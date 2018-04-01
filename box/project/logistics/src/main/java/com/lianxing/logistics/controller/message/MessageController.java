package com.lianxing.logistics.controller.message;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.User;
import com.lianxing.logistics.model.WarrantyNumber;
import com.lianxing.logistics.service.MessageRecorderServiceImpl;
import com.lianxing.logistics.service.UserServiceImpl;
import com.lianxing.logistics.service.WarrantyNumberServiceImpl;
import com.lianxing.logistics.util.*;
import net.sf.json.JSONObject;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.net.URLEncoder;

@Controller
public class MessageController extends BaseController {

    private static Logger logger = LogManager.getLogger(MessageController.class);

    @Autowired
    private MessageRecorderServiceImpl messageRecorderService;

    @Autowired
    private WarrantyNumberServiceImpl warrantyNumberService;

    @Autowired
    private UserServiceImpl userService;

    private String apikey = PropertiesUtil.get("apikey", "/sys_config.properties");

    /**
     * 自定义发送短信验证码
     *
     * @param mobile
     * @param count
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/sendMessageCode", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> sendMessageCode(@RequestParam("mobile") String mobile,
                                                  @RequestParam("count") Long count) {
        JSONObject json = new JSONObject();
        String apiName = "sendMessageCode";
        logger.info("[start]" + apiName);
        try {
            long tpl_id = 2129562;// 模板id(发送注册验证码)
            String registerCode = RandomUtil.getRandomCodeForTen(count);
            // 获取短信验证码有效保存时间
            String CodeEffectiveTime = PropertiesUtil.get("CodeEffectiveTime", "/sys_config.properties");
            String tpl_value = URLEncoder.encode("#a#", Const.UTF_8) + "="
                    + URLEncoder.encode(registerCode, Const.UTF_8) + "&"
                    + URLEncoder.encode("#b#", Const.UTF_8) + "="
                    + URLEncoder.encode(CodeEffectiveTime, Const.UTF_8);
            String response = JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);
            JSONObject msgObj = JSONObject.fromObject(response);
            Integer code = Integer.parseInt(msgObj.get("code").toString());
            if (0 == code) {
                RedisClient client = new RedisClient();
                client.set(RedisUtil.REDIS_PREFIX + mobile + ".registerCode", registerCode, 60 * Integer.parseInt(CodeEffectiveTime));
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 校验短信验证码
     *
     * @param mobile
     * @param msgCode
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/checkMessageCode", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkMessageCode(@RequestParam("mobile") String mobile,
                                                   @RequestParam("msgCode") String msgCode) {
        JSONObject json = new JSONObject();
        String apiName = "checkMessageCode";
        logger.info("[start]" + apiName);
        try {
            RedisClient client = new RedisClient();
            String value = client.get(RedisUtil.REDIS_PREFIX + mobile + ".registerCode");
            if (value != null && value.equals(msgCode)) {
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
            json.put("status", Const.ERROR);
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 获取短信接口,将查到的数据在redis中进行检查（1.存活，将其保存到订单中；2.不存活，数据库中也没有，超时；3.不存活，数据库中有，有人先接单）
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getPushedMessages", method = RequestMethod.POST)
    @ResponseBody
    @Transactional
    public String getPushedMessages(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getPushedMessages";
        logger.info("[start]" + apiName);
        try {
            String sms_reply = request.getParameter("sms_reply");
            sms_reply = java.net.URLDecoder.decode(sms_reply, "utf-8");
            System.out.println(sms_reply);
            JSONObject smsObject = JSONObject.fromObject(sms_reply);
            logger.warn("[smsObject]" + smsObject);
            // 维修人员手机号
            String mobile = (String) smsObject.get("mobile");
            // 维修单号
            String maintenanceNumber = (String) smsObject.get("text");
            User user = userService.getUserByTel(mobile);
            WarrantyNumber warrantyNumber = warrantyNumberService.getWarrantyNumerByMaintenanceNumber(maintenanceNumber);
            int result = messageRecorderService.testDataAudit(user, warrantyNumber);
            if (result == 1) {
                String workerName = user.getName();
                String name = warrantyNumber.getRepairStaff().getName();
                String tel = warrantyNumber.getRepairStaff().getTel();
                String address = warrantyNumber.getAddress();
                // 给维修人员发送成功接单的短信
                acceptOrderSuccess(maintenanceNumber, name, tel, address, mobile);
                // 给报修人员发送维修人员成功接单的短信
                sendAcceptOrderSuccessForRepairStaff(tel, workerName, mobile, maintenanceNumber);
            } else if (result == 0) {
                acceptOrderError(mobile, maintenanceNumber);
            }
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
            json.put("status", Const.ERROR);
        }
        logger.info("[end]" + apiName);
        return "0";
    }

    /**
     * 给指定的维修人员发短信
     *
     * @param name
     * @param maintenanceNumber
     * @param count
     * @param mobile
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/sendMessageForAppoint", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> sendMessageForAppoint(@RequestParam("name") String name,
                                                        @RequestParam("maintenanceNumber") String maintenanceNumber,
                                                        @RequestParam("count") Long count,
                                                        @RequestParam("mobile") String mobile) {
        JSONObject json = new JSONObject();
        String apiName = "sendMessageForAppoint";
        logger.info("[start]" + apiName);
        try {
            long tpl_id = 2059446;// 模板id(发送派单短信)
            String tpl_value = URLEncoder.encode("#a#", Const.UTF_8) + "="
                    + URLEncoder.encode(name, Const.UTF_8) + "&"
                    + URLEncoder.encode("#b#", Const.UTF_8) + "="
                    + URLEncoder.encode(maintenanceNumber, Const.UTF_8) + "&"
                    + URLEncoder.encode("#c#", Const.UTF_8) + "="
                    + URLEncoder.encode(count.toString(), Const.UTF_8);
            String response = JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);
            JSONObject msgObj = JSONObject.fromObject(response);
            Integer code = Integer.parseInt(msgObj.get("code").toString());
            if (0 == code) {
                RedisClient client = new RedisClient();
                client.set(RedisUtil.REDIS_PREFIX + mobile + ".registerCode", maintenanceNumber, 180);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 给成功接单的员工发送短信
     *
     * @param maintenanceNumber
     * @param name
     * @param tel
     * @param address
     * @param mobile
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/acceptOrderSuccess", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> acceptOrderSuccess(@RequestParam("maintenanceNumber") String maintenanceNumber,
                                                     @RequestParam("name") String name,
                                                     @RequestParam("tel") String tel,
                                                     @RequestParam("address") String address,
                                                     @RequestParam("mobile") String mobile) {
        JSONObject json = new JSONObject();
        String apiName = "acceptOrderSuccess";
        logger.info("[start]" + apiName);
        try {
            long tpl_id = 2059448;// 模板id(成功接受订单)
            String tpl_value = URLEncoder.encode("#a#", Const.UTF_8) + "="
                    + URLEncoder.encode(maintenanceNumber, Const.UTF_8) + "&"
                    + URLEncoder.encode("#b#", Const.UTF_8) + "="
                    + URLEncoder.encode(name, Const.UTF_8) + "&"
                    + URLEncoder.encode("#c#", Const.UTF_8) + "="
                    + URLEncoder.encode(tel, Const.UTF_8) + "&"
                    + URLEncoder.encode("#d#", Const.UTF_8) + "="
                    + URLEncoder.encode(address, Const.UTF_8);
            String response = JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);
            JSONObject msgObj = JSONObject.fromObject(response);
            Integer code = Integer.parseInt(msgObj.get("code").toString());
            if (0 == code) {
                RedisClient client = new RedisClient();
                client.set(RedisUtil.REDIS_PREFIX + mobile + ".registerCode", maintenanceNumber, 180);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 给接单失败的员工发送短信
     *
     * @param mobile
     * @param maintenanceNumber
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/acceptOrderError", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> acceptOrderError(@RequestParam("mobile") String mobile,
                                                   @RequestParam("maintenanceNumber") String maintenanceNumber) {
        JSONObject json = new JSONObject();
        String apiName = "acceptOrderError";
        logger.info("[start]" + apiName);
        try {
            long tpl_id = 2059450;// 模板id(接收订单失败)
            String tpl_value = URLEncoder.encode("#a#", Const.UTF_8) + "="
                    + URLEncoder.encode(maintenanceNumber, Const.UTF_8);
            String response = JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);
            JSONObject msgObj = JSONObject.fromObject(response);
            Integer code = Integer.parseInt(msgObj.get("code").toString());
            if (0 == code) {
                RedisClient client = new RedisClient();
                client.set(RedisUtil.REDIS_PREFIX + mobile + ".registerCode", maintenanceNumber, 180);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 给管理人员发送订单超时的订单号
     *
     * @param mobile
     * @param maintenanceNumber
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/sendOverTimeMessageForAdministrative", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> sendOverTimeMessageForAdministrative(@RequestParam("mobile") String mobile,
                                                                       @RequestParam("maintenanceNumber") String maintenanceNumber) {
        JSONObject json = new JSONObject();
        String apiName = "sendOverTimeMessageForAdministrative";
        logger.info("[start]" + apiName);
        try {
            long tpl_id = 2132518;// 模板id(发送超时短信)
            String tpl_value = URLEncoder.encode("#a#", Const.UTF_8) + "="
                    + URLEncoder.encode(maintenanceNumber, Const.UTF_8);
            String response = JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);
            JSONObject msgObj = JSONObject.fromObject(response);
            Integer code = Integer.parseInt(msgObj.get("code").toString());
            if (0 == code) {
                RedisClient client = new RedisClient();
                client.set(RedisUtil.REDIS_PREFIX + mobile + ".registerCode", maintenanceNumber, 180);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 给报修人发送维修工人成功接单之后的短信
     *
     * @param mobile
     * @param name
     * @param maintenanceNumber
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/sendAcceptOrderSuccessForRepairStaff", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> sendAcceptOrderSuccessForRepairStaff(@RequestParam("mobile") String mobile,
                                                                       @RequestParam("name") String name,
                                                                       @RequestParam("tel") String tel,
                                                                       @RequestParam("maintenanceNumber") String maintenanceNumber) {
        JSONObject json = new JSONObject();
        String apiName = "sendAcceptOrderSuccessForRepairStaff";
        logger.info("[start]" + apiName);
        try {
            long tpl_id = 2135820;// 模板id(发送成功接单短信)
            String tpl_value = URLEncoder.encode("#a#", Const.UTF_8) + "="
                    + URLEncoder.encode(maintenanceNumber, Const.UTF_8) + "&"
                    + URLEncoder.encode("#b#", Const.UTF_8) + "="
                    + URLEncoder.encode(name, Const.UTF_8) + "&"
                    + URLEncoder.encode("#c#", Const.UTF_8) + "="
                    + URLEncoder.encode(tel, Const.UTF_8);
            String response = JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);
            JSONObject msgObj = JSONObject.fromObject(response);
            Integer code = Integer.parseInt(msgObj.get("code").toString());
            if (0 == code) {
                RedisClient client = new RedisClient();
                client.set(RedisUtil.REDIS_PREFIX + mobile + ".registerCode", maintenanceNumber, 180);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 给报修人员发送维修人员成功完成订单之后的短信
     *
     * @param mobile
     * @param maintenanceNumber
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/sendFinishOrderSuccessForRepairStaff", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> sendFinishOrderSuccessForRepairStaff(@RequestParam("mobile") String mobile,
                                                                       @RequestParam("maintenanceNumber") String maintenanceNumber) {
        JSONObject json = new JSONObject();
        String apiName = "sendFinishOrderSuccessForRepairStaff";
        logger.info("[start]" + apiName);
        try {
            long tpl_id = 2135822;// 模板id(发送成功维修短信)
            String tpl_value = URLEncoder.encode("#a#", Const.UTF_8) + "="
                    + URLEncoder.encode(maintenanceNumber, Const.UTF_8);
            String response = JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);
            JSONObject msgObj = JSONObject.fromObject(response);
            Integer code = Integer.parseInt(msgObj.get("code").toString());
            if (0 == code) {
                RedisClient client = new RedisClient();
                client.set(RedisUtil.REDIS_PREFIX + mobile + ".registerCode", maintenanceNumber, 180);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 给报修人员发送维修失败的短信
     *
     * @param mobile
     * @param reason
     * @param maintenanceNumber
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/sendFinishOrderLoseForRepairStaff", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> sendFinishOrderLoseForRepairStaff(@RequestParam("mobile") String mobile,
                                                                    @RequestParam("reason") String reason,
                                                                    @RequestParam("maintenanceNumber") String maintenanceNumber) {
        JSONObject json = new JSONObject();
        String apiName = "sendFinishOrderLoseForRepairStaff";
        logger.info("[start]" + apiName);
        try {
            long tpl_id = 2135826;// 模板id(发送维修失败短信)
            String tpl_value = URLEncoder.encode("#a#", Const.UTF_8) + "="
                    + URLEncoder.encode(maintenanceNumber, Const.UTF_8) + "&"
                    + URLEncoder.encode("#b#", Const.UTF_8) + "="
                    + URLEncoder.encode(reason, Const.UTF_8);
            String response = JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);
            JSONObject msgObj = JSONObject.fromObject(response);
            Integer code = Integer.parseInt(msgObj.get("code").toString());
            if (0 == code) {
                RedisClient client = new RedisClient();
                client.set(RedisUtil.REDIS_PREFIX + mobile + ".registerCode", maintenanceNumber, 180);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 给用户发送账号被管理员审核成功的短信
     *
     * @param account
     * @param mobile
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/sendExamineSuccessMessageForUser", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> sendExamineSuccessMessageForUser(@RequestParam("account") String account,
                                                                   @RequestParam("mobile") String mobile) {
        JSONObject json = new JSONObject();
        String apiName = "sendExamineSuccessMessageForUser";
        logger.info("[start]" + apiName);
        try {
            long tpl_id = 2141020;// 模板id(发送审核成功短信)
            String tpl_value = URLEncoder.encode("#a#", Const.UTF_8) + "="
                    + URLEncoder.encode(account, Const.UTF_8);
            String response = JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);
            JSONObject msgObj = JSONObject.fromObject(response);
            Integer code = Integer.parseInt(msgObj.get("code").toString());
            if (0 == code) {
                RedisClient client = new RedisClient();
                client.set(RedisUtil.REDIS_PREFIX + mobile + ".registerCode", account, 180);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

}

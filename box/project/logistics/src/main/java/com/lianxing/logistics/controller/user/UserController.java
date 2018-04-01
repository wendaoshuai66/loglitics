package com.lianxing.logistics.controller.user;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.controller.message.MessageController;
import com.lianxing.logistics.model.User;
import com.lianxing.logistics.service.LoginServiceImpl;
import com.lianxing.logistics.service.UserServiceImpl;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.data.MD5Util;
import net.sf.json.JSONObject;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
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
import java.util.Date;

@Controller
public class UserController extends BaseController {

    private static Logger logger = LogManager.getLogger(UserController.class);

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private LoginServiceImpl loginService;

    @Autowired
    private MessageController messageController;

    /**
     * 调用微信接口获取openId
     *
     * @return
     */
    @RequestMapping(value = "/getOpenId", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getOpenId(@RequestParam("appid") String appid, @RequestParam("secret") String secret,
                                            @RequestParam("jsCode") String jsCode) {
        JSONObject json = new JSONObject();
        String apiName = "getOpenId";
        logger.info("[start]" + apiName);
        String urlNameString = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret
                + "&js_code=" + jsCode + "&grant_type=authorization_code";
        String result;
        try {
            // 根据地址获取请求
            HttpGet request = new HttpGet(urlNameString);// 这里发送get请求
            // 获取当前客户端对象
            DefaultHttpClient httpClient = new DefaultHttpClient();
            // 通过请求对象获取响应对象
            HttpResponse response = httpClient.execute(request);
            // 判断网络连接状态码是否正常(0--200都数正常)
            if (response.getStatusLine().getStatusCode() == 200) {
                result = EntityUtils.toString(response.getEntity(), Const.UTF_8);
                JSONObject jsonObject = JSONObject.fromObject(result);
                String openid = jsonObject.get("openid").toString();
                json.put("openId", openid);
                logger.info("[openId]" + openid);
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
     * 获取userId
     *
     * @return
     */
    @RequestMapping(value = "/getUserId", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getUserId(@RequestParam("openId") String openId) {
        JSONObject json = new JSONObject();
        String apiName = "getUserId";
        logger.info("[start]" + apiName);
        try {
            JSONObject resultJson = userService.getUserFromOpenId(openId);
            if (resultJson != null) {
                Long userId = resultJson.getLong("id");
                String password = resultJson.getString("password");
                Integer role = resultJson.getInt("role");
                if (userId != null) {
                    User user = userService.getById(User.class, userId);
                    if (user.getApprovalStatus() == 1 && user.getStatus() == 1) {
                        user.setLastLoginDateTime(new Date());
                        userService.update(user);
                    }
                    logger.info("[userId]" + userId);
                    String redisToken = MD5Util.getMD5String(password) + System.currentTimeMillis();
                    logger.info("Token为：" + redisToken);
                    loginService.updateRedisKeyAliveTime(redisToken, role == 0);
                    json.put("token", redisToken);
                    json.put("userId", userId);
                    json.put("status", Const.SUCCESS);
                } else {
                    json.put("status", Const.NOTLOGIN);
                }
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
     * 根据Id查询到User
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getUserById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getUserById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getUserById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                User user = userService.getById(User.class, id);
                json.put("data", JSONObject.fromObject(user, JsonUtil.jsonConfig("dateTime")));
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.NULL);
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
     * 修改用户的密码
     *
     * @param id
     * @param password
     * @return
     */
    @Transactional
    @RequestMapping(value = "/updateUserPassword", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> updateUserPassword(@RequestParam("id") String id, @RequestParam("password") String password) {
        JSONObject json = updatePassword(id, password);
        String apiName = "updateUserPassword";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 修改密码时判断旧密码是否与数据库中的密码相等
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/findUserPassword", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> findUserPassword(HttpServletRequest request) {
        JSONObject json = userService.checkUserPassword(request);
        String apiName = "findUserPassword";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 检查账号是否重复
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/checkRepeatAccount", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = checkCommonRepeat(request);
        String apiName = "checkRepeatAccount";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 检查手机号是否重复
     *
     * @param tel
     * @return
     */
    @Transactional
    @RequestMapping(value = "/checkRepeatTel", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeatTel(@RequestParam("tel") String tel) {
        JSONObject json = checkCommonRepeatAboutTel(tel);
        String apiName = "checkRepeatTel";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 给用户发送审核通过的短信
     *
     * @param statusType
     * @param id
     */
    public void sendSuccessMessageForUser(@RequestParam("statusType") String statusType,
                                          @RequestParam("id") String id) {
        if ("approvalStatus".equals(statusType)) {
            User user = userService.getById(User.class, Long.parseLong(id));
            String account = user.getAccount();
            String tel = user.getTel();
            if (user.getApprovalStatus() == 1) {
                // 审核通过之后给用户发送成功的短信
                messageController.sendExamineSuccessMessageForUser(account, tel);
            }
        }
    }

    /**
     * 保存修改的用户openId
     *
     * @param request
     * @return
     */
    @Transactional
    @RequestMapping(value = "/updateUserWeChatOpenId", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> updateUserWeChatOpenId(HttpServletRequest request) {
        JSONObject json = updateUserWeChatOpenid(request);
        String apiName = "updateUserWeChatOpenId";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

}

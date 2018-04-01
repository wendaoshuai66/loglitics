package com.lianxing.logistics.controller.information;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.InforText;
import com.lianxing.logistics.service.InforTextServiceImpl;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.Page;
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
import java.util.Date;
import java.util.List;
import java.util.Map;

@Controller
public class InforTextController extends BaseController {

    private static Logger logger = LogManager.getLogger(InforTextController.class);

    @Autowired
    private InforTextServiceImpl inforTextService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @Transactional
    @RequestMapping(value = "/getInforTextList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getInforTextList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = inforTextService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = inforTextService.getSeachMapInfo(request);
            // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
            List<InforText> list = inforTextService.getList(page, paraMap, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = inforTextService.getInforTextAllCountFromPara(page, paraMap, true);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 修改建言献策信息的启用状态
     *
     * @param statusType 确定修改什么状态
     * @param id         修改的实体id
     * @return 状态修改
     */
    @Transactional
    @RequestMapping(value = "/changeInforTextStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeInforTextStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            InforText inforText = inforTextService.getById(InforText.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("approvalStatus".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = inforText.getApprovalStatus() == 1 ? 0 : 1;
                }
                if (parameter == 1) {
                    inforText.setApprovalDateTime(new Date());
                } else if (parameter == 0) {
                    inforText.setApprovalDateTime(null);
                }
                inforText.setApprovalStatus(parameter);
            }
            inforTextService.update(inforText);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 提交回复内容
     */
    @Transactional
    @RequestMapping(value = "/confirmReplyInforText", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> confirmReply(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "confirmReplyInforText";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            // 执行
            InforText inforText = inforTextService.getById(InforText.class,
                    Long.parseLong(requestObject.getString("id")));
            // 设置回复内容
            inforText.setReply(requestObject.getString("reply"));
            inforTextService.update(inforText);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 根据Id删除对应的图文信息(逻辑删除)
     *
     * @param id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteInforText", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteInforText";
        logger.info("[start]" + apiName);
        try {
            // 执行
            InforText inforText = inforTextService.getById(InforText.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            inforText.setIfDelete(1);
            inforTextService.update(inforText);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 添加/修改InforText信息(建言献策)
     *
     * @param request
     * @return
     */
    @Transactional
    @RequestMapping(value = "/saveInforTextFromWeChat", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> saveInforTextFromWeChat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveInforTextFromWeChat";
        logger.info("[start]" + apiName);
        try {
            // 将传进来的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            InforText inforText;
            inforText = JsonUtil.jsonToObject(InforText.class, requestObject.toString());
            // 执行
            if (inforText.getId() == null) {
                Long id = inforTextService.save(inforText);
                json.put("id", id);
            } else {
                if (inforText.getApprovalStatus() == 1) {
                    inforText.setApprovalDateTime(new Date());
                } else if (inforText.getApprovalStatus() == 0) {
                    inforText.setApprovalDateTime(null);
                }
                inforTextService.update(inforText);
            }
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 通过Id获得InforText
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getInforTextById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getInforTextById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getInforTextById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                InforText inforText = inforTextService.getById(InforText.class, id);
                json.put("data", JSONObject.fromObject(inforText, JsonUtil.jsonConfig("dateTime")));
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.NULL);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 通过Id使其浏览次数每次加一
     *
     * @param id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/updateInforTextViewTimesById", method = RequestMethod.POST)
    @ResponseBody
    public synchronized ResponseEntity<String> updateInforTextViewTimesById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "updateInforTextViewTimesById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                InforText inforText = inforTextService.getById(InforText.class, id);
                Long times = inforText.getViewTimes() + 1L;
                inforText.setViewTimes(times);
                inforTextService.update(inforText);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

}

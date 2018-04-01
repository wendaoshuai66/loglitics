package com.lianxing.logistics.controller.information;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.LostFound;
import com.lianxing.logistics.service.FleaMarketServiceImpl;
import com.lianxing.logistics.service.LostFoundServiceImpl;
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
import java.util.*;

@Controller
public class LostFoundController extends BaseController {

    private static Logger logger = LogManager.getLogger(LostFoundController.class);

    @Autowired
    private LostFoundServiceImpl lostFoundService;

    @Autowired
    private FleaMarketServiceImpl fleaMarketService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @Transactional
    @RequestMapping(value = "/getLostFoundList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getLostFoundList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = lostFoundService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = lostFoundService.getSeachMapInfo(request);
            List<LostFound> list = lostFoundService.getList(page, paraMap, true);
            List<JSONObject> resultList = new ArrayList<>();
            for (LostFound lostFound : list) {
                JSONObject itemObj;
                String urlIds = lostFound.getFileIds();
                itemObj = fleaMarketService.getResultJSONList(urlIds);
                itemObj.putAll(JSONObject.fromObject(lostFound, JsonUtil.jsonConfig("dateTime")));
                resultList.add(itemObj);
            }
            // 获取满足查询条件总对象的个数
            Long totalRecords = lostFoundService.getLostFoundAllCountFromPara(page, paraMap, true);
            json = getTableData(resultList, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
            json = getTableData(Collections.emptyList(), 0L);
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 修改失物招领的审核状态以及交易状态
     *
     * @param statusType 确定修改什么状态
     * @param id         修改的实体id
     * @return 状态修改
     */
    @Transactional
    @RequestMapping(value = "/changeLostFoundStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeLostFoundStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            LostFound lostFound = lostFoundService.getById(LostFound.class, Long.parseLong(id));
            // 审核状态
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("approvalStatus".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = lostFound.getApprovalStatus() == 1 ? 0 : 1;
                }
                if (parameter == 1) {
                    lostFound.setApprovalDateTime(new Date());
                } else if (parameter == 0) {
                    lostFound.setApprovalDateTime(null);
                }
                lostFound.setApprovalStatus(parameter);
            } else if ("dealStatus".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = lostFound.getDealStatus() == 1 ? 0 : 1;
                }
                lostFound.setDealStatus(parameter);
            }
            lostFoundService.update(lostFound);
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

    @Transactional
    @RequestMapping(value = "/deleteLostFound", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteLostFound";
        logger.info("[start]" + apiName);
        try {
            // 执行
            LostFound lostFound = lostFoundService.getById(LostFound.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            lostFound.setIfDelete(1);
            lostFoundService.update(lostFound);
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
     * 添加/修改LostFound信息
     *
     * @param request
     * @return
     */
    @Transactional
    @RequestMapping(value = "/saveLostFoundFromWeChat", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> saveLostFoundFromWeChat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveLostFoundFromWeChat";
        logger.info("[start]" + apiName);
        try {
            // 将传进来的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            requestObject = fleaMarketService.dealWithJSONObj(requestObject);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            LostFound lostFound;
            lostFound = JsonUtil.jsonToObject(LostFound.class, requestObject.toString());
            // 执行
            if (lostFound.getId() == null) {
                Long id = lostFoundService.save(lostFound);
                json.put("id", id);
            } else {
                if (lostFound.getApprovalStatus() == 1) {
                    lostFound.setApprovalDateTime(new Date());
                } else if (lostFound.getApprovalStatus() == 0) {
                    lostFound.setApprovalDateTime(null);
                }
                lostFoundService.update(lostFound);
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
     * 通过Id获得LostFound
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getLostFoundById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getLostFoundById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getLostFoundById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                LostFound lostFound = lostFoundService.getById(LostFound.class, id);
                String fileIds = lostFound.getFileIds();
                JSONObject itemObj = fleaMarketService.getResultJSONList(fileIds);
                JSONObject object = JSONObject.fromObject(lostFound, JsonUtil.jsonConfig("dateTime"));
                object.put("imgUrls", itemObj);
                json.put("data", object);
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
    @RequestMapping(value = "/updateLostFoundViewTimesById", method = RequestMethod.POST)
    @ResponseBody
    public synchronized ResponseEntity<String> updateLostFoundViewTimesById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "updateLostFoundViewTimesById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                LostFound lostFound = lostFoundService.getById(LostFound.class, id);
                Long times = lostFound.getViewTimes() + 1;
                lostFound.setViewTimes(times);
                lostFoundService.update(lostFound);
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

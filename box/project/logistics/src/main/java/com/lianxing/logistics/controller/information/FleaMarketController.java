package com.lianxing.logistics.controller.information;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.FleaMarket;
import com.lianxing.logistics.service.FleaMarketServiceImpl;
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
public class FleaMarketController extends BaseController {

    private static Logger logger = LogManager.getLogger(FleaMarketController.class);

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
    @RequestMapping(value = "/getFleaMarketList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json;
        String apiName = "getFleaMarketList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = fleaMarketService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = fleaMarketService.getSeachMapInfo(request);
            List<FleaMarket> list = fleaMarketService.getList(page, paraMap, true);
            List<JSONObject> resultList = new ArrayList<>();
            for (FleaMarket fleaMarket : list) {
                JSONObject itemObj;
                String urlIds = fleaMarket.getFileIds();
                itemObj = fleaMarketService.getResultJSONList(urlIds);
                itemObj.putAll(JSONObject.fromObject(fleaMarket, JsonUtil.jsonConfig("dateTime")));
                resultList.add(itemObj);
            }
            // 获取满足查询条件总对象的个数
            Long totalRecords = fleaMarketService.getFleaMarketAllCountFromPara(page, paraMap, true);
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
     * 修改跳蚤市场的审核状态以及交易状态
     *
     * @param statusType 确定修改什么状态
     * @param id         修改的实体id
     * @return 状态修改
     */
    @Transactional
    @RequestMapping(value = "/changeFleaMarketStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeFleaMarketStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            FleaMarket fleaMarket = fleaMarketService.getById(FleaMarket.class, Long.parseLong(id));
            // 审核状态
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("approvalStatus".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = fleaMarket.getApprovalStatus() == 1 ? 0 : 1;
                }
                if (parameter == 1) {
                    fleaMarket.setApprovalDateTime(new Date());
                } else if (parameter == 0) {
                    fleaMarket.setApprovalDateTime(null);
                }
                fleaMarket.setApprovalStatus(parameter);
            } else if ("dealStatus".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = fleaMarket.getDealStatus() == 1 ? 0 : 1;
                }
                fleaMarket.setDealStatus(parameter);
            }
            fleaMarket.setApprovalDateTime(new Date());
            fleaMarketService.update(fleaMarket);
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
    @RequestMapping(value = "/deleteFleaMarket", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteFleaMarket";
        logger.info("[start]" + apiName);
        try {
            // 执行
            FleaMarket fleaMarket = fleaMarketService.getById(FleaMarket.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            fleaMarket.setIfDelete(1);
            fleaMarketService.update(fleaMarket);
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
     * 添加/修改FleaMarket信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/saveFleaMarket", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveFleaMarket";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            // 获取到该表单的 图片路径集合
            requestObject = fleaMarketService.dealWithJSONObj(requestObject);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            FleaMarket fleaMarket;
            fleaMarket = JsonUtil.jsonToObject(FleaMarket.class, requestObject.toString());
            // 执行
            if (fleaMarket.getId() == null) {
                Long id = fleaMarketService.save(fleaMarket);
                json.put("id", id);
            } else {
                if (fleaMarket.getApprovalStatus() == 1) {
                    fleaMarket.setApprovalDateTime(new Date());
                } else if (fleaMarket.getApprovalStatus() == 0) {
                    fleaMarket.setApprovalDateTime(null);
                }
                fleaMarketService.update(fleaMarket);
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
     * 通过Id获得FleaMarket
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getFleaMarketById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getFleaMarketById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getFleaMarketById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                FleaMarket fleaMarket = fleaMarketService.getById(FleaMarket.class, id);
                String fileIds = fleaMarket.getFileIds();
                JSONObject itemObj = fleaMarketService.getResultJSONList(fileIds);
                JSONObject object = JSONObject.fromObject(fleaMarket, JsonUtil.jsonConfig("dateTime"));
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
    @RequestMapping(value = "/updateFleaMarketViewTimesById", method = RequestMethod.POST)
    @ResponseBody
    public synchronized ResponseEntity<String> updateFleaMarketViewTimesById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "updateFleaMarketViewTimesById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                FleaMarket fleaMarket = fleaMarketService.getById(FleaMarket.class, id);
                Long times = fleaMarket.getViewTimes() + 1L;
                fleaMarket.setViewTimes(times);
                fleaMarketService.update(fleaMarket);
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

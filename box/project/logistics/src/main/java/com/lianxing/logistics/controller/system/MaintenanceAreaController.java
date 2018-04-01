package com.lianxing.logistics.controller.system;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.MaintenanceArea;
import com.lianxing.logistics.service.MaintenanceAreaServiceImpl;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONArray;
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
public class MaintenanceAreaController extends BaseController {

    private static Logger logger = LogManager.getLogger(MaintenanceAreaController.class);

    @Autowired
    private MaintenanceAreaServiceImpl maintenanceAreaService;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Transactional(readOnly = true)
    @RequestMapping(value = "/getMaintenanceAreaList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceAreaList";
        logger.info("[start] " + apiName);
        try {
            Page page = maintenanceAreaService.getPageInfo(request);
            Map paraMap = maintenanceAreaService.getSeachMapInfo(request);
            List<MaintenanceArea> areas = maintenanceAreaService.getList(page, paraMap, true);
            List<JSONObject> resultObj = new ArrayList<>();
            for (MaintenanceArea maintenanceArea : areas) {
                JSONObject itemObj = new JSONObject();
                itemObj.putAll(JSONObject.fromObject(maintenanceArea, JsonUtil.jsonConfig("dateTime")));
                Map<Object, JSONArray> map = maintenanceAreaService
                        .getMaintenanceTypeFromAreaId(maintenanceArea.getId());
                itemObj.put("maintenanceType", map.toString());
                resultObj.add(itemObj);
            }
            Long totalRecords = maintenanceAreaService.getMaintenanceAreaAllCountFromPara(paraMap, true);
            json = getTableData(resultObj, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    // 维修区域下拉框数据
    @RequestMapping(value = "/getMaintenanceAreaSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaintenanceAreaSelectList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceAreaSelectList";
        logger.info("[start] " + apiName);
        try {
            String ignoreDeleteAndStatus = request.getParameter("ignoreDeleteAndStatus");
            List<MaintenanceArea> maintenanceAreas = maintenanceAreaService.getMaintenanceAreraList(ignoreDeleteAndStatus);
            json.put("data", JSONArray.fromObject(maintenanceAreas, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/checkRepeatMaintenanceArea", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatMaintenanceArea";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            if (requestObject != null) {
                requestObject.remove("maintenanceType");
                requestObject.remove("maintenanceAreaWorkers");
            }
            logger.info(requestObject);
            MaintenanceArea maintenanceArea;
            maintenanceArea = JsonUtil.jsonToObject(MaintenanceArea.class, requestObject.toString());
            logger.info(maintenanceArea);
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", maintenanceArea.getName());
            checkMap.put("campus.id", maintenanceArea.getCampus().getId());
            boolean repeat = maintenanceAreaService.checkRepeat("MaintenanceArea", checkMap, maintenanceArea.getId());
            if (!repeat) {
                json.put("status", Const.REPEAT);
            } else {
                json.put("status", Const.NOREPEAT);
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
     * 保存和修改
     *
     * @param request
     * @return
     */
    @SuppressWarnings("unchecked")
    @Transactional
    @RequestMapping(value = "/saveMaintenanceArea", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveMaintenanceArea";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            MaintenanceArea area;
            // 维修人员Id
            HashSet<String> workerIdSet = new HashSet<>();
            // 工种Id
            HashSet<String> typeIdSet = new HashSet<>();
            Map<String, JSONArray> maintenanceMap = (JSONObject) requestObject.get("maintenanceType");
            if (maintenanceMap != null) {
                for (Map.Entry<String, JSONArray> map : maintenanceMap.entrySet()) {
                    String key = map.getKey();
                    typeIdSet.add(key);
                    JSONArray ids = map.getValue();
                    for (Object id : ids) {
                        // 存入该区域下对应的维修人员id
                        workerIdSet.add(id.toString());
                    }
                }
            }
            // 去除掉 'maintenanceType'
            if (requestObject != null) {
                requestObject.remove("maintenanceType");
                requestObject.remove("maintenanceAreaWorkers");
            }
            area = JsonUtil.jsonToObject(MaintenanceArea.class, requestObject.toString());
            logger.info(area);
            if (area.getId() == null) {
                maintenanceAreaService.save(area);
            } else {
                area.setUpdateDateTime(new Date());
                maintenanceAreaService.update(area);
            }
            // 删除之前对应的maintenance_area_worker表记录
            maintenanceAreaService.deleteAreaWorkerFormAreaId(area.getId());
            // 重新插入maintenance_area_worker新记录
            for (String workerId : workerIdSet) {
                maintenanceAreaService.insertAreaWorker(area.getId(), Long.parseLong(workerId));
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

    @Transactional
    @RequestMapping(value = "/deleteMaintenanceArea", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteMaintenanceArea";
        logger.info("[start]" + apiName);
        try {
            MaintenanceArea area = maintenanceAreaService.getById(MaintenanceArea.class, Long.parseLong(id));
            area.setIfDelete(1);
            maintenanceAreaService.update(area);
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
    @RequestMapping(value = "/changeMaintenanceAreaStatus")
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeMaintenanceAreaStatus";
        logger.info("[start]" + apiName);
        try {
            MaintenanceArea area = maintenanceAreaService.getById(MaintenanceArea.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = area.getStatus() == 1 ? 0 : 1;
                }
                area.setStatus(parameter);
            }
            area.setUpdateDateTime(new Date());
            maintenanceAreaService.update(area);
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

    // 返回校园，区域的json
    @RequestMapping(value = "/getCampusAreaJson", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getCampusAreaJson() {
        JSONObject json = new JSONObject();
        String apiName = "getCampusAreaJson";
        logger.info("[start]" + apiName);
        try {
            // 取出过滤掉的区域list
            List<MaintenanceArea> mainAreaList = maintenanceAreaService.getMaintenanceAreraList("false");
            // 获取满足条件的校园list（包含区域list）
            List<Map<String, Object>> mapList = maintenanceAreaService.getThisInfo(mainAreaList);
            json.put("campusList", JSONArray.fromObject(mapList));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/getCampusAreaTreeList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getCampusAreaTreeList() {
        JSONArray resultData = new JSONArray();
        String apiName = "getCampusAreaTreeList";
        logger.info("[start]" + apiName);
        try {
            // 取出区域list
            List<MaintenanceArea> mainAreaList = maintenanceAreaService.getMaintenanceAreaForCampus();
            // 获取满足条件的校园list（包含区域list）
            List<Map<String, Object>> mapList = maintenanceAreaService.getThisInfoList(mainAreaList);
            resultData = JSONArray.fromObject(mapList, JsonUtil.jsonConfig("dateTime"));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(resultData.toString(), headers, HttpStatus.OK);
    }

}

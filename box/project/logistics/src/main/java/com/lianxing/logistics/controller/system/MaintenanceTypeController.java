package com.lianxing.logistics.controller.system;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.MaintenanceCategory;
import com.lianxing.logistics.model.MaintenanceType;
import com.lianxing.logistics.service.MaintenanceCategoryServiceImpl;
import com.lianxing.logistics.service.MaintenanceTypeServiceImpl;
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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class MaintenanceTypeController extends BaseController {

    private static Logger logger = LogManager.getLogger(MaintenanceTypeController.class);

    @Autowired
    private MaintenanceTypeServiceImpl maintenanceTypeService;

    @Autowired
    private MaintenanceCategoryServiceImpl maintenanceCategoryService;

    @RequestMapping(value = "/getMaintenanceTypeList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceTypeList";
        logger.info("[start]" + apiName);
        try {
            Page page = maintenanceTypeService.getPageInfo(request);
            List<MaintenanceType> types = maintenanceTypeService.getList(page, null, true);
            Long totalRecords = maintenanceTypeService.getMaintenanceTypeAllCountFromPara(true);
            json = getTableData(types, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    // 维修工种下拉框数据
    @RequestMapping(value = "/getMaintenanceTypeSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaintenanceTypeSelectList() {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceTypeSelectList";
        logger.info("[start] " + apiName);
        try {
            List<MaintenanceType> maintenanceType = maintenanceTypeService.getAll(false, "MaintenanceType"); // 取出状态为'启用'
            json.put("data", JSONArray.fromObject(maintenanceType, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/checkRepeatMaintenanceType", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatMaintenanceType";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            MaintenanceType type;
            type = JsonUtil.jsonToObject(MaintenanceType.class, requestObject.toString());
            logger.info(type);
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", type.getName());
            boolean repeat = maintenanceTypeService.checkRepeat("MaintenanceType", checkMap, type.getId());
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
    @Transactional
    @RequestMapping(value = "/saveMaintenanceType", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveMaintenanceType";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            MaintenanceType type;
            type = JsonUtil.jsonToObject(MaintenanceType.class, requestObject.toString());
            logger.info(type);
            if (type.getId() == null) {
                maintenanceTypeService.save(type);
            } else {
                type.setUpdateDateTime(new Date());
                maintenanceTypeService.update(type);
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
    @RequestMapping(value = "/deleteMaintenanceType", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteMaintenanceType";
        logger.info("[start]" + apiName);
        try {
            MaintenanceType type = maintenanceTypeService.getById(MaintenanceType.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            type.setIfDelete(1);
            maintenanceTypeService.update(type);
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
     * 修改维修工种的启用状态
     */
    @Transactional
    @RequestMapping(value = "/changeMaintenanceTypeStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeMaintenanceTypeStatus";
        logger.info("[start]" + apiName);
        try {
            MaintenanceType type = maintenanceTypeService.getById(MaintenanceType.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = type.getStatus() == 1 ? 0 : 1;
                }
                type.setStatus(parameter);
            }
            maintenanceTypeService.update(type);
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

    // 返回类别，工种的json
    @RequestMapping(value = "/getCategoryTypeJson", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getCategoryTypeJson() {
        JSONObject json = new JSONObject();
        String apiName = "getCategoryTypeJson";
        logger.info("[start]" + apiName);
        try {
            // 取出类别list
            List<MaintenanceCategory> categoryList = maintenanceCategoryService.getMaintenanceCategoryTypeList("false");
            // 获取满足条件的list
            List<Map<String, Object>> mapList = maintenanceTypeService.getThisInfo(categoryList);
            json.put("maintenanceTypeList", JSONArray.fromObject(mapList));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/getCategoryTypeTreeList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getCategoryTypeTreeList() {
        JSONArray resultData = new JSONArray();
        String apiName = "getCategoryTypeTreeList";
        logger.info("[start]" + apiName);
        try {
            // 取出类别list
            List<MaintenanceCategory> categoryList = maintenanceCategoryService.getMaintenanceCategoryForType();
            // 获取满足条件的list
            List<Map<String, Object>> mapList = maintenanceTypeService.getThisInfoList(categoryList);
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

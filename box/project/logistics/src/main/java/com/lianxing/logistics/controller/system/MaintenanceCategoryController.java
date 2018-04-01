package com.lianxing.logistics.controller.system;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.MaintenanceCategory;
import com.lianxing.logistics.service.MaintenanceCategoryServiceImpl;
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
public class MaintenanceCategoryController extends BaseController {

    private static Logger logger = LogManager.getLogger(MaintenanceCategoryController.class);

    @Autowired
    private MaintenanceCategoryServiceImpl maintenanceCategoryService;

    @SuppressWarnings("rawtypes")
    @Transactional(readOnly = true)
    @RequestMapping(value = "/getMaintenanceCategoryList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceCategoryList";
        logger.info("[start] " + apiName);
        try {
            Page page = maintenanceCategoryService.getPageInfo(request);
            Map<String, Map> paraMap = maintenanceCategoryService.getSeachMapInfo(request);
            List<MaintenanceCategory> maintenanceCategory = maintenanceCategoryService.getList(page, paraMap, true);
            Long totalRecords = maintenanceCategoryService.getMaintenanceCategoryAllCountFromPara(paraMap, true);
            json = getTableData(maintenanceCategory, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    // 维修类别下拉框数据
    @RequestMapping(value = "/getMaintenanceCateaorySelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaintenanceCateaorySelectList() {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceCateaorySelectList";
        logger.info("[start] " + apiName);
        try {
            List<MaintenanceCategory> maintenanceCategories = maintenanceCategoryService.getMaintenanceCategoryList();
            json.put("data", JSONArray.fromObject(maintenanceCategories, JsonUtil.jsonConfig("dateTime")));
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
    @RequestMapping(value = "/saveMaintenanceCategory", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveMaintenanceCategory";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            MaintenanceCategory category;
            category = JsonUtil.jsonToObject(MaintenanceCategory.class, requestObject.toString());
            logger.info(category);
            if (category.getId() == null) {
                maintenanceCategoryService.save(category);
            } else {
                category.setUpdateDateTime(new Date());
                maintenanceCategoryService.update(category);
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
    @RequestMapping(value = "/deleteMaintenanceCategory", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteMaintenanceCategory";
        logger.info("[start]" + apiName);
        try {
            MaintenanceCategory category = maintenanceCategoryService.getById(MaintenanceCategory.class,
                    Long.parseLong(id));
            category.setIfDelete(1);
            maintenanceCategoryService.update(category);
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
    @RequestMapping(value = "/changeMaintenanceCategoryStatus")
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeMaintenanceCategoryStatus";
        logger.info("[start]" + apiName);
        try {
            MaintenanceCategory category = maintenanceCategoryService.getById(MaintenanceCategory.class,
                    Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = category.getStatus() == 1 ? 0 : 1;
                }
                category.setStatus(parameter);
            }
            category.setUpdateDateTime(new Date());
            maintenanceCategoryService.update(category);
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
    @RequestMapping(value = "/checkRepeatMaintenanceCategory", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatMaintenanceCategory";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            MaintenanceCategory category;
            category = JsonUtil.jsonToObject(MaintenanceCategory.class, requestObject.toString());
            logger.info(category);
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", category.getName());
            boolean repeat = maintenanceCategoryService.checkRepeat("MaintenanceCategory", checkMap, category.getId());
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

}

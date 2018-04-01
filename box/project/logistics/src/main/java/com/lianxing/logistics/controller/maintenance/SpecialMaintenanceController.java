package com.lianxing.logistics.controller.maintenance;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.MaintenanceSpecial;
import com.lianxing.logistics.model.WarrantyNumber;
import com.lianxing.logistics.service.SpecialMaintenanceServiceImpl;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class SpecialMaintenanceController extends BaseController {

    private static Logger logger = LogManager.getLogger(SpecialMaintenanceController.class);

    @Autowired
    private SpecialMaintenanceServiceImpl specialMaintenanceService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings({"rawtypes", "unchecked"})
    @RequestMapping(value = "/getSpecialMaintenance", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getSpecialMaintenance";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = specialMaintenanceService.getPageInfo(request);
            Map<String, Map> paraMap = specialMaintenanceService.getSeachMapInfo(request);
            List<WarrantyNumber> list = specialMaintenanceService.getList(page, paraMap, true);// 取出满足条件的list（但是除了满足area的）
//            List<Object> areaIdsList = maintenanceAreaService.getMaintenanceAreaIdsList();// 获取到满足条件的Area的list
//            List<WarrantyNumber> finalList = specialMaintenanceService.getFinalList(list, areaIdsList);
            List<JSONObject> resultList;
            resultList = specialMaintenanceService.getResultJSONList(list);
            // 获取满足查询条件总对象的个数
            Long totalRecords = specialMaintenanceService.getSpecialMaintenanceAllCountFromPara(paraMap, true);
            json = getTableData(resultList, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 添加/修改专项维修信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/saveSpecialMaintenance", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveSpecialMaintenance";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 取出区域id数组
            JSONObject obj = (JSONObject) requestObject.get("maintenanceArea");
            JSONArray areaIdList = (JSONArray) obj.get("id");
            StringBuffer areaIds = new StringBuffer();
            for (Object object : areaIdList) {
                areaIds.append(object).append(",");
            }
            String tempIds = areaIds.toString();
            String dbAreaIds = tempIds.substring(0, tempIds.length() - 1);
            // 从转换队列中取出
            requestObject.remove("maintenanceArea");
            // 将json数据转换为实体对象
            WarrantyNumber warrantyNumber;
            warrantyNumber = JsonUtil.jsonToObject(WarrantyNumber.class, requestObject.toString());
            MaintenanceSpecial special = warrantyNumber.getMaintenanceSpecial();
            special.setMaintenanceAreaIds(dbAreaIds);
            warrantyNumber.setMaintenanceSpecial(special);
            // 专项维修
            warrantyNumber.setType(1);
            logger.info(warrantyNumber);
            // 执行
            if (warrantyNumber.getId() == null) {
                synchronized (this) {
                    // 生成维修单号
                    String number = specialMaintenanceService.getMaintenanceNumber();
                    if (number != null) {
                        warrantyNumber.setMaintenanceNumber(number);
                    } else {
                        warrantyNumber.setMaintenanceNumber("");
                    }
                    MaintenanceSpecial maintenanceSpecial = warrantyNumber.getMaintenanceSpecial();
                    Long id = specialMaintenanceService.save(maintenanceSpecial);
                    maintenanceSpecial.setId(id);
                    warrantyNumber.setMaintenanceSpecial(maintenanceSpecial);
                    specialMaintenanceService.save(warrantyNumber);
                }
            } else {
                specialMaintenanceService.update(special);
                specialMaintenanceService.update(warrantyNumber);
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
     * 检查专项维修名称是否重复
     *
     * @param request
     * @throws Exception
     */
    @RequestMapping(value = "/checkRepeatSpecialMaintenance", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatSpecialMaintenance";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 将json数据转换为实体对象
            WarrantyNumber warrantyNumber;
            warrantyNumber = JsonUtil.jsonToObject(WarrantyNumber.class,
                    requestObject.get("warrantyNumber").toString());
            logger.info(warrantyNumber);
            // 执行
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("maintenanceItemName", warrantyNumber.getMaintenanceItemName());
            boolean repeat = specialMaintenanceService.checkRepeat("WarrantyNumber", checkMap,
                    warrantyNumber.getId(), true);
            // 重复
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
     * 根据Id删除对应的专项维修(逻辑删除)
     *
     * @param id 专项维修Id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteSpecialMaintenance", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteSpecialMaintenance";
        logger.info("[start]" + apiName);
        try {
            // 执行
            WarrantyNumber warrantyNumber = specialMaintenanceService.getById(WarrantyNumber.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            warrantyNumber.setIfDelete(1);
            specialMaintenanceService.update(warrantyNumber);
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
     * 通过Id获得专项维修详情
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getSpecialMaintenanceById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getSpecialMaintenanceById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getSpecialMaintenanceById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                WarrantyNumber warrantyNumber = specialMaintenanceService.getById(WarrantyNumber.class, id);
                MaintenanceSpecial maintenanceSpecial = warrantyNumber.getMaintenanceSpecial();
                String areaIds = maintenanceSpecial.getMaintenanceAreaIds();
                String[] ids = areaIds.split(",", -1);
                String areaNameListFromIds = specialMaintenanceService.getAreaNameListFromIds(ids);
                maintenanceSpecial.setMaintenanceAreaIds(areaNameListFromIds);
                warrantyNumber.setMaintenanceSpecial(maintenanceSpecial);
                json.put("data", JSONObject.fromObject(warrantyNumber, JsonUtil.jsonConfig("dateTime")));
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

}

package com.lianxing.logistics.controller.duty;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.WorkDuty;
import com.lianxing.logistics.service.DutyServiceImpl;
import com.lianxing.logistics.util.*;
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
import java.util.List;
import java.util.Map;

@Controller
public class DutyController extends BaseController {

    private static Logger logger = LogManager.getLogger(DutyController.class);

    @Autowired
    private DutyServiceImpl dutyService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getDutyList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getDutyList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = dutyService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = dutyService.getSeachMapInfo(request);
            List<WorkDuty> list = dutyService.getList(page, paraMap, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = dutyService.getDutyAllCountFromPara(page, paraMap, true);
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
     * 根据id删除WorkDuty
     *
     * @param id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteDuty", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> deleteDuty(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteDuty";
        logger.info("[start]" + apiName);
        try {
            // 执行
            WorkDuty workDuty = dutyService.getById(WorkDuty.class, Long.parseLong(id));
            // 修改删除状态为删除
            workDuty.setIfDelete(1);
            dutyService.update(workDuty);
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
     * 修改值班的状态
     *
     * @param statusType
     * @param id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/changeDutyStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeDutyStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            WorkDuty workDuty = dutyService.getById(WorkDuty.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("ifAllDay".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = workDuty.getIfAllDay() == 1 ? 0 : 1;
                }
                workDuty.setIfAllDay(parameter);
            } else if ("ifNight".equals(statusType)) {// 白夜班状态
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = workDuty.getIfNight() == 1 ? 0 : 1;
                }
                workDuty.setIfNight(parameter);
            } else if ("dateType".equals(statusType)) {// 班次的状态
                parameter = Integer.parseInt(parameterStr);
                workDuty.setDateType(parameter);
            }
            dutyService.update(workDuty);
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
     * 通过Id获得WorkDuty的详情
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getDutyById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getDutyById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getDutyById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                WorkDuty workDuty = dutyService.getById(WorkDuty.class, id);
                json.put("data", JSONObject.fromObject(workDuty, JsonUtil.jsonConfig("dateTime")));
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
     * 根据传入的年月获取到该月中的 周末以及需要放假的日期
     *
     * @param year  eq:'2017'
     * @param month eq:'10'
     * @return eq:''
     */
    @RequestMapping(value = "/getInitCalendarHolidayFromDate", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getInitCalendarHolidayFromDate(@RequestParam("year") String year, @RequestParam("month") String month) {
        String apiName = "getInitCalendarHolidayFromDate";
        logger.info("[start]" + apiName);
        JSONObject json = new JSONObject();
        try {
            // redis缓存中取出该年月的节假日信息
            RedisClient redisClient = new RedisClient();
            String holidayInfo = redisClient.get("holiday." + year + String.format("%02d", Integer.parseInt(month)));
            if (holidayInfo == null) {
                List<JSONObject> date = dutyService.getInitCalendarInfoFromDate(year, month);
                if (date != null) {
                    json.put("data", date);
                }
            } else {
                HttpHeaders headers = HttpUtil.getHttpHeaders();
                return new ResponseEntity<>(holidayInfo, headers, HttpStatus.OK);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }


    @Transactional
    @RequestMapping(value = "/saveDuty", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> saveDuty(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveDuty";
        logger.info("[start]" + apiName);
        try {
            // 工种Id
            String typeId = request.getParameter("typeId");
            // 部门Id
            String departmentId = request.getParameter("departmentId");
            String listDataStr = request.getParameter("tableListData");
            dutyService.saveDuties(typeId, departmentId, listDataStr);
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
     * 根据部门Id 工种Id 日期(年月 eq:2017-11) 获取到值班表
     *
     * @param departmentId 部门Id
     * @param typeId       工种Id
     * @param date         日期
     * @return
     */
    @RequestMapping(value = "/getDutiesFromDepartmentTypeAndDate", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getDutiesFromDepartmentTypeAndDate(@RequestParam("departmentId") Long departmentId,
                                                                     @RequestParam("typeId") Long typeId, @RequestParam("date") String date) {
        JSONObject json = new JSONObject();
        String apiName = "getDutiesFromDepartmentTypeAndDate";
        logger.info("[start]" + apiName);
        try {
            List<JSONObject> list = dutyService.getDutiesFromDepartmentTypeAndDate(departmentId, typeId, date);
            json.put("data", list);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            json.put("status", Const.ERROR);
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 根据部门Id 工种Id 日期(年月 eq:2017-11) 获取到用户信息统计 白夜班次数 普通 节假日 周末统计
     *
     * @param departmentId
     * @param typeId
     * @param date
     * @return
     */
    @RequestMapping(value = "/getUserInfoFromDepartmentTypeAndDate", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getUserInfoFromDepartmentTypeAndDate(@RequestParam("departmentId") Long departmentId,
                                                                       @RequestParam("typeId") Long typeId, @RequestParam("date") String date) {
        JSONObject json = new JSONObject();
        String apiName = "getUserInfoFromDepartmentTypeAndDate";
        logger.info("[start]" + apiName);
        try {
            List<JSONObject> list = dutyService.getUserInfoFromDepartmentTypeAndDate(departmentId, typeId, date);
            json.put("data", list);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            json.put("status", Const.ERROR);
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/getDutiesDetailFromDepartmentId", method = RequestMethod.POST)
    @ResponseBody
    public synchronized ResponseEntity<String> getDutiesDetailFromDepartmentId(@RequestParam("departmentId") Long departmentId) {
        JSONObject json = new JSONObject();
        String apiName = "getDutiesDetailFromDepartmentId";
        logger.info("[start]" + apiName);
        try {
            // 获取到该部门下的值班信息
            JSONArray list = dutyService.getDutyDetailsFromDepartmentId(departmentId);
            json.put("data", list);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            json.put("status", Const.ERROR);
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }
}

package com.lianxing.logistics.controller.maintenance;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.controller.message.MessageController;
import com.lianxing.logistics.model.*;
import com.lianxing.logistics.service.*;
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
import java.util.*;

@Controller
public class MaintenanceRecordController extends BaseController {

    private static Logger logger = LogManager.getLogger(MaintenanceRecordController.class);

    @Autowired
    private MaintenanceRecordServiceImpl maintenanceRecordService;

    @Autowired
    private MessageRecorderServiceImpl messageRecorderService;

    @Autowired
    private WarrantyNumberServiceImpl warrantyNumberService;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private MessageController messageController;

    @Autowired
    private MaintenanceWorkerServiceImpl maintenanceWorkerService;

    @Autowired
    private FleaMarketServiceImpl fleaMarketService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getMaintenanceRecord", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceRecord";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = maintenanceRecordService.getPageInfo(request);
            Map<String, Map> paraMap = maintenanceRecordService.getSeachMapInfo(request);
            List<WarrantyNumber> list = maintenanceRecordService.getList(page, paraMap, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = maintenanceRecordService.getMaintenanceRecordAllCountFromPara(paraMap, true);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 修改状态
     *
     * @param statusType
     * @param id
     * @param request
     * @return
     */
    @Transactional
    @RequestMapping(value = "/changeMaintenanceRecordStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeMaintenanceRecordStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            WarrantyNumber warrantyNumber = maintenanceRecordService.getById(WarrantyNumber.class, Long.parseLong(id));
            MaintenanceRecord record = warrantyNumber.getMaintenanceRecord();
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("approvalStatus".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = record.getApprovalStatus() == 1 ? 0 : 1;
                    if(parameter == 1) {
                        MaintenanceStatus maintenanceStatus = maintenanceRecordService.getById(MaintenanceStatus.class, 6L);
                        record.setMaintenanceStatus(maintenanceStatus);
                    }
                }
                record.setApprovalStatus(parameter);
            }
            maintenanceRecordService.update(record);
            warrantyNumber.setMaintenanceRecord(record);
            maintenanceRecordService.update(warrantyNumber);
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
     * 添加普通维修记录
     *
     * @param request
     * @throws Exception
     */
    @SuppressWarnings("rawtypes")
    @Transactional
    @RequestMapping(value = "/saveMaintenanceRecord", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveMaintenanceRecord";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            // 保存图片
            requestObject = fleaMarketService.dealWithJSONObj(requestObject);
            Object fileIds = requestObject.get("fileIds");
            if (fileIds != null) {
                JSONObject maintenanceRecord = (JSONObject) requestObject.get("maintenanceRecord");
                maintenanceRecord.put("fileIds", fileIds);
                requestObject.remove("fileIds");
            }
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            WarrantyNumber warrantyNumber;
            warrantyNumber = JsonUtil.jsonToObject(WarrantyNumber.class, requestObject.toString());
            logger.info(warrantyNumber);
            // 执行
            if (warrantyNumber.getId() == null) {
                synchronized (this) {
                    // 生成维修单号
                    String number = maintenanceRecordService.getMaintenanceNumber();
                    if (number != null) {
                        warrantyNumber.setMaintenanceNumber(number);
                    } else {
                        warrantyNumber.setMaintenanceNumber("");
                    }
                    MaintenanceRecord record = warrantyNumber.getMaintenanceRecord();
                    record = maintenanceRecordService.saveMaintenanceRecord(record);
                    warrantyNumber.setMaintenanceRecord(record);
                    Long id = maintenanceRecordService.save(warrantyNumber);
                    List list = getMaintenanceWorkerList(record);
                    if (list.size() > 0) {
                        // 如果获取到的维修工人不为空则发送短信
                        List<User> userList = saveMessageRecorder(list);
                        // 给维修工人发送短信
                        HashMap map = new HashMap();
                        for (User user : userList) {
                            Long userId = user.getId();
                            String name = user.getName();
                            String mobile = user.getTel();
                            messageController.sendMessageForAppoint(name, number, Long.parseLong("10"), mobile);
                            map.put(userId.toString(), mobile);
                        }
                        // 保存订单的相关信息保存到redis中
                        maintenanceRecordService.saveRedisByIdAndMap(id, map);
                        // 调用计时接口（在10分钟之后如果订单中的维修人员还为空，则给管理人员发送短信）
                        getWarrantyNumberAboutWorker(number);
                    } else {
                        // 如果维修人员为空，给管理人员发短信（但是维修订单保存成功）
                        User user = userService.getAdministrativeUser();
                        messageController.sendOverTimeMessageForAdministrative(user.getTel(), number);
                    }
                    json.put("status", Const.SUCCESS);
                }
            } else {
                MaintenanceRecord record = warrantyNumber.getMaintenanceRecord();
                record = maintenanceRecordService.changeRecordStatus(record);
                maintenanceRecordService.update(record);
                warrantyNumber.setMaintenanceRecord(record);
                maintenanceRecordService.update(warrantyNumber);
                json.put("status", Const.SUCCESS);
            }
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
     * 计时接口：在十分钟之后，调用TimerTask函数
     *
     * @param maintenanceNumber
     */
    private void getWarrantyNumberAboutWorker(String maintenanceNumber) {
        // 获取触发定时器的延迟时间
        String TimerTime = PropertiesUtil.get("SendMessageForAdministrativeTimer", "/sys_config.properties");
        Long oneMinTime = Long.valueOf(1000 * 60);
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                WarrantyNumber warrantyNumber = warrantyNumberService.getWarrantyNumerByMaintenanceNumber(maintenanceNumber);
                User worker = warrantyNumber.getMaintenanceStaff();
                User user = userService.getAdministrativeUser();
                if (worker == null) {
                    MaintenanceRecord record = warrantyNumber.getMaintenanceRecord();
                    MaintenanceStatus maintenanceStatus = maintenanceRecordService.getById(MaintenanceStatus.class, 3L);
                    record.setMaintenanceStatus(maintenanceStatus);
                    maintenanceRecordService.update(record);
                    warrantyNumber.setMaintenanceRecord(record);
                    maintenanceRecordService.update(warrantyNumber);
                    messageController.sendOverTimeMessageForAdministrative(user.getTel(), maintenanceNumber);
                    timer.cancel();
                }
            }
        }, oneMinTime * Long.parseLong(TimerTime));
    }

    /**
     * 获取到维修工人的id
     *
     * @param record
     * @return
     */
    @SuppressWarnings("rawtypes")
    private List getMaintenanceWorkerList(MaintenanceRecord record) {
        Long maintenanceAreaId = record.getMaintenanceArea().getId();
        Long maintenanceCategoryId = record.getMaintenanceCategory().getId();
        MaintenanceArea maintenanceArea = maintenanceRecordService.getById(MaintenanceArea.class, maintenanceAreaId);
        MaintenanceCategory maintenanceCategory = maintenanceRecordService.getById(MaintenanceCategory.class, maintenanceCategoryId);
        Long departmentId = maintenanceArea.getDepartment().getId();
        Long maintenanceTypeId = maintenanceCategory.getMaintenanceType().getId();
        List list = maintenanceWorkerService.getMaintenanceWorkerIdList(departmentId, maintenanceTypeId);
        return list;
    }

    /**
     * 保存短信记录
     *
     * @param list
     */
    @SuppressWarnings("rawtypes")
    private List<User> saveMessageRecorder(List list) {
        List<User> userList = new ArrayList<>();
        HashSet<String> set = new HashSet();
        Iterator it = list.iterator();
        while (it.hasNext()) {
            Map map = (Map) it.next();
            Long workerId = (Long) map.get("id");
            User user;
            user = userService.getUserByWorkerId(workerId);
            if (user != null) {
                String tel = user.getTel();
                // 根据手机号码将user放到set中（重复的手机号只放一个用户）
                set.add(tel);
                MessageRecorder messageRecorder = new MessageRecorder();
                messageRecorder.setMaintenanceStaff(user);
                messageRecorder.setTel(tel);
                messageRecorderService.save(messageRecorder);
            }
        }
        // 此set中没有重复的手机号，将手机号对应的user取出（多个用户只取第一个）
        for (String mobile : set) {
            User user = userService.getUserByTel(mobile);
            userList.add(user);
        }
        return userList;
    }

    /**
     * 手动指派时获取的userlist
     *
     * @param id
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getUserListByRecord", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getUserListByRecord(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getUserListByRecord";
        logger.info("[start]" + apiName);
        try {
            WarrantyNumber warrantyNumber = maintenanceRecordService.getById(WarrantyNumber.class, id);
            MaintenanceRecord maintenanceRecord = warrantyNumber.getMaintenanceRecord();
            List list = getMaintenanceWorkerList(maintenanceRecord);
            List<User> userList;
            userList = userService.getUserListForErgodic(list);
            json.put("data", JSONArray.fromObject(userList, JsonUtil.jsonConfig("date")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/getMaintenanceRecordById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaintenanceRecordById(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceRecordById";
        logger.info("[start]" + apiName);
        try {
            WarrantyNumber warrantyNumber = maintenanceRecordService.getById(WarrantyNumber.class, Long.parseLong(id));
            String fileIds = warrantyNumber.getMaintenanceRecord().getFileIds();
            JSONObject itemObj = fleaMarketService.getResultJSONList(fileIds);
            json.put("imgUrls", itemObj);
            json.put("data", JSONObject.fromObject(warrantyNumber, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 根据用户id获取到对应的维修中列表
     *
     * @param userId
     * @return
     */
    @RequestMapping(value = "/getWarrantyNumberIsServiceListByUserId", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getWarrantyNumberIsServiceListByUserId(@RequestParam("userId") String userId, @RequestParam("type") String type) {
        JSONObject json = new JSONObject();
        String apiName = "getWarrantyNumberIsServiceListByUserId";
        logger.info("[start]" + apiName);
        try {
            List<WarrantyNumber> list = warrantyNumberService.getWarrantyNumberList(Long.parseLong(userId), type);
            json.put("data", JSONArray.fromObject(list, JsonUtil.jsonConfig("date")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 手动指派维修人员
     *
     * @param userId
     * @param maintenanceId
     * @return
     */
    @SuppressWarnings("rawtypes")
    @Transactional
    @RequestMapping(value = "/addMaintenanceRecordForUser", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> addMaintenanceRecordForUser(@RequestParam("userId") String userId,
                                                              @RequestParam("maintenanceId") String maintenanceId) {
        JSONObject json = new JSONObject();
        String apiName = "addMaintenanceRecordForUser";
        logger.info("[start]" + apiName);
        try {
            User worker = maintenanceRecordService.getById(User.class, Long.parseLong(userId));
            WarrantyNumber warrantyNumber = messageRecorderService.getById(WarrantyNumber.class, Long.parseLong(maintenanceId));
            if (worker != null && warrantyNumber != null) {
                warrantyNumber.setMaintenanceStaff(worker);
                MaintenanceRecord maintenanceRecord = warrantyNumber.getMaintenanceRecord();
                MaintenanceStatus maintenanceStatus = new MaintenanceStatus();
                maintenanceStatus.setId(4L);
                maintenanceRecord.setMaintenanceStatus(maintenanceStatus);
                maintenanceRecordService.update(maintenanceRecord);
                warrantyNumber.setMaintenanceRecord(maintenanceRecord);
                warrantyNumber.setMaintenanceStartDateTime(new Date());
                maintenanceRecordService.update(warrantyNumber);
                String maintenanceNumber = warrantyNumber.getMaintenanceNumber();
                String name = warrantyNumber.getRepairStaff().getName();
                String tel = warrantyNumber.getRepairStaff().getTel();
                String address = warrantyNumber.getAddress();
                String mobile = worker.getTel();
                String workerName = worker.getName();
                // 给维修人员发送成功接单的短信
                messageController.acceptOrderSuccess(maintenanceNumber, name, tel, address, mobile);
                // 给报修人员发送维修人员成功接单的短信
                messageController.sendAcceptOrderSuccessForRepairStaff(tel, workerName, mobile, maintenanceNumber);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.NULL);
            }
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
     * 维修人员结束维修订单
     *
     * @param id
     * @param maintenanceStatusId
     * @param unableRepairReason
     * @return
     */
    @SuppressWarnings("rawtypes")
    @Transactional
    @RequestMapping(value = "/completionMaintenanceRecordForWorker", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> completionMaintenanceRecordForWorker(@RequestParam("id") Long id,
                                                                       @RequestParam("maintenanceStatusId") Long maintenanceStatusId,
                                                                       @RequestParam("unableRepairReason") String unableRepairReason) {
        JSONObject json = new JSONObject();
        String apiName = "completionMaintenanceRecordForWorker";
        logger.info("[start]" + apiName);
        try {
            Date date = new Date();
            WarrantyNumber warrantyNumber = maintenanceRecordService.getById(WarrantyNumber.class, id);
            MaintenanceStatus maintenanceStatus = maintenanceRecordService.getById(MaintenanceStatus.class, maintenanceStatusId);
            MaintenanceRecord maintenanceRecord = warrantyNumber.getMaintenanceRecord();
            // 当无法维修原因不为空并且维修状态为无法维修时，才将原因保存到订单中
            if (unableRepairReason != null && maintenanceStatusId == 8) {
                maintenanceRecord.setUnableRepairReason(unableRepairReason);
            } else {
                maintenanceRecord.setUnableRepairReason(null);
            }
            maintenanceRecord.setMaintenanceStatus(maintenanceStatus);
            maintenanceRecordService.update(maintenanceRecord);
            warrantyNumber.setMaintenanceRecord(maintenanceRecord);
            warrantyNumber.setMaintenanceEndDateTime(date);
            String maintenanceTime = maintenanceRecordService.getMaintenanceTime(warrantyNumber, date);
            warrantyNumber.setMaintenanceTime(maintenanceTime);
            maintenanceRecordService.update(warrantyNumber);
            String mobile = warrantyNumber.getRepairStaff().getTel();
            String maintenanceNumber = warrantyNumber.getMaintenanceNumber();
            int weight = maintenanceStatus.getWeight();
            String reason = maintenanceStatus.getName();
            // weight == 4 : 带评价（维修人员已经正常维修结束） weight == 7,8 : 重复报修或无法维修
            if (weight == 4) {
                // 发送成功维修结束的短信
                messageController.sendFinishOrderSuccessForRepairStaff(mobile, maintenanceNumber);
            } else if (weight == 7 || weight == 8) {
                // 发送维修失败的短信
                messageController.sendFinishOrderLoseForRepairStaff(mobile, reason, maintenanceNumber);
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

}

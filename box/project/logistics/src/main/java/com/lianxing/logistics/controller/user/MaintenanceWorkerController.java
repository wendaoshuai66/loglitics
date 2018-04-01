package com.lianxing.logistics.controller.user;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.User;
import com.lianxing.logistics.service.MaintenanceWorkerServiceImpl;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
public class MaintenanceWorkerController extends BaseController {

    private static Logger logger = LogManager.getLogger(MaintenanceWorkerController.class);

    @Autowired
    private MaintenanceWorkerServiceImpl maintenanceWorkerService;

    @Autowired
    private UserController userController;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getMaintenanceWorkerList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceWorkerList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = maintenanceWorkerService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = maintenanceWorkerService.getSeachMapInfo(request);
            // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
            List<User> list = maintenanceWorkerService.getList(page, paraMap, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = maintenanceWorkerService.getMaintenanceWorkersAllCountFromPara(paraMap, true);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    // 维修工人下拉框数据
    @RequestMapping(value = "/getMaintenanceWorkerSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaintenanceWorkerSelectList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceWorkerSelectList";
        logger.info("[start] " + apiName);
        try {
            String ignoreDeleteAndStatus = request.getParameter("ignoreDeleteAndStatus");
            List<User> users = maintenanceWorkerService.getAll(false, "User", ignoreDeleteAndStatus); // 只取出状态为'启用'
            List<User> maintenanceWorkers = new ArrayList<>();
            // 将维修人员取出
            for (User user : users) {
                if (user.getMaintenanceWorker() != null && user.getApprovalStatus() == 1) {
                    maintenanceWorkers.add(user);
                }
            }
            json.put("data", JSONArray.fromObject(maintenanceWorkers, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 添加/修改维修人员信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/saveMaintenanceWorker", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> saveMaintenanceWorker(HttpServletRequest request) {
        JSONObject json = registerUser(request);
        String apiName = "saveMaintenanceWorker";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 修改维修人员的启用状态
     *
     * @param statusType 确定修改什么状态
     * @param id         修改的实体id
     * @return 状态修改
     */
    @Transactional
    @RequestMapping(value = "/changeMaintenanceWorkerStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = changeUserStatus(statusType, id, request);
        userController.sendSuccessMessageForUser(statusType, id);
        String apiName = "changeMaintenanceWorkerStatus";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 根据Id删除对应的维修人员(逻辑删除)
     *
     * @param id 维修人员Id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteMaintenanceWorker", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = deleteCommon(id);
        String apiName = "deleteMaintenanceWorker";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 重置教员密码
     *
     * @param id 校区Id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/resetPswMaintenance", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> resetPswMaintenance(@RequestParam("id") String id) {
        JSONObject json = resetPswUserCommon(id);
        String apiName = "resetPswMaintenance";
        logger.info("[start]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

}

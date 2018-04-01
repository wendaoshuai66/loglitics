package com.lianxing.logistics.controller.system;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.MaintenanceStatus;
import com.lianxing.logistics.service.MaintenanceStatusServiceImpl;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class MaintenanceStatusController extends BaseController {

    private static Logger logger = LogManager.getLogger(MaintenanceStatusController.class);

    @Autowired
    private MaintenanceStatusServiceImpl maintenanceStatusService;


    /**
     * 根据维修状态列表
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/getMaintenanceStatusList")
    @ResponseBody
    public ResponseEntity<String> getMaintenanceStatusList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaintenanceStatusList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = maintenanceStatusService.getPageInfo(request);
            // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
            List<MaintenanceStatus> list = maintenanceStatusService.getList(page, null, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = maintenanceStatusService.getMaintenanceStatusAllCountFromPara(true);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/getAllMaintenanceStatus")
    @ResponseBody
    public ResponseEntity<String> getAllMaintenanceStatus() {
        JSONObject json = new JSONObject();
        String apiName = "getAllMaintenanceStatus";
        logger.info("[start]" + apiName);
        try {
            List<MaintenanceStatus> allStatus = maintenanceStatusService.getAllMaintenanceStatusSelectList();
            json.put("data", JSONArray.fromObject(allStatus, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }
}

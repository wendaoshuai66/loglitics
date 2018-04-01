package com.lianxing.logistics.controller.statistical;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.service.StatisticalAnalysisServiceImpl;
import com.lianxing.logistics.util.HttpUtil;
import net.sf.json.JSONObject;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Controller
public class StatisticalAnalysisController extends BaseController {

    private static Logger logger = LogManager.getLogger(StatisticalAnalysisController.class);

    @Autowired
    private StatisticalAnalysisServiceImpl statisticalAnalysisService;

    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/getMaintenanceStatisticWithTime", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaintenanceStatisticWithTime(@RequestParam("timeSpan") int paramInt, HttpServletRequest request) {
        String apiName = "getMaintenanceStatisticWithTime";
        logger.info("[start]" + apiName);
        JSONObject resultList = null;
        try {
            String startTime = request.getParameter("startTime");
            String endTime = request.getParameter("endTime");
            resultList = statisticalAnalysisService
                    .getMaintainCountList(statisticalAnalysisService.getMaintainCount(paramInt, startTime, endTime), paramInt);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(resultList.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/getMaintenanceStatisticWithType", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaintenanceStatisticWithType(@RequestParam("typeSpan") String type, HttpServletRequest request) {
        String apiName = "getMaintenanceStatisticWithType";
        logger.info("[start]" + apiName);
        JSONObject resultList = null;
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
        String lineUseFlag = request.getParameter("lineUse");
        try {
            resultList = statisticalAnalysisService.getMaintenanceStatisticWithType(type, startTime, endTime);
            // 将饼状图 转化成柱状图以及主线图
            if ("true".equals(lineUseFlag)) {
                resultList = statisticalAnalysisService.getLineUseInfoWithType(resultList);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(resultList.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/maintenanceStatisticWithQuality", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> maintenanceStatisticWithQuality(@RequestParam("typeSpan") String type, @RequestParam("startTime") String startTime, @RequestParam("endTime") String endTime) {
        String apiName = "maintenanceStatisticWithQuality";
        logger.info("[start]" + apiName);
        JSONObject resultList = null;
        try {
            resultList = statisticalAnalysisService.maintenanceStatisticWithQuality(type, startTime, endTime);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(resultList.toString(), headers, HttpStatus.OK);
    }
}

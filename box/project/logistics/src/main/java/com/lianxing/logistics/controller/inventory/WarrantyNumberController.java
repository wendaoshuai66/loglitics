package com.lianxing.logistics.controller.inventory;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.WarrantyNumber;
import com.lianxing.logistics.service.BaseServiceImpl;
import com.lianxing.logistics.service.WarrantyNumberServiceImpl;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.JsonUtil;
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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
public class WarrantyNumberController extends BaseController {

    private static Logger logger = LogManager.getLogger(WarrantyNumberController.class);

    @Autowired
    private BaseServiceImpl baseService;

    @Autowired
    private WarrantyNumberServiceImpl warrantyNumberService;

    /**
     * 获取维修单号下拉框数据
     *
     * @return
     */
    @RequestMapping(value = "/getWarrantyNumberSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getWarrantyNumberSelectList() {
        JSONObject json = new JSONObject();
        String apiName = "getWarrantyNumberSelectList";
        logger.info("[start] " + apiName);
        try {
            List<WarrantyNumber> warrantyNumbers = baseService.getAll(true, "WarrantyNumber");
            json.put("data", JSONArray.fromObject(warrantyNumbers, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 获取只有接单了的订单列表(有工人的专项维修和有工人的并且维修状态不为‘重复报修’和‘无法维修’的普通维修)
     *
     * @return
     */
    @RequestMapping(value = "/getWarrantyNumberSelectListForStockRemoval", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getWarrantyNumberSelectListForStockRemoval() {
        JSONObject json = new JSONObject();
        String apiName = "getWarrantyNumberSelectListForStockRemoval";
        logger.info("[start] " + apiName);
        try {
            // 维修状态不为‘重复报修’和‘无法维修’的且维修工人不为空（即接单的）普通维修订单
            List<WarrantyNumber> recordList = warrantyNumberService.getWarrantyNumberForAcceptOrderAboutRecord();
            // 维修工人不为空（即接单的）专项维修订单
            List<WarrantyNumber> specialList = warrantyNumberService.getWarrantyNumberForAcceptOrderAboutSpecial();
            List<WarrantyNumber> list = new ArrayList<>();
            list.addAll(recordList);
            list.addAll(specialList);
            json.put("data", JSONArray.fromObject(list, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

}

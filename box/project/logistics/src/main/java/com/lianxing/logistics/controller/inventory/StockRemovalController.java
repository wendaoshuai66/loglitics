package com.lianxing.logistics.controller.inventory;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.Material;
import com.lianxing.logistics.model.StockRemoval;
import com.lianxing.logistics.service.StockRemovalServiceImpl;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.Page;
import com.lianxing.logistics.util.date.DateTime;
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
import java.util.List;
import java.util.Map;

@Controller
public class StockRemovalController extends BaseController {

    private static Logger logger = LogManager.getLogger(StockRemovalController.class);

    @Autowired
    private StockRemovalServiceImpl stockRemovalService;

    /**
     * 查询出库信息的集合
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getStockRemovalList", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public ResponseEntity<String> getStockRemovalList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getStockRemovalList";
        logger.info("[start]" + apiName);
        try {
            Page page = stockRemovalService.getPageInfo(request);
            boolean ifAll = true;
            Map<String, Map> paraMap = stockRemovalService.getSeachMapInfo(request);
            List<StockRemoval> storageList = stockRemovalService.getList(page, paraMap, ifAll);
            Long totalRecords = stockRemovalService.getStockRemovalAllCountFromPara(paraMap, ifAll);
            json = getTableData(storageList, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 通过维修单号的id获取到对应的出库信息list
     *
     * @return
     */
    @Transactional
    @RequestMapping(value = "/getStockRemovalListByWarrantyNumber", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getStockRemovalListByWarrantyNumber(Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getStockRemovalListByWarrantyNumber";
        logger.info("[start]" + apiName);
        try {
            List<StockRemoval> list;
            list = stockRemovalService.getStockRemovalListByWarrantyNumber(id);
            json.put("data", JSONArray.fromObject(list, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getStockRemovalMaterialNameFromWarrantyNumberId", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getStockRemovalMaterialNameFromWarrantyNumberId(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getStockRemovalMaterialNameFromWarrantyNumberId";
        logger.info("[start]" + apiName);
        try {
            String warrantyNumberId = request.getParameter("id");
            String str = stockRemovalService.getStockRemovalMaterialNameStrFromWarrantyNumberId(Long.parseLong(warrantyNumberId));
            json.put("status", Const.SUCCESS);
            json.put("data", str);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            json.put("status", Const.ERROR);
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    // /**
    // * 检查入库单号是否重复
    // *
    // * @param request
    // * @throws Exception
    // */
    // @RequestMapping(value = "/checkRepeatStorage", method = RequestMethod.POST)
    // @ResponseBody
    // public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
    // JSONObject json = new JSONObject();
    // String apiName = "checkRepeatStorage";
    // logger.info("[start]" + apiName);
    // try {
    // // 将取得的数据转换为json
    // JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
    // logger.info(requestObject);
    // // 将json数据转换为实体对象
    // Storage storage = new Storage();
    // storage = JsonUtil.jsonToObject(Storage.class, requestObject.toString());
    // logger.info(storage);
    // // 执行
    // HashMap<String, Object> checkMap = new HashMap<String, Object>();
    // checkMap.put("storageDocuments", storage.getStorageDocuments());
    // boolean repeat = storageService.checkRepeat("Storage", checkMap, storage.getId());
    // // 重复
    // if (!repeat) {
    // json.put("status", Const.REPEAT);
    // } else {
    // json.put("status", Const.NOREPEAT);
    // }
    // } catch (Exception e) {
    // logger.error("[error]" + apiName + e.toString());
    // e.printStackTrace();
    // }
    // logger.info("[end]" + apiName);
    // HttpHeaders headers = HttpUtil.getHttpHeaders();
    // return new ResponseEntity<String>(json.toString(), headers, HttpStatus.OK);
    // }

    /**
     * 添加或修改出库信息
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/saveStockRemoval", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public synchronized ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveStockRemoval";
        logger.info("[start]" + apiName);
        try {
            // 转化数据格式
            JSONObject requestJsonObject = JsonUtil.getJSONObjFromRequset(request);
            // 封装数据
            StockRemoval stockRemoval = JsonUtil.jsonToObject(StockRemoval.class, requestJsonObject.toString());
            // 需要将字符串手动转成日期
            String stockRemovalDate = (String) requestJsonObject.get("stockRemovalDate");
            Date stockRemovalToDate = DateTime.stringToDate(stockRemovalDate, 1);
            stockRemoval.setStockRemovalDate(stockRemovalToDate);
            // 获取到当前物料
            Material material = stockRemoval.getMaterial();
            // 更新物料个数
            material.setInventoryQuantity(material.getInventoryQuantity() - stockRemoval.getStockRemovalCount());
            stockRemovalService.update(material);
            stockRemoval.setMaterial(material);
            if (stockRemoval.getId() == null) {
                stockRemovalService.save(stockRemoval);
            } else {
                stockRemovalService.update(stockRemoval);
            }
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error] " + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 删除出库信息
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/deleteStockRemoval", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public synchronized ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteStockRemoval";
        logger.info("[start]" + apiName);
        try {
            StockRemoval stockRemoval = stockRemovalService.getById(StockRemoval.class, Long.parseLong(id));
            Integer count = stockRemoval.getStockRemovalCount();
            Material material = stockRemoval.getMaterial();
            // 删除出库记录,将出库物料个数还原
            material.setInventoryQuantity(material.getInventoryQuantity() + count);
            stockRemovalService.update(material);
            stockRemoval.setIfDelete(1);
            stockRemovalService.update(stockRemoval);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }
}

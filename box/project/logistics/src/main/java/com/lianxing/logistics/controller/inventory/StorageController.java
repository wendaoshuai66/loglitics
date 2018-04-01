package com.lianxing.logistics.controller.inventory;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.Material;
import com.lianxing.logistics.model.Storage;
import com.lianxing.logistics.service.StorageServiceImpl;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.Page;
import com.lianxing.logistics.util.date.DateTime;
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
public class StorageController extends BaseController {

    private static Logger logger = LogManager.getLogger(StorageController.class);

    @Autowired
    private StorageServiceImpl storageService;

    /**
     * 查询入库信息的集合
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getStorageList", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public ResponseEntity<String> getStorageList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getStorageList";
        logger.info("[start]" + apiName);
        try {
            Page page = storageService.getPageInfo(request);
            boolean ifAll = true;
            Map<String, Map> paraMap = storageService.getSeachMapInfo(request);
            List<Storage> storageList = storageService.getList(page, paraMap, ifAll);
            Long totalRecords = storageService.getStorageAllCountFromPara(paraMap, ifAll);
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
     * 检查入库单号是否重复
     *
     * @param request
     * @throws Exception
     */
    @RequestMapping(value = "/checkRepeatStorage", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatStorage";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 将json数据转换为实体对象
            Storage storage;
            storage = JsonUtil.jsonToObject(Storage.class, requestObject.toString());
            logger.info(storage);
            // 执行
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("storageDocuments", storage.getStorageDocuments());
            boolean repeat = storageService.checkRepeat("Storage", checkMap, storage.getId());
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
     * 添加或修改入库信息
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/saveStorage", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public synchronized ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveStorage";
        logger.info("[start]" + apiName);
        try {
            // 转化数据格式
            JSONObject requestJsonObject = JsonUtil.getJSONObjFromRequset(request);
            // 封装数据
            Storage storage = JsonUtil.jsonToObject(Storage.class, requestJsonObject.toString());
            // 设置总价
            storage.setTotalPrice(storage.getPrice() * storage.getStorageCount());
            // 需要将字符串手动转成日期
            String storageDate = (String) requestJsonObject.get("storageDate");
            Date storageToDate = DateTime.stringToDate(storageDate, 1);
            storage.setStorageDate(storageToDate);
            // 获取到当当前物料
            Material material = storage.getMaterial();
            // 增加入库物料个数
            material.setInventoryQuantity(material.getInventoryQuantity() + storage.getStorageCount());
            storageService.update(material);
            if (storage.getId() == null) {
                storageService.save(storage);
            } else {
                storageService.update(storage);
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
     * 删除入库信息
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/deleteStorage", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public synchronized ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteStorage";
        logger.info("[start]" + apiName);
        try {
            Storage storage = storageService.getById(Storage.class, Long.parseLong(id));
            Integer count = storage.getStorageCount();
            Material material = storage.getMaterial();
            // 删除入库记录,将入库物料个数还原 如果库中个数小于还原个数提示错误
            Integer c = material.getInventoryQuantity() - count;
            if (c < 0) {
                json.put("status", Const.NOSTORAGE);
            } else {
                material.setInventoryQuantity(c);
                storageService.update(material);
                storage.setIfDelete(1);
                storageService.update(storage);
                json.put("status", Const.SUCCESS);
            }
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

}

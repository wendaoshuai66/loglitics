package com.lianxing.logistics.controller.inventory;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.Material;
import com.lianxing.logistics.service.MaterialServiceImpl;
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
public class MaterialController extends BaseController {

    private static Logger logger = LogManager.getLogger(MaterialController.class);

    @Autowired
    private MaterialServiceImpl materialService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @Transactional
    @RequestMapping(value = "/getMaterialList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaterialList";
        logger.info("[start]" + apiName);
        try {
            Page page = materialService.getPageInfo(request);
            // 拼接精确或模糊查询的Map
            Map<String, Map> paraMap = materialService.getSeachMapInfo(request);
            List<Material> list = materialService.getList(page, paraMap, true);
            Long totalRecords = materialService.getMaterialAllCountFromPara(paraMap, true);
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
     * 下拉框使用
     *
     * @return
     */
    @RequestMapping(value = "/getMaterialSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaterialSelectList() {
        JSONObject json = new JSONObject();
        String apiName = "getMaterialSelectList";
        logger.info("[start] " + apiName);
        try {
            // 只取出启用的
            List<Material> material = materialService.getSelectAllInfo();
            json.put("data", JSONArray.fromObject(material, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("[error]" + apiName + e.toString());
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @Transactional
    @RequestMapping(value = "/changeMaterialStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeMaterialStatus";
        try {
            logger.info("[start]" + apiName);
            Material material = materialService.getById(Material.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = material.getStatus() == 1 ? 0 : 1;
                }
                material.setStatus(parameter);
            }
            material.setUpdateDateTime(new Date());
            materialService.update(material);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.info("[ERROR] " + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 检查物料名称是否重复
     *
     * @param request
     * @throws Exception
     */
    @RequestMapping(value = "/checkRepeatMaterial", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatMaterial";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 将json数据转换为实体对象
            Material material;
            material = JsonUtil.jsonToObject(Material.class, requestObject.toString());
            logger.info(material);
            // 执行
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", material.getName());
            boolean repeat = materialService.checkRepeat("Material", checkMap, material.getId());
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
     * 查询出比报警阈值小的物料的库存数
     *
     * @return
     */
    @RequestMapping(value = "/checkMaterialLessAlarmValue", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkMaterialLessAlarmValue() {
        JSONObject json = new JSONObject();
        String apiName = "checkMaterialLessAlarmValue";
        logger.info("[start]" + apiName);
        try {
            // 执行(获取到未满足条件的集合)
            List<Material> materialList = materialService.checkMaterialLessAlarmValue("Material");
            // 取数据
            json.put("data", JSONArray.fromObject(materialList, JsonUtil.jsonConfig("dateTime")));
            json.put("count", materialList.size());
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 添加物料信息
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/saveMaterial", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveMaterial";
        logger.info("[start]" + apiName);
        try {
            // 转化数据的格式
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            Material material = JsonUtil.jsonToObject(Material.class, requestObject.toString());
            if (material.getId() == null) {
                material.setInventoryQuantity(0);
                materialService.save(material);
            } else {
                material.setUpdateDateTime(new Date());
                materialService.update(material);
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

    @RequestMapping(value = "/deleteMaterial", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteMaterial";
        logger.info("[start]" + apiName);
        try {
            Material material = materialService.getById(Material.class, Long.parseLong(id));
            material.setIfDelete(1);
            materialService.update(material);
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
     * 通过Id获得Material
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getMaterialById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaterialById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getMaterialById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                Material material = materialService.getById(Material.class, id);
                json.put("data", JSONObject.fromObject(material, JsonUtil.jsonConfig("dateTime")));
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

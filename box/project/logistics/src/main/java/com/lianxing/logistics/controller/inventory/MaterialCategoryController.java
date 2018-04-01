package com.lianxing.logistics.controller.inventory;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.MaterialCategory;
import com.lianxing.logistics.service.MaterialCategoryServiceImpl;
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
public class MaterialCategoryController extends BaseController {

    private static Logger logger = LogManager.getLogger(MaterialCategory.class);

    @Autowired
    private MaterialCategoryServiceImpl materialCategoryService;

    /**
     * 查询 MaterialCategory 信息，根据查询条件获取分页列表
     *
     * @param request
     * @return JSON 格式的数据
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getMaterialCategoryList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaterialCategoryList(HttpServletRequest request) {

        JSONObject json = new JSONObject();
        String apiName = "getMaterialCategoryList";
        logger.info("[start] " + apiName);
        try {
            Page page = materialCategoryService.getPageInfo(request);
            // 从前端接收的参数 （模糊或精确查询的参数）
            Map<String, Map> paraMap = materialCategoryService.getSeachMapInfo(request);
            boolean ifAll = true;
            // 按照条件进行查询，返回一个集合
            List<MaterialCategory> list = materialCategoryService.getList(page, paraMap, ifAll);
            System.out.println(list);
            Long totalRecords = materialCategoryService.getMaterialCategorAllCountFromPara(paraMap, true);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("[error]  " + apiName + e.toString());
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
    @RequestMapping(value = "/getMaterialCategorySelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaterialCategorySelectList() {
        JSONObject json = new JSONObject();
        String apiName = "getMaterialCategorySelectList";
        logger.info("[start] " + apiName);
        try {
            // 只取出启用的
            List<MaterialCategory> materialCategorys = materialCategoryService.getAll(false, "MaterialCategory");
            json.put("data", JSONArray.fromObject(materialCategorys, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("[error]" + apiName + e.toString());
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @Transactional
    @RequestMapping(value = "/changeMaterialCategoryStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeMaterialCategoryStatus";
        try {
            logger.info("[start]" + apiName);
            MaterialCategory materialCategory = materialCategoryService.getById(MaterialCategory.class,
                    Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = materialCategory.getStatus() == 1 ? 0 : 1;
                }
                materialCategory.setStatus(parameter);
            }
            materialCategory.setUpdateDateTime(new Date());
            materialCategoryService.update(materialCategory);
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
     * 检查物料类别名称是否重复
     *
     * @param request
     * @throws Exception
     */
    @RequestMapping(value = "/checkRepeatMaterialCategory", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatMaterialCategory";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 将json数据转换为实体对象
            MaterialCategory materialCategory;
            materialCategory = JsonUtil.jsonToObject(MaterialCategory.class, requestObject.toString());
            logger.info(materialCategory);
            // 执行
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", materialCategory.getName());
            boolean repeat = materialCategoryService.checkRepeat("MaterialCategory", checkMap,
                    materialCategory.getId());
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
     * 添加物料类别信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/saveMaterialCategory", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveMaterialCategory";
        logger.info("[start]" + apiName);
        try {
            // 转化数据的格式
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 解析JSONObject 拼接成 MaterialCategory 对象
            MaterialCategory materialCategory = JsonUtil.jsonToObject(MaterialCategory.class, requestObject.toString());
            if (materialCategory.getId() == null) {
                materialCategoryService.save(materialCategory);
            } else {
                materialCategory.setUpdateDateTime(new Date());
                materialCategoryService.update(materialCategory);
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
     * 删除物料类别信息
     *
     * @param id
     * @return JSON 格式的数据
     */
    @RequestMapping(value = "/deleteMaterialCategory", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteMaterialCategory";
        try {
            logger.info("[start] " + apiName);
            MaterialCategory materialCategory = materialCategoryService.getById(MaterialCategory.class,
                    Long.parseLong(id));
            materialCategory.setIfDelete(1);
            materialCategoryService.update(materialCategory);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.info("[error] " + apiName + e.toString());
        }
        logger.info("[end]" + apiName);

        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }
}

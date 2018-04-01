package com.lianxing.logistics.controller.inventory;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.MaterialUnit;
import com.lianxing.logistics.service.MaterialUnitServiceImpl;
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
public class MaterialUnitController extends BaseController {

    private static Logger logger = LogManager.getLogger(MaterialUnit.class);

    @Autowired
    private MaterialUnitServiceImpl materialUnitService;

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getMaterialUnitList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaterialUnitList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getMaterialUnitList";
        logger.info("[start] " + apiName);
        try {
            Page page = materialUnitService.getPageInfo(request);
            // 从前端接收的参数 （模糊或精确查询的参数）
            Map<String, Map> paraMap = materialUnitService.getSeachMapInfo(request);
            boolean ifAll = true;// 查询全部，包括隐藏
            // 按照条件进行查询，返回一个集合
            List<MaterialUnit> list = materialUnitService.getList(page, paraMap, ifAll);
            Long totalRecords = materialUnitService.getMaterialUnitAllCountFromPara(paraMap, true);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("[error]" + apiName + e.toString());
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
    @RequestMapping(value = "/getMaterialUnitSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getMaterialUnitSelectList() {
        JSONObject json = new JSONObject();
        String apiName = "getMaterialUnitSelectList";
        logger.info("[start] " + apiName);
        try {
            // 只取出启用的
            List<MaterialUnit> materialUnits = materialUnitService.getAll(false, "MaterialUnit");
            json.put("data", JSONArray.fromObject(materialUnits, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("[error]" + apiName + e.toString());
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 检查物料单位名称是否重复
     *
     * @param request
     * @throws Exception
     */
    @RequestMapping(value = "/checkRepeatMaterialUnit", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatMaterialUnit";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 将json数据转换为实体对象
            MaterialUnit materialUnit;
            materialUnit = JsonUtil.jsonToObject(MaterialUnit.class, requestObject.toString());
            logger.info(materialUnit);
            // 执行
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", materialUnit.getName());
            boolean repeat = materialUnitService.checkRepeat("MaterialUnit", checkMap, materialUnit.getId());
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
     * 改变物料单元状态
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/changeMaterialUnitStatus", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeMaterialUnitStatus";
        try {
            logger.info("[start]" + apiName);
            MaterialUnit materialUtil = materialUnitService.getById(MaterialUnit.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = materialUtil.getStatus() == 1 ? 0 : 1;
                }
                materialUtil.setStatus(parameter);
            }
            materialUtil.setUpdateDateTime(new Date());
            materialUnitService.update(materialUtil);
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
     * 添加物料单元信息，或更新物料单元
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/saveMaterialUnit", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveMaterialUnit";
        logger.info("[start]" + apiName);
        try {
            // 转化数据的格式
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 解析JSONObject 拼接成 MaterialCategory 对象
            MaterialUnit materialUnit = JsonUtil.jsonToObject(MaterialUnit.class, requestObject.toString());
            if (materialUnit.getId() == null) {
                materialUnitService.save(materialUnit);
            } else {
                materialUnitService.update(materialUnit);
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
     * 删除物料单元信息
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/deleteMaterialUnit", method = RequestMethod.POST)
    @Transactional
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteMaterialUtil";
        logger.info("[start]" + apiName);
        try {
            logger.info("[start] " + apiName);
            MaterialUnit materialUnit = materialUnitService.getById(MaterialUnit.class, Long.parseLong(id));
            materialUnit.setIfDelete(1);
            materialUnitService.update(materialUnit);
            json.put("status", Const.SUCCESS);

        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.info("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

}

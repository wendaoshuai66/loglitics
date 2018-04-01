package com.lianxing.logistics.controller.system;

import com.alibaba.fastjson.JSON;
import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.Campus;
import com.lianxing.logistics.service.CampusServiceImpl;
import com.lianxing.logistics.util.*;
import com.lianxing.logistics.util.websocket.SocketEnum;
import com.lianxing.logistics.util.websocket.SocketVO;
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

@Controller
public class CampusController extends BaseController {

    private static Logger logger = LogManager.getLogger(CampusController.class);

    @Autowired
    private CampusServiceImpl campusService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/getCampusList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getCampusList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = campusService.getPageInfo(request);
            // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
            List<Campus> list = campusService.getList(page, null, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = campusService.getCampusAllCountFromPara(true);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    // 校区下拉框数据
    @RequestMapping(value = "/getCampusSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getCampusSelectList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getCampusSelectList";
        logger.info("[start] " + apiName);
        try {
            String ignoreDeleteAndStatus = request.getParameter("ignoreDeleteAndStatus");
            List<Campus> campus = campusService.getAll(false, "Campus", ignoreDeleteAndStatus); // 只取状态为'启用的'
            json.put("data", JSONArray.fromObject(campus, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 检查校区名称是否重复
     *
     * @param request
     * @throws Exception
     */
    @RequestMapping(value = "/checkRepeatCampus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatCampus";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 将json数据转换为实体对象
            Campus campus;
            campus = JsonUtil.jsonToObject(Campus.class, requestObject.toString());
            logger.info(campus);
            // 执行
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", campus.getName());
            boolean repeat = campusService.checkRepeat("Campus", checkMap, campus.getId());
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
     * 添加/修改校区信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/saveCampus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveCampus";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            Campus campus;
            campus = JsonUtil.jsonToObject(Campus.class, requestObject.toString());
            logger.info(campus);
            // 执行
            if (campus.getId() == null) {
                campusService.save(campus);
            } else {
                campus.setUpdateDateTime(new Date());
                campusService.update(campus);
            }
            json.put("status", Const.SUCCESS);
            // 保存成功后给 redis 总频道推送消息
            RedisClient client = new RedisClient();
            SocketVO vo = new SocketVO(SocketEnum.NEW_CAMPUS.getCode(), campus.getName() + "校区");
            client.publish(JSON.toJSONString(vo));
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
     * 修改校区的启用状态
     *
     * @param id 修改的实体id
     * @return 状态修改
     */
    @Transactional
    @RequestMapping(value = "/changeCampusStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeCampusStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Campus campus = campusService.getById(Campus.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = campus.getStatus() == 1 ? 0 : 1;
                }
                campus.setStatus(parameter);
            }
            campus.setUpdateDateTime(new Date());
            campusService.update(campus);
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
     * 根据Id删除对应的校区(逻辑删除)
     *
     * @param id 校区Id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteCampus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteCampus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Campus campus = campusService.getById(Campus.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            campus.setIfDelete(1);
            campusService.update(campus);
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

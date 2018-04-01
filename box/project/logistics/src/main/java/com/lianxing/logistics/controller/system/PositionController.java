package com.lianxing.logistics.controller.system;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.Position;
import com.lianxing.logistics.service.PositionServiceImpl;
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
public class PositionController extends BaseController {

    private static Logger logger = LogManager.getLogger(PositionController.class);

    @Autowired
    private PositionServiceImpl positionService;

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getPositionList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getPositionList";
        logger.info("[start]" + apiName);
        try {
            Page page = positionService.getPageInfo(request);
            // 将查询条件封装进hashMap中
            Map<String, Map> paraMap = positionService.getSeachMapInfo(request);
            List<Position> positions = positionService.getList(page, paraMap, true);
            Long totalRecords = positionService.getPositionAllCountFromPara(paraMap, true);
            json = getTableData(positions, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/getPositionSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getPositionSelectList() {
        JSONObject json = new JSONObject();
        String apiName = "getPositionSelectList";
        logger.info("[start]" + apiName);
        try {
            List<Position> positions = positionService.getAll(false, "Position");
            json.put("data", JSONArray.fromObject(positions, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/checkRepeatPosition", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatPosition";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            Position position;
            position = JsonUtil.jsonToObject(Position.class, requestObject.toString());
            logger.info(position);
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", position.getName());
            boolean repeat = positionService.checkRepeat("Position", checkMap, position.getId());
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
     * 添加/修改职务信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/savePosition", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "savePosition";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            Position position;
            position = JsonUtil.jsonToObject(Position.class, requestObject.toString());
            logger.info(position);
            if (position.getId() == null) {
                positionService.save(position);
            } else {
                position.setUpdateDateTime(new Date());
                positionService.update(position);
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

    @Transactional
    @RequestMapping(value = "/changeCardStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeCardStatus";
        logger.info("[start]" + apiName);
        try {
            Position position = positionService.getById(Position.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = position.getStatus() == 1 ? 0 : 1;
                }
                position.setStatus(parameter);
            } else if ("cardDisplay".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = position.getCardDisplay() == 1 ? 0 : 1;
                }
                position.setCardDisplay(parameter);
            }
            position.setUpdateDateTime(new Date());
            positionService.update(position);
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

    @Transactional
    @RequestMapping(value = "/deletePosition", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deletePosition";
        logger.info("[start]" + apiName);
        try {
            Position position = positionService.getById(Position.class, Long.parseLong(id));
            position.setIfDelete(1);
            positionService.update(position);
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

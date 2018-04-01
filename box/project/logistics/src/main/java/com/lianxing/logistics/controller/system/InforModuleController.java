package com.lianxing.logistics.controller.system;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.InforModule;
import com.lianxing.logistics.service.InforModuleServiceImpl;
import com.lianxing.logistics.service.InforSlideServiceImpl;
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

@Controller
public class InforModuleController extends BaseController {

    private static Logger logger = LogManager.getLogger(InforModuleController.class);

    @Autowired
    private InforModuleServiceImpl inforModuleService;

    @Autowired
    private InforSlideServiceImpl inforSlideService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/getInforModuleList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getInforModuleList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = inforModuleService.getPageInfo(request);
            // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
            List<InforModule> list = inforModuleService.getList(page, null, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = inforModuleService.getInforModuleAllCountFromPara(true, page);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    // 模块类型下拉框数据
    @RequestMapping(value = "/getInforModuleSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getInforModuleSelectList() {
        JSONObject json = new JSONObject();
        String apiName = "getInforModuleSelectList";
        logger.info("[start] " + apiName);
        try {
            List<InforModule> inforModules = inforModuleService.getAll(false, "InforModule"); // 只取出'启用状态'
            json.put("data", JSONArray.fromObject(inforModules, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 检查模块名称是否重复
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/checkRepeatInforModule", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatInforModule";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 将json数据转换为实体对象
            InforModule inforModule;
            inforModule = JsonUtil.jsonToObject(InforModule.class, requestObject.toString());
            logger.info(inforModule);
            // 执行
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", inforModule.getName());
            boolean repeat = inforModuleService.checkRepeat("InforModule", checkMap, inforModule.getId());
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
    @RequestMapping(value = "/saveInforModule", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveInforModule";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            InforModule inforModule;
            inforModule = JsonUtil.jsonToObject(InforModule.class, requestObject.toString());
            logger.info(inforModule);
            // 执行
            if (inforModule.getId() == null) {
                inforModuleService.save(inforModule);
            } else {
                inforModule.setUpdateDateTime(new Date());
                inforModuleService.update(inforModule);
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
     * 修改信息模块的状态(启用、禁用,首页显示、隐藏)
     *
     * @param statusType
     * @param id         修改的实体id
     * @return 状态修改
     */
    @Transactional
    @RequestMapping(value = "/changeInforModuleStatus")
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeInforModuleStatus";
        try {
            logger.info("[start]" + apiName);
            InforModule inforModule = inforModuleService.getById(InforModule.class, Long.parseLong(id));
            // 修改首页、隐藏状态
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("homeShow".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = inforModule.getHomeShow() == 1 ? 0 : 1;
                }
                inforModule.setHomeShow(parameter);
            }
            // 修改启用、禁用状态
            else {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = inforModule.getStatus() == 1 ? 0 : 1;
                }
                inforModule.setStatus(parameter);
                // 如果模块的状态改为禁用的时候，inforModule下的inforPicture下的inforSlide的首页显示状态改为首页不显示
                if (parameter == 0) {
                    inforSlideService.changeInforSlideListForHomeshowByModuleId(id);
                }
            }
            inforModule.setUpdateDateTime(new Date());
            inforModuleService.update(inforModule);
            json.put("status", Const.SUCCESS);
            logger.info("[end]" + apiName);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 根据Id删除对应的信息模块(逻辑删除)
     *
     * @param id 信息模块Id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteInforModule")
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteInforModule";
        try {
            logger.info("[start]" + apiName);
            InforModule inforModule = inforModuleService.getById(InforModule.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            inforModule.setIfDelete(1);
            inforModuleService.update(inforModule);
            json.put("status", Const.SUCCESS);
            logger.info("[end]" + apiName);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }
}

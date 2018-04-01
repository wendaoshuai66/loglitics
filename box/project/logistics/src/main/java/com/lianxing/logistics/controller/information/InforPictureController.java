package com.lianxing.logistics.controller.information;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.InforPicture;
import com.lianxing.logistics.model.InforSlide;
import com.lianxing.logistics.service.InforPictureServiceImpl;
import com.lianxing.logistics.service.InforSlideServiceImpl;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.Page;
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
public class InforPictureController extends BaseController {

    private static Logger logger = LogManager.getLogger(InforPictureController.class);

    @Autowired
    private InforPictureServiceImpl inforPictureService;

    @Autowired
    private InforSlideServiceImpl slideService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @Transactional
    @RequestMapping(value = "/getInforPictureList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getInforPictureList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = inforPictureService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = inforPictureService.getSeachMapInfo(request);
            // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
            List<InforPicture> list = inforPictureService.getList(page, paraMap, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = inforPictureService.getInforPictureAllCountFromPara(page, paraMap, true);
            json = getTableData(list, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 给微信使用根据id获取的新闻详情
     *
     * @return
     */
    @Transactional
    @RequestMapping(value = "/getInforPictureFromIdForWeChat", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getInforPictureFromIdForWeChat(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "getInforPictureFromIdForWeChat";
        logger.info("[start]" + apiName);
        try {
            InforPicture inforPicture = inforPictureService.getById(InforPicture.class, Long.parseLong(id));
            json.put("data", inforPicture);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 检查标题是否重复
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/checkRepeatInforPictureTitle", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatInforPictureTitle";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 将json数据转换为实体对象
            InforPicture inforPicture;
            inforPicture = JsonUtil.jsonToObject(InforPicture.class, requestObject.toString());
            logger.info(inforPicture);
            // 执行
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("title", inforPicture.getTitle());
            boolean repeat = inforPictureService.checkRepeat("InforPicture", checkMap, inforPicture.getId());
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
     * 添加/修改图片信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/saveInforPicture", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveInforPicture";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            InforPicture inforPicture;
            inforPicture = JsonUtil.jsonToObject(InforPicture.class, requestObject.toString());
            logger.info(inforPicture);
            // 执行
            if (inforPicture.getId() == null) {
                if (inforPicture.getApprovalStatus() == 1) {
                    inforPicture.setApprovalDateTime(new Date());
                }
                inforPictureService.save(inforPicture);
            } else {
                inforPicture.setUpdateDateTime(new Date());
                Long id = inforPicture.getId();
                String title = inforPicture.getTitle();
                slideService.update(id, title);
                if (inforPicture.getApprovalStatus() == 1) {
                    inforPicture.setApprovalDateTime(new Date());
                } else if (inforPicture.getApprovalStatus() == 0) {
                    inforPicture.setApprovalDateTime(null);
                }
                inforPictureService.update(inforPicture);
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
     * 修改图文信息的启用状态
     *
     * @param statusType 确定修改什么状态
     * @param id         修改的实体id
     * @return 状态修改
     */
    @Transactional
    @RequestMapping(value = "/changePictureStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changePictureStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            InforPicture inforPicture = inforPictureService.getById(InforPicture.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("approvalStatus".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = inforPicture.getApprovalStatus() == 1 ? 0 : 1;
                }
                if (parameter == 1) {
                    inforPicture.setApprovalDateTime(new Date());
                } else if (parameter == 0) {
                    inforPicture.setApprovalDateTime(null);
                }
                inforPicture.setApprovalStatus(parameter);
                if (inforPicture.getApprovalStatus() == 0) {
                    InforSlide inforSlide = slideService.getInforSlideList(id);
                    if (inforSlide != null && inforSlide.getHomeShow() == 1) {
                        inforSlide.setHomeShow(0);
                        slideService.update(inforSlide);
                    }
                }
            } else if ("slideShow".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = inforPicture.getSlideShow() == 1 ? 0 : 1;
                }
                inforPicture.setSlideShow(parameter);
            }
            inforPicture.setUpdateDateTime(new Date());
            inforPictureService.update(inforPicture);
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
     * 根据Id删除对应的图文信息(逻辑删除)
     *
     * @param id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteInforPicture", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteInforPicture";
        logger.info("[start]" + apiName);
        try {
            // 执行
            InforPicture inforPicture = inforPictureService.getById(InforPicture.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            inforPicture.setIfDelete(1);
            InforSlide inforSlide = slideService.getInforSlideList(id);
            if (inforSlide != null && inforSlide.getId() != null) {
                if (inforSlide.getHomeShow() == 1) {
                    inforSlide.setHomeShow(0);
                    inforSlide.setIfDelete(1);
                    slideService.update(inforSlide);
                }
            }
            inforPictureService.update(inforPicture);
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
     * 通过Id获得InforPicture
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getInforPictureById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getInforPictureById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getInforPictureById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                InforPicture inforPicture = inforPictureService.getById(InforPicture.class, id);
                json.put("data", JSONObject.fromObject(inforPicture, JsonUtil.jsonConfig("dateTime")));
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

    /**
     * 通过Id使其浏览次数每次加一
     *
     * @param id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/updateInforPictureViewTimesById", method = RequestMethod.POST)
    @ResponseBody
    public synchronized ResponseEntity<String> updateInforPictureViewTimesById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "updateInforPictureViewTimesById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                InforPicture inforPicture = inforPictureService.getById(InforPicture.class, id);
                Long times = inforPicture.getViewTimes() + 1;
                inforPicture.setViewTimes(times);
                inforPictureService.update(inforPicture);
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
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

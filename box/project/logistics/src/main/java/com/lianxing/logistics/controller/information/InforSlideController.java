package com.lianxing.logistics.controller.information;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.InforPicture;
import com.lianxing.logistics.model.InforSlide;
import com.lianxing.logistics.service.InforSlideServiceImpl;
import com.lianxing.logistics.util.*;
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
public class InforSlideController extends BaseController {

    private static Logger logger = LogManager.getLogger(InforSlideController.class);

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
    @RequestMapping(value = "/getInforSlideList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getInforSlideList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = slideService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = slideService.getSeachMapInfo(request);
            // flag为空表示获取的是页面的list，为false(即有值)表示获取的是微信端的list
            String flag = request.getParameter("searchObj[flag]");
            List<JSONObject> list;
            Long totalRecords;
            if (flag != null) {
                // 微信端获取的List,3表示获取微信端的list，4表示获取微信端的总数(表示为微信端获取的)
                // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
                list = slideService.getInforSlideList(page, paraMap, true, 3);
                totalRecords = slideService.getInforSlideAllCountFromPara(page, paraMap, true, 4);
            } else {
                // 页面获取的List,2表示获取页面的list，1表示获取页面的总数(表示为页面获取的)
                // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
                list = slideService.getInforSlideList(page, paraMap, true, 2);
                totalRecords = slideService.getInforSlideAllCountFromPara(page, paraMap, true, 1);
            }
            // 将list中的JSONObject对象转换为InforSlide对象
            List array = slideService.getInforSlideProcessList(list);
            json = getTableData(array, totalRecords);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
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
    @RequestMapping(value = "/saveInforSlide", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveInforSlide";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            InforSlide inforSlide;
            inforSlide = JsonUtil.jsonToObject(InforSlide.class, requestObject.toString());
            // 图文页面保存幻灯的情况
            if (inforSlide.getInforPicture() != null) {
                Long pictureId = inforSlide.getInforPicture().getId();
                InforPicture _inforPicture = slideService.getById(InforPicture.class, pictureId);
                inforSlide.setTitle(_inforPicture.getTitle()); // 标题与文章标题一致
                String webNewsUrl = PropertiesUtil.get("webNewsUrl", "/sys_config.properties");
                inforSlide.setUrl(webNewsUrl + pictureId); // url链接与文章标题一致
                // 文章来源
                inforSlide.setSlideType(1);
            }
            logger.info(inforSlide);
            // 执行
            if (inforSlide.getId() == null) {
                slideService.save(inforSlide);
            } else {
                inforSlide.setUpdateDateTime(new Date());
                slideService.update(inforSlide);
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
    @RequestMapping(value = "/changeInforSlideStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeInforSlideStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            InforSlide inforSlide = slideService.getById(InforSlide.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("homeShow".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = inforSlide.getHomeShow() == 1 ? 0 : 1;
                }
                inforSlide.setHomeShow(parameter);
            }
            inforSlide.setUpdateDateTime(new Date());
            slideService.update(inforSlide);
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
     * @param id Id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteInforSlide", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteInforSlide";
        logger.info("[start]" + apiName);
        try {
            // 执行
            InforSlide inforSlide = slideService.getById(InforSlide.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            inforSlide.setIfDelete(1);
            slideService.update(inforSlide);
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
     * 获取到当前首页显示的个数
     *
     * @return
     */
    @Transactional
    @RequestMapping(value = "/getInforSlideHomeshow", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getInforSlideHomeshow() {
        JSONObject json = new JSONObject();
        String apiName = "getInforSlideHomeshow";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Long count = slideService.getInforSlideHomeshowCount();
            json.put("count", count);
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

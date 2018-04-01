package com.lianxing.logistics.controller.duty;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.WorkDiary;
import com.lianxing.logistics.service.DiaryServiceImpl;
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
import java.util.List;
import java.util.Map;

@Controller
public class DiaryController extends BaseController {

    private static Logger logger = LogManager.getLogger(DiaryController.class);

    @Autowired
    private DiaryServiceImpl diaryService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getDiaryList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getDiaryList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = diaryService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = diaryService.getSeachMapInfo(request);
            List<WorkDiary> list = diaryService.getList(page, paraMap, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = diaryService.getDiaryAllCountFromPara(page, paraMap, true);
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
     * 添加/修改WorkDiary信息
     *
     * @param request
     * @return
     */
    @Transactional
    @RequestMapping(value = "/saveDiary", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> saveDiary(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveDiary";
        logger.info("[start]" + apiName);
        try {
            // 将传进来的值转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            WorkDiary workDiary;
            workDiary = JsonUtil.jsonToObject(WorkDiary.class, requestObject.toString());
            // 执行
            if (workDiary.getId() == null) {
                Long id = diaryService.save(workDiary);
                json.put("id", id);
            } else {
                diaryService.update(workDiary);
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
     * 通过id删除WorkDiary
     *
     * @param id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteDiary", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> deleteDiary(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteDiary";
        logger.info("[start]" + apiName);
        try {
            // 执行
            WorkDiary workDiary = diaryService.getById(WorkDiary.class, Long.parseLong(id));
            // 修改删除状态为删除
            workDiary.setIfDelete(1);
            diaryService.update(workDiary);
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
     * 修改日志记录的维修状态
     *
     * @param statusType
     * @param id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/changeDiaryStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeDiaryStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            WorkDiary workDiary = diaryService.getById(WorkDiary.class, Long.parseLong(id));
            // 审核状态
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = workDiary.getStatus() == 1 ? 0 : 1;
                }
                workDiary.setStatus(parameter);
            }
            diaryService.update(workDiary);
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
     * 通过Id获得WorkDiary的详情
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getDiaryById", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getDiaryById(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getDiaryById";
        logger.info("[start]" + apiName);
        try {
            if (id != null) {
                WorkDiary workDiary = diaryService.getById(WorkDiary.class, id);
                json.put("data", JSONObject.fromObject(workDiary, JsonUtil.jsonConfig("dateTime")));
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

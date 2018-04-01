package com.lianxing.logistics.controller.system;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.FriendLink;
import com.lianxing.logistics.service.FriendLinkServiceImpl;
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
public class FriendLinkController extends BaseController {

    private static Logger logger = LogManager.getLogger(FriendLinkController.class);

    @Autowired
    private FriendLinkServiceImpl friendLinkService;

    /**
     * 根据查询条件获取分页列表
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    @Transactional
    @RequestMapping(value = "/getFriendLinkList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getFriendLinkList";
        logger.info("[start]" + apiName);
        try {
            // 执行
            Page page = friendLinkService.getPageInfo(request);
            // 拼接HQL以及SQL需要的Map
            Map<String, Map> paraMap = friendLinkService.getSeachMapInfo(request);
            // 获取满足查询条件并分页后的对象(校区管理不需要分页不需要查询,传入空)
            List<FriendLink> list = friendLinkService.getList(page, paraMap, true);
            // 获取满足查询条件总对象的个数
            Long totalRecords = friendLinkService.getFriendLinkAllCountFromPara(page, paraMap, true);
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
     * 添加/修改友情链接信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/saveFriendLink", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveFriendLink";
        logger.info("[start]" + apiName);
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            // 将json数据转换为实体对象
            FriendLink friendLink;
            friendLink = JsonUtil.jsonToObject(FriendLink.class, requestObject.toString());
            // 执行
            if (friendLink.getId() == null) {
                friendLinkService.save(friendLink);
            } else {
                friendLink.setUpdateDateTime(new Date());
                friendLinkService.update(friendLink);
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
     * 根据Id删除对应的友情链接(逻辑删除)
     *
     * @param id Id
     * @return
     */
    @Transactional
    @RequestMapping(value = "/deleteFriendLink", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteFriendLink";
        logger.info("[start]" + apiName);
        try {
            // 执行
            FriendLink friendLink = friendLinkService.getById(FriendLink.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            friendLink.setIfDelete(1);
            friendLinkService.update(friendLink);
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
     * 修改友情链接的启用禁用状态
     *
     * @param statusType
     * @param id
     * @param request
     * @return
     */
    @Transactional
    @RequestMapping(value = "/changeFriendLinkStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeFriendLinkStatus";
        logger.info("[start]" + apiName);
        try {
            // 执行
            FriendLink friendLink = friendLinkService.getById(FriendLink.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = friendLink.getStatus() == 1 ? 0 : 1;
                }
                friendLink.setStatus(parameter);
            }
            friendLink.setUpdateDateTime(new Date());
            friendLinkService.update(friendLink);
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
     * 查询链接标题是否重复
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/checkRepeatFriendLink", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatFriendLink";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 为空(页面刚由有值变为null)，不进行校验操作
            if (requestObject.size() == 0) {
                HttpHeaders headers = HttpUtil.getHttpHeaders();
                return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
            }
            FriendLink friendLink;
            friendLink = JsonUtil.jsonToObject(FriendLink.class, requestObject.toString());
            logger.info(friendLink);
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("title", friendLink.getTitle());
            boolean repeat = friendLinkService.checkRepeat("FriendLink", checkMap, friendLink.getId());
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
     * 获取到友情链接的信息
     *
     * @return
     */
    @Transactional
    @RequestMapping(value = "/getFriendLinkInfo", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getFriendLinkInfo() {
        JSONObject json = new JSONObject();
        String apiName = "getFriendLinkInfo";
        logger.info("[start]" + apiName);
        try {
            List<FriendLink> list;
            list = friendLinkService.getAll(false, "FriendLink");
            json.put("data", JSONArray.fromObject(list, JsonUtil.jsonConfig("dateTime")));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

}

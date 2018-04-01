package com.lianxing.logistics.controller;

import com.lianxing.logistics.service.MainServiceImpl;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.RedisClient;
import com.lianxing.logistics.util.RedisUtil;
import net.sf.json.JSONObject;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class MainController {

    private static Logger logger = LogManager.getLogger(MainController.class);

    @Autowired
    private MainServiceImpl mainService;

    /**
     * 获取到后台首页需要统计的数据
     *
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getHomePageClassifyCount", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getCount() {
        JSONObject json = new JSONObject();
        String apiName = "getHomePageClassifyCount";
        logger.info("[start]" + apiName);
        try {
            // 获取统计数量
            Map map = mainService.getCountByRole();
            json.put("data", map);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 获取到Web端首页需要的数据
     *
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getHomeWebClassifyCount", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getHomeWebClassifyCount() {
        JSONObject json = new JSONObject();
        String apiName = "getHomeWebClassifyCount";
        logger.info("[start]" + apiName);
        try {
            // 获取统计数量
            Map map = mainService.getHomeWebCount();
            json.put("data", map);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 删除缓存
     *
     * @param token token标识
     * @return
     */
    @RequestMapping(value = "/cleanToken", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> cleanToken(@RequestParam String token) {
        JSONObject json = new JSONObject();
        String apiName = "cleanToken";
        logger.info("[start]" + apiName);
        try {
            // 删除缓存token
            RedisClient redisClient = new RedisClient();
            redisClient.del(RedisUtil.REDIS_PREFIX + token);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            json.put("status", Const.ERROR);
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 校验token是否过期
     *
     * @return
     */
    @RequestMapping(value = "/checkAuthority", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkAuthority(HttpServletRequest request) {
        String token = request.getHeader("logistics-session-token");
        String administrator = request.getParameter("administrator");
        JSONObject json = new JSONObject();
        String apiName = "checkAuthority";
        logger.info("[start]" + apiName);
        try {
            RedisClient redisClient = new RedisClient();
            String redisToken = redisClient.get(RedisUtil.REDIS_PREFIX + token);
            if (redisToken != null) {
                // 判断是否是超级管理员
                if ("true".equals(administrator)) {
                    if ("administrator".equals(redisToken)) {
                        json.put("status", Const.SUCCESS);
                    } else {
                        json.put("status", Const.NOADMINISTRATOR);
                    }
                }
                // 普通用户
                else {
                    json.put("status", Const.SUCCESS);
                }
            } else {
                json.put("status", Const.EXPIRED);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            json.put("status", Const.ERROR);
            e.printStackTrace();
        }
        logger.info("[end] " + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }
}

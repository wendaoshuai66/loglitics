package com.lianxing.logistics.controller;

import com.lianxing.logistics.model.User;
import com.lianxing.logistics.service.LoginServiceImpl;
import com.lianxing.logistics.util.*;
import com.lianxing.logistics.util.data.MD5Util;
import com.lianxing.logistics.util.date.DateTime;
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
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Controller
public class LoginController extends BaseController {

    @Autowired
    private LoginServiceImpl loginService;

    private static Logger logger = LogManager.getLogger(LoginController.class);

    @Transactional
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> login(HttpServletRequest request) {
        String apiName = "login";
        logger.info("[start]" + apiName);
        JSONObject json = null;
        // 用于记录整个登录状态
        int flag;
        try {
            json = new JSONObject();
            String beginAccount = request.getParameter("account");
            String password = request.getParameter("password");
            String administrator = request.getParameter("administrator");
            String account = beginAccount.toUpperCase();
            HashMap<String, String> map = new HashMap<>();
            map.put("account", account);
            String administratorLogin = "true";
            // 超管登录
            List<User> user;
            if (administratorLogin.equals(administrator)) {
                map.put("role", "0");
                user = loginService.getByObject(map, 3, false, "User", true);
            } else {
                user = loginService.getByObject(map, 2, false, "User", true);
            }
            if (user == null) {
                // 超管账户不存在
                if (administratorLogin.equals(administrator)) {
                    flag = 1;
                }
                // 普通账户不存在
                else {
                    flag = 2;
                }
            } else {
                // 获取配置的盐值
                String saltValue = PropertiesUtil.get("MD5Str");
                if (saltValue == null) {
                    flag = 5;
                } else {
                    // 拼接成MD5加密前的数据串
                    String p = account + saltValue + password;
                    // 加密后的串
                    String md5String = MD5Util.getMD5String(p);
                    logger.info(account + "密码为：" + md5String);
                    // 用户名密码登录成功
                    if (md5String.equals(user.get(0).getPassword())) {
                        // 登录成功
                        flag = 3;
                        // 登陆成功之后，将登陆的时间保存到user对象的最后一次登陆时间中
                        User loginUser = user.get(0);
                        loginUser.setLastLoginDateTime(new Date());
                        loginService.update(loginUser);
                        // key 使用二次加密后的密码拼接上毫秒数(同一个账号可同时登陆)
                        // 如需配置一个账号最多登陆N个保持在线,扫描所有以传入key开头指定位 com.logistics.user.+ 32位密码二次key
                        // 然后将找出剩余时间最多的4个加上正在登陆的这个,其他的全部删除即可
                        String redisToken = MD5Util.getMD5String(md5String) + System.currentTimeMillis();
                        logger.info(account + "Token为：" + redisToken);
                        updateRedisKeyAliveTime(redisToken, user.get(0).getRole() == 0);
                        // 将二次MD5的值作为token返回
                        json.put("token", redisToken);
                        JSONObject userObj = new JSONObject();
                        userObj.put("id", user.get(0).getId());
                        userObj.put("role", user.get(0).getRole());
                        userObj.put("headPicture", user.get(0).getHeadPicture());
                        userObj.put("name", user.get(0).getName());
                        if ((user.get(0).getRole() == 1 || user.get(0).getRole() == 0) && user.get(0).getMaintenanceWorker() != null
                                && user.get(0).getMaintenanceWorker().getDepartment() != null) {
                            userObj.put("departmentId", user.get(0).getMaintenanceWorker().getDepartment().getId());
                            userObj.put("departmentName", user.get(0).getMaintenanceWorker().getDepartment().getName());
                            userObj.put("maintenanceTypeID", user.get(0).getMaintenanceWorker().getMaintenanceType().getId());
                        }
                        json.put("token", redisToken);
                        // 将用户信息存入
                        json.put("user", userObj);
                    } else {
                        // 登录失败
                        flag = 4;
                    }
                }
            }
        } catch (Exception e) {
            // 登录异常
            flag = 5;
        }
        switch (flag) {
            case 1:
                json.put("status", Const.NOADMINISTRATOR);
                break;
            case 2:
                json.put("status", Const.NOUSER);
                break;
            case 3:
                json.put("status", Const.SUCCESS);
                break;
            default:
                json.put("status", Const.ERROR);
        }
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);

    }

    /**
     * 根据主key 更新redis存活时间
     *
     * @param key             更新的key
     * @param isAdministrator 是否为超级管理员
     */
    private void updateRedisKeyAliveTime(String key, boolean isAdministrator) {
        // 获取到jedis实例
        RedisClient redisClient = new RedisClient();
        // 存入缓存
        if (!redisClient.exists(RedisUtil.REDIS_PREFIX + key)) {
            if (isAdministrator) {
                redisClient.set(RedisUtil.REDIS_PREFIX + key, "administrator");
            } else {
                redisClient.set(RedisUtil.REDIS_PREFIX + key, "true");
            }
        }
        redisClient.expire(RedisUtil.REDIS_PREFIX + key, DateTime.getSecondFromDay(1));
    }
}

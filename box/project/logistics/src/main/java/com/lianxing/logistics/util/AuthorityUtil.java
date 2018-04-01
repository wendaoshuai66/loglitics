package com.lianxing.logistics.util;

import com.lianxing.logistics.util.date.DateTime;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AuthorityUtil implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String path = request.getServletPath();
        RedisClient redisClient = new RedisClient();
        // 初始为0放行状态
        int flag = 0;
        // 登录请求直接放行，不需要判断权限以及登录状态
        boolean result = false;
        String abstractStr = PropertiesUtil.get("NoLoginFiltering", "/webFiltering.properties");
        String[] absStr = abstractStr.split(",", -1);
        for (int i = 0; i < absStr.length; i++) {
            if (absStr[i].equals(path)) {
                result = true;
            }
        }
        String token = request.getHeader("logistics-session-token");
        if (!result) {
            // 缓存清空,重新登陆
            if (token == null) {
                // 跳转到登录页面
                flag = 1;
            }
            // token存在
            else {
                String redisToken = redisClient.get(RedisUtil.REDIS_PREFIX + token);
                // redis缓存过期
                if (redisToken == null) {
                    // 提示密码已过期,请重新登录
                    flag = 2;
                }
                // 可以使用token进行免密登录,刷新redis缓存时间
                else {
                    if (!redisToken.equals("administrator")) {
                        boolean resultAdmin = false;
                        String newPathStr = PropertiesUtil.get("PermissionFiltering", "/webFiltering.properties");
                        String[] newPath = newPathStr.split(",", -1);
                        for (int j = 0; j < newPath.length; j++) {
                            if (newPath[j].equals(path)) {
                                resultAdmin = true;
                            }
                        }
                        if (!resultAdmin) {
                            flag = 3;
                        }
                    }
                }
            }
        }
        // 目前就两种跳转状态 flag==0 即正常可以访问请求
        if (flag == 0) {
            if (token == null) {
                // 更新token过期时间
                // 写入过期时间为一天
                redisClient.expire(RedisUtil.REDIS_PREFIX + token, DateTime.getSecondFromDay(1));
            }
            return true;
        }
        // flag==1(无权直接访问接口) 跳转到登录页面
        else if (flag == 1) {
            response.setHeader("Authority", Const.NOTLOGIN);
            return false;
        }
        // 提示密码过期
        else if (flag == 2) {
            response.setHeader("Authority", Const.EXPIRED);
            return false;
        }
        // 没有超级管理员权限
        else if (flag == 3) {
            response.setHeader("Authority", Const.NOADMINISTRATOR);
            return false;
        } else {
            response.setHeader("Authority", Const.NOTLOGIN);
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {

    }
}

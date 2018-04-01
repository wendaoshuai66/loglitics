package com.lianxing.logistics.filter;

import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CorsFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // 跨域访问问题
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        // 允许通过的请求头类型(需要把自定义的请求头加入)
        response.addHeader("Access-Control-Allow-Headers",
                "origin, content-type, accept, x-requested-with, sid, logistics-session-token");
        response.addHeader("Access-Control-Allow-Credentials", "true"); //是否支持cookie跨域
        filterChain.doFilter(request, response);
    }
}
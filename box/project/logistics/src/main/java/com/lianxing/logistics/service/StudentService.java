package com.lianxing.logistics.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.lianxing.logistics.util.Page;

public interface StudentService {

    // 通过前端传来的集合，拼接dao需要的Map对象
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    // 通过请求拼装分页、排序等page信息
    Page getPageInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getStudentAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);

}

package com.lianxing.logistics.service;

import javax.servlet.http.HttpServletRequest;

import com.lianxing.logistics.util.Page;

public interface CampusService {

    // 通过请求拼装分页、排序等page信息
    Page getPageInfo(HttpServletRequest request);

    Long getCampusAllCountFromPara(boolean ifAll);

}

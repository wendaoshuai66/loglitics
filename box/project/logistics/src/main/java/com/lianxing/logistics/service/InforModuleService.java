package com.lianxing.logistics.service;

import com.lianxing.logistics.util.Page;

import javax.servlet.http.HttpServletRequest;

public interface InforModuleService {

    // 通过请求拼装分页、排序等page信息
    Page getPageInfo(HttpServletRequest request);

    Long getInforModuleAllCountFromPara(boolean ifAll, Page page);

}

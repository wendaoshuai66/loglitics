package com.lianxing.logistics.service;

import com.lianxing.logistics.util.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface MaintenanceStatusService {

    // 通过请求拼装分页、排序等page信息
    Page getPageInfo(HttpServletRequest request);

    Long getMaintenanceStatusAllCountFromPara(boolean ifAll);

    List getAllMaintenanceStatusSelectList();
}

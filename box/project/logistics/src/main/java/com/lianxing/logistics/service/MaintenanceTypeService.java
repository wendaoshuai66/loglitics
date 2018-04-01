package com.lianxing.logistics.service;

import com.lianxing.logistics.model.MaintenanceCategory;
import com.lianxing.logistics.util.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface MaintenanceTypeService {

    // 通过请求拼装分页、排序等page信息
    Page getPageInfo(HttpServletRequest request);

    // 获取到满足条件的list
    List<Map<String, Object>> getThisInfo(List<MaintenanceCategory> list);

    // 获取到满足条件的list
    List<Map<String, Object>> getThisInfoList(List<MaintenanceCategory> list);

    Long getMaintenanceTypeAllCountFromPara(boolean ifAll);

}

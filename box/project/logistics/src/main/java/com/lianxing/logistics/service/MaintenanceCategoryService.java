package com.lianxing.logistics.service;

import com.lianxing.logistics.model.MaintenanceCategory;
import com.lianxing.logistics.util.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface MaintenanceCategoryService {

    Page getPageInfo(HttpServletRequest request);

    // 通过前端传来的集合，拼接dao需要的Map对象
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getMaintenanceCategoryAllCountFromPara(Map<String, Map> para, boolean ifAll);

    List<MaintenanceCategory> getMaintenanceCategoryList();

    List<MaintenanceCategory> getMaintenanceCategoryForType();

    List<MaintenanceCategory> getMaintenanceCategoryTypeList(String ignoreDeleteAndStatus);

}

package com.lianxing.logistics.dao;


import com.lianxing.logistics.model.MaintenanceCategory;

import java.util.List;
import java.util.Map;

public interface MaintenanceCategoryDao {

    @SuppressWarnings("rawtypes")
    Long getMaintenanceCategoryAllCountFromPara(Map<String, Map> para, boolean ifAll);

    List<MaintenanceCategory> getMaintenanceCategoryList();

    List<MaintenanceCategory> getMaintenanceCategoryForType();

    List<MaintenanceCategory> getMaintenanceCategoryTypeList(String ignoreDeleteAndStatus);

}

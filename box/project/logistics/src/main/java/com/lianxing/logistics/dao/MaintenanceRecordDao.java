package com.lianxing.logistics.dao;

import java.util.Map;

public interface MaintenanceRecordDao {

    @SuppressWarnings("rawtypes")
    Long getMaintenanceRecordAllCountFromPara(Map<String, Map> para, boolean ifAll);

}

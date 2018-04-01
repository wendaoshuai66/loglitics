package com.lianxing.logistics.dao;

import java.util.List;
import java.util.Map;

public interface MaintenanceWorkerDao {

    @SuppressWarnings("rawtypes")
    Long getMaintenanceWorkersAllCountFromPara(Map<String, Map> para, boolean ifAll);

    @SuppressWarnings("rawtypes")
    List getMaintenanceWorkerIdList(Long departmentId, Long maintenanceTypeId);
}

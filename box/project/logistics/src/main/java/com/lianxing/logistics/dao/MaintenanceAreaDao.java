package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.MaintenanceArea;

import java.util.List;
import java.util.Map;

public interface MaintenanceAreaDao {

    void deleteAreaWorkerFormAreaId(Long id);

    void insertAreaWorker(Long areaId, Long typeId);

    List<Map<String, Object>> getMaintenanceTypeFromAreaId(Long id);

    @SuppressWarnings("rawtypes")
    Long getMaintenanceAreaAllCountFromPara(Map<String, Map> para, boolean ifAll);

    // 取出满足条件的AreaId
    @SuppressWarnings("rawtypes")
    List getMaintenanceAreaIdsList();

    List<MaintenanceArea> getMaintenanceAreaForCampus();

    List<MaintenanceArea> getMaintenanceAreraList(String ignoreDeleteAndStatus);

}

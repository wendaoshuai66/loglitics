package com.lianxing.logistics.service;

import com.lianxing.logistics.model.MaintenanceArea;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONArray;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface MaintenanceAreaService {

    Page getPageInfo(HttpServletRequest request);

    // 根据areaId删除MaintenanceAreaWorker表中记录
    void deleteAreaWorkerFormAreaId(Long id);

    // 插入记录根据区域id以及工种id
    void insertAreaWorker(Long areaId, Long typeId);

    // 通过区域id获取到前端需要的数据格式
    // 生成的model结构:["1":[1,2,3],"2":[1],"3":[2,3]],整体是一个数组，内对象key即为工种id, value为维修人员id
    Map<Object, JSONArray> getMaintenanceTypeFromAreaId(Long id);

    // 获取到满足条件的list
    List<Map<String, Object>> getThisInfo(List<MaintenanceArea> list);

    // 获取到满足条件的list
    List<Map<String, Object>> getThisInfoList(List<MaintenanceArea> list);

    // 通过前端传来的集合，拼接dao需要的Map对象
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getMaintenanceAreaAllCountFromPara(Map<String, Map> para, boolean ifAll);

    // 取出满足条件的AreaId
    @SuppressWarnings("rawtypes")
    List getMaintenanceAreaIdsList();

    List<MaintenanceArea> getMaintenanceAreaForCampus();

    List<MaintenanceArea> getMaintenanceAreraList(String ignoreDeleteAndStatus);

}

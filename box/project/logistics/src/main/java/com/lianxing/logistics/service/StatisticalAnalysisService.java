package com.lianxing.logistics.service;

import net.sf.json.JSONObject;

import java.util.List;
import java.util.Map;

public interface StatisticalAnalysisService {

    // 获取根据时间的维修记录数量
    @SuppressWarnings("rawtypes")
    List getMaintainCount(int i, String startTime, String endTime);

    // 获取根据时间对应的维修记录数量
    JSONObject getMaintainCountList(List<Map<String, Object>> list, int x);

    // 获取维修量分类统计
    JSONObject getMaintenanceStatisticWithType(String type, String startTime, String endTime);

    // 获取维修质量分类统计
    JSONObject maintenanceStatisticWithQuality(String type, String startTime, String endTime);

    JSONObject getLineUseInfoWithType(JSONObject object);

}

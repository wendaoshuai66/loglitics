package com.lianxing.logistics.dao;

import java.util.List;

public interface StatisticalAnalysisDao {

    // 根据时间段进行区分
    @SuppressWarnings("rawtypes")
    List getMaintenanceStatisticWithTime(int type, String startTime, String endTime);

    // 根据维修量进行区分
    @SuppressWarnings("rawtypes")
    List getMaintenanceStatisticWithType(String type, String startTime, String endTime);

    // 根据根据维修质量进行区分
    @SuppressWarnings("rawtypes")
    List getMaintenanceStatisticWithQuality(String type, String startTime, String endTime);
}

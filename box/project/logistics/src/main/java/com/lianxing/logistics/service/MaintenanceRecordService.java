package com.lianxing.logistics.service;

import com.lianxing.logistics.model.MaintenanceRecord;
import com.lianxing.logistics.model.WarrantyNumber;
import com.lianxing.logistics.util.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @author zyj
 */
public interface MaintenanceRecordService {

    /**
     * 通过前端传来的集合，拼接dao需要的Map对象
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    Page getPageInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getMaintenanceRecordAllCountFromPara(Map<String, Map> para, boolean ifAll);

    /**
     * 获取需要保存的维修单号
     *
     * @return
     */
    String getMaintenanceNumber();

    /**
     * 获取到维修订单的维修用时
     *
     * @param warrantyNumber
     * @return
     */
    String getMaintenanceTime(WarrantyNumber warrantyNumber, Date endDate);

    MaintenanceRecord changeRecordStatus(MaintenanceRecord record);

    MaintenanceRecord saveMaintenanceRecord(MaintenanceRecord record);

    void saveRedisByIdAndMap(Long id, HashMap map);

}

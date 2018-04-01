package com.lianxing.logistics.service;

import com.lianxing.logistics.model.WarrantyNumber;

import java.util.List;

public interface WarrantyNumberService {

    WarrantyNumber getWarrantyNumerByMaintenanceNumber(String MaintenanceNumber);

    List<WarrantyNumber> getWarrantyNumberList(Long userId, String type);

    /**
     * 获取到维修订单中维修工人不为空的所有维修单
     *
     * @param list
     * @return
     */
    List<WarrantyNumber> getWarrantyNumberSelectList(List<WarrantyNumber> list);

    List<WarrantyNumber> getNotEvaluatedWarrantyNumberList();

    List<WarrantyNumber> getOverTimeWarrantyNumberList(List<WarrantyNumber> list);

    void updateOverTimeWarrantyNumberList(List<WarrantyNumber> list);

    List<WarrantyNumber> getWarrantyNumberForAcceptOrderAboutRecord();

    List<WarrantyNumber> getWarrantyNumberForAcceptOrderAboutSpecial();

}

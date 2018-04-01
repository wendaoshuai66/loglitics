package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.WarrantyNumber;

import java.util.List;

public interface WarrantyNumberDao {

    WarrantyNumber getWarrantyNumerByMaintenanceNumber(String MaintenanceNumber);

    List<WarrantyNumber> getWarrantyNumberList(Long userId, String type);

    List<WarrantyNumber> getNotEvaluatedWarrantyNumberList();

    List<WarrantyNumber> getWarrantyNumberForAcceptOrderAboutRecord();

    List<WarrantyNumber> getWarrantyNumberForAcceptOrderAboutSpecial();

}

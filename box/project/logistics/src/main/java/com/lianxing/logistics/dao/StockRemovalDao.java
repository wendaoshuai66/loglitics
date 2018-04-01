package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.StockRemoval;

import java.util.List;
import java.util.Map;

public interface StockRemovalDao {

    @SuppressWarnings("rawtypes")
    Long getStockRemovalAllCountFromPara(Map<String, Map> para, boolean ifAll);

    List<StockRemoval> getStockRemovalMaterialList(Long warrantyNumberId);

}

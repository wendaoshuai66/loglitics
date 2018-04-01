package com.lianxing.logistics.service;

import com.lianxing.logistics.model.StockRemoval;
import com.lianxing.logistics.util.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface StockRemovalService {

    // 通过前端传来的集合，拼接dao需要的Map对象
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    Page getPageInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getStockRemovalAllCountFromPara(Map<String, Map> para, boolean ifAll);

    String getStockRemovalMaterialNameStrFromWarrantyNumberId(Long warrantyNumberId);

    List<StockRemoval> getStockRemovalListByWarrantyNumber(Long id);

}

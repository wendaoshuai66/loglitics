package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;

import java.util.Map;

public interface ConvenientServiceDao {

    @SuppressWarnings("rawtypes")
    Long getConvenientServiceAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);
}

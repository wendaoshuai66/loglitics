package com.lianxing.logistics.dao;

import java.util.Map;

import com.lianxing.logistics.util.Page;

public interface InforTextDao {

    @SuppressWarnings("rawtypes")
    Long getInforTextAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);
}

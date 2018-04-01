package com.lianxing.logistics.dao;

import java.util.Map;

public interface LostFoundDao {

    @SuppressWarnings("rawtypes")
    Long getLostFoundAllCountFromPara(Map<String, Map> para, boolean ifAll);
}

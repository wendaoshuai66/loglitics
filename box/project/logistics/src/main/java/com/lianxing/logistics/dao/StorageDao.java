package com.lianxing.logistics.dao;

import java.util.Map;

public interface StorageDao {

    @SuppressWarnings("rawtypes")
    Long getStorageAllCountFromPara(Map<String, Map> para, boolean ifAll);
}

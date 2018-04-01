package com.lianxing.logistics.dao;

import java.util.Map;

public interface FleaMarketDao {

    @SuppressWarnings("rawtypes")
    Long getFleaMarketAllCountFromPara(Map<String, Map> para, boolean ifAll);

    String getFileUrlListFromIds(String[] ids);
}

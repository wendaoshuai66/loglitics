package com.lianxing.logistics.dao;

import java.util.Map;

public interface PositionDao {

    @SuppressWarnings("rawtypes")
    Long getPositionAllCountFromPara(Map<String, Map> para, boolean ifAll);
}

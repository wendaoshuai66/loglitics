package com.lianxing.logistics.dao;

import java.util.Map;

public interface MaterialUnitDao {

    @SuppressWarnings("rawtypes")
    Long getMaterialUnitAllCountFromPara(Map<String, Map> para, boolean ifAll);
}

package com.lianxing.logistics.dao;

import java.util.Map;

public interface MaterialCategoryDao {

    @SuppressWarnings("rawtypes")
    Long getMaterialCategorAllCountFromPara(Map<String, Map> para, boolean ifAll);
}

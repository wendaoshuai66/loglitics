package com.lianxing.logistics.dao;

import java.util.Map;

import com.lianxing.logistics.util.Page;

public interface StudentDao {

    @SuppressWarnings("rawtypes")
    Long getStudentAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);
}

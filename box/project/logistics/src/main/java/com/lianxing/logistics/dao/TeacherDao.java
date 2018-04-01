package com.lianxing.logistics.dao;

import java.util.Map;

public interface TeacherDao {

    @SuppressWarnings("rawtypes")
    Long getTeacherAllCountFromPara(Map<String, Map> para, boolean ifAll);
}

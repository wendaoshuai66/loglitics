package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;

import java.util.Map;

public interface DiaryDao {

    @SuppressWarnings("rawtypes")
    Long getDiaryAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);
}

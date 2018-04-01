package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;

import java.util.Map;

public interface InforPictureDao {

    @SuppressWarnings("rawtypes")
    Long getInforPictureAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);

}

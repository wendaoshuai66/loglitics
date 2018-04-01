package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.InforSlide;
import com.lianxing.logistics.util.Page;

import java.util.List;
import java.util.Map;

public interface InforSlideDao {

    @SuppressWarnings("rawtypes")
    Long getInforSlideAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll, Integer integer);

    Long getInforSlideHomeshowCount();

    void update(Long id, String title);

    <T> List<T> getInforSlideList(Page page, Map<String, Map> paraMap, boolean ifAll, Integer integer);

    InforSlide getInforSlideList(String id);

    List<InforSlide> getInforSlideListByModuleId(String id);

}

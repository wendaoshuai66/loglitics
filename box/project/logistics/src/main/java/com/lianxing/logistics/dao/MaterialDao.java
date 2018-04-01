package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.Material;

import java.util.List;
import java.util.Map;

public interface MaterialDao {

    @SuppressWarnings("rawtypes")
    Long getMaterialAllCountFromPara(Map<String, Map> para, boolean ifAll);

    // 判断获取到的库存数是否小于报警阈值
    <T> List<T> checkMaterialLessAlarmValue(String entityName);

    List<Material> getSelectAllInfo();
}

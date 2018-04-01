package com.lianxing.logistics.service;

import com.lianxing.logistics.model.Material;
import com.lianxing.logistics.util.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface MaterialService {

    // 通过前端传来的集合，拼接dao需要的Map对象
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    Page getPageInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getMaterialAllCountFromPara(Map<String, Map> para, boolean ifAll);

    // 判断获取到的库存数是否小于报警阈值
    <T> List<T> checkMaterialLessAlarmValue(String entityName);

    List<Material> getSelectAllInfo();
}

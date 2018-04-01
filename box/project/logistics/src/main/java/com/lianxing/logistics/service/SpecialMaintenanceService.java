package com.lianxing.logistics.service;

import com.lianxing.logistics.model.WarrantyNumber;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface SpecialMaintenanceService {

    // 通过前端传来的集合，拼接dao需要的Map对象
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    Page getPageInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getSpecialMaintenanceAllCountFromPara(Map<String, Map> para, boolean ifAll);

    // 获取需要保存的维修单号
    String getMaintenanceNumber();

    // 根据区域id数组获取对应的区域名称串，每个区域之间使用分号隔开
    String getAreaNameListFromIds(String[] ids);

    // 对比两个list，将满足条件的list返回
//    List<WarrantyNumber> getFinalList(List<WarrantyNumber> list, List<Object> listB);

    List<JSONObject> getResultJSONList(List<WarrantyNumber> list);
}

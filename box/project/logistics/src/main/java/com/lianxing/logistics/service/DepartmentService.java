package com.lianxing.logistics.service;

import com.lianxing.logistics.model.Department;
import com.lianxing.logistics.model.DepartmentTree;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface DepartmentService {

    // 通过前端传来的集合，拼接dao需要的Map对象
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    Page getPageInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getDepartmentAllCountFromPara(Map<String, Map> para, boolean ifAll);

    List<Department> getSelectListFromCampusId(String campusId);

    List<DepartmentTree> getDepartmentTreeFromDepartmentList(List<Department> list);

    List<JSONObject> getSelectTreeFromList(List<Department> list);

    JSONArray getDutyInfoFromDepartmentList(List<Department> list);

    List<Department> getDepartmentForCampus();

    void getUpdateListStatus(Integer parameter, List<Department> list);

    List<Department> getDepartmentByParentId(Long id);
}

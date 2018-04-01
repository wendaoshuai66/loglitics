package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.Department;
import com.lianxing.logistics.model.DepartmentTypeDuty;

import java.util.List;
import java.util.Map;

public interface DepartmentDao {

    @SuppressWarnings("rawtypes")
    Long getDepartmentAllCountFromPara(Map<String, Map> para, boolean ifAll);

    List<Department> getSelectListFromCampusId(String campusId);

    List<DepartmentTypeDuty> getDepartmentTypeDutyFromDepartmentId(Long departmentId);

    List<Department> getDepartmentForCampus();

    List<Department> getDepartmentByParentId(Long id);
}

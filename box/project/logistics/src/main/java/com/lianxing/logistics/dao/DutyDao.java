package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.DepartmentTypeDuty;
import com.lianxing.logistics.model.WorkDuty;
import com.lianxing.logistics.util.Page;

import java.util.List;
import java.util.Map;

public interface DutyDao {

    @SuppressWarnings("rawtypes")
    Long getDutyAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);

    int getDutyDateNum(String strDate);

    DepartmentTypeDuty getDepartmentTypeDutyDate(Long departmentId, Long maintenanceTypeId);

    /**
     * 获取到值班表
     *
     * @param departmentId
     * @param typeId
     * @param startDate
     * @param endDate
     * @return
     */
    List<WorkDuty> getDutiesFromDepartmentTypeAndDate(long departmentId, long typeId, String startDate, String endDate);

    /**
     * 根据部门id,工种id获取到对应的值班设置记录串 eq:2017-09,2017-10
     *
     * @param departmentId
     * @param typeId
     * @return
     */
    String getDutyDateStrFromDepartmentTypeAndDate(String departmentId, String typeId);
}

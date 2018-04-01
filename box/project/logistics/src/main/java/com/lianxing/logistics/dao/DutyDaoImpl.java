package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.DepartmentTypeDuty;
import com.lianxing.logistics.model.WorkDuty;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository("dutyDao")
public class DutyDaoImpl extends BaseDaoImpl implements DutyDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getDutyAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        Map eqParaSqlMap = para.get("eqParaSql");
        String sql = "SELECT COUNT(1) AS count FROM work_duty w,`user` u,maintenance_worker m,campus c,department d," +
                "maintenance_type t,maintenance_area a WHERE w.addUid = u.id and u.workerId = m.id ";
        if (!ifAll) {
            sql += " and w.`status` = 1 ";
        }
        sql += " and m.departmentId = d.id and m.maintenanceTypeId = t.id AND d.campusId = c.id and w.ifDelete = 0 " +
                " and w.areaId = a.id ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, null, eqParaSqlMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @Override
    public int getDutyDateNum(String strDate) {
        String sql = "SELECT DAYOFWEEK(" + strDate + ")";
        int dateNum = jdbcTemplate.queryForObject(sql, int.class);
        return dateNum;
    }

    @SuppressWarnings("unchecked")
    @Override
    public DepartmentTypeDuty getDepartmentTypeDutyDate(Long departmentId, Long maintenanceTypeId) {
        String hql = "FROM DepartmentTypeDuty d where d.department.id = '" + departmentId + "' AND "
                + " d.maintenanceType.id = '" + maintenanceTypeId + "'";

        List<DepartmentTypeDuty> departmentTypeDutyList = (List<DepartmentTypeDuty>) hibernateTemplate.find(hql);
        if (departmentTypeDutyList.size() == 0) {
            return null;
        } else {
            return departmentTypeDutyList.get(0);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<WorkDuty> getDutiesFromDepartmentTypeAndDate(long departmentId, long typeId, String startDate, String endDate) {
        String hql = "FROM WorkDuty w WHERE w.ifDelete = 0 AND w.department.id = '" + departmentId + "' AND" +
                " w.maintenanceType.id = '" + typeId + "' AND ";
        StringBuffer buffer = new StringBuffer(hql);
        buffer.append("( w.dutyDate >=").append(" '" + startDate + "' AND w.dutyDate < '" + endDate + "')");
        List<WorkDuty> lists = (List<WorkDuty>) hibernateTemplate.find(buffer.toString());
        return lists;
    }

    @Override
    public String getDutyDateStrFromDepartmentTypeAndDate(String departmentId, String typeId) {
        try {
            String sql = "SELECT d.dutyDate FROM department_type_duty d where d.departmentId = '" +
                    departmentId + "' AND d.typeId = '" + typeId + "'";
            Map<String, Object> map = jdbcTemplate.queryForMap(sql);
            if (map == null || map.size() == 0) {
                return null;
            } else {
                Object dutyDate = map.get("dutyDate");
                return dutyDate.toString();
            }
        } catch (Exception e) {
            return null;
        }
    }
}

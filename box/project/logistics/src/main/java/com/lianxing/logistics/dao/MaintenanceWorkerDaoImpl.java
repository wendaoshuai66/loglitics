package com.lianxing.logistics.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository("maintenanceWorkerDao")
public class MaintenanceWorkerDaoImpl extends BaseDaoImpl implements MaintenanceWorkerDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @SuppressWarnings("rawtypes")
    public Long getMaintenanceWorkersAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        String sql = "SELECT COUNT(1) AS count FROM `user` c,maintenance_worker w,department d,maintenance_type t,campus a WHERE 1=1 ";
        if (!ifAll) {
            sql += " and c.`status` = 1 ";
        }
        sql += " and c.workerId = w.id and c.ifDelete = 0 and w.departmentId = d.id AND w.maintenanceTypeId = t.id "
                + " AND d.campusId = a.id ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @SuppressWarnings("rawtypes")
    @Override
    public List getMaintenanceWorkerIdList(Long departmentId, Long maintenanceTypeId) {
        String sql = "SELECT m.id FROM maintenance_worker m,`user` u WHERE u.workerId = m.id AND u.approvalStatus = 1 AND u.ifDelete = 0 AND u.status = 1 "
                + " AND m.departmentId = " + departmentId + " AND m.maintenanceTypeId = " + maintenanceTypeId;
        List list = jdbcTemplate.queryForList(sql);
        return list;
    }

}

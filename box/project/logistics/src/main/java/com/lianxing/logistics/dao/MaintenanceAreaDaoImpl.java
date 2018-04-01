package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.MaintenanceArea;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository("maintenanceAreaDao")
public class MaintenanceAreaDaoImpl extends BaseDaoImpl implements MaintenanceAreaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @Override
    public void deleteAreaWorkerFormAreaId(Long id) {
        String sql = "DELETE FROM maintenance_area_worker where areaId = '" + id + "'";
        jdbcTemplate.execute(sql);
    }

    @Override
    public void insertAreaWorker(Long areaId, Long typeId) {
        String sql = "INSERT INTO maintenance_area_worker (areaId,userId) VALUES (" + areaId + "," + typeId + ")";
        jdbcTemplate.execute(sql);
    }

    @Override
    public List<Map<String, Object>> getMaintenanceTypeFromAreaId(Long id) {
        String sql = "SELECT u.id userId, w.maintenanceTypeId typeId FROM "
                + " maintenance_area_worker aw, `user` u, maintenance_worker w WHERE "
                + " u.id = aw.userId AND u.workerId = w.id AND aw.areaId = '" + id + "'";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return list;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaintenanceAreaAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        String sql = "SELECT COUNT(1) AS count FROM maintenance_area c,campus d,department t WHERE 1=1";
        if (!ifAll) {
            sql += " and c.`status` = 1 ";
        }
        sql += " and c.campusId = d.id and c.ifDelete = 0 and c.departmentId = t.id and t.campusId = d.id ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public List getMaintenanceAreaIdsList() {
        String sql = "SELECT a.id FROM `maintenance_area` a WHERE a.ifDelete = 0 AND a.`status` = 1";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        List resultList = new ArrayList();
        for (Map<String, Object> m : list) {
            for (String k : m.keySet()) {
                resultList.add(m.get(k) + "");
            }
        }
        return resultList;
    }

    @Override
    public List<MaintenanceArea> getMaintenanceAreaForCampus() {
        String hql = "SELECT m FROM MaintenanceArea m,Department d,Campus c WHERE m.campus.id = c.id AND m.department.id = d.id AND d.campus.id = c.id AND " +
                " m.ifDelete = 0 AND m.status = 1 AND d.ifDelete = 0 AND d.status = 1 AND c.ifDelete = 0 AND c.status = 1";
        List<MaintenanceArea> list = (List<MaintenanceArea>) hibernateTemplate.find(hql);
        return list;
    }

    @Override
    public List<MaintenanceArea> getMaintenanceAreraList(String ignoreDeleteAndStatus) {
        String hql;
        if ("true".equals(ignoreDeleteAndStatus)) {
            hql = " SELECT m FROM MaintenanceArea m ";
        } else {
            hql = "SELECT m FROM MaintenanceArea m,Department d,Campus c WHERE m.campus.id = c.id AND m.department.id = d.id AND d.campus.id = c.id AND " +
                    " d.ifDelete = 0 AND d.status = 1 and d.ifLogistics = 1 AND c.ifDelete = 0 AND c.status = 1 AND m.ifDelete = 0 AND m.status = 1 ORDER BY m.addDateTime DESC";
        }
        List<MaintenanceArea> list = (List<MaintenanceArea>) hibernateTemplate.find(hql);
        return list;
    }

}

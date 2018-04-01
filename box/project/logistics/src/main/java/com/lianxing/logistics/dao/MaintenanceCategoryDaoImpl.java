package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.MaintenanceCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository("maintenanceCategoryDao")
public class MaintenanceCategoryDaoImpl extends BaseDaoImpl implements MaintenanceCategoryDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaintenanceCategoryAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        String sql = "SELECT COUNT(1) AS count FROM maintenance_category c,maintenance_type d WHERE 1=1";
        if (!ifAll) {
            sql += " and c.`status` = 1 ";
        }
        sql += " and c.maintenanceTypeId = d.id and c.ifDelete = 0 ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @Override
    public List<MaintenanceCategory> getMaintenanceCategoryList() {
        String hql = "SELECT c FROM MaintenanceCategory c,MaintenanceType t WHERE c.maintenanceType.id = t.id " +
                " AND c.ifDelete = 0 AND c.status = 1 AND t.ifDelete = 0 AND t.status = 1 ORDER BY c.addDateTime DESC";
        List<MaintenanceCategory> list = (List<MaintenanceCategory>) hibernateTemplate.find(hql);
        return list;
    }

    @Override
    public List<MaintenanceCategory> getMaintenanceCategoryForType() {
        String hql = "SELECT c FROM MaintenanceCategory c,MaintenanceType t WHERE c.maintenanceType.id = t.id AND c.ifDelete = 0 " +
                " AND c.status = 1 AND t.ifDelete = 0 AND t.status = 1";
        List<MaintenanceCategory> list = (List<MaintenanceCategory>) hibernateTemplate.find(hql);
        return list;
    }

    @Override
    public List<MaintenanceCategory> getMaintenanceCategoryTypeList(String ignoreDeleteAndStatus) {
        String hql;
        if ("true".equals(ignoreDeleteAndStatus)) {
            hql = " SELECT c FROM MaintenanceCategory c";
        } else {
            hql = "SELECT c FROM MaintenanceCategory c,MaintenanceType t WHERE c.maintenanceType.id = t.id AND c.ifDelete = 0 AND c.status = 1 AND t.ifDelete = 0 AND t.status = 1 ORDER BY c.addDateTime DESC";
        }
        List<MaintenanceCategory> list = (List<MaintenanceCategory>) hibernateTemplate.find(hql);
        return list;
    }

}

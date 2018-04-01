package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.MaintenanceStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository("maintenanceStatusDao")
public class MaintenanceStatusDaoImpl extends BaseDaoImpl implements MaintenanceStatusDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @Override
    public Long getMaintenanceStatusAllCountFromPara(boolean ifAll) {
        String sql = "SELECT COUNT(1) AS count FROM maintenance_status WHERE 1=1";
        if (!ifAll) {
            sql += " and `status` = 1 ";
        }
        sql += " and ifDelete = 0 ";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql);
        return Long.parseLong(map.get("count").toString());
    }

    @Override
    public List getAllMaintenanceStatusSelectList() {
        String hql = "FROM MaintenanceStatus m WHERE m.ifDelete = 0 ORDER BY m.weight";
        List<MaintenanceStatus> list = (List<MaintenanceStatus>) hibernateTemplate.find(hql);
        return list;
    }

}

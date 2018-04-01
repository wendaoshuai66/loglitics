package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository("inforModuleDao")
public class InforModuleDaoImpl implements InforModuleDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @Override
    public Long getInforModuleAllCountFromPara(boolean ifAll, Page page) {
        String sql = "SELECT COUNT(1) AS count FROM " + page.getTableName() + " WHERE 1=1";
        if (!ifAll) {
            sql += " and `status` = 1 ";
        }
        sql += " and ifDelete = 0 ";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql);
        return Long.parseLong(map.get("count").toString());
    }

}

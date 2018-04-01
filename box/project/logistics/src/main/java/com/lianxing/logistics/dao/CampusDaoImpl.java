package com.lianxing.logistics.dao;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository("campusDao")
public class CampusDaoImpl extends BaseDaoImpl implements CampusDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Long getCampusAllCountFromPara(boolean ifAll) {
        String sql = "SELECT COUNT(1) AS count FROM campus WHERE 1=1";
        if (!ifAll) {
            sql += " and `status` = 1 ";
        }
        sql += " and ifDelete = 0 ";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql);
        return Long.parseLong(map.get("count").toString());
    }

}

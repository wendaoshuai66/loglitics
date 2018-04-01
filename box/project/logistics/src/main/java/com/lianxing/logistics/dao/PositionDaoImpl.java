package com.lianxing.logistics.dao;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository("positionDao")
public class PositionDaoImpl extends BaseDaoImpl implements PositionDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getPositionAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        String sql = "SELECT COUNT(1) AS count FROM position c WHERE 1=1";
        if (!ifAll) {
            sql += " and cardDisplay = 1 ";
        }
        sql += " and ifDelete = 0 ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

}

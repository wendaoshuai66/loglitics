package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository("friendLinkDao")
public class FriendLinkDaoImpl extends BaseDaoImpl implements FriendLinkDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getFriendLinkAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        Map timeMap = para.get("timeMap");
        String sql = "SELECT COUNT(1) AS count FROM " + page.getTableName() + " WHERE ifDelete = 0 ";
        if (!ifAll) {
            sql += " and status = 1 ";
        }
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        sqlBuffer = putTimeQueryInfo(sqlBuffer, timeMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }
}

package com.lianxing.logistics.dao;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository("lostFoundDao")
public class LostFoundDaoImpl extends BaseDaoImpl implements LostFoundDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getLostFoundAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaSqlMap = para.get("likeParaSql");
        Object title = "";
        Object personName = "";
        if (likeParaSqlMap != null) {
            title = likeParaSqlMap.get("title");
            personName = likeParaSqlMap.get("person.name");
        }
        String titleStr = appendSqlBuffer(title, "l.title", "LIKE");
        String nameStr = appendSqlBuffer(personName, "u.NAME", "LIKE");
        Map timeMap = para.get("timeMap");
        Map eqParaSqlMap = para.get("eqParaSql");
        Object type = "";
        Object approvalStatus = "";
        Object dealStatus = "";
        Object personId = "";
        if (eqParaSqlMap != null) {
            type = eqParaSqlMap.get("c.type");
            approvalStatus = eqParaSqlMap.get("c.approvalStatus");
            dealStatus = eqParaSqlMap.get("c.dealStatus");
            personId = eqParaSqlMap.get("c.person.id");
        }
        String typeStr = appendSqlBuffer(type, "l.type", "=");
        String approvalStatusStr = appendSqlBuffer(approvalStatus, "l.approvalStatus", "=");
        String dealStatusStr = appendSqlBuffer(dealStatus, "l.dealStatus", "=");
        String idStr = appendSqlBuffer(personId, "u.id", "=");
        StringBuffer buffer = new StringBuffer();
        buffer.append("SELECT count(1) AS count FROM lost_found l, `user` u WHERE l.addUid = u.id and u.ifDelete = 0 and u.status = 1 ").append(titleStr)
                .append(typeStr).append(nameStr).append(idStr).append(approvalStatusStr).append(dealStatusStr).append(" AND l.ifDelete = '0' ");
        String addStart = (String) timeMap.get("addStart");
        String addEnd = getNextDayStr((String) timeMap.get("addEnd"));
        buffer.append(" AND ");
        if (StringUtils.isNotBlank(addStart) && StringUtils.isNotBlank(addEnd)) {
            buffer.append("( l.addDateTime BETWEEN").append(" '").append(addStart).append("' AND  '").append(addEnd).append("')");
        } else if (StringUtils.isNotBlank(addStart)) {
            buffer.append(" l.addDateTime >= '").append(addStart).append("'");
        } else if (StringUtils.isNotBlank(addEnd)) {
            buffer.append(" l.addDateTime <= '").append(addEnd).append("')");
        } else {
            buffer.append(" 1=1 ");
        }
        Map<String, Object> map = jdbcTemplate.queryForMap(buffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

}

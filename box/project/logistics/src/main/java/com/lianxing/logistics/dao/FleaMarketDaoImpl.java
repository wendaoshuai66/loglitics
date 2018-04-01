package com.lianxing.logistics.dao;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

@Repository("fleaMarketDao")
public class FleaMarketDaoImpl extends BaseDaoImpl implements FleaMarketDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getFleaMarketAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaSqlMap = para.get("likeParaSql");
        Object title = "";
        Object personName = "";
        if (likeParaSqlMap != null) {
            title = likeParaSqlMap.get("title");
            personName = likeParaSqlMap.get("person.name");
        }
        String titleStr = appendSqlBuffer(title, "f.title", "LIKE");
        String nameStr = appendSqlBuffer(personName, "u. NAME", "LIKE");
        Map timeMap = para.get("timeMap");
        Map eqParaSqlMap = para.get("eqParaSql");
        Object type = "";
        Object approvalStatus = "";
        Object dealStatus = "";
        Object addUid = "";
        if (eqParaSqlMap != null) {
            type = eqParaSqlMap.get("c.type");
            approvalStatus = eqParaSqlMap.get("c.approvalStatus");
            dealStatus = eqParaSqlMap.get("c.dealStatus");
            addUid = eqParaSqlMap.get("c.person.id");
        }
        String typeStr = appendSqlBuffer(type, "f.type", "=");
        String approvalStatusStr = appendSqlBuffer(approvalStatus, "f.approvalStatus", "=");
        String dealStatusStr = appendSqlBuffer(dealStatus, "f.dealStatus", "=");
        String addUidStr = appendSqlBuffer(addUid, "u.id", "=");
        StringBuilder buffer = new StringBuilder();
        buffer.append("SELECT count(1) AS count FROM flea_market f, `user` u WHERE f.addUid = u.id and u.ifDelete = 0 and u.status = 1 ").append(titleStr)
                .append(typeStr).append(nameStr).append(approvalStatusStr).append(addUidStr).append(dealStatusStr).append(" AND f.ifDelete = '0' ");
        String addStart = (String) timeMap.get("addStart");
        String addEnd = getNextDayStr((String) timeMap.get("addEnd"));
        buffer.append(" AND ");
        if (StringUtils.isNotBlank(addStart) && StringUtils.isNotBlank(addEnd)) {
            buffer.append("( f.addDateTime BETWEEN").append(" '").append(addStart).append("' AND  '").append(addEnd).append("')");
        } else if (StringUtils.isNotBlank(addStart)) {
            buffer.append(" f.addDateTime >= '").append(addStart).append("'");
        } else if (StringUtils.isNotBlank(addEnd)) {
            buffer.append(" f.addDateTime <= '").append(addEnd).append("')");
        } else {
            buffer.append(" 1=1 ");
        }
        Map<String, Object> map = jdbcTemplate.queryForMap(buffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @Override
    public String getFileUrlListFromIds(String[] ids) {
        StringBuffer buffer = new StringBuffer();
        for (String id : ids) {
            buffer.append("'").append(id).append("'").append(",");
        }
        String sb = buffer.toString();
        String sql = "SELECT url from upload_file WHERE id in ( " + sb.substring(0, sb.length() - 1) + ")";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        StringBuilder resultbuffer = new StringBuilder();
        for (Map<String, Object> map : list) {
            for (Entry<String, Object> entry : map.entrySet()) {
                resultbuffer.append(entry.getValue()).append(",");
            }
        }
        String result = resultbuffer.toString();
        return result.substring(0, result.length() - 1);
    }

}

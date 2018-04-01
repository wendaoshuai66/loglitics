package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository("inforTextDao")
public class InforTextDaoImpl extends BaseDaoImpl implements InforTextDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getInforTextAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        Map eqParaSqlMap = para.get("eqParaSql");
        Map likeParaSqlMap = para.get("likeParaSql");
        Map timeMap = para.get("timeMap");
        Object title = "";
        Object authorName = "";
        if (likeParaSqlMap != null) {
            title = likeParaSqlMap.get("i.title");
            authorName = likeParaSqlMap.get("authorName");
        }
        String titleStr = appendSqlBuffer(title, "i.title", "LIKE");
        String nameStr = appendSqlBuffer(authorName, "u.NAME", "LIKE");
        Object approvalStatus = "";
        Object authorId = "";
        if (eqParaSqlMap != null) {
            approvalStatus = eqParaSqlMap.get("i.approvalStatus");
            authorId = eqParaSqlMap.get("u.id");
        }
        String approvalStatusStr = appendSqlBuffer(approvalStatus, "i.approvalStatus", "=");
        String idStr = appendSqlBuffer(authorId, "u.id", "=");
        String sql = "SELECT COUNT(1) count FROM infor_text i, `user` u WHERE i.addUid = u.id " + titleStr + nameStr
                + idStr + approvalStatusStr + " AND i.ifDelete = '0' and u.ifDelete = 0 and u.status = 1";
        if (!ifAll) {
            sql += " and i.status = 1 ";
        }
        StringBuilder buffer = new StringBuilder(sql);
        String addStart = (String) timeMap.get("addStart");
        String addEnd = getNextDayStr((String) timeMap.get("addEnd"));
        buffer.append(" AND ");
        if (StringUtils.isNotBlank(addStart) && StringUtils.isNotBlank(addEnd)) {
            buffer.append("( i.addDateTime BETWEEN").append(" '").append(addStart).append("' AND  '").append(addEnd).append("')");
        } else if (StringUtils.isNotBlank(addStart)) {
            buffer.append(" i.addDateTime >= '").append(addStart).append("'");
        } else if (StringUtils.isNotBlank(addEnd)) {
            buffer.append(" i.addDateTime <= '").append(addEnd).append("')");
        } else {
            buffer.append(" 1=1 ");
        }
        Map<String, Object> map = jdbcTemplate.queryForMap(buffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

}

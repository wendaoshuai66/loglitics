package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository("inforPictureDao")
public class InforPictureDaoImpl extends BaseDaoImpl implements InforPictureDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getInforPictureAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = null;
        Map eqParaSqlMap = null;
        Map timeMap = null;
        if (para != null) {
            likeParaMap = para.get("likePara");
            eqParaSqlMap = para.get("eqParaSql");
            timeMap = para.get("timeMap");
        }
        String sql = "SELECT COUNT(1) AS count FROM " + page.getTableName() + " c,infor_module d WHERE 1=1 ";
        if (!ifAll) {
            sql += " and c.status = 1 ";
        }
        sql += " and c.moduleId = d.id and c.ifDelete = 0 ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        String addStart = (String) timeMap.get("addStart");
        String addEnd = getNextDayStr((String) timeMap.get("addEnd"));
        buffer.append(" AND ");
        if (StringUtils.isNotBlank(addStart) && StringUtils.isNotBlank(addEnd)) {
            buffer.append("( c.addDateTime BETWEEN").append(" '").append(addStart).append("' AND  '").append(addEnd).append("')");
        } else if (StringUtils.isNotBlank(addStart)) {
            buffer.append(" c.addDateTime >= '").append(addStart).append("'");
        } else if (StringUtils.isNotBlank(addEnd)) {
            buffer.append(" c.addDateTime <= '").append(addEnd).append("')");
        } else {
            buffer.append(" 1=1 ");
        }
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

}

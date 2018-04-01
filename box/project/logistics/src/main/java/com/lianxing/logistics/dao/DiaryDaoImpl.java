package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository("diaryDao")
public class DiaryDaoImpl extends BaseDaoImpl implements DiaryDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getDiaryAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likeParaSql");
        Map eqParaSqlMap = para.get("eqParaSql");
        Map timeMap = para.get("timeMap");
        String sql = "SELECT COUNT(1) AS count FROM work_diary w,`user` u,maintenance_worker m,campus c,department d,maintenance_type t WHERE " +
                " w.addUid = u.id and u.workerId = m.id ";
        if (!ifAll) {
            sql += " and w.`status` = 1 ";
        }
        sql += " and m.departmentId = d.id and m.maintenanceTypeId = t.id AND d.campusId = c.id and w.ifDelete = 0 ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        String addStart = (String) timeMap.get("addStart");
        String addEnd = getNextDayStr((String) timeMap.get("addEnd"));
        sqlBuffer.append(" AND ");
        if (StringUtils.isNotBlank(addStart) && StringUtils.isNotBlank(addEnd)) {
            sqlBuffer.append("( w.addDateTime BETWEEN").append(" '").append(addStart).append("' AND  '").append(addEnd).append("')");
        } else if (StringUtils.isNotBlank(addStart)) {
            sqlBuffer.append(" w.addDateTime >= '").append(addStart).append("'");
        } else if (StringUtils.isNotBlank(addEnd)) {
            sqlBuffer.append(" w.addDateTime <= '").append(addEnd).append("')");
        } else {
            sqlBuffer.append(" 1=1 ");
        }
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }
}

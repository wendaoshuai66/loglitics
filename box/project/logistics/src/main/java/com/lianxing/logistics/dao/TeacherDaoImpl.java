package com.lianxing.logistics.dao;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository("teacherDao")
public class TeacherDaoImpl extends BaseDaoImpl implements TeacherDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @SuppressWarnings("rawtypes")
    public Long getTeacherAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        String sql = "SELECT COUNT(1) AS count FROM `user` c,teacher t,department d,position p,campus a WHERE 1=1 ";
        if (!ifAll) {
            sql += " and c.`status` = 1 ";
        }
        sql += " and c.teacherId = t.id and c.ifDelete = 0 and t.departmentId = d.id AND t.positionId = p.id "
                + " AND d.campusId = a.id ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

}

package com.lianxing.logistics.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository("mainDao")
public class MainDaoImpl extends BaseDaoImpl implements MainDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> getCountByRole() {
        String sql1 = "SELECT count(u.studentId) studentCount FROM `user` u WHERE u.ifDelete = 0";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql1);
        String sql2 = "SELECT count(workerId) maintenanceWorkerCount FROM `user` u,maintenance_worker w,department d,maintenance_type t,campus c \n" +
                " WHERE u.ifDelete = 0 and u.workerId = w.id and w.departmentId = d.id and d.ifDelete = 0 and d.`status` = 1 \n" +
                " and w.maintenanceTypeId = t.id and t.ifDelete = 0 and t.`status`=1 AND d.campusId = c.id and c.ifDelete = 0 and c.`status` = 1 AND u.role = 1";
        Map<String, Object> map2 = jdbcTemplate.queryForMap(sql2);
        String sql3 = "SELECT count(teacherId) teacherCount FROM `user` u,teacher e,position p,department d ,campus c\n" +
                " WHERE u.ifDelete = 0 and u.teacherId = e.id and e.departmentId = d.id and d.ifDelete = 0 and d.`status` = 1 \n" +
                " and e.positionId = p.id and p.ifDelete = 0 and p.`status`=1 AND d.campusId = c.id and c.ifDelete = 0 and c.`status` = 1 AND u.role = 2";
        Map<String, Object> map3 = jdbcTemplate.queryForMap(sql3);
        String sql4 = "SELECT count(id) maintenanceRecordCount FROM warranty_number w WHERE w.ifDelete = 0";
        Map<String, Object> map4 = jdbcTemplate.queryForMap(sql4);
        map.putAll(map2);
        map.putAll(map3);
        map.putAll(map4);
        return map;
    }

    @Override
    public Map<String, Object> getHomeWebCount() {
        String sql1 = "SELECT COUNT(id) commonRepairRecordCount FROM warranty_number w WHERE w.ifDelete = 0 and w.type = 0";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql1);
        String sql2 = "SELECT COUNT(1) specialRepairRecordCount FROM warranty_number w,maintenance_special m,`user` u WHERE w.maintenanceSpecialId = m.id AND w.workerUid = u.id AND w.ifDelete = 0 and w.type = 1 AND u.role IN (1,0)";
        Map<String, Object> map2 = jdbcTemplate.queryForMap(sql2);
        String sql3 = "SELECT COUNT(id) saleCount FROM flea_market f WHERE f.ifDelete = 0 AND f.approvalStatus = 1 AND f.type = 1";// 出售
        Map<String, Object> map3 = jdbcTemplate.queryForMap(sql3);
        String sql4 = "SELECT COUNT(id) lostCount FROM lost_found l WHERE l.ifDelete = 0 AND l.approvalStatus = 1 AND l.type = 1";// 失物
        Map<String, Object> map4 = jdbcTemplate.queryForMap(sql4);
        String sql5 = "SELECT COUNT(id) purchaseCount FROM flea_market f WHERE f.ifDelete = 0 AND f.approvalStatus = 1 AND f.type = 0";// 求购
        Map<String, Object> map5 = jdbcTemplate.queryForMap(sql5);
        String sql6 = "SELECT COUNT(id) foundCount FROM lost_found l WHERE l.ifDelete = 0 AND l.approvalStatus = 1 AND l.type = 0";// 招领
        Map<String, Object> map6 = jdbcTemplate.queryForMap(sql6);
        map.putAll(map2);
        map.putAll(map3);
        map.putAll(map4);
        map.putAll(map5);
        map.putAll(map6);
        return map;
    }

}

package com.lianxing.logistics.dao;

import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import com.lianxing.logistics.model.User;
import com.lianxing.logistics.util.Page;

@Repository("userDao")
public class UserDaoImpl extends BaseDaoImpl implements UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @SuppressWarnings("rawtypes")
    public Long getUserAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        String sql = "SELECT COUNT(1) AS count FROM " + page.getTableName() + " c WHERE ifDelete = 0 ";
        if (!ifAll) {
            sql += " and status = 1 ";
        }
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    public JSONObject getUserFromOpenId(String openId) throws Exception {
        JSONObject json = new JSONObject();
        String sql = "select id,password,role from `user` where weChatOpenId = '" + openId + "' AND ifDelete = 0";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql);
        Long id;
        String password;
        Integer role;
        try {
            id = Long.parseLong(map.get("id").toString());
            password = map.get("password").toString();
            role = Integer.parseInt(map.get("role").toString());
        } catch (Exception e) {
            throw e;
        }
        json.put("id", id);
        json.put("password", password);
        json.put("role", role);
        return json;
    }

    @Override
    public String getUserPasswordById(Long id) {
        String sql = "SELECT password FROM `user` WHERE id = '" + id
                + "' AND ifDelete = 0 AND status = 1 AND approvalStatus = 1";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql);
        if (map != null) {
            String password = map.get("password").toString();
            return password;
        }
        return null;
    }

    @Override
    public User getUserByWorkerId(Long workerId) {
        String hql = "FROM User u WHERE u.ifDelete = 0 AND u.status = 1 AND u.role = 1 AND u.maintenanceWorker.id = "
                + workerId;
        List<User> list = (List<User>) hibernateTemplate.find(hql);
        if (list.size() > 0) {
            // 取唯一的对象
            return list.get(0);
        } else {
            return null;
        }
    }

    @Override
    public User getUserByTel(String tel) {
        String hql = "SELECT u FROM User u,MaintenanceWorker m,Campus c,Department d,MaintenanceType t where u.maintenanceWorker.id = m.id and "
                + " m.department.id = d.id and m.maintenanceType.id = t.id and c.id = d.campus.id AND c.status = 1 and c.ifDelete = 0 and "
                + " u.ifDelete = 0 AND u.status = 1 and d.ifDelete = 0 AND d.status = 1 and t.ifDelete = 0 AND t.status = 1 and "
                + " u.role = 1 AND u.tel = " + tel;
        List<User> list = (List<User>) hibernateTemplate.find(hql);
        if (list.size() > 0) {
            return list.get(0);
        }
        return null;
    }

    @Override
    public User getAdministrativeUser() {
        String hql = "FROM User u WHERE u.ifDelete = 0 AND u.status = 1 AND u.role = 0 ";
        List<User> list = (List<User>) hibernateTemplate.find(hql);
        if (list.size() > 0) {
            // 取唯一的对象
            return list.get(0);
        } else {
            return null;
        }
    }
}

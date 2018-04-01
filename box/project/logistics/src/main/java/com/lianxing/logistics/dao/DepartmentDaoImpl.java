package com.lianxing.logistics.dao;

import java.util.List;
import java.util.Map;

import com.lianxing.logistics.model.Department;

import com.lianxing.logistics.model.DepartmentTypeDuty;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

@Repository("departmentDao")
public class DepartmentDaoImpl extends BaseDaoImpl implements DepartmentDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getDepartmentAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        String sql = "SELECT COUNT(1) AS count FROM department c,campus d WHERE 1=1";
        if (!ifAll) {
            sql += " and c.`status` = 1 ";
        }
        sql += " and c.campusId = d.id and c.ifDelete = 0 ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<Department> getSelectListFromCampusId(String campusId) {
        String str;
        if (StringUtils.isNotBlank(campusId)) {
            str = "d.campus.id='" + campusId + "'";
        }
        // 校区为空不能查出部门
        else {
            str = "1!=1";
        }
        StringBuffer hql = new StringBuffer().append("from Department d where d.ifDelete = 0 and d.status = 1 and ").append(str);
        hql.append(" ORDER BY addDateTime DESC ");
        List<Department> list = (List<Department>) hibernateTemplate.find(hql.toString());
        return list;
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<DepartmentTypeDuty> getDepartmentTypeDutyFromDepartmentId(Long departmentId) {
        String hql = "FROM DepartmentTypeDuty d WHERE d.department.id = '" + departmentId + "'";
        List<DepartmentTypeDuty> list = (List<DepartmentTypeDuty>) hibernateTemplate.find(hql);
        return list;
    }

    @Override
    public List<Department> getDepartmentForCampus() {
        String hql = "SELECT d FROM Department d,Campus c WHERE d.campus.id = c.id AND d.ifDelete = 0 AND d.status = 1 AND c.ifDelete = 0 AND c.status = 1";
        List<Department> list = (List<Department>) hibernateTemplate.find(hql);
        return list;
    }

    @Override
    public List<Department> getDepartmentByParentId(Long id) {
        String hql = "from Department d where d.parent.id = " + id;
        List<Department> list = (List<Department>) hibernateTemplate.find(hql);
        return list;
    }

}

package com.lianxing.logistics.dao;

import java.util.List;
import java.util.Map;

import com.lianxing.logistics.model.Material;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

@Repository("materialDao")
public class MaterialDaoImpl extends BaseDaoImpl implements MaterialDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaterialAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        StringBuffer buffer = new StringBuffer("SELECT COUNT(1) AS count FROM material c, material_category m, material_unit n  WHERE 1=1 ");
        buffer.append(" AND c.materialCategoryId = m.id AND c.materialUnitId = n.id ");
        if (!ifAll) {
            buffer.append(" and c.status = 1 ");
        }
        buffer.append(" and c.ifDelete = '0' ");
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @Override
    public <T> List<T> checkMaterialLessAlarmValue(String entityName) {
        String hql = "from " + entityName + " c where 1 = 1 and ifDelete = 0 and status = 1";
        // 查询所有库存数小于警报阈值的对象
        hql += " and c.inventoryQuantity < c.alarmValue ";
        @SuppressWarnings("unchecked")
        List<T> list = (List<T>) hibernateTemplate.find(hql);
        return list;
    }

    @Override
    public List<Material> getSelectAllInfo() {
        String hql = "FROM Material m where m.ifDelete = 0 and m.status = 1 and m.materialCategory.ifDelete = 0 and "
                + " m.materialCategory.status = 1 and m.materialUnit.ifDelete = 0 and m.materialUnit.status = 1 ORDER BY m.addDateTime DESC";
        return (List<Material>) hibernateTemplate.find(hql);
    }

}

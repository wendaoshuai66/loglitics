package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.StockRemoval;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository("stockRemovalDao")
public class StockRemovalDaoImpl extends BaseDaoImpl implements StockRemovalDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getStockRemovalAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaSqlMap = para.get("likeParaSql");
        Object name = "";
        Object warrantyNumber = "";
        if (likeParaSqlMap != null) {
            name = likeParaSqlMap.get("material.name") == null ? "" : likeParaSqlMap.get("material.name");
            warrantyNumber = likeParaSqlMap.get("warrantyNumber.maintenanceNumber") == null ? ""
                    : likeParaSqlMap.get("warrantyNumber.maintenanceNumber");
        }
        Map eqParaSqlMap = para.get("eqParaSql");
        Object categoryId = "";
        Object workerUid = "";
        if (eqParaSqlMap != null) {
            categoryId = eqParaSqlMap.get("material_category.id") == null ? ""
                    : eqParaSqlMap.get("material_category.id");
            workerUid = eqParaSqlMap.get("maintenanceStaff.id") == null ? ""
                    : eqParaSqlMap.get("maintenanceStaff.id");
        }
        Map timeMap = para.get("timeMap");
        StringBuffer buffer = new StringBuffer();
        String idString = (categoryId == "") ? " AND 1=1 " : "AND c. ID = '" + categoryId + "'\n";
        String UidString = (workerUid == "") ? " AND 1=1 " : "AND n.workerUid = '" + workerUid + "'\n";
        buffer.append("SELECT COUNT(1) AS count FROM stock_removal s, material m, "
                + " material_category c, warranty_number n WHERE s.materialId = m.id "
                + " AND m.materialCategoryId = c.id AND s.warrantyNumberId = n.id "
                + " AND n.maintenanceNumber LIKE '%" + warrantyNumber + "%' AND m.name LIKE '%" + name + "%' "
                + idString + UidString + " AND s.ifDelete = '0'");
        StringBuffer sqlBuffer = putTimeQueryInfo(buffer, timeMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @Override
    public List<StockRemoval> getStockRemovalMaterialList(Long warrantyNumberId) {
        String hql = "FROM StockRemoval s WHERE s.ifDelete = 0 and s.warrantyNumber.id = '" + warrantyNumberId + "'";
        List<StockRemoval> list = (List<StockRemoval>) hibernateTemplate.find(hql);
        return list;
    }

}

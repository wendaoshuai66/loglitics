package com.lianxing.logistics.dao;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository("storageDao")
public class StorageDaoImpl extends BaseDaoImpl implements StorageDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getStorageAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaSqlMap = para.get("likeParaSql");
        Object name = "";
        Object storageDocuments = "";
        if (likeParaSqlMap != null) {
            name = likeParaSqlMap.get("material.name") == null ? "" : likeParaSqlMap.get("material.name");
            storageDocuments = likeParaSqlMap.get("storageDocuments") == null ? ""
                    : likeParaSqlMap.get("storageDocuments");
        }
        Map eqParaSqlMap = para.get("eqParaSql");
        Object categoryId = "";
        if (eqParaSqlMap != null) {
            categoryId = eqParaSqlMap.get("material_category.id") == null ? ""
                    : eqParaSqlMap.get("material_category.id");
        }
        Map timeMap = para.get("timeMap");
        StringBuffer buffer = new StringBuffer();
        String idString = (categoryId == "") ? " AND 1=1 " : "AND c. ID = '" + categoryId + "'\n";
        buffer.append("SELECT count(1) AS count FROM `storage` s, `material` m, "
                + " `material_category` c WHERE s.materialId = m.id "
                + " AND m.materialCategoryId = c.id AND m. NAME LIKE '%" + name + "%' " + idString
                + " AND s.storageDocuments LIKE '%" + storageDocuments + "%'" + " AND s.ifDelete = '0'");
        StringBuffer sqlBuffer = putTimeQueryInfo(buffer, timeMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

}

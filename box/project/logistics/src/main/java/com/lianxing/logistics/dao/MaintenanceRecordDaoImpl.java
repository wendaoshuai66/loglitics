package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;
import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository("maintenanceRecordDao")
public class MaintenanceRecordDaoImpl extends BaseDaoImpl implements MaintenanceRecordDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaintenanceRecordAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        Map timeMap = para.get("timeMap");
        String sql = "SELECT COUNT(1) AS count FROM warranty_number w,maintenance_record r,maintenance_status s where w.maintenanceRecordId = r.id AND r.maintenanceStatusId = s.id";
        sql += " and w.ifDelete = 0 ";
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        Map statusSqlMap = this.getParaMap(para, "statusSqlMap");
        Object status = statusSqlMap.get("maintenanceStatus");
        if (status != null) {
            sqlBuffer.append(" AND s.id IN ( " + status + " ) ");
        }
        sqlBuffer = putTimeQueryInfo(sqlBuffer, timeMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @SuppressWarnings("rawtypes")
    @Override
    public StringBuffer putTimeQueryInfo(StringBuffer buffer, Map timeMap) {
        String addStart = (String) timeMap.get("addStart");
        String addEnd = getNextDayStr((String) timeMap.get("addEnd"));
        buffer.append(" AND ");
        // 发布时间
        if (StringUtils.isNotBlank(addStart) && StringUtils.isNotBlank(addEnd)) {
            buffer.append("( w.addDateTime BETWEEN").append(" '" + addStart + "' AND  '" + addEnd + "')");
        } else if (StringUtils.isNotBlank(addStart)) {
            buffer.append(" w.addDateTime >= '" + addStart + "'");
        } else if (StringUtils.isNotBlank(addEnd)) {
            buffer.append(" w.addDateTime <= '" + addEnd + "')");
        } else {
            buffer.append(" 1=1 ");
        }
        return buffer;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public <T> List<T> getList(Page page, Map<String, Map> paraMap, boolean ifAll) {
        StringBuffer hql = new StringBuffer();
        hql.append("from " + page.getEntityName() + " w where 1=1 and w.ifDelete = 0");
        hql = this.getParaBuffer(hql, this.getParaMap(paraMap, "likePara"), this.getParaMap(paraMap, "eqPara"));
        Map statusMap = this.getParaMap(paraMap, "statusMap");
        Object status = statusMap.get("maintenanceRecord.maintenanceStatus");
        if (status != null) {
            hql.append(" AND w.maintenanceRecord.maintenanceStatus IN ( " + status + " ) ");
        }
        hql = putTimeQueryInfo(hql, this.getParaMap(paraMap, "timeMap"));
        String orderByField = page.getOrderByName(); // 排序字段的名称
        String sortMethod = page.getOrderByDesc() ? " desc" : " asc"; // 排序方式
        hql.append(" order by " + orderByField + sortMethod);
        Query query = getSession().createQuery(hql.toString());
        query.setFirstResult(page.countOffset());
        query.setMaxResults(page.pageSize); // page 信息
        @SuppressWarnings("unchecked")
        List<T> list = (List<T>) query.list();
        return list;
    }

}

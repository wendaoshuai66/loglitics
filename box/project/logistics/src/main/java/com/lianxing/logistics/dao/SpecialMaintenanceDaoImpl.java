package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.date.DateTime;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.text.ParseException;
import java.util.*;
import java.util.Map.Entry;

@Repository("specialMaintenanceDao")
public class SpecialMaintenanceDaoImpl extends BaseDaoImpl implements SpecialMaintenanceDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Long getSpecialMaintenanceAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqParaSql");
        Map timeMap = para.get("timeMap");
        String sql = "SELECT m.maintenanceAreaIds ids FROM `maintenance_special` m,warranty_number w,`user` u WHERE 1=1 ";
        sql += " and w.ifDelete = 0 and u.role IN (1,0) and w.maintenanceSpecialId = m.id  and w.workerUid = u.id ";
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
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sqlBuffer.toString());
//        List resultList = new ArrayList();
//        for (Map<String, Object> m : list) {
//            for (String k : m.keySet()) {
//                resultList.add(m.get(k));
//            }
//        }
//        List areaIdsList = maintenanceAreaDao.getMaintenanceAreaIdsList();
//        List finalList = getFinalResultList(areaIdsList, resultList);
        return Long.parseLong(list.size() + "");
    }

    @Override
    public Long getMaintenanceNumber() throws ParseException {
        Date date = new Date();
        String start = DateTime.dateToString(date, 1);
        String end = getNextDayStr(start);
        String sql = "SELECT count(1) AS count FROM warranty_number WHERE" + " addDateTime BETWEEN '" + start
                + "' AND '" + end + "'";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql);
        return Long.parseLong(map.get("count").toString()) + 1;
    }

    @Override
    public String getAreaNameListFromIds(String[] ids) {
        StringBuffer buffer = new StringBuffer();
        for (String id : ids) {
            buffer.append("'").append(id).append("'").append(",");
        }
        String sb = buffer.toString();
        String sql = "SELECT name from maintenance_area WHERE id in (" + sb.substring(0, sb.length() - 1) + ")";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        StringBuilder resultBuffer = new StringBuilder();
        for (Map<String, Object> map : list) {
            for (Entry<String, Object> entry : map.entrySet()) {
                resultBuffer.append(entry.getValue()).append("  ;  ");
            }
        }
        String result = resultBuffer.toString();
        return result.substring(0, result.length() - 5);
    }

//    @SuppressWarnings({ "rawtypes", "unchecked" })
//    private List getFinalResultList(List areaIdsList, List resultList) {
//        List finalList = new ArrayList();
//        for (Object ids : resultList) {
//            int count = 0;
//            String[] split = (ids + "").split(",", -1);
//            for (int i = 0; i < split.length; i++) {
//                if (Collections.frequency(areaIdsList, split[i]) > 0) {
//                    count++;
//                }
//            }
//            if (count == split.length) {
//                finalList.add(split);
//            }
//        }
//        return finalList;
//    }

}

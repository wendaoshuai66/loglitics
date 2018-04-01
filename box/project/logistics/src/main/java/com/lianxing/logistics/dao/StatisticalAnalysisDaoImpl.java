package com.lianxing.logistics.dao;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository("statisticalAnalysisDao")
public class StatisticalAnalysisDaoImpl extends BaseDaoImpl implements StatisticalAnalysisDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    @SuppressWarnings("rawtypes")
    @Override
    public List getMaintenanceStatisticWithTime(int type, String startTime, String endTime) {
        String startSqlStr = getStartTimeSqlStr(startTime);
        String endSqlStr = StringUtils.isNotBlank(endTime) ? " AND w.addDateTime <= '" + ((type == 12) ? endTime : getNextDayStr(endTime)) + "' " : " AND 1=1 ";
        String sqlA = "SELECT u.time categories,COUNT(*) data FROM ( SELECT ";
        String sqlB = " (w.addDateTime) time FROM warranty_number w WHERE w.ifDelete = 0 and w.type = 0 " + startSqlStr + endSqlStr + "  ) u GROUP BY u.time";
        StringBuffer buffer = new StringBuffer();
        if (type == 24 || type == 240) {
            buffer.append(sqlA).append("HOUR").append(sqlB);
        } else if (type == 12) {
            buffer.append(sqlA).append("MONTH").append(sqlB);
        } else if (type == 7) {
            buffer.append(sqlA).append("WEEKDAY").append(sqlB);
        }
        List<Map<String, Object>> list = jdbcTemplate.queryForList(buffer.toString());
        return list;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public List getMaintenanceStatisticWithType(String type, String startTime, String endTime) {
        String sql = null;
        String startSqlStr = getStartTimeSqlStr(startTime);
        String endSqlStr = getEndTimeSqlStr(endTime);
        // 报修来源(web与微信报修占比)
        if ("repairOriginStatistics".equalsIgnoreCase(type)) {
            sql = "SELECT * FROM(SELECT COUNT(1) web FROM warranty_number w WHERE w.ifDelete = 0 AND w.type = 0 AND w.repairMethod = 0 " + startSqlStr + endSqlStr + ") AS a, "
                    + "(SELECT COUNT(1) weChart FROM warranty_number w WHERE w.ifDelete = 0 AND w.type = 0 AND w.repairMethod = 1 " + startSqlStr + endSqlStr
                    + " ) AS b";
        }
        // 报修类型占比(工种占比)
        else if ("maintenanceTypeStatistics".equalsIgnoreCase(type)) {
            sql = "SELECT t.name FROM warranty_number w,maintenance_record r,maintenance_category c,maintenance_type t where w.ifDelete = 0 and w.maintenancerecordId = r.id " +
                    " and r.maintenancecategoryId = c.id and c.maintenancetypeId = t.id " +
                    startSqlStr + endSqlStr;
        }
        // 报修区域占比(区域占比)
        else if ("maintenanceAreaStatistics".equalsIgnoreCase(type)) {
            sql = "SELECT m.name area,c.name campus from warranty_number w,maintenance_record r,maintenance_area m,campus c WHERE w.maintenanceRecordId <> '' " +
                    " AND w.maintenanceRecordId = r.id AND r.maintenanceAreaId = m.id and w.ifdelete = 0 AND m.campusId = c.id " + startSqlStr + endSqlStr;
        }
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return list;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public List getMaintenanceStatisticWithQuality(String type, String startTime, String endTime) {
        String sql = null;
        String startSqlStr = getStartTimeSqlStr(startTime);
        String endSqlStr = getEndTimeSqlStr(endTime);
        // 维修评价分类
        if ("evaluationStatistics".equalsIgnoreCase(type)) {
            StringBuffer buffer = new StringBuffer("select * from");
            String evaluationGradeStr = " from warranty_number w,maintenance_record m WHERE w.maintenanceRecordId = m.id AND w.maintenanceRecordId <> '' and w.workerUid <> '' AND w.type = 0 AND w.ifDelete = 0 " + startSqlStr + endSqlStr + " AND m.evaluationGrade = ";
            buffer.append("(select count(1) bad ").append(evaluationGradeStr).append(" 0 AND m.approvalStatus = 1) a, ");
            buffer.append("(select count(1) mid ").append(evaluationGradeStr).append(" 2) b, ");
            buffer.append("(select count(1) good ").append(evaluationGradeStr).append(" 1) c ");
            sql = buffer.toString();
        }
        // 完成状态
        else if ("maintenanceStatusStatistics".equalsIgnoreCase(type)) {
            sql = "select s.name from warranty_number w,maintenance_record r,maintenance_status s WHERE w.maintenanceRecordId = r.id AND r.maintenanceStatusId = s.id AND w.maintenanceRecordId <> '' AND w.ifDelete = 0 " + startSqlStr + endSqlStr;
        }
        // 维修耗时
        else if ("timeCostStatistics".equalsIgnoreCase(type)) {
            sql = "select maintenanceTime time from warranty_number w WHERE w.type = 0 AND w.maintenanceTime <> '' AND w.ifDelete = 0 AND w.workerUid <> '' " + startSqlStr + endSqlStr;
            // 专项维修
//           + " union "
//           + " select maintenanceTime time from warranty_number w WHERE w.type = 1 AND w.maintenanceTime <> '' AND w.ifDelete = 0" + startSqlStr + endSqlStr;
        }
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return list;
    }

    private String getStartTimeSqlStr(String startTime) {
        return StringUtils.isNotBlank(startTime) ? " AND w.addDateTime >= '" + startTime + "' " : " AND 1=1 ";
    }

    private String getEndTimeSqlStr(String endTime) {
        return StringUtils.isNotBlank(endTime) ? " AND w.addDateTime <= '" + getNextDayStr(endTime) + "' " : " AND 1=1 ";
    }
}

package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.MaintenanceRecordDaoImpl;
import com.lianxing.logistics.dao.MessageRecorderDaoImpl;
import com.lianxing.logistics.dao.SpecialMaintenanceDaoImpl;
import com.lianxing.logistics.model.MaintenanceRecord;
import com.lianxing.logistics.model.MaintenanceStatus;
import com.lianxing.logistics.model.WarrantyNumber;
import com.lianxing.logistics.util.Page;
import com.lianxing.logistics.util.PropertiesUtil;
import com.lianxing.logistics.util.RedisClient;
import com.lianxing.logistics.util.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("maintenanceRecordService")
public class MaintenanceRecordServiceImpl extends BaseServiceImpl implements MaintenanceRecordService {

    @Autowired
    private MaintenanceRecordDaoImpl maintenanceRecordDao;

    @Autowired
    private SpecialMaintenanceDaoImpl specialMaintenanceDao;

    @SuppressWarnings("unused")
    @Autowired
    private MessageRecorderDaoImpl messageRecorderDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String maintenanceNumber = request.getParameter("searchObj[maintenanceNumber]");// 维修单号
        String addDateTimeStart = request.getParameter("searchObj[addDateTimeStart]"); // 报修时间起始
        String addDateTimeEnd = request.getParameter("searchObj[addDateTimeEnd]"); // 报修时间结束
        String searchStatusId = request.getParameter("searchObj[searchStatusId]"); // 维修状态ID组(0/1,2,3)
        // 0代表全部
        // 维修评价中只取差评记录
        String badReview = request.getParameter("searchObj[badReview]");
        String addUid = request.getParameter("searchObj[repairStaff][id]");// 报修人员Id
        String workerUid = request.getParameter("searchObj[maintenanceStaff][id]");// 维修人员Id
        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("addStart", addDateTimeStart);
        timeMap.put("addEnd", addDateTimeEnd);
        Map likePara = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        likePara.put("maintenanceNumber", maintenanceNumber);
        // 维修类别为普通维修
        eqPara.put("w.type", 0);
        eqPara.put("w.repairStaff.id", addUid);
        eqPara.put("w.maintenanceStaff.id", workerUid);
        Map likeParaSql = new HashMap<String, String>();
        Map eqParaSql = new HashMap<String, String>();
        likeParaSql.put("maintenanceNumber", maintenanceNumber);
        eqParaSql.put("w.type", 0);
        eqParaSql.put("w.addUid", addUid);
        eqParaSql.put("w.workerUid", workerUid);
        if ("1".equals(badReview)) {
            // 差评
            eqPara.put("maintenanceRecord.evaluationGrade", 0);
            eqParaSql.put("evaluationGrade", 0);
        }

        // 针对 searchStatusId 特殊情况 需要专门sql与hql拼装
        Map statusMap = new HashMap<String, String>();
        Map statusSqlMap = new HashMap<String, String>();
        if (!"0".equals(searchStatusId)) {
            statusMap.put("maintenanceRecord.maintenanceStatus", searchStatusId);
            statusSqlMap.put("maintenanceStatus", searchStatusId);
        }
        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("eqPara", eqPara);
        paraMap.put("likeParaSql", likeParaSql);
        paraMap.put("eqParaSql", eqParaSql);
        paraMap.put("timeMap", timeMap);
        paraMap.put("statusMap", statusMap);
        paraMap.put("statusSqlMap", statusSqlMap);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("warranty_number");// 表名
        page.setEntityName("WarrantyNumber");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaintenanceRecordAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return maintenanceRecordDao.getMaintenanceRecordAllCountFromPara(para, ifAll);
    }

    @Override
    public String getMaintenanceNumber() {
        try {
            // 补足4位
            Long number;
            number = specialMaintenanceDao.getMaintenanceNumber();
            Date date = new Date();
            SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
            String dateStr = format.format(date);
            return dateStr + String.format("%04d", number);
        } catch (ParseException e) {
            return null;
        }
    }

    @Override
    public String getMaintenanceTime(WarrantyNumber warrantyNumber, Date endDate) {
        Date maintenanceStartDateTime = warrantyNumber.getMaintenanceStartDateTime();
        long differTime = endDate.getTime() - maintenanceStartDateTime.getTime();
        BigDecimal endTime = new BigDecimal(differTime);
        BigDecimal hourTime = new BigDecimal(1000L * 60 * 60);
        BigDecimal divide = endTime.divide(hourTime, 2, BigDecimal.ROUND_HALF_EVEN);
        return String.valueOf(divide.doubleValue());
    }

    @Override
    public MaintenanceRecord changeRecordStatus(MaintenanceRecord record) {
        Integer grade = record.getEvaluationGrade();
        MaintenanceStatus maintenanceStatus;
        if (grade == 0) {
            // 评价带审核的状态
            maintenanceStatus = getById(MaintenanceStatus.class, 2L);
        } else {
            // 已完成的状态,好评，中评的评价内容设置为空
            maintenanceStatus = getById(MaintenanceStatus.class, 6L);
            record.setEvaluationContent(null);
        }
        record.setMaintenanceStatus(maintenanceStatus);
        record.setEvaluationDateTime(new Date());
        return record;
    }

    @Override
    public MaintenanceRecord saveMaintenanceRecord(MaintenanceRecord record) {
        MaintenanceStatus maintenanceStatus = getById(MaintenanceStatus.class, 1L);
        Long recordId = save(record);
        record.setId(recordId);
        record.setMaintenanceStatus(maintenanceStatus);
        record.setApprovalStatus(0);
        return record;
    }

    @Override
    public void saveRedisByIdAndMap(Long id, HashMap map) {
        // 将订单id-->key；数据（发送短信的维修人员）-->value 存放到redis中(存入缓存)，设置时长
        RedisClient redisClient = new RedisClient();
        // 获取接单有效时间
        String ReceiveOrderEffectiveTime = PropertiesUtil.get("ReceiveOrderEffectiveTime", "/sys_config.properties");
        // key为RedisUtil.REDIS_PREFIX + 维修单号id
        int i = Integer.parseInt(ReceiveOrderEffectiveTime);
        int x = 60 * i;
        redisClient.set(RedisUtil.REDIS_PREFIX + id, map, 60 * Integer.parseInt(ReceiveOrderEffectiveTime));
    }

    @SuppressWarnings("rawtypes")
    @Override
    public <T> List<T> getList(Page page, Map<String, Map> paraMap, boolean ifAll) {
        return maintenanceRecordDao.getList(page, paraMap, ifAll);
    }

}

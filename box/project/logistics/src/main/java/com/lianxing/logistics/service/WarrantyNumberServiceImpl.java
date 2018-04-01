package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.WarrantyNumberDaoImpl;
import com.lianxing.logistics.model.MaintenanceRecord;
import com.lianxing.logistics.model.MaintenanceStatus;
import com.lianxing.logistics.model.User;
import com.lianxing.logistics.model.WarrantyNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service("warrantyNumberService")
public class WarrantyNumberServiceImpl extends BaseServiceImpl implements WarrantyNumberService {

    @SuppressWarnings("unused")
    @Autowired
    private WarrantyNumberDaoImpl warrantyNumberDao;

    @Override
    public WarrantyNumber getWarrantyNumerByMaintenanceNumber(String MaintenanceNumber) {
        return warrantyNumberDao.getWarrantyNumerByMaintenanceNumber(MaintenanceNumber);
    }

    @Override
    public List<WarrantyNumber> getWarrantyNumberList(Long userId, String type) {
        return warrantyNumberDao.getWarrantyNumberList(userId, type);
    }

    @Override
    public List<WarrantyNumber> getWarrantyNumberSelectList(List<WarrantyNumber> list) {
        List<WarrantyNumber> resultList = new ArrayList<>();
        for (WarrantyNumber warrantyNumber : list) {
            User maintenanceStaff = warrantyNumber.getMaintenanceStaff();
            if (maintenanceStaff != null) {
                resultList.add(warrantyNumber);
            }
        }
        return resultList;
    }

    @Override
    public List<WarrantyNumber> getNotEvaluatedWarrantyNumberList() {
        List<WarrantyNumber> list = warrantyNumberDao.getNotEvaluatedWarrantyNumberList();
        if (list.size() > 0) {
            return warrantyNumberDao.getNotEvaluatedWarrantyNumberList();
        }
        return null;
    }

    /**
     * 获取‘待评价’的订单中超时的订单
     *
     * @param list
     * @return
     */
    @Override
    public List<WarrantyNumber> getOverTimeWarrantyNumberList(List<WarrantyNumber> list) {
        List<WarrantyNumber> resultList = new ArrayList<>();
        Date nowDate = new Date();
        BigDecimal bigDecimal = BigDecimal.valueOf(48);
        for (WarrantyNumber warranty : list) {
            Date endDateTime = warranty.getMaintenanceEndDateTime();
            if (endDateTime != null) {
                long differTime = nowDate.getTime() - endDateTime.getTime();
                BigDecimal endTime = new BigDecimal(differTime);
                BigDecimal hourTime = new BigDecimal(1000L * 60 * 60);
                // divide为两个时间的时间差（单位：小时）
                BigDecimal divide = endTime.divide(hourTime, 0, BigDecimal.ROUND_HALF_EVEN);
                // 取出订单结束时间距现在的时间超过或者等于48小时（即两天）的维修订单
                if (divide.compareTo(bigDecimal) == 1 || divide.compareTo(bigDecimal) == 0) {
                    resultList.add(warranty);
                }
            }
        }
        return resultList;
    }

    /**
     * 将超时的list中的订单进行操作
     *
     * @param list
     */
    @Override
    @Transactional
    public void updateOverTimeWarrantyNumberList(List<WarrantyNumber> list) {
        if (list.size() > 0) {
            for (WarrantyNumber warrantyNumber : list) {
                MaintenanceRecord record = warrantyNumber.getMaintenanceRecord();
                MaintenanceStatus maintenanceStatus = getById(MaintenanceStatus.class, 6L);
                record.setMaintenanceStatus(maintenanceStatus);
                record.setIfAutoEvaluation(1);
                record.setEvaluationGrade(1);
                record.setEvaluationDateTime(new Date());
                update(record);
                warrantyNumber.setMaintenanceRecord(record);
                update(warrantyNumber);
            }
        }
    }

    @Override
    public List<WarrantyNumber> getWarrantyNumberForAcceptOrderAboutRecord() {
        return warrantyNumberDao.getWarrantyNumberForAcceptOrderAboutRecord();
    }

    @Override
    public List<WarrantyNumber> getWarrantyNumberForAcceptOrderAboutSpecial() {
        return warrantyNumberDao.getWarrantyNumberForAcceptOrderAboutSpecial();
    }

}

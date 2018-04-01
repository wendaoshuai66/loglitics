package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.MessageRecorderDaoImpl;
import com.lianxing.logistics.model.MaintenanceRecord;
import com.lianxing.logistics.model.MaintenanceStatus;
import com.lianxing.logistics.model.User;
import com.lianxing.logistics.model.WarrantyNumber;
import com.lianxing.logistics.util.RedisClient;
import com.lianxing.logistics.util.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;

@Service("messageRecorderService")
public class MessageRecorderServiceImpl extends BaseServiceImpl implements MessageRecorderService {

    @SuppressWarnings("unused")
    @Autowired
    private MessageRecorderDaoImpl messageRecorderDao;

    /**
     * @param user
     * @param warrantyNumber
     * @return int == 0 : 表示发送失败短信； int == 1 : 发送成功短信； int == 2 : 不发送短信（即此人在10分钟之内重复发短信）
     */
    @Override
    public synchronized int testDataAudit(User user, WarrantyNumber warrantyNumber) {
        int result = 0;
        if (user != null && warrantyNumber != null) {
            Long id = warrantyNumber.getId();// 获取维修订单号，以获得redis中的key
            Long userId = user.getId();// 获取员工的id
            String mobile = user.getTel();// 获取员工的手机号码
            RedisClient redisClient = new RedisClient();
            if (redisClient.exists(RedisUtil.REDIS_PREFIX + id)) {
                User staff = warrantyNumber.getMaintenanceStaff();
                if (staff == null) {
                    HashMap<String, String> map = (HashMap) redisClient.hgetAll(RedisUtil.REDIS_PREFIX + id);
                    // 判断传进来的用户id是否在map中存在(判断userId是否在map的key中存在)
                    boolean containsKey = map.containsKey(String.valueOf(userId));
                    if (containsKey) {
                        for (String key : map.keySet()) {
                            // 当返回的员工信息和redis中存放的某一个相等，则将此员工保存到维修单中
                            if (mobile.equals(map.get(key)) && userId.toString().equals(key)) {
                                warrantyNumber.setMaintenanceStaff(user);
                                warrantyNumber.setIfAutomaticAppoint(1);
                                MaintenanceRecord maintenanceRecord = warrantyNumber.getMaintenanceRecord();
                                MaintenanceStatus maintenanceStatus = new MaintenanceStatus();
                                maintenanceStatus.setId(4L);
                                maintenanceRecord.setMaintenanceStatus(maintenanceStatus);
                                update(maintenanceRecord);
                                warrantyNumber.setMaintenanceRecord(maintenanceRecord);
                                warrantyNumber.setMaintenanceStartDateTime(new Date());
                                update(warrantyNumber);
                                result = 1;
                            }
                        }
                    } else {
                        result = 3;
                    }
                } else {
                    // 如果订单中的员工的手机号和发送短信的人的手机号一样
                    if (mobile.equals(staff.getTel())) {
                        result = 2;
                    }
                }
            }
        } else {
            result = 3;
        }
        return result;
    }

}

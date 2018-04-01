package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.WarrantyNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("warrantyNumberDao")
public class WarrantyNumberDaoImpl extends BaseDaoImpl implements WarrantyNumberDao {

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @Override
    public WarrantyNumber getWarrantyNumerByMaintenanceNumber(String MaintenanceNumber) {
        String hql = "FROM WarrantyNumber w WHERE w.ifDelete = 0 AND w.type = 0 AND w.maintenanceNumber = " + MaintenanceNumber;
        List<WarrantyNumber> list = (List<WarrantyNumber>) hibernateTemplate.find(hql);
        if (list.size() > 0) {
            return list.get(0);
        }
        return null;
    }

    @Override
    public List<WarrantyNumber> getWarrantyNumberList(Long userId, String type) {
        // 此处type采用硬编码处理的是由于 maintenanceStatus 表内容不由管理员维护,生成好的对应关系
        // 如需配置成灵活的方式
        // 1.需要将maintenanceStatus 表中的名称与id对应关系放映到配置文件中.
        // 2.将id从硬编码方式换成读取配置文件
        // 只查询维修中
        String maintenanceStatusIdType;
        String personId = "";
        if ("isService".equals(type)) {
            maintenanceStatusIdType = " = 4";
            personId = "w.maintenanceStaff.id";
        }
        // 除过已完成的剩余全部内容
        else {
            maintenanceStatusIdType = " < 6";
            personId = "w.repairStaff.id";
        }
        String hql = "FROM WarrantyNumber w WHERE  w.maintenanceRecord.maintenanceStatus.id " + maintenanceStatusIdType +
                " AND w.ifDelete = 0 AND " + personId + " = " + userId + " ORDER BY addDateTime DESC ";
        List<WarrantyNumber> list = (List<WarrantyNumber>) hibernateTemplate.find(hql);
        return list;
    }

    /**
     * 获取到未评价并且订单状态为‘待评价’的维修订单
     *
     * @return
     */
    @Override
    public List getNotEvaluatedWarrantyNumberList() {
        String hql = "SELECT w FROM WarrantyNumber w,MaintenanceRecord m,MaintenanceStatus s WHERE " +
                " w.maintenanceRecord.id = m.id AND w.ifDelete = 0 AND m.maintenanceStatus.id = s.id " +
                " AND m.maintenanceStatus.id = 5 AND m.evaluationGrade IS NULL ";
        List<WarrantyNumber> list = (List<WarrantyNumber>) hibernateTemplate.find(hql);
        return list;
    }

    @Override
    public List<WarrantyNumber> getWarrantyNumberForAcceptOrderAboutRecord() {
        String hql = "SELECT w FROM WarrantyNumber w,MaintenanceRecord r,MaintenanceStatus s where w.ifDelete = 0 and w.maintenanceRecord.id = r.id and " +
                     " r.maintenanceStatus = s.id and w.maintenanceStaff.id <> '' and s.id <> 7 and s.id <> 8";
        List<WarrantyNumber> list = (List<WarrantyNumber>) hibernateTemplate.find(hql);
        return list;
    }

    @Override
    public List<WarrantyNumber> getWarrantyNumberForAcceptOrderAboutSpecial() {
        String hql = "SELECT w FROM WarrantyNumber w,MaintenanceSpecial s where w.maintenanceSpecial.id = s.id and w.ifDelete = 0 and w.maintenanceStaff.id <> '' ";
        List<WarrantyNumber> list = (List<WarrantyNumber>) hibernateTemplate.find(hql);
        return list;
    }

}

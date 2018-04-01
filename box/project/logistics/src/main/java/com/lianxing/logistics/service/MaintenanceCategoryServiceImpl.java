package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.MaintenanceCategoryDaoImpl;
import com.lianxing.logistics.model.MaintenanceCategory;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("maintenanceCategoryService")
public class MaintenanceCategoryServiceImpl extends BaseServiceImpl implements MaintenanceCategoryService {

    @Autowired
    private MaintenanceCategoryDaoImpl maintenanceCategoryDao;

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setEntityName("MaintenanceCategory");
        page.setTableName("maintenance_category");
        return page;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String status = request.getParameter("searchObj[status]");// 显示状态

        // 状态为禁用的
        if ("2".equals(status)) {
            status = "0";
        }
        Map likePara = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        eqPara.put("c.status", status);
        eqPara.put("c.maintenanceType.ifDelete", 0);
        eqPara.put("c.maintenanceType.status", 1);

        Map likeParaSql = new HashMap<String, String>();
        Map eqParaSql = new HashMap<String, String>();
        eqParaSql.put("c.status", status);
        eqParaSql.put("d.ifDelete", 0);
        eqParaSql.put("d.`status`", 1);

        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("eqPara", eqPara);
        paraMap.put("likeParaSql", likeParaSql);
        paraMap.put("eqParaSql", eqParaSql);
        return paraMap;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaintenanceCategoryAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return maintenanceCategoryDao.getMaintenanceCategoryAllCountFromPara(para, ifAll);
    }

    @Override
    public List<MaintenanceCategory> getMaintenanceCategoryList() {
        return maintenanceCategoryDao.getMaintenanceCategoryList();
    }

    @Override
    public List<MaintenanceCategory> getMaintenanceCategoryForType() {
        return maintenanceCategoryDao.getMaintenanceCategoryForType();
    }

    @Override
    public List<MaintenanceCategory> getMaintenanceCategoryTypeList(String ignoreDeleteAndStatus) {
        return maintenanceCategoryDao.getMaintenanceCategoryTypeList(ignoreDeleteAndStatus);
    }

}

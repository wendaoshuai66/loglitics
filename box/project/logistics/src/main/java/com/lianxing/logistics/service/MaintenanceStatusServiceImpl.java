package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.MaintenanceStatusDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Service("maintenanceStatusService")
public class MaintenanceStatusServiceImpl extends BaseServiceImpl implements MaintenanceStatusService {

    @Autowired
    private MaintenanceStatusDaoImpl maintenanceStatusDao;


    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("maintenance_status");// 表名
        page.setEntityName("MaintenanceStatus");// 实体名
        return page;
    }

    @Override
    public Long getMaintenanceStatusAllCountFromPara(boolean ifAll) {
        return maintenanceStatusDao.getMaintenanceStatusAllCountFromPara(ifAll);
    }

    @Override
    public List getAllMaintenanceStatusSelectList() {
        return maintenanceStatusDao.getAllMaintenanceStatusSelectList();
    }

}

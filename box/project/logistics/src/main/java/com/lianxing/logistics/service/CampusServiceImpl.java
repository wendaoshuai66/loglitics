package com.lianxing.logistics.service;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lianxing.logistics.dao.CampusDaoImpl;
import com.lianxing.logistics.util.Page;

@Service("campusService")
public class CampusServiceImpl extends BaseServiceImpl implements CampusService {

    @Autowired
    private CampusDaoImpl campusDao;

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("campus");// 表名
        page.setEntityName("Campus");// 实体名
        return page;
    }

    @Override
    public Long getCampusAllCountFromPara(boolean ifAll) {
        return campusDao.getCampusAllCountFromPara(ifAll);
    }

}

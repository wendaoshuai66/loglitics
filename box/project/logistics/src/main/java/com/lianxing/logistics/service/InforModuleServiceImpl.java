package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.InforModuleDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

@Service("inforModuleService")
public class InforModuleServiceImpl extends BaseServiceImpl implements InforModuleService {

    @Autowired
    private InforModuleDaoImpl inforModuleDao;

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("infor_module");// 表名
        page.setEntityName("InforModule");// 实体名
        return page;
    }

    @Override
    public Long getInforModuleAllCountFromPara(boolean ifAll, Page page) {
        return inforModuleDao.getInforModuleAllCountFromPara(ifAll, page);
    }

}

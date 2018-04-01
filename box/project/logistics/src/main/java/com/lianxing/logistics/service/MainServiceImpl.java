package com.lianxing.logistics.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lianxing.logistics.dao.MainDaoImpl;

@Service("mainService")
public class MainServiceImpl extends BaseServiceImpl implements MainService {

    @Autowired
    private MainDaoImpl mainDao;

    @SuppressWarnings("rawtypes")
    @Override
    public Map getCountByRole() {
        return mainDao.getCountByRole();
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Map getHomeWebCount() {
        return mainDao.getHomeWebCount();
    }
}

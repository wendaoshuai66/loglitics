package com.lianxing.logistics.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("loginDao")
public class LoginDaoImpl extends BaseDaoImpl implements LoginDao {

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Boolean checkLoginInfo(String entityName, String account, String password) {
        try {
            String hql = " from " + entityName + " where 1=1 ";
            hql += " and account = '" + account + "' and password='" + password + "'";
            List list = hibernateTemplate.find(hql);
            if (list.size() > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
}

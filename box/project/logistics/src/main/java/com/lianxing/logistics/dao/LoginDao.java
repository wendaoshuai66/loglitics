package com.lianxing.logistics.dao;

public interface LoginDao {

    Boolean checkLoginInfo(String entityName, String account, String password);

}

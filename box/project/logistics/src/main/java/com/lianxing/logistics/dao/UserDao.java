package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.User;

public interface UserDao {

    String getUserPasswordById(Long id);

    User getUserByWorkerId(Long workerId);

    User getUserByTel(String tel);

    User getAdministrativeUser();
}

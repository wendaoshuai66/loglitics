package com.lianxing.logistics.dao;

import java.util.Map;

import com.lianxing.logistics.util.Page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository("studentDao")
public class StudentDaolmpl implements StudentDao {

    @Autowired
    private UserDaoImpl user;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getStudentAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        return user.getUserAllCountFromPara(page, para, ifAll);
    }

}

package com.lianxing.logistics.service;

import com.lianxing.logistics.model.User;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface UserService {

    /**
     * 根据openId获取到对应的userId
     *
     * @param openId
     * @return
     */
    JSONObject getUserFromOpenId(String openId);

    String getUserPasswordById(Long id);

    JSONObject checkUserPassword(HttpServletRequest request);

    User getUserByWorkerId(Long workerId);

    List getUserListForErgodic(List list);

    User getUserByTel(String tel);

    /**
     * 获取超级管理人员
     *
     * @return
     */
    User getAdministrativeUser();
}

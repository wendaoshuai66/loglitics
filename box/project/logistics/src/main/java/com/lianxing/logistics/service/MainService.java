package com.lianxing.logistics.service;

import java.util.Map;

public interface MainService {

    // 通过查询获取不同角色的count
    @SuppressWarnings("rawtypes")
    Map getCountByRole();

    // 通过查询获取Web端需要的count
    @SuppressWarnings("rawtypes")
    Map getHomeWebCount();

}

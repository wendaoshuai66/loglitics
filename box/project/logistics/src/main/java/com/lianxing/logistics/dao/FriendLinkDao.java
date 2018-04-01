package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;

import java.util.Map;

public interface FriendLinkDao {

    @SuppressWarnings("rawtypes")
    Long getFriendLinkAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);
}

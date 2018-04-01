package com.lianxing.logistics.service;

import com.lianxing.logistics.model.User;
import com.lianxing.logistics.model.WarrantyNumber;

public interface MessageRecorderService {

    /**
     * 将查到的数据在redis中进行检查（1.存活，将其保存到订单中；2.不存活，数据库中也没有，超时；3.不存活，数据库中有，有人先接单）
     *
     * @param user
     * @param warrantyNumber
     * @return
     */
    int testDataAudit(User user, WarrantyNumber warrantyNumber);

}

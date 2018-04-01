package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;

public interface InforModuleDao {

    Long getInforModuleAllCountFromPara(boolean ifAll, Page page);

}

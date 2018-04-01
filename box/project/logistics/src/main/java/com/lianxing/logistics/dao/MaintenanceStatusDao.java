package com.lianxing.logistics.dao;

import java.util.List;

public interface MaintenanceStatusDao {

    Long getMaintenanceStatusAllCountFromPara(boolean ifAll);

    List getAllMaintenanceStatusSelectList();
}

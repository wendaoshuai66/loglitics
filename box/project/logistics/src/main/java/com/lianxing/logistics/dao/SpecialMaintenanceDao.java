package com.lianxing.logistics.dao;

import java.text.ParseException;
import java.util.Map;

public interface SpecialMaintenanceDao {

    @SuppressWarnings("rawtypes")
    Long getSpecialMaintenanceAllCountFromPara(Map<String, Map> para, boolean ifAll);

    Long getMaintenanceNumber() throws ParseException;

    String getAreaNameListFromIds(String[] ids);

}

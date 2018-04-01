package com.lianxing.logistics.util.date;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

public class DateJsonValueProcessor implements JsonValueProcessor {

    private String pattern = DateTime.ymd;

    @Override
    public Object processArrayValue(Object objParam, JsonConfig arg1) {
        return process(objParam);
    }

    @Override
    public Object processObjectValue(String strParam, Object objParam, JsonConfig config) {
        return process(objParam);
    }

    private Object process(Object value) {
        if (value instanceof Date) {
            SimpleDateFormat sdf = new SimpleDateFormat(pattern, Locale.CHINA);
            return sdf.format(value);
        }
        return value == null ? "" : value.toString();
    }

}

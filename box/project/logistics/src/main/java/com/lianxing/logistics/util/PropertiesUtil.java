package com.lianxing.logistics.util;

import java.io.IOException;
import java.util.Properties;

public class PropertiesUtil {
    private static final String DEFAULT_PROPERTY_STR = "/sys_config.properties";

    public static String get(String key, String... str) {
        String propertyStr = DEFAULT_PROPERTY_STR;
        if (str.length != 0) {
            propertyStr = str[0];
        }
        Properties prop = new Properties();
        try {
            prop.load(PropertiesUtil.class.getResourceAsStream(propertyStr));
            return prop.getProperty(key);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}

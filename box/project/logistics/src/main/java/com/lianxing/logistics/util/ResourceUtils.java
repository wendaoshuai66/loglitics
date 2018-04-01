package com.lianxing.logistics.util;

import java.util.ResourceBundle;

public class ResourceUtils {

    private static final ResourceBundle sys_bundle = ResourceBundle.getBundle("sys_config");

    public static String get(String configFile, String key) {
        String value = "";
        if (configFile.equals("sys")) {
            value = sys_bundle.getString(key);
        }
        return value;
    }
}

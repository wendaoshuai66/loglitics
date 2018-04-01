package com.lianxing.logistics.util.Geetest;

import com.lianxing.logistics.util.PropertiesUtil;

/**
 * @author: Lin
 * @date: 2018/1/2
 */
public class GeetestConfig {

    private static final String GEETEST_PROPERTIES = "/Geetest.properties";

    public static String getGeetest_id() {
        return PropertiesUtil.get("CaptchaId", GEETEST_PROPERTIES);
    }

    public static String getGeetest_key() {
        return PropertiesUtil.get("PrivateKey", GEETEST_PROPERTIES);
    }

    public static boolean isnewfailback() {
        return false;
    }
}

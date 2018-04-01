package com.lianxing.logistics.util;

import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.util.ByteSource;

public class PasswordHelper {

    public static String encryptPassword(String pwd, String salt) {
        String algorithmName = "md5";
        Integer hashIterations = 2;

        String encryptPassword = new SimpleHash(algorithmName, pwd, ByteSource.Util.bytes(salt), hashIterations)
                .toHex();
        return encryptPassword;
    }
}

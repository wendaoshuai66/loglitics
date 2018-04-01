package com.lianxing.logistics.util;

import java.util.Random;

public class RandomUtil {

    public static String getRandomCodeForTen(Long count) {
        String str = "0123456789";
        StringBuffer resultBuffer = new StringBuffer();
        for (int i = 0; i < count; i++) {
            char ch = str.charAt(new Random().nextInt(str.length()));
            resultBuffer.append(ch);
        }
        return resultBuffer.toString();
    }
}

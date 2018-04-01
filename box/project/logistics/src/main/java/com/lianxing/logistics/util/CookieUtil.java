package com.lianxing.logistics.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

public class CookieUtil {

    private static final String token = "logistics.user.token";

    private static Map<String, Cookie> ReadCookieMap(HttpServletRequest request) {
        Map<String, Cookie> cookieMap = new HashMap<>();
        Cookie[] cookies = request.getCookies();
        if (null != cookies) {
            for (Cookie cookie : cookies) {
                // 把已经死亡的cookie过滤
//                if(cookie.getMaxAge()>1) {
                cookieMap.put(cookie.getName(), cookie);
//                }

            }
        }
        return cookieMap;
    }

    public static Cookie getCookieFromName(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        Map<String, Cookie> cookieMap = ReadCookieMap(request);
        if (cookieMap.containsKey(token)) {
            return cookieMap.get(token);
        } else {
            return null;
        }
    }

}

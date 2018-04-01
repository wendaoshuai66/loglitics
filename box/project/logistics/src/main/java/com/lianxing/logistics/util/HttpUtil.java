package com.lianxing.logistics.util;

import java.nio.charset.Charset;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class HttpUtil {

    public static HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentType(new MediaType(Const.TEXT, Const.HTML, Charset.forName(Const.UTF_8)));
        return headers;
    }
}

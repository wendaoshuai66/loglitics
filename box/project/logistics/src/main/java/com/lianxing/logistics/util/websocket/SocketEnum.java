package com.lianxing.logistics.util.websocket;

import com.lianxing.logistics.util.EnumUtil;

/**
 * @author: Lin
 * @date: 2018/1/6
 */
public enum SocketEnum implements EnumUtil{
    NEW_CAMPUS(1001, "新增校区") {
        @Override
        public Integer getCode() {
            return 1001;
        }
    },

    ;
    Integer key;

    String msg;

    SocketEnum(int key, String msg) {
        this.key = key;
        this.msg = msg;
    }

    public Integer getKey() {
        return key;
    }

    public String getMsg() {
        return msg;
    }

}

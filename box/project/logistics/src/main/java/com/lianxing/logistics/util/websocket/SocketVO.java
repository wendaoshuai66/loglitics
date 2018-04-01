package com.lianxing.logistics.util.websocket;

/**
 * 给前端返回的消息推送VO模型
 * @author: Lin
 * @date: 2018/1/6
 */
public class SocketVO {

    // eq: {1001:'新增校区'}

    /**
     * 标志
     */
    private Integer key;

    /**
     * 实际内容
     */
    private String msg;

    public SocketVO() {
    }

    public SocketVO(Integer key, String msg) {
        this.key = key;
        this.msg = msg;
    }

    public Integer getKey() {
        return key;
    }

    public void setKey(Integer key) {
        this.key = key;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}

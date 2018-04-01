package com.lianxing.logistics.util;

import com.lianxing.logistics.util.websocket.SocketUtil;
import org.springframework.stereotype.Component;
import redis.clients.jedis.JedisPubSub;

/**
 * Redis 消息订阅与推送
 * (解决集群下webSocket每次只有一组client能收到对应一组server的推送问题)
 * @author: Lin
 * @date: 2018/1/8
 */
@Component
public class RedisMsgPubSubListener extends JedisPubSub {
    @Override
    public void unsubscribe() {
        super.unsubscribe();
    }

    @Override
    public void unsubscribe(String... channels) {
        super.unsubscribe(channels);
    }

    @Override
    public void subscribe(String... channels) {
        super.subscribe(channels);
    }

    @Override
    public void psubscribe(String... patterns) {
        super.psubscribe(patterns);
    }

    @Override
    public void punsubscribe() {
        super.punsubscribe();
    }

    @Override
    public void punsubscribe(String... patterns) {
        super.punsubscribe(patterns);
    }

    @Override
    /**
     * subscribe是阻塞方法
     * 务必收到方法后,调用取消订阅的方法
     */
    public void onMessage(String channel, String message) {
        System.out.println("[redis消息推送]:" + channel + " receives message :" + message);
        SocketUtil socketUtil = new SocketUtil();
        socketUtil.sendMessage(message);
        this.unsubscribe();
    }

    @Override
    public void onPMessage(String pattern, String channel, String message) {

    }

    @Override
    public void onSubscribe(String channel, int subscribedChannels) {
        System.out.println("[redis消息订阅]:" + channel + " is been subscribed:" + subscribedChannels);
    }

    @Override
    public void onPUnsubscribe(String pattern, int subscribedChannels) {

    }

    @Override
    public void onPSubscribe(String pattern, int subscribedChannels) {

    }

    @Override
    public void onUnsubscribe(String channel, int subscribedChannels) {
        System.out.println("[redis取消订阅]:" + channel + " is been unsubscribed:" + subscribedChannels);
    }
}

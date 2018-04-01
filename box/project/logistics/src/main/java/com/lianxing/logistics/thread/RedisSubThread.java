package com.lianxing.logistics.thread;

import com.lianxing.logistics.util.RedisClient;
import com.lianxing.logistics.util.RedisMsgPubSubListener;

/**
 * Redis推送线程类
 * 由于Jedis的subscribe操作是阻塞的，因此，我们另起一个线程来进行subscribe操作
 * @author: Lin
 * @date: 2018/1/8
 */
public class RedisSubThread extends Thread {

    public RedisClient client = new RedisClient();

    public RedisMsgPubSubListener redisMsgPubSubListener = new RedisMsgPubSubListener();

    /**
     * 频道目前就设置一个,后续如果需要区分频道可动态传入
     */
    public static final String CHANNEL_KEY = "channelKey";

    @Override
    public void run() {
        System.out.println(String.format("subscribe redis, channel %s, thread will be blocked", CHANNEL_KEY));
        try {
            client.subscribe(redisMsgPubSubListener, CHANNEL_KEY);
        } catch (Exception e) {
            System.out.println(String.format("subsrcibe channel error, %s", e));
            e.printStackTrace();
        }
    }
}

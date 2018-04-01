package com.lianxing.logistics.util;

import com.lianxing.logistics.thread.RedisSubThread;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class RedisClient {

    private RedisMsgPubSubListener redisMsgPubSubListener = new RedisMsgPubSubListener();

    /**
     * 通过key删除（字节）
     *
     * @param key
     */
    public void del(byte[] key) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.del(key);
        RedisUtil.returnResource(jedis);
    }

    /**
     * 通过key删除
     *
     * @param key
     */
    public void del(String key) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.del(key);
        RedisUtil.returnResource(jedis);
    }

    /**
     * 添加key value 并且设置存活时间(byte)
     *
     * @param key
     * @param value
     * @param liveTime
     */
    public void set(byte[] key, byte[] value, int liveTime) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.set(key, value);
        jedis.expire(key, liveTime);
        RedisUtil.returnResource(jedis);
    }

    /**
     * 添加key value 并且设置存活时间
     *
     * @param key
     * @param value
     * @param liveTime
     */
    public void set(String key, String value, int liveTime) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.set(key, value);
        jedis.expire(key, liveTime);
        RedisUtil.returnResource(jedis);
    }

    /**
     * 添加key value 并且设置存活时间
     *
     * @param key
     * @param value
     * @param liveTime
     */
    public void set(String key, Map value, int liveTime) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.hmset(key, value);
        jedis.expire(key, liveTime);
        RedisUtil.returnResource(jedis);
    }

    /**
     * 添加key value
     *
     * @param key
     * @param value
     */
    public void set(String key, String value) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.set(key, value);
        RedisUtil.returnResource(jedis);
    }

    /**
     * 添加key value (字节)(序列化)
     *
     * @param key
     * @param value
     */
    public void set(byte[] key, byte[] value) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.set(key, value);
        RedisUtil.returnResource(jedis);
    }

    /**
     * 获取redis value (String)
     *
     * @param key
     * @return
     */
    public String get(String key) {
        Jedis jedis = RedisUtil.getJedis();
        String value = jedis.get(key);
        RedisUtil.returnResource(jedis);
        return value;
    }

    /**
     * 获取redis value (Map)
     *
     * @param key
     * @return
     */
    public Map<String, String> hgetAll(String key) {
        Jedis jedis = RedisUtil.getJedis();
        Map value = jedis.hgetAll(key);
        RedisUtil.returnResource(jedis);
        return value;
    }

    /**
     * 获取redis value (byte [] )(反序列化)
     *
     * @param key
     * @return
     */
    public byte[] get(byte[] key) {
        Jedis jedis = RedisUtil.getJedis();
        byte[] value = jedis.get(key);
        RedisUtil.returnResource(jedis);
        return value;
    }

    public Long expire(String key, int time) {
        Jedis jedis = RedisUtil.getJedis();
        Long value = jedis.expire(key, time);
        RedisUtil.returnResource(jedis);
        return value;
    }

    /**
     * 通过正则匹配keys
     *
     * @param pattern
     * @return
     */
    public Set<String> keys(String pattern) {
        Jedis jedis = RedisUtil.getJedis();
        Set<String> value = jedis.keys(pattern);
        RedisUtil.returnResource(jedis);
        return value;
    }

    /**
     * 检查key是否已经存在
     *
     * @param key
     * @return
     */
    public boolean exists(String key) {
        Jedis jedis = RedisUtil.getJedis();
        boolean value = jedis.exists(key);
        RedisUtil.returnResource(jedis);
        return value;
    }

    /*******************redis list操作************************/
    /**
     * 往list中添加元素
     *
     * @param key
     * @param value
     */
    public void lpush(String key, String value) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.lpush(key, value);
        RedisUtil.returnResource(jedis);
    }

    public void rpush(String key, String value) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.rpush(key, value);
        RedisUtil.returnResource(jedis);
    }

    /**
     * 数组长度
     *
     * @param key
     * @return
     */
    public Long llen(String key) {
        Jedis jedis = RedisUtil.getJedis();
        Long len = jedis.llen(key);
        RedisUtil.returnResource(jedis);
        return len;
    }

    /**
     * 获取下标为index的value
     *
     * @param key
     * @param index
     * @return
     */
    public String lindex(String key, Long index) {
        Jedis jedis = RedisUtil.getJedis();
        String str = jedis.lindex(key, index);
        RedisUtil.returnResource(jedis);
        return str;
    }

    public String lpop(String key) {
        Jedis jedis = RedisUtil.getJedis();
        String str = jedis.lpop(key);
        RedisUtil.returnResource(jedis);
        return str;
    }

    public List<String> lrange(String key, long start, long end) {
        Jedis jedis = RedisUtil.getJedis();
        List<String> str = jedis.lrange(key, start, end);
        RedisUtil.returnResource(jedis);
        return str;
    }
    /*********************redis list操作结束**************************/

    /**
     * 清空redis 所有数据
     *
     * @return
     */
    public String flushDB() {
        Jedis jedis = RedisUtil.getJedis();
        String str = jedis.flushDB();
        RedisUtil.returnResource(jedis);
        return str;
    }

    /**
     * 查看redis里有多少数据
     */
    public long dbSize() {
        Jedis jedis = RedisUtil.getJedis();
        long len = jedis.dbSize();
        RedisUtil.returnResource(jedis);
        return len;
    }

    /**
     * 检查是否连接成功
     *
     * @return
     */
    public String ping() {
        Jedis jedis = RedisUtil.getJedis();
        String str = jedis.ping();
        RedisUtil.returnResource(jedis);
        return str;
    }

    /**********************redis 订阅 与 推送****************************/

    /**
     * 添加订阅
     * @param listener 监听器
     * @param channelKey 频道key
     */
    public void subscribe(JedisPubSub listener, String channelKey) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.subscribe(listener, channelKey);
        RedisUtil.returnResource(jedis);
    }

    /**
     * 向频道推送消息
     * @param msg 消息内容
     */
    public void publish(String msg) {
        Jedis jedis = RedisUtil.getJedis();
        jedis.publish(RedisSubThread.CHANNEL_KEY, msg);
    }

}

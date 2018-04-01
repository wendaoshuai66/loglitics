package com.lianxing.logistics.service;

import com.lianxing.logistics.util.RedisClient;
import com.lianxing.logistics.util.RedisUtil;
import com.lianxing.logistics.util.date.DateTime;
import org.springframework.stereotype.Service;

@Service("loginService")
public class LoginServiceImpl extends BaseServiceImpl implements LoginService {

    // @Autowired
    // private LoginDaoImpl loginDao;

    /**
     * 根据主key 更新redis存活时间
     *
     * @param key             更新的key
     * @param isAdministrator 是否为超级管理员
     */
    @Override
    public void updateRedisKeyAliveTime(String key, boolean isAdministrator) {
        // 获取到jedis实例
        RedisClient redisClient = new RedisClient();
        // 存入缓存
        if (!redisClient.exists(RedisUtil.REDIS_PREFIX + key)) {
            if (isAdministrator) {
                redisClient.set(RedisUtil.REDIS_PREFIX + key, "administrator");
            } else {
                redisClient.set(RedisUtil.REDIS_PREFIX + key, "true");
            }
        }
        redisClient.expire(RedisUtil.REDIS_PREFIX + key, DateTime.getSecondFromDay(1));
    }
}

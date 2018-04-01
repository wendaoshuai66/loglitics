package com.lianxing.logistics.listener;

import com.lianxing.logistics.thread.RedisSubThread;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * @author: Lin
 * @date: 2018/1/8
 */
public class RedisChannelListener implements ServletContextListener {

    /**
     * 消息订阅线程
     */
    private RedisSubThread subThread = new RedisSubThread();
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // 发布线程启动
        subThread.start();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        subThread.interrupt();
    }
}

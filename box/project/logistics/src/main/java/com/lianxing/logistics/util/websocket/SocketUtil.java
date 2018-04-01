package com.lianxing.logistics.util.websocket;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * @author: Lin
 * @date: 2018/1/6
 */
@Component
@ServerEndpoint("/websocketTest")
public class SocketUtil {
    private Session session;

    private static CopyOnWriteArraySet<SocketUtil> webSocketSet = new CopyOnWriteArraySet<>();

    private static Logger logger = LogManager.getLogger(SocketUtil.class);

    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        webSocketSet.add(this);
        System.out.println("【websocket消息】有新的连接, 总数: " + webSocketSet.size());
        logger.info("【websocket消息】有新的连接, 总数: " + webSocketSet.size());
    }

    @OnClose
    public void onClose() {
        webSocketSet.remove(this);
        logger.info("【websocket消息】连接断开, 总数:" + webSocketSet.size());
    }

    @OnMessage
    public void onMessage(String message) {
        logger.info("【websocket消息】收到客户端发来的消息:" + message);
    }

    public void sendMessage(String message) {
        for (SocketUtil webSocket: webSocketSet) {
            logger.info("【websocket消息】广播消息, message=" + message);
            try {
                webSocket.session.getBasicRemote().sendText(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

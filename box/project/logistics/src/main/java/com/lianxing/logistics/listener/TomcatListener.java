package com.lianxing.logistics.listener;

import com.lianxing.logistics.model.WarrantyNumber;
import com.lianxing.logistics.service.BaseService;
import com.lianxing.logistics.service.WarrantyNumberService;
import com.lianxing.logistics.util.PropertiesUtil;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class TomcatListener implements ServletContextListener {

    WarrantyNumberService warrantyNumberService = null;

    BaseService baseService = null;

    private WebApplicationContext springContext;

    //tomcat启动后就会执行该方法
    @Override
    public void contextInitialized(ServletContextEvent event) {
        springContext = WebApplicationContextUtils.getWebApplicationContext(event.getServletContext());
        if (springContext != null) {
            warrantyNumberService = (WarrantyNumberService) springContext.getBean("warrantyNumberService");
            baseService = (BaseService) springContext.getBean("baseService");
        }
        try {
            // 取出两天的时间（两天运行一次：检查订单是否超时）
            String TimerTime = PropertiesUtil.get("checkRecordIsOrNotOverTime", "/sys_config.properties");
            Timer timer = new Timer();
            timer.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                    System.out.println("[订单管理定时器]: 开启");
                    List<WarrantyNumber> list = warrantyNumberService.getNotEvaluatedWarrantyNumberList();
                    if (list != null && list.size() > 0) {
                        List<WarrantyNumber> resultList = warrantyNumberService.getOverTimeWarrantyNumberList(list);
                        warrantyNumberService.updateOverTimeWarrantyNumberList(resultList);
                    }
                }
            }, new Date(), Long.parseLong(TimerTime));
        } catch (Exception e) {
            System.out.println("[订单管理定时器]: 开启失败");
            e.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {

    }
}

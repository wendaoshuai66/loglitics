package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.FriendLinkDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("friendLinkService")
public class FriendLinkServiceImpl extends BaseServiceImpl implements FriendLinkService {

    @Autowired
    private FriendLinkDaoImpl friendLinkDao;

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String title = request.getParameter("searchObj[title]");// 标题

        String addDateTimeStart = request.getParameter("searchObj[addDateTimeStart]"); // 发布时间 起始
        String addDateTimeEnd = request.getParameter("searchObj[addDateTimeEnd]"); // 发布时间 结束

        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("addStart", addDateTimeStart);
        timeMap.put("addEnd", addDateTimeEnd);

        // HQL语句条件 获取完整列表信息
        Map likePara = new HashMap<String, String>();
        likePara.put("title", title);

        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("timeMap", timeMap);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("friend_link");// 表名
        page.setEntityName("FriendLink");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getFriendLinkAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        return friendLinkDao.getFriendLinkAllCountFromPara(page, para, ifAll);
    }
}

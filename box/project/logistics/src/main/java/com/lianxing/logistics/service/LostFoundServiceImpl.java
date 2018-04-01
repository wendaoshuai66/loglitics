package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.LostFoundDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("lostFoundService")
public class LostFoundServiceImpl extends BaseServiceImpl implements LostFoundService {

    @Autowired
    private LostFoundDaoImpl lostFoundDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String title = request.getParameter("searchObj[title]");// 标题
        String statusId = request.getParameter("searchObj[type]");// 类别
        String author = request.getParameter("searchObj[person][name]");// 联系人
        String userId = request.getParameter("searchObj[person][id]");// 联系人的id
        String approvalStatus = request.getParameter("searchObj[approvalStatus]");// 审核状态
        String dealStatus = request.getParameter("searchObj[dealStatus]");// 交易状态

        String addDateTimeStart = request.getParameter("searchObj[addDateTimeStart]"); // 发布时间 起始
        String addDateTimeEnd = request.getParameter("searchObj[addDateTimeEnd]"); // 发布时间 结束

        if ("2".equals(statusId)) {
            statusId = "0";
        }
        if ("2".equals(approvalStatus)) {
            approvalStatus = "0";
        }
        if ("2".equals(dealStatus)) {
            dealStatus = "0";
        }
        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("addStart", addDateTimeStart);
        timeMap.put("addEnd", addDateTimeEnd);
        // HQL语句条件 获取完整列表信息
        Map likePara = new HashMap<String, String>();
        likePara.put("c.title", title);
        likePara.put("c.person.name", author);
        //
        Map likeParaSql = new HashMap<String, String>();
        likeParaSql.put("title", title);
        likeParaSql.put("person.name", author);
        //
        Map eqPara = new HashMap<String, String>();
        eqPara.put("c.type", statusId);
        eqPara.put("c.approvalStatus", approvalStatus);
        eqPara.put("c.dealStatus", dealStatus);
        eqPara.put("c.person.ifDelete", 0);
        eqPara.put("c.person.status", 1);
        eqPara.put("c.person.id", userId);
        //
        Map<String, Map> paraMap = new HashMap<String, Map>();
        paraMap.put("likePara", likePara);
        paraMap.put("likeParaSql", likeParaSql);
        paraMap.put("eqPara", eqPara);
        paraMap.put("eqParaSql", eqPara);
        paraMap.put("timeMap", timeMap);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("lost_found");// 表名
        page.setEntityName("LostFound");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getLostFoundAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        return lostFoundDao.getLostFoundAllCountFromPara(para, ifAll);
    }

}

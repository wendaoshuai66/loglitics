package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.InforTextDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("inforTextService")
public class InforTextServiceImpl extends BaseServiceImpl implements InforTextService {

    @Autowired
    private InforTextDaoImpl pictureDao;

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String title = request.getParameter("searchObj[title]");// 标题
        String author = request.getParameter("searchObj[author][name]");// 作者
        String authorId = request.getParameter("searchObj[author][id]");// 作者的id
        String approvalStatus = request.getParameter("searchObj[approvalStatus]");// 审核状态

        String addDateTimeStart = request.getParameter("searchObj[addDateTimeStart]"); // 发布时间 起始
        String addDateTimeEnd = request.getParameter("searchObj[addDateTimeEnd]"); // 发布时间 结束
        if ("2".equals(approvalStatus)) {
            approvalStatus = "0";
        }
        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("addStart", addDateTimeStart);
        timeMap.put("addEnd", addDateTimeEnd);
        // HQL语句条件 获取完整列表信息
        Map likePara = new HashMap<String, String>();
        likePara.put("c.title", title);
        likePara.put("c.author.name", author);
        //
        Map likeParaSql = new HashMap<String, String>();
        likeParaSql.put("i.title", title);
        likeParaSql.put("authorName", author);
        //
        Map eqPara = new HashMap<String, String>();
        eqPara.put("c.approvalStatus", approvalStatus);
        eqPara.put("c.author.ifDelete", 0);
        eqPara.put("c.author.status", 1);
        eqPara.put("c.author.id", authorId);
        //
        Map eqParaSql = new HashMap<String, String>();
        eqParaSql.put("i.approvalStatus", approvalStatus);
        eqParaSql.put("u.ifDelete", 0);
        eqParaSql.put("u.status", 1);
        eqParaSql.put("u.id", authorId);
        //
        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("likeParaSql", likeParaSql);
        paraMap.put("eqPara", eqPara);
        paraMap.put("eqParaSql", eqParaSql);
        paraMap.put("timeMap", timeMap);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("infor_text");// 表名
        page.setEntityName("InforText");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getInforTextAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        return pictureDao.getInforTextAllCountFromPara(page, para, ifAll);
    }

}

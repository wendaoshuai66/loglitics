package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.DiaryDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("diaryService")
public class DiaryServiceImpl extends BaseServiceImpl implements DiaryService {

    @Autowired
    private DiaryDaoImpl diaryDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String title = request.getParameter("searchObj[title]");// 标题
        String content = request.getParameter("searchObj[content]");// 内容
        String user = request.getParameter("searchObj[user][name]");// 人员
        String addDateTimeStart = request.getParameter("searchObj[addDateTimeStart]"); // 日志添加时间起始
        String addDateTimeEnd = request.getParameter("searchObj[addDateTimeEnd]"); // 日至添加时间结束
        String status = request.getParameter("searchObj[status]");// 用户状态
        String addUid = request.getParameter("searchObj[user][id]");// 工作日志人员id
        String maintenanceTypeId = request.getParameter("searchObj[user][maintenanceWorker][maintenanceType][id]");// 工种
        // 状态值为隐藏
        if ("2".equals(status)) {
            status = "0";
        }
        // HQL语句条件 获取完整列表信息
        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("addStart", addDateTimeStart);
        timeMap.put("addEnd", addDateTimeEnd);

        Map likePara = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        likePara.put("title", title);
        likePara.put("content", content);
        likePara.put("c.user.name", user);

        eqPara.put("c.status", status);
        eqPara.put("c.user.status", 1);
        eqPara.put("c.user.ifDelete", 0);
        eqPara.put("c.user.maintenanceWorker.department.status", 1);
        eqPara.put("c.user.maintenanceWorker.department.ifDelete", 0);
        eqPara.put("c.user.maintenanceWorker.department.campus.status", 1);
        eqPara.put("c.user.maintenanceWorker.department.campus.ifDelete", 0);
        eqPara.put("c.user.maintenanceWorker.maintenanceType.status", 1);
        eqPara.put("c.user.maintenanceWorker.maintenanceType.ifDelete", 0);
        eqPara.put("c.user.id", addUid);
        eqPara.put("c.user.maintenanceWorker.maintenanceType.id", maintenanceTypeId);

        Map likeParaSql = new HashMap<String, String>();
        likeParaSql.put("w.title", title);
        likeParaSql.put("u.name", user);

        // SQL语句条件 获取完整列表信息
        Map eqParaSql = new HashMap<String, String>();
        eqParaSql.put("w.status", status);
        eqParaSql.put("u.status", 1);
        eqParaSql.put("u.ifDelete", 0);
        eqParaSql.put("d.status", 1);
        eqParaSql.put("d.ifDelete", 0);
        eqParaSql.put("c.status", 1);
        eqParaSql.put("c.ifDelete", 0);
        eqParaSql.put("t.status", 1);
        eqParaSql.put("t.ifDelete", 0);
        eqParaSql.put("u.id", addUid);
        eqParaSql.put("t.id", maintenanceTypeId);

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
        page.setTableName("work_diary");// 表名
        page.setEntityName("WorkDiary");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getDiaryAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        return diaryDao.getDiaryAllCountFromPara(page, para, ifAll);
    }

}

package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.PositionDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("positionService")
public class PositionServiceImpl extends BaseServiceImpl implements PositionService {

    @Autowired
    private PositionDaoImpl positionDao;

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("position");// 表名
        page.setEntityName("Position");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getPositionAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return positionDao.getPositionAllCountFromPara(para, ifAll);
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {

        String name = request.getParameter("searchObj[name]");// 姓名
        String cardDisplay = request.getParameter("searchObj[cardDisplay]");// 卡片显示状态
        // 状态值为隐藏
        if ("2".equals(cardDisplay)) {
            cardDisplay = "0";
        }
        Map likePara = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        likePara.put("c.name", name);
        eqPara.put("c.cardDisplay", cardDisplay);

        Map likeParaSql = new HashMap<String, String>();
        Map eqParaSql = new HashMap<String, String>();
        likeParaSql.put("c.name", name);
        eqParaSql.put("c.cardDisplay", cardDisplay);

        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("eqPara", eqPara);
        paraMap.put("likeParaSql", likeParaSql);
        paraMap.put("eqParaSql", eqParaSql);
        return paraMap;
    }

}

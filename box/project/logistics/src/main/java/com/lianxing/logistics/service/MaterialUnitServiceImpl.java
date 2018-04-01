package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.MaterialUnitDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("materialUnitService")
public class MaterialUnitServiceImpl extends BaseServiceImpl implements MaterialUnitService {

    @Autowired
    private MaterialUnitDaoImpl materialUnitDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String name = request.getParameter("searchObj[name]");// 单位名称
        String status = request.getParameter("searchObj[status]");// 单位状态
        // 状态值为隐藏
        if ("2".equals(status)) {
            status = "0";
        }
        Map likePara = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        likePara.put("c.name", name);
        eqPara.put("c.status", status);

        Map likeParaSql = new HashMap<String, String>();
        Map eqParaSql = new HashMap<String, String>();
        likeParaSql.put("c.name", name);
        eqParaSql.put("c.status", status);

        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("eqPara", eqPara);
        paraMap.put("likeParaSql", likeParaSql);
        paraMap.put("eqParaSql", eqParaSql);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("material_unit");// 表名
        page.setEntityName("MaterialUnit");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaterialUnitAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return materialUnitDao.getMaterialUnitAllCountFromPara(para, ifAll);
    }

}

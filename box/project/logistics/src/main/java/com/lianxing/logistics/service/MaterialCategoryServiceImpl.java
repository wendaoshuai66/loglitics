package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.MaterialCategoryDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("materialCategoryService")
public class MaterialCategoryServiceImpl extends BaseServiceImpl implements MaterialCategoryService {

    @Autowired
    private MaterialCategoryDaoImpl materialCategoryDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String name = request.getParameter("searchObj[name]");// 类别名称
        String status = request.getParameter("searchObj[status]");// 类别状态
        // 状态值为隐藏
        if ("2".equals(status)) {
            status = "0";
        }
        Map likePara = new HashMap<>();
        Map eqPara = new HashMap<>();
        likePara.put("c.name", name);
        eqPara.put("c.status", status);

        Map likeParaSql = new HashMap<>();
        Map eqParaSql = new HashMap<>();
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
        page.setTableName("material_category");// 表名
        page.setEntityName("MaterialCategory");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaterialCategorAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return materialCategoryDao.getMaterialCategorAllCountFromPara(para, ifAll);
    }

}

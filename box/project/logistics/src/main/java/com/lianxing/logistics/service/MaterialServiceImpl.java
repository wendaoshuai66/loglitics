package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.MaterialDaoImpl;
import com.lianxing.logistics.model.Material;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("materialService")
public class MaterialServiceImpl extends BaseServiceImpl implements MaterialService {

    @Autowired
    private MaterialDaoImpl materialDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String name = request.getParameter("searchObj[name]");// 物料名称
        String materialCategoryId = request.getParameter("searchObj[materialCategory][id]");// 物料类别
        String status = request.getParameter("searchObj[status]");// 物料状态
        // 状态值为隐藏
        if ("2".equals(status)) {
            status = "0";
        }
        Map likePara = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        likePara.put("c.name", name);
        eqPara.put("c.materialCategory.id", materialCategoryId);
        eqPara.put("c.materialCategory.status", 1);
        eqPara.put("c.materialCategory.ifDelete", 0);
        eqPara.put("c.materialUnit.status", 1);
        eqPara.put("c.materialUnit.ifDelete", 0);
        eqPara.put("c.status", status);

        Map likeParaSql = new HashMap<String, String>();
        Map eqParaSql = new HashMap<String, String>();
        likeParaSql.put("c.name", name);
        eqParaSql.put("m.id", materialCategoryId);
        eqParaSql.put("m.status", 1);
        eqParaSql.put("m.ifDelete", 0);
        eqParaSql.put("n.status", 1);
        eqParaSql.put("n.ifDelete", 0);
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
        page.setTableName("material");// 表名
        page.setEntityName("Material");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaterialAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return materialDao.getMaterialAllCountFromPara(para, ifAll);
    }

    @Override
    public <T> List<T> checkMaterialLessAlarmValue(String entityName) {
        return materialDao.checkMaterialLessAlarmValue(entityName);
    }

    @Override
    public List<Material> getSelectAllInfo() {
        return materialDao.getSelectAllInfo();
    }
}
package com.lianxing.logistics.service;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.lianxing.logistics.dao.StorageDaoImpl;
import com.lianxing.logistics.util.Page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("storageService")
public class StorageServiceImpl extends BaseServiceImpl implements StorageService {

    @Autowired
    private StorageDaoImpl storageDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String materialName = request.getParameter("searchObj[material][name]");// 物料名称
        String materialCategoryId = request.getParameter("searchObj[material][materialCategory][id]");// 物料类别
        String storageDocuments = request.getParameter("searchObj[storageDocuments]");// 入库单号
        String storageDateTimeStart = request.getParameter("searchObj[storageDateTimeStart]"); // 入库时间起始
        String storageDateTimeEnd = request.getParameter("searchObj[storageDateTimeEnd]"); // 入库时间结束
        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("storageStart", storageDateTimeStart);
        timeMap.put("storageEnd", storageDateTimeEnd);
        // HQL语句条件 获取完整列表信息
        Map likePara = new HashMap<String, String>();
        likePara.put("c.material.name", materialName);
        likePara.put("c.storageDocuments", storageDocuments);
        //
        Map likeParaSql = new HashMap<String, String>();
        likeParaSql.put("material.name", materialName);
        likeParaSql.put("storageDocuments", storageDocuments);
        //
        Map eqPara = new HashMap<String, String>();
        eqPara.put("c.material.materialCategory.id", materialCategoryId);
        //
        Map eqParaSql = new HashMap<String, String>();
        eqParaSql.put("material_category.id", materialCategoryId);
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
        page.setTableName("storage");// 表名
        page.setEntityName("Storage");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getStorageAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return storageDao.getStorageAllCountFromPara(para, ifAll);
    }
}

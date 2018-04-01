package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.StockRemovalDaoImpl;
import com.lianxing.logistics.model.StockRemoval;
import com.lianxing.logistics.util.Page;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("stockRemovalService")
public class StockRemovalServiceImpl extends BaseServiceImpl implements StockRemovalService {

    @Autowired
    private StockRemovalDaoImpl stockRemovalDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String materialName = request.getParameter("searchObj[material][name]");// 物料名称
        String materialCategoryId = request.getParameter("searchObj[material][materialCategory][id]");// 物料类别
        String warrantyNumber = request.getParameter("searchObj[warrantyNumber][maintenanceNumber]");// 维修单号
        String stockRemovalDateTimeStart = request.getParameter("searchObj[stockRemovalDateStart]"); // 出库时间起始
        String stockRemovalDateTimeEnd = request.getParameter("searchObj[stockRemovalDateEnd]"); // 出库时间结束
        String workerUid = request.getParameter("searchObj[warrantyNumber][maintenanceStaff][id]");// 领用人员
        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("stockRemovalStart", stockRemovalDateTimeStart);
        timeMap.put("stockRemovalEnd", stockRemovalDateTimeEnd);
        // HQL语句条件 获取完整列表信息
        Map likePara = new HashMap<String, String>();
        likePara.put("c.material.name", materialName);
        likePara.put("c.warrantyNumber.maintenanceNumber", warrantyNumber);
        //
        Map likeParaSql = new HashMap<String, String>();
        likeParaSql.put("material.name", materialName);
        likeParaSql.put("warrantyNumber.maintenanceNumber", warrantyNumber);
        //
        Map eqPara = new HashMap<String, String>();
        eqPara.put("c.material.materialCategory.id", materialCategoryId);
        eqPara.put("c.warrantyNumber.maintenanceStaff.id", workerUid);
        //
        Map eqParaSql = new HashMap<String, String>();
        eqParaSql.put("material_category.id", materialCategoryId);
        eqParaSql.put("maintenanceStaff.id", workerUid);
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
        page.setTableName("stock_removal");// 表名
        page.setEntityName("StockRemoval");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getStockRemovalAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return stockRemovalDao.getStockRemovalAllCountFromPara(para, ifAll);
    }

    @Override
    public String getStockRemovalMaterialNameStrFromWarrantyNumberId(Long warrantyNumberId) {
        List<StockRemoval> list = stockRemovalDao.getStockRemovalMaterialList(warrantyNumberId);
        Map<String, Integer> map = new HashMap<>();
        for (StockRemoval stockRemoval : list) {
            String name = stockRemoval.getMaterial().getName();
            Integer value = map.get(name);
            if (value == null) {
                map.put(name, 1);
            } else {
                map.put(name, 1 + value);
            }
        }
        StringBuilder builder = new StringBuilder();
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            String key = entry.getKey();
            Integer value = entry.getValue();
            builder.append("[名称 : ").append(key).append(" , 个数 : ").append(value);
            builder.append("]#");
        }
        String temp = builder.toString();
        if (StringUtils.isNotBlank(temp)) {
            return temp.substring(0, temp.length() - 1);
        }
        return "noData";
    }

    @Override
    public List<StockRemoval> getStockRemovalListByWarrantyNumber(Long id) {
        return stockRemovalDao.getStockRemovalMaterialList(id);
    }

}

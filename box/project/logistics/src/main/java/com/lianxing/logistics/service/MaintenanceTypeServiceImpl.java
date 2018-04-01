package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.MaintenanceTypeDaoImpl;
import com.lianxing.logistics.model.MaintenanceCategory;
import com.lianxing.logistics.model.MaintenanceType;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service("maintenanceTypeService")
public class MaintenanceTypeServiceImpl extends BaseServiceImpl implements MaintenanceTypeService {

    @Autowired
    private MaintenanceTypeDaoImpl maintenanceTypeDao;

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("maintenance_type");// 表名
        page.setEntityName("MaintenanceType");// 实体名
        return page;
    }

    @Override
    public List<Map<String, Object>> getThisInfo(List<MaintenanceCategory> list) {
        LinkedHashSet<Long> typeSetId = new LinkedHashSet<>();
        LinkedHashSet<String> typeSetName = new LinkedHashSet<>();
        for (MaintenanceCategory maintenanceCategory : list) {
            if (maintenanceCategory.getStatus() == 1 && maintenanceCategory.getIfDelete() == 0) {
                MaintenanceType type = maintenanceCategory.getMaintenanceType();
                if (type.getStatus() == 1 && type.getIfDelete() == 0) {
                    // 把工种id放入
                    typeSetId.add(maintenanceCategory.getMaintenanceType().getId());
                    // 把工种name放入
                    typeSetName.add(maintenanceCategory.getMaintenanceType().getName());
                }
            }
        }
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (int i = 0; i < typeSetId.size(); i++) {
            Map<String, Object> resultMap = new HashMap<>();
            Long id = (typeSetId.toArray(new Long[]{}))[i];
            List<Map<String, String>> tempList = new ArrayList<>();
            for (MaintenanceCategory category : list) {
                if (Objects.equals(category.getMaintenanceType().getId(), id)) {
                    Map<String, String> tempMap = new HashMap<>();
                    Long tempCategoryId = category.getId();
                    String tempCategoryName = category.getName();
                    tempMap.put("id", tempCategoryId.toString());
                    tempMap.put("name", tempCategoryName);
                    tempList.add(tempMap);
                }
            }
            resultMap.put("id", id.toString());
            resultMap.put("maintenanceCategory", tempList);
            resultMap.put("name", (typeSetName.toArray(new String[]{}))[i]);
            resultList.add(resultMap);
        }
        return resultList;
    }

    @Override
    public List<Map<String, Object>> getThisInfoList(List<MaintenanceCategory> list) {
        LinkedHashSet<Long> typeSetId = new LinkedHashSet<>();
        LinkedHashSet<String> typeSetName = new LinkedHashSet<>();
        for (MaintenanceCategory maintenanceCategory : list) {
            // 把工种id放入
            typeSetId.add(maintenanceCategory.getMaintenanceType().getId());
            // 把工种name放入
            typeSetName.add(maintenanceCategory.getMaintenanceType().getName());
        }
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (int i = 0; i < typeSetId.size(); i++) {
            Map<String, Object> resultMap = new HashMap<>();
            Long id = (typeSetId.toArray(new Long[]{}))[i];
            List<Map<String, String>> tempList = new ArrayList<>();
            for (MaintenanceCategory category : list) {
                if (Objects.equals(category.getMaintenanceType().getId(), id)) {
                    Map<String, String> tempMap = new HashMap<>();
                    Long tempCategoryId = category.getId();
                    String tempCategoryName = category.getName();
                    tempMap.put("id", tempCategoryId.toString() + "_");
                    tempMap.put("text", tempCategoryName);
                    tempList.add(tempMap);
                }
            }
            resultMap.put("id", id.toString());
            resultMap.put("children", tempList);
            resultMap.put("text", (typeSetName.toArray(new String[]{}))[i]);
            resultList.add(resultMap);
        }
        return resultList;
    }

    @Override
    public Long getMaintenanceTypeAllCountFromPara(boolean ifAll) {
        return maintenanceTypeDao.getMaintenanceTypeAllCountFromPara(ifAll);
    }

}

package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.MaintenanceAreaDaoImpl;
import com.lianxing.logistics.model.Campus;
import com.lianxing.logistics.model.MaintenanceArea;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service("maintenanceAreaService")
public class MaintenanceAreaServiceImpl extends BaseServiceImpl implements MaintenanceAreaService {

    @Autowired
    private MaintenanceAreaDaoImpl maintenanceAreaDao;

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("maintenance_area");// 表名
        page.setEntityName("MaintenanceArea");// 实体名
        return page;
    }

    @Override
    public void deleteAreaWorkerFormAreaId(Long id) {
        maintenanceAreaDao.deleteAreaWorkerFormAreaId(id);
    }

    @Override
    public void insertAreaWorker(Long areaId, Long typeId) {
        maintenanceAreaDao.insertAreaWorker(areaId, typeId);

    }

    @Override
    public Map<Object, JSONArray> getMaintenanceTypeFromAreaId(Long id) {
        Map<Object, JSONArray> resultMap = new HashMap<>();
        List<Map<String, Object>> list = maintenanceAreaDao.getMaintenanceTypeFromAreaId(id);
        for (Map<String, Object> map : list) {
            Object userId = map.get("userId");
            Object typeId = map.get("typeId");
            Set<Object> keySet = resultMap.keySet();
            boolean flag = false;
            for (Object object : keySet) {
                if (object == typeId) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                JSONArray userArray = resultMap.get(typeId);
                userArray.add(userId);
            } else {
                JSONArray userArray = new JSONArray();
                userArray.add(userId);
                resultMap.put(typeId, userArray);
            }
        }
        return resultMap;
    }

    @Override
    public List<Map<String, Object>> getThisInfo(List<MaintenanceArea> list) {
        LinkedHashSet<Long> campusIdSet = new LinkedHashSet<>();
        LinkedHashSet<String> campusNameSet = new LinkedHashSet<>();
        for (MaintenanceArea maintenanceArea : list) {
            Campus campus = maintenanceArea.getCampus();
            // 把校园id放入
            campusIdSet.add(campus.getId());
            // 把校园name放入
            campusNameSet.add(campus.getName());
        }
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (int i = 0; i < campusIdSet.size(); i++) {
            Map<String, Object> resultMap = new HashMap<>();
            Long id = (campusIdSet.toArray(new Long[]{}))[i];
            List<Map<String, String>> _list = new ArrayList<>();
            for (MaintenanceArea mainArea : list) {
                // 相等的话，就开始封装list
                if (Objects.equals(mainArea.getCampus().getId(), id)) {
                    Map<String, String> _map = new HashMap<>();
                    Long _mainAreaId = mainArea.getId();
                    String _mainAreaName = mainArea.getName();
                    _map.put("id", _mainAreaId.toString());
                    _map.put("name", _mainAreaName);
                    _list.add(_map);
                }
            }
            resultMap.put("id", id.toString());
            resultMap.put("maintenanceArea", _list);
            resultMap.put("name", (campusNameSet.toArray(new String[]{}))[i]);
            resultList.add(resultMap);
        }
        return resultList;
    }

    @Override
    public List<Map<String, Object>> getThisInfoList(List<MaintenanceArea> list) {
        LinkedHashSet<Long> campusIdSet = new LinkedHashSet<>();
        LinkedHashSet<String> campusNameSet = new LinkedHashSet<>();
        for (MaintenanceArea maintenanceArea : list) {
            // 把校园id放入
            campusIdSet.add(maintenanceArea.getCampus().getId());
            // 把校园name放入
            campusNameSet.add(maintenanceArea.getCampus().getName());
        }
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (int i = 0; i < campusIdSet.size(); i++) {
            Map<String, Object> resultMap = new HashMap<>();
            Long id = (campusIdSet.toArray(new Long[]{}))[i];
            List<Map<String, String>> _list = new ArrayList<>();
            for (MaintenanceArea mainArea : list) {
                // 相等的话，就开始封装list
                if (Objects.equals(mainArea.getCampus().getId(), id)) {
                    Map<String, String> _map = new HashMap<>();
                    Long _mainAreaId = mainArea.getId();
                    String _mainAreaName = mainArea.getName();
                    _map.put("id", _mainAreaId.toString() + "_");
                    _map.put("text", _mainAreaName);
                    _list.add(_map);
                }
            }
            resultMap.put("id", id.toString());
            resultMap.put("children", _list);
            resultMap.put("text", (campusNameSet.toArray(new String[]{}))[i]);
            resultList.add(resultMap);
        }
        return resultList;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String statusId = request.getParameter("searchObj[status][id]");// 显示状态

        // 状态值为禁用
        if ("2".equals(statusId)) {
            statusId = "0";
        }
        Map likePara = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        if (statusId != null) {
            eqPara.put("c.status", statusId);
        }
        eqPara.put("c.campus.ifDelete", 0);
        eqPara.put("c.campus.status", 1);
        eqPara.put("c.department.ifDelete", 0);
        eqPara.put("c.department.status", 1);

        Map likeParaSql = new HashMap<String, String>();
        Map eqParaSql = new HashMap<String, String>();
        if (statusId != null) {
            eqParaSql.put("c.status", statusId);
        }
        eqParaSql.put("d.ifDelete", 0);
        eqParaSql.put("d.`status`", 1);
        eqParaSql.put("t.ifDelete", 0);
        eqParaSql.put("t.`status`", 1);

        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("eqPara", eqPara);
        paraMap.put("likeParaSql", likeParaSql);
        paraMap.put("eqParaSql", eqParaSql);
        return paraMap;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getMaintenanceAreaAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return maintenanceAreaDao.getMaintenanceAreaAllCountFromPara(para, ifAll);
    }

    @SuppressWarnings("rawtypes")
    @Override
    public List getMaintenanceAreaIdsList() {
        return maintenanceAreaDao.getMaintenanceAreaIdsList();
    }

    @Override
    public List<MaintenanceArea> getMaintenanceAreaForCampus() {// 过滤没有父部门的部门
        return maintenanceAreaDao.getMaintenanceAreaForCampus();
    }

    @Override
    public List<MaintenanceArea> getMaintenanceAreraList(String ignoreDeleteAndStatus) {
        return maintenanceAreaDao.getMaintenanceAreraList(ignoreDeleteAndStatus);
    }

}

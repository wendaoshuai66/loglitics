package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.DepartmentDaoImpl;
import com.lianxing.logistics.model.Department;
import com.lianxing.logistics.model.DepartmentTree;
import com.lianxing.logistics.model.DepartmentTypeDuty;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service("departmentService")
public class DepartmentServiceImpl extends BaseServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentDaoImpl departmentDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String name = request.getParameter("searchObj[name]");// 部门名称
        String status = request.getParameter("searchObj[status]");// 显示状态
        String ifLogistics = request.getParameter("searchObj[ifLogistics]");// 只查询后勤部门或非后勤部门
        // HQL
        Map likePara = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        // SQL
        Map likeParaSql = new HashMap<String, String>();
        Map eqParaSql = new HashMap<String, String>();
        // 状态值为隐藏
        if ("2".equals(status)) {
            status = "0";
        }
        // 只查询后勤部门
        if ("1".equals(ifLogistics)) {
            eqPara.put("c.ifLogistics", 1);
            eqParaSql.put("c.ifLogistics", 1);
        }
        // 只查询非后勤部门
        else if ("0".equals(ifLogistics)) {
            eqPara.put("c.ifLogistics", 0);
            eqParaSql.put("c.ifLogistics", 0);
        }

        likePara.put("c.name", name);
        eqPara.put("c.status", status);
        eqPara.put("c.campus.ifDelete", 0);
        eqPara.put("c.campus.status", 1);


        likeParaSql.put("c.name", name);
        eqParaSql.put("c.status", status);
        eqParaSql.put("d.ifDelete", 0);
        eqParaSql.put("d.`status`", 1);

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
        page.setTableName("department");// 表名
        page.setEntityName("Department");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getDepartmentAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return departmentDao.getDepartmentAllCountFromPara(para, ifAll);
    }

    @Override
    public List<Department> getSelectListFromCampusId(String campusId) {
        return departmentDao.getSelectListFromCampusId(campusId);
    }

    @Override
    public List<DepartmentTree> getDepartmentTreeFromDepartmentList(List<Department> list) {
        // 用于记录部门id与对应的校区名称
        Map<Long, String> campusNameMap = new HashMap<>();
        List<DepartmentTree> trees = new ArrayList<>();
        Set<String> campusNameSet = new LinkedHashSet<>();
        List<DepartmentTree> returnTree = new ArrayList<>();
        for (Department dep : list) {
            DepartmentTree tree = new DepartmentTree();
            tree.setId(dep.getId());
            tree.setText(dep.getName());
            // 记录对应关系
            campusNameMap.put(dep.getId(), dep.getCampus().getName());
            // 记录campus个数
            campusNameSet.add(dep.getCampus().getName());
            Department parent = dep.getParent();
            if (parent != null) {
                tree.setParentId(dep.getParent().getId());
            } else {
                tree.setParentId(-1L);
            }
            trees.add(tree);
        }
        // 取得存在的校区个数
        int campusCount = 1;
        for (String campus : campusNameSet) {
            DepartmentTree rootTree = new DepartmentTree();
            rootTree.setParentId(-1L);
            rootTree.setId(-1000L - campusCount);
            rootTree.setText(campus);
            campusCount++;
            returnTree.add(rootTree);
        }
        // 遍历完成标志
        boolean flag = false;
        while (!flag) {
            List<Long> ids = new ArrayList<>();
            // 取出trees中所有的id
            Set<Long> set = new HashSet<>();
            for (DepartmentTree tree : trees) {
                ids.add(tree.getParentId());
                set.add(tree.getParentId());
            }
            // 只剩下根节点
            if (set.size() == 1) {
                flag = true;
            } else {
                long deadCycleCount = 0;
                double maxCycleCount = Math.pow(trees.size(), 2);
                for (int i = 0; i < trees.size() && !flag; i++) {
                    // 如果自己的id不属于当前的父id队列，则说明自己为末节点，且根节点不需要处理
                    if (Collections.frequency(ids, trees.get(i).getId()) == 0 && trees.get(i).getParentId() != -1) {
                        for (int j = 0; j < trees.size() && !flag; j++) {
                            // 死循环判断,trees 双层循环 已经遍历一遍
                            if (deadCycleCount > maxCycleCount) {
                                flag = true;
                            } else {
                                deadCycleCount++;
                            }
                            if (Objects.equals(trees.get(i).getParentId(), trees.get(j).getId())) {
                                trees.get(j).getChildren().add(trees.get(i));
                                trees.remove(i);
                                // 需将循环计数器重置
                                j = i = 0;
                            }
                        }
                    }
                }
            }
        }
        for (int i = 0; i < trees.size(); i++) {
            for (int j = 0; j < returnTree.size(); j++) {
                Long id = trees.get(i).getId();
                // 取出对应的校区名称
                String campusName = campusNameMap.get(id);
                DepartmentTree departmentTree = returnTree.get(j);
                if (departmentTree.getText().equals(campusName)) {
                    DepartmentTree childTree = trees.get(i);
                    childTree.setParentId(departmentTree.getId());
                    departmentTree.getChildren().add(trees.get(i));
                }
            }
        }
        return returnTree;
    }

    @Override
    public List<JSONObject> getSelectTreeFromList(List<Department> list) {
        List<JSONObject> resultList = new ArrayList<>();
        // 遍历全部的list 找出所有最根层的部门对象，并放入List<JSONObject>
        List<Department> removeList = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Department dep = list.get(i);
            if (dep.getParent() == null) {
                JSONObject obj = new JSONObject();
                obj.put("id", dep.getId());
                obj.put("name", dep.getName());
                obj.put("treeLevel", 0);
                obj.put("ifLogistics", dep.getIfLogistics());
                resultList.add(obj);
                removeList.add(dep);
            }
        }
        // 原始list 删除掉最根层部门对象 并清空掉缓存删除 部门的list
        list.removeAll(removeList);
        removeList.clear();
        while (list.size() != 0) {
            // 记录插入的位置
            Integer insertIndex = null;
            JSONObject obj = new JSONObject();
            // 在剩余的部门对象中查找 部门对象的 父部门为已找出对象的结构
            boolean state = true;
            for (int i = 0; i < list.size() && state; i++) {
                for (int j = 0; j < resultList.size() && state; j++) {
                    // 如果找到父子关系
                    Department dep = list.get(i);
                    Long parentId = dep.getParent().getId();
                    Long id = Long.parseLong(resultList.get(j).get("id").toString());
                    if (Objects.equals(parentId, id)) {
                        // 记录父部门的list位置
                        insertIndex = j + 1;
                        // 根据父treeLevel 得出自己的level
                        Integer treeLevel = Integer.parseInt(resultList.get(j).get("treeLevel").toString()) + 1;
                        removeList.add(dep);
                        obj.put("id", dep.getId());
                        obj.put("name", dep.getName());
                        obj.put("treeLevel", treeLevel);
                        obj.put("ifLogistics", dep.getIfLogistics());
                        obj.put("parentId", dep.getParent().getId());
                        // 用于跳出多重循环
                        state = false;
                    }
                }
            }
            list.removeAll(removeList);
            if (insertIndex != null) {
                resultList.add(insertIndex, obj);
            }
        }
        return resultList;
    }

    @Override
    public JSONArray getDutyInfoFromDepartmentList(List<Department> list) {
        JSONArray resultArray = new JSONArray();
        for (Department department : list) {
            List<DepartmentTypeDuty> dutyList = departmentDao.getDepartmentTypeDutyFromDepartmentId(department.getId());
            JSONArray typeNameList = new JSONArray();
            JSONArray dateStrList = new JSONArray();
            for (DepartmentTypeDuty duty : dutyList) {
                String typeName = duty.getMaintenanceType().getName();
                String dateStr = duty.getDutyDate();
                typeNameList.add(typeName);
                dateStrList.add(dateStr);
            }
            JSONObject departmentObject = JSONObject.fromObject(department, JsonUtil.jsonConfig("dateTime"));
            departmentObject.put("typeList", getStrFromList(typeNameList));
            departmentObject.put("dateStr", getStrFromList(dateStrList));
            resultArray.add(departmentObject);
        }
        return resultArray;
    }

    @Override
    public List<Department> getDepartmentForCampus() {
        return departmentDao.getDepartmentForCampus();
    }

    @Override
    public void getUpdateListStatus(Integer parameter, List<Department> list) {
        for (Department department : list) {
            department.setStatus(parameter);
            Long id = department.getId();
            List<Department> departmentList = departmentDao.getDepartmentByParentId(id);
            if (departmentList.size() > 0) {
                getUpdateListStatus(parameter, departmentList);
            }
        }
        departmentDao.updateAll(list);
    }

    @Override
    public List<Department> getDepartmentByParentId(Long id) {
        return departmentDao.getDepartmentByParentId(id);
    }

    /**
     * 由于dataTables 详情会自行给 转成字符串 ,所以集合格式都会显示[object] ,需要将集合对象处理
     *
     * @param list 集合对象
     * @return 固定格式的字符串
     */
    private String getStrFromList(JSONArray list) {
        if (list == null || list.size() == 0) {
            return "";
        }
        int count = 1;
        StringBuilder sb = new StringBuilder();
        for (Object o : list) {
            sb.append(count).append(" : ").append(o).append("  #  ");
            count++;
        }
        String s = sb.toString();
        String resultStr = s.substring(0, s.length() - 3);
        return resultStr;
    }
}

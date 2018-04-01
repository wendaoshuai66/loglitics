package com.lianxing.logistics.controller.system;

import com.lianxing.logistics.controller.BaseController;
import com.lianxing.logistics.model.Department;
import com.lianxing.logistics.model.DepartmentTree;
import com.lianxing.logistics.service.DepartmentServiceImpl;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.HttpUtil;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Controller
public class DepartmentController extends BaseController {

    private static Logger logger = LogManager.getLogger(DepartmentController.class);

    @Autowired
    private DepartmentServiceImpl departmentService;

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/getDepartmentList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getDepartmentList";
        logger.info("[start] " + apiName);
        try {
            Page page = departmentService.getPageInfo(request);
            Map<String, Map> paraMap = departmentService.getSeachMapInfo(request);
            List<Department> departments = departmentService.getList(page, paraMap, true);
            // 将最顶级的部门的父部门名称设置为'-'，避免dataTables报错
            for (Department department : departments) {
                if (department.getParent() == null) {
                    Department de = new Department();
                    de.setName("-");
                    department.setParent(de);
                }
            }
            Long totalRecords;
            // 还需要部门关联下的 工种以及设置值班的情况 ([工种名称: 设置值班表的年月])
            // eq: [{工种1: 2017-10,2017-11},{工种2:2017-09,2017-10}]
            if ("true".equals(request.getParameter("searchObj[getDutyInfo]"))) {
                totalRecords = departmentService.getDepartmentAllCountFromPara(paraMap, false);
                JSONArray list = departmentService.getDutyInfoFromDepartmentList(departments);
                json = getTableData(list, totalRecords);
            } else {
                totalRecords = departmentService.getDepartmentAllCountFromPara(paraMap, true);
                json = getTableData(departments, totalRecords);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    // 部门下拉框数据(根据传入的校区id,且只显示状态为'启用')
    @RequestMapping(value = "/getDepartmentSelectList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getDepartmentSelectList(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "getDepartmentSelectList";
        logger.info("[start] " + apiName);
        try {
            String campusId = request.getParameter("campusId");
            String ifLogistics = request.getParameter("ifLogistics");
            String getAll = request.getParameter("getAll");
            String ignoreDeleteAndStatus = request.getParameter("ignoreDeleteAndStatus");
            List<Department> departments;
            // 是否忽略校区Id,直接取全部
            if ("true".equals(getAll)) {
                departments = departmentService.getAll(false, "Department", ignoreDeleteAndStatus);
            } else {
                departments = departmentService.getSelectListFromCampusId(campusId);
            }
            // 如果只取维修部门
            if ("1".equals(ifLogistics)) {
                List<Department> tempList = filterIfLogistics(1, departments);
                departments.clear();
                departments.addAll(tempList);
            }
            // 只取非维修部门
            else if ("0".equals(ifLogistics)) {
                List<Department> tempList = filterIfLogistics(0, departments);
                departments.clear();
                departments.addAll(tempList);
            }
            if (!"true".equals(ignoreDeleteAndStatus)) {
                List<JSONObject> selectTreeFromList = departmentService.getSelectTreeFromList(departments);
                json.put("data", JSONArray.fromObject(selectTreeFromList, JsonUtil.jsonConfig("dateTime")));
            } else {
                json.put("data", JSONArray.fromObject(departments, JsonUtil.jsonConfig("dateTime")));
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    private List<Department> filterIfLogistics(int flag, List<Department> originList) {
        List<Department> tempList = new ArrayList<>();
        for (Department department : originList) {
            if (department.getIfLogistics() == flag) {
                tempList.add(department);
            }
        }
        return tempList;
    }

    @RequestMapping(value = "/checkRepeatDepartment", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> checkRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "checkRepeatDepartment";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info(requestObject);
            // 为空(页面刚由有值变为null)，不进行校验操作
            if (requestObject.size() == 0) {
                HttpHeaders headers = HttpUtil.getHttpHeaders();
                return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
            }
            Department department;
            department = JsonUtil.jsonToObject(Department.class, requestObject.toString());
            logger.info(department);
            HashMap<String, Object> checkMap = new HashMap<>();
            checkMap.put("name", department.getName());
            checkMap.put("campus.id", department.getCampus().getId());
            boolean repeat = departmentService.checkRepeat("Department", checkMap, department.getId());
            if (!repeat) {
                json.put("status", Const.REPEAT);
            } else {
                json.put("status", Const.NOREPEAT);
            }
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    /**
     * 添加/修改部门信息
     *
     * @param request
     * @throws Exception
     */
    @Transactional
    @RequestMapping(value = "/saveDepartment", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> save(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "saveDepartment";
        logger.info("[start]" + apiName);
        try {
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            logger.info("[requestObject]" + requestObject);
            Department department;
            department = JsonUtil.jsonToObject(Department.class, requestObject.toString());
            // 当为一级节点时
            if (department.getParent().getId() == null || department.getParent().getId() == 0L) {
                department.setParent(null);
            }
            logger.info(department);
            if (department.getId() == null) {
                departmentService.save(department);
            } else {
                department.setChildren(Collections.emptySet());
                department.setUpdateDateTime(new Date());
                Integer parameter = department.getStatus();
                departmentService.update(department);
                List<Department> list = new ArrayList<>();
                list.add(department);
                departmentService.getUpdateListStatus(parameter, list);
            }
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @Transactional
    @RequestMapping(value = "/changeDepartmentStatus", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> changeStatus(@RequestParam("statusType") String statusType,
                                               @RequestParam("id") String id,
                                               HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String apiName = "changeDepartmentStatus";
        logger.info("[start]" + apiName);
        try {
            Department department = departmentService.getById(Department.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = department.getStatus() == 1 ? 0 : 1;
                }
                department.setStatus(parameter);
                List<Department> list = departmentService.getDepartmentByParentId(Long.parseLong(id));
                departmentService.getUpdateListStatus(parameter, list);
            }
            department.setUpdateDateTime(new Date());
            departmentService.update(department);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    @Transactional
    @RequestMapping(value = "/deleteDepartment", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> delete(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        String apiName = "deleteDepartment";
        logger.info("[start]" + apiName);
        try {
            Department department = departmentService.getById(Department.class, Long.parseLong(id));
            department.setIfDelete(1);
            departmentService.update(department);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }

    // 部门下拉框数据(根据传入的校区id,且只显示状态为'启用')
    @RequestMapping(value = "/getDepartmentTreeList", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getDepartmentTreeList() {
        JSONArray resultData = new JSONArray();
        String apiName = "getDepartmentTreeList";
        List<DepartmentTree> departmentTree;
        logger.info("[start] " + apiName);
        try {
            List<Department> departments;
            departments = departmentService.getDepartmentForCampus();
            departmentTree =
                    departmentService.getDepartmentTreeFromDepartmentList(departments);
            resultData = JSONArray.fromObject(departmentTree, JsonUtil.jsonConfig("dateTime"));
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            e.printStackTrace();
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(resultData.toString(), headers, HttpStatus.OK);
    }

    /**
     * 根据传入的id获取该部门对象的父对象状态
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/getDepartmentParentStatusFromId", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> getDepartmentParentStatusFromId(@RequestParam("id") Long id) {
        JSONObject json = new JSONObject();
        String apiName = "getDepartmentParentStatusFromId";
        logger.info("[start] " + apiName);
        try {
            Department department = departmentService.getById(Department.class, id);
            Department parent = department.getParent();
            Integer status = -1;
            if (parent != null) {
                status = parent.getStatus();
            }
            json.put("status", Const.SUCCESS);
            json.put("data", status);
        } catch (Exception e) {
            logger.error("[error]" + apiName + e.toString());
            json.put("status", Const.ERROR);
        }
        logger.info("[end]" + apiName);
        HttpHeaders headers = HttpUtil.getHttpHeaders();
        return new ResponseEntity<>(json.toString(), headers, HttpStatus.OK);
    }
}

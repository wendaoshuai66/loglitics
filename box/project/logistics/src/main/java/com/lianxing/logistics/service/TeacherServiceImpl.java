package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.TeacherDaoImpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("teacherService")
public class TeacherServiceImpl extends BaseServiceImpl implements TeacherService {

    @Autowired
    private TeacherDaoImpl teacherDao;

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String account = request.getParameter("searchObj[account]");// 账号
        String name = request.getParameter("searchObj[name]");// 姓名
        String tel = request.getParameter("searchObj[tel]");// 手机号
        String status = request.getParameter("searchObj[status]");// 用户状态
        String campusId = request.getParameter("searchObj[teacher][department][campus][id]");// 校区
        String departmentId = request.getParameter("searchObj[teacher][department][id]");// 部门
        // 状态值为隐藏
        if ("2".equals(status)) {
            status = "0";
        }
        // HQL语句条件 获取完整列表信息
        Map likePara = new HashMap<String, String>();
        likePara.put("c.name", name);
        likePara.put("c.account", account);
        likePara.put("c.tel", tel);
        //
        Map eqPara = new HashMap<String, String>();
        eqPara.put("c.status", status);
        eqPara.put("c.teacher.department.status", 1);
        eqPara.put("c.teacher.department.ifDelete", 0);
        eqPara.put("c.teacher.department.campus.status", 1);
        eqPara.put("c.teacher.department.campus.ifDelete", 0);
        eqPara.put("c.teacher.position.ifDelete", 0);
        eqPara.put("c.teacher.position.status", 1);
        eqPara.put("c.teacher.department.campus.id", campusId);
        eqPara.put("c.teacher.department.id", departmentId);
        // 区分教师
        eqPara.put("c.role", 2);
        //
        Map eqParaSql = new HashMap<String, String>();
        eqParaSql.put("c.status", status);
        eqParaSql.put("a.id", campusId);
        eqParaSql.put("d.status", 1);
        eqParaSql.put("d.ifDelete", 0);
        eqParaSql.put("d.id", departmentId);
        eqParaSql.put("a.status", 1);
        eqParaSql.put("a.ifDelete", 0);
        eqParaSql.put("p.ifDelete", 0);
        eqParaSql.put("p.status", 1);
        // 区分教师
        eqParaSql.put("c.role", 2);
        //
        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("eqPara", eqPara);
        paraMap.put("eqParaSql", eqParaSql);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("user");// 表名
        page.setEntityName("User");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getTeacherAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return teacherDao.getTeacherAllCountFromPara(para, ifAll);
    }

}

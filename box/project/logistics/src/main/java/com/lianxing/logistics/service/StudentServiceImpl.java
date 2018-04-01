package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.StudentDaolmpl;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("studentService")
public class StudentServiceImpl extends BaseServiceImpl implements StudentService {

    @Autowired
    private StudentDaolmpl studentDao;

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String account = request.getParameter("searchObj[account]");// 账号
        String name = request.getParameter("searchObj[name]");// 姓名
        String tel = request.getParameter("searchObj[tel]");// 手机号
        String status = request.getParameter("searchObj[status]");// 用户状态
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
        // 区分教师
        eqPara.put("c.role", 3);
        //
        Map eqParaSql = new HashMap<String, String>();
        eqParaSql.put("c.status", status);
        eqParaSql.put("c.role", 3);
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
    public Long getStudentAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        return studentDao.getStudentAllCountFromPara(page, para, ifAll);
    }

}

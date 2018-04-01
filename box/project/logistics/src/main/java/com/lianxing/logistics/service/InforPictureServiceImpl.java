package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.InforPictureDaoImpl;
import com.lianxing.logistics.util.Page;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service("inforPictureService")
public class InforPictureServiceImpl extends BaseServiceImpl implements InforPictureService {

    @Autowired
    private InforPictureDaoImpl pictureDao;

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String title = request.getParameter("searchObj[title]");// 标题
        String moduleId = request.getParameter("searchObj[module][id]");// 所属模块
        String author = request.getParameter("searchObj[author]");// 作者
        String approvalStatus = request.getParameter("searchObj[approvalStatus]");// 审核状态
        String showSlide = request.getParameter("searchObj[showSlide]");// 是否幻灯
        String home = request.getParameter("searchObj[homeShowFlag]");
        Boolean homeShowFlag = null;
        if (home != null) {
            homeShowFlag = Boolean.parseBoolean(home);
        }
        String addDateTimeStart = request.getParameter("searchObj[addDateTimeStart]"); // 发布时间 起始
        String addDateTimeEnd = request.getParameter("searchObj[addDateTimeEnd]"); // 发布时间 结束
        if ("2".equals(showSlide)) {
            showSlide = "0";
        }
        if ("2".equals(approvalStatus)) {
            approvalStatus = "0";
        }
        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("addStart", addDateTimeStart);
        timeMap.put("addEnd", addDateTimeEnd);
        // HQL语句条件 获取完整列表信息
        Map likePara = new HashMap<String, String>();
        likePara.put("c.title", title);
        likePara.put("c.author", author);
        //
        Map eqPara = new HashMap<String, String>();
        eqPara.put("c.inforModule.id", moduleId);
        eqPara.put("c.approvalStatus", approvalStatus);
        eqPara.put("c.slideShow", showSlide);
        eqPara.put("c.inforModule.ifDelete", 0);
        eqPara.put("c.inforModule.status", 1);
        //
        Map eqParaSql = new HashMap<String, String>();
        eqParaSql.put("c.moduleId", moduleId);
        eqParaSql.put("c.approvalStatus", approvalStatus);
        eqParaSql.put("c.slideShow", showSlide);
        eqParaSql.put("d.ifDelete", 0);
        eqParaSql.put("d.status", 1);
        if (homeShowFlag != null) {
            if (homeShowFlag) {
                eqPara.put("c.inforModule.homeShow", 1);
                eqParaSql.put("d.homeShow", 1);
            } else {
                eqPara.put("c.inforModule.homeShow", 0);
                eqParaSql.put("d.homeShow", 0);
            }
        }
        //
        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("eqPara", eqPara);
        paraMap.put("eqParaSql", eqParaSql);
        paraMap.put("timeMap", timeMap);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("infor_picture");// 表名
        page.setEntityName("InforPicture");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getInforPictureAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        return pictureDao.getInforPictureAllCountFromPara(page, para, ifAll);
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSearchMapForWeChat(String title) {
        Map<String, Map> paraMap = new HashMap<>();
        Map likePara = new HashMap<String, String>();
        if (StringUtils.isNotBlank(title) && !"null".equalsIgnoreCase(title)) {
            likePara.put("c.title", title);
            paraMap.put("likePara", likePara);
        }
        return paraMap;
    }

}

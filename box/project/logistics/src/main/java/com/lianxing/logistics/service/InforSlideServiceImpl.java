package com.lianxing.logistics.service;

import com.alibaba.fastjson.JSON;
import com.lianxing.logistics.dao.InforSlideDaoImpl;
import com.lianxing.logistics.model.InforPicture;
import com.lianxing.logistics.model.InforSlide;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("slideService")
public class InforSlideServiceImpl extends BaseServiceImpl implements InforSlideService {

    @Autowired
    private InforSlideDaoImpl slideDao;

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String title = request.getParameter("searchObj[title]");// 标题
        String homeShow = request.getParameter("searchObj[homeShow]");// 首页显示状态
        String addDateTimeStart = request.getParameter("searchObj[addDateTimeStart]"); // 发布时间 起始
        String addDateTimeEnd = request.getParameter("searchObj[addDateTimeEnd]"); // 发布时间 结束
        // 状态值为隐藏
        if ("2".equals(homeShow)) {
            homeShow = "0";
        }

        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("addStart", addDateTimeStart);
        timeMap.put("addEnd", addDateTimeEnd);
        // HQL语句条件 获取完整列表信息
        Map likePara = new HashMap<String, String>();
        Map likeParaForWechat = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        Map eqParaForWechat = new HashMap<String, String>();
        likePara.put("c.title", title);
        likeParaForWechat.put("i.title", title);
        eqPara.put("c.homeShow", homeShow);
        eqParaForWechat.put("i.homeShow", homeShow);
        //
        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("eqPara", eqPara);
        paraMap.put("likeParaForWechat", likeParaForWechat);
        paraMap.put("eqParaForWechat", eqParaForWechat);
        paraMap.put("timeMap", timeMap);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("infor_slide");// 表名
        page.setEntityName("InforSlide");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getInforSlideAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll, Integer integer) {
        return slideDao.getInforSlideAllCountFromPara(page, para, ifAll, integer);
    }

    @Override
    public Long getInforSlideHomeshowCount() {
        return slideDao.getInforSlideHomeshowCount();
    }

    @Override
    public <T> List<T> getInforSlideList(Page page, Map<String, Map> paraMap, boolean ifAll, Integer integer) {
        return slideDao.getInforSlideList(page, paraMap, ifAll, integer);
    }

    @Override
    public void update(Long id, String title) {
        slideDao.update(id, title);
    }

    @Override
    public InforSlide getInforSlideList(String id) {
        return slideDao.getInforSlideList(id);
    }

    @Override
    public List getInforSlideProcessList(List<JSONObject> list) {
        List array = new ArrayList<InforSlide>();
        for (Object object : list) {
            InforSlide slide = com.alibaba.fastjson.JSONObject.toJavaObject((JSON) com.alibaba.fastjson.JSONObject.toJSON(object),
                    InforSlide.class);
            array.add(slide);
            Map objJson = (Map) object;
            Object inforId = objJson.get("inforId");
            if (inforId != null) {
                InforPicture inforPicture = getById(InforPicture.class, (Long) inforId);
                slide.setInforPicture(inforPicture);
            }
        }
        return array;
    }

    @Override
    public void changeInforSlideListForHomeshowByModuleId(String id) {
        List<InforSlide> list = slideDao.getInforSlideListByModuleId(id);
        if (list != null && list.size() > 0) {
            for (InforSlide inforSlide : list) {
                if (inforSlide.getHomeShow() == 1) {
                    inforSlide.setHomeShow(0);
                    update(inforSlide);
                }
            }
        }
    }

}

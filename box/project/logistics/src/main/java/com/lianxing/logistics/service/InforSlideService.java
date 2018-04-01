package com.lianxing.logistics.service;

import com.lianxing.logistics.model.InforSlide;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface InforSlideService {

    /**
     * 通过前端传来的集合，拼接dao需要的Map对象
     *
     * @param request
     * @return
     */
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    /**
     * 通过请求拼装分页、排序等page信息
     *
     * @param request
     * @return
     */
    Page getPageInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getInforSlideAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll, Integer integer);

    Long getInforSlideHomeshowCount();

    void update(Long id, String title);

    <T> List<T> getInforSlideList(Page page, Map<String, Map> paraMap, boolean ifAll, Integer integer);

    InforSlide getInforSlideList(String id);

    /**
     * 将list中的JSONObject对象转换为InforSlide对象
     *
     * @param list
     * @return
     */
    List getInforSlideProcessList(List<JSONObject> list);

    void changeInforSlideListForHomeshowByModuleId(String id);

}

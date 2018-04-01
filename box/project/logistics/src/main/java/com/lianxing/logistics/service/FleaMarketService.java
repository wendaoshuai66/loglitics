package com.lianxing.logistics.service;

import com.lianxing.logistics.util.Page;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface FleaMarketService {

    // 通过前端传来的集合，拼接dao需要的Map对象
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    // 通过请求拼装分页、排序等page信息
    Page getPageInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getFleaMarketAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);

    String getFileUrlListFromIds(String[] ids);

    /**
     * 将前端传递过来的JSONObj对象进行处理,将urls变为保存的ids
     *
     * @param obj
     * @return
     */
    JSONObject dealWithJSONObj(JSONObject obj);

    /**
     * 将前端传进来的ids进行处理,获取到对应的路径,保存到JSONObj中
     *
     * @param urlIds
     * @return
     */
    JSONObject getResultJSONList(String urlIds);

}

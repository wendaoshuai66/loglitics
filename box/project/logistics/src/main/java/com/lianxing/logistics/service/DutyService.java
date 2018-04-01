package com.lianxing.logistics.service;

import com.lianxing.logistics.util.Page;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface DutyService {

    // 通过前端传来的集合，拼接dao需要的Map对象
    @SuppressWarnings("rawtypes")
    Map<String, Map> getSeachMapInfo(HttpServletRequest request);

    // 通过请求拼装分页、排序等page信息
    Page getPageInfo(HttpServletRequest request);

    @SuppressWarnings("rawtypes")
    Long getDutyAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll);

    boolean checkDutyDateNum(String strDate);

    List<JSONObject> getInitCalendarInfoFromDate(String year, String month);

    /**
     * 保存多条值班信息
     *
     * @param typeId       工种Id
     * @param departmentId 部门Id
     * @param listDataStr  值班信息列表的JSON字符串
     * @throws Exception
     */
    void saveDuties(String typeId, String departmentId, String listDataStr) throws Exception;

    /**
     * 获取到前端需要的数据类型,并且去除掉冗余数据
     *
     * @param departmentId 部门Id
     * @param typeId       工种Id
     * @param date         日期 年月
     * @return 数据集合
     * @throws Exception
     */
    List<JSONObject> getDutiesFromDepartmentTypeAndDate(long departmentId, long typeId, String date) throws Exception;

    /**
     * 获取到前端需要的数据类型(以用户为中心的统计列表以及图例使用),并且去除掉冗余数据
     *
     * @param departmentId 部门Id
     * @param typeId       工种Id
     * @param date         日期 年月
     * @return 数据集合
     * @throws Exception
     */
    List<JSONObject> getUserInfoFromDepartmentTypeAndDate(long departmentId, long typeId, String date) throws Exception;

    /**
     * 获取值班详情(该部门下按照时间进行分组)工种的排班情况
     *
     * @param id
     * @return
     */
    JSONArray getDutyDetailsFromDepartmentId(Long id);

}

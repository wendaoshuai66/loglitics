package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.DepartmentDaoImpl;
import com.lianxing.logistics.dao.DutyDaoImpl;
import com.lianxing.logistics.model.*;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.Page;
import com.lianxing.logistics.util.PropertiesUtil;
import com.lianxing.logistics.util.RedisClient;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service("dutyService")
public class DutyServiceImpl extends BaseServiceImpl implements DutyService {

    @Autowired
    private DutyDaoImpl dutyDao;

    @Autowired
    private DepartmentDaoImpl departmentDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String addUid = request.getParameter("searchObj[user][id]");// 值班人员id
        // HQL语句条件 获取完整列表信息
        Map eqPara = new HashMap<String, String>();
        eqPara.put("c.user.status", 1);
        eqPara.put("c.user.ifDelete", 0);
        eqPara.put("c.user.maintenanceWorker.department.status", 1);
        eqPara.put("c.user.maintenanceWorker.department.ifDelete", 0);
        eqPara.put("c.user.maintenanceWorker.department.campus.status", 1);
        eqPara.put("c.user.maintenanceWorker.department.campus.ifDelete", 0);
        eqPara.put("c.user.maintenanceWorker.maintenanceType.status", 1);
        eqPara.put("c.user.maintenanceWorker.maintenanceType.ifDelete", 0);
        eqPara.put("c.maintenanceArea.status", 1);
        eqPara.put("c.maintenanceArea.ifDelete", 0);
        eqPara.put("c.user.id", addUid);

        // SQL语句条件 获取完整列表信息
        Map eqParaSql = new HashMap<String, String>();
        eqParaSql.put("u.status", 1);
        eqParaSql.put("u.ifDelete", 0);
        eqParaSql.put("d.status", 1);
        eqParaSql.put("d.ifDelete", 0);
        eqParaSql.put("c.status", 1);
        eqParaSql.put("c.ifDelete", 0);
        eqParaSql.put("t.status", 1);
        eqParaSql.put("t.ifDelete", 0);
        eqParaSql.put("a.status", 1);
        eqParaSql.put("a.ifDelete", 0);
        eqParaSql.put("u.id", addUid);

        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("eqPara", eqPara);
        paraMap.put("eqParaSql", eqParaSql);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("work_duty");// 表名
        page.setEntityName("WorkDuty");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getDutyAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        return dutyDao.getDutyAllCountFromPara(page, para, ifAll);
    }

    @Override
    public boolean checkDutyDateNum(String strDate) {
        int dateNum = dutyDao.getDutyDateNum(strDate);
        if (dateNum == 1 && dateNum == 7) {
            return false;
        }
        return true;
    }

    /**
     * 1、接口地址：http://api.goseek.cn/Tools/holiday?date=数字日期
     * 2、返回数据：工作日对应结果为 0, 休息日对应结果为 1, 节假日对应的结果为 2
     * eq: http://api.goseek.cn/Tools/holiday?date=20171010
     * {"code":10000,"data":0}
     * eq: http://api.goseek.cn/Tools/holiday?date=20171001
     * {"code":10000,"data":2}
     * 免费key 仅可用1000次,上线前需要最小升级为 20000 次
     * 3、具体节日查询 api http://api.jisuapi.com/calendar/query?appkey=yourappkey&date=数字日期
     * 4、上一个api返回 2 则需要知道具体节日名称， result -->festival-->solar
     *
     * @param year
     * @param month
     * @return
     */
    @Override
    public List<JSONObject> getInitCalendarInfoFromDate(String year, String month) {
        String successCode = "10000";
        // 用于接收不安排值班的日期(yyyy-MM-dd)
        List<JSONObject> resultList = new ArrayList<>();
        try {
            Calendar c = Calendar.getInstance();
            c.set(Integer.parseInt(year), Integer.parseInt(month), 0); //输入类型为int类型
            // 获取该月多少天
            int dayOfMonth = c.get(Calendar.DAY_OF_MONTH);
            String monthFormat = String.format("%02d", Integer.parseInt(month));
            for (int i = 1; i <= dayOfMonth; i++) {
                String dayFormat = String.format("%02d", i);
                String dateFormat = year + monthFormat + dayFormat;
                String urlNameString = "http://api.goseek.cn/Tools/holiday?date=" + dateFormat;
                String result;
                // 根据地址获取请求
                HttpGet request = new HttpGet(urlNameString);
                DefaultHttpClient httpClient = new DefaultHttpClient();
                HttpResponse response = httpClient.execute(request);
                if (response.getStatusLine().getStatusCode() == 200) {
                    result = EntityUtils.toString(response.getEntity(), Const.UTF_8);
                    JSONObject jsonObject = JSONObject.fromObject(result);
                    String code = jsonObject.get("code").toString();
                    if (successCode.equals(code)) {
                        String data = jsonObject.get("data").toString();
                        if (!("0").equals(data)) {
                            JSONObject obj = new JSONObject();
                            // 节假日，需要取出节假日的名称
                            if (("2").equals(data)) {
                                String festivalKey = PropertiesUtil.get("FestivalUrl");
                                String festivalUrl = "http://api.jisuapi.com/calendar/query?appkey=" + festivalKey + "&date=" + dateFormat;
                                HttpGet festivalHttp = new HttpGet(festivalUrl);
                                DefaultHttpClient festivalHttpClient = new DefaultHttpClient();
                                HttpResponse festivalResponse = festivalHttpClient.execute(festivalHttp);
                                if (response.getStatusLine().getStatusCode() == 200) {
                                    String festivalStr = EntityUtils.toString(festivalResponse.getEntity(), Const.UTF_8);
                                    JSONObject festivalObj = JSONObject.fromObject(festivalStr);
                                    JSONObject info = (JSONObject) festivalObj.get("result");
                                    JSONObject festival = (JSONObject) info.get("festival");
                                    // 节假日只显示第一次出现的
                                    if (festival != null) {
                                        String festivalName = "";
                                        // 国际节日
                                        if (festival.has("solar")) {
                                            festivalName = festival.get("solar").toString();
                                        }
                                        // 传统节日
                                        else if (festival.has("lunar")) {
                                            festivalName = festival.get("lunar").toString();
                                        }
                                        // 将具体的节日名称写入
                                        obj.put("title", festivalName);
                                    } else {
                                        obj.put("title", "");
                                    }
                                }
                                // 节假日
                                obj.put("type", "2");
                            } else {
                                obj.put("title", "");
                                // 普通休息日
                                obj.put("type", "1");
                            }
                            obj.put("start", year + "-" + monthFormat + "-" + dayFormat);
                            // 非结尾最后一天，天数直接加一
                            if (i != dayOfMonth) {
                                obj.put("end", year + "-" + monthFormat + "-" + String.format("%02d", i + 1));
                            }
                            // 该月最后一天，月份加一，天数为 '01'
                            else {
                                obj.put("end", year + "-" + String.format("%02d", Integer.parseInt(month) + 1) + "-01");
                            }
                            resultList.add(obj);
                        }
                    }
                }
            }
        } catch (Exception e) {
            return null;
        }
        // 第一次请求将该年月的节假日信息缓存
        RedisClient redisClient = new RedisClient();
        JSONObject redisCache = new JSONObject();
        redisCache.put("data", resultList);
        redisClient.set("holiday." + year + String.format("%02d", Integer.parseInt(month)), redisCache.toString());
        return resultList;
    }

    @Override
    public void saveDuties(String typeId, String departmentId, String listDataStr) throws Exception {
        // 部门实例
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            JSONArray list = JSONArray.fromObject(listDataStr);
            String oneTime = ((JSONObject) list.get(0)).get("time").toString();
            // 取出当前值班表所处的年月 eq:2017-11
            String thisYearMonth = oneTime.substring(0, 7);
            // 检测该部门 工种 时间下是否有值班表,如果有删除掉原始的值班表
            String dbDutyStr = dutyDao.getDutyDateStrFromDepartmentTypeAndDate(departmentId, typeId);
            // 该值班表是否存在
            boolean existDutyFlag = false;
            if (dbDutyStr != null) {
                String[] split = dbDutyStr.split(",", -1);
                if (Arrays.asList(split).contains(thisYearMonth)) {
                    existDutyFlag = true;
                    // 删除原始的值班表
                    deleteOldDutyFromDepartmentTypeAndDate(Long.parseLong(departmentId), Long.parseLong(typeId), thisYearMonth);
                }
            }
            Department department = dutyDao.getById(Department.class, Long.parseLong(departmentId));
            // 工种实例
            MaintenanceType maintenanceType = dutyDao.getById(MaintenanceType.class, Long.parseLong(typeId));
            // 更新或保存 DepartmentTypeDuty 部门工种值班关系表
            // 新增情况下,更新关联配置表,修改情况下不需要
            if (!existDutyFlag) {
                updateDepartmentTypeDutyDate(department, maintenanceType, thisYearMonth);
            }
            List<WorkDuty> duties = new ArrayList<>();
            for (int i = 0; i < list.size(); i++) {
                JSONObject obj = (JSONObject) list.get(i);
                if (obj != null) {
                    // 取出值班时间
                    String time = (String) obj.get("time");
                    Date saveDate = format.parse(time.substring(0, 10));
                    // 值班类型 0：普通班次 1：周末班次，2：节假期班次
                    int type = 0;
                    if (obj.get("type") != null) {
                        type = Integer.parseInt((String) obj.get("type"));
                    }
                    String holidayName = "";
                    // 普通周末
                    if (type == 1) {
                        holidayName = "普通周末";
                    } else if (type == 2) {
                        if (obj.get("name") != null) {
                            String tempStr = null;
                            try {
                                tempStr = (String)obj.get("name");
                                if(StringUtils.isBlank(tempStr) || "null".equalsIgnoreCase(tempStr)) {
                                    holidayName = "节假日";
                                }
                                else {
                                    holidayName = tempStr;
                                }
                            } catch (Exception e) {
                                holidayName = "节假日";
                            }
                        }
                    }
                    JSONArray nightIdList = JSONArray.fromObject(obj.get("nightId"));
                    JSONArray dayIdList = JSONArray.fromObject(obj.get("dayId"));
                    // 夜班列表
                    for (int j = 0; j < nightIdList.size(); j++) {
                        Long nightPersonId = Long.parseLong((String) nightIdList.get(j));
                        User user = dutyDao.getById(User.class, nightPersonId);
                        WorkDuty duty = getOriginalObj(department, maintenanceType, type, saveDate, holidayName);
                        duty.setUser(user);
                        // 夜班
                        duty.setIfNight(1);
                        duties.add(duty);
                    }
                    // 白班
                    for (int k = 0; k < dayIdList.size(); k++) {
                        Long dayPersonId = Long.parseLong((String) dayIdList.get(k));
                        User user = dutyDao.getById(User.class, dayPersonId);
                        WorkDuty duty = getOriginalObj(department, maintenanceType, type, saveDate, holidayName);
                        duty.setUser(user);
                        // 白班
                        duty.setIfNight(0);
                        duties.add(duty);
                    }
                }
            }
            dutyDao.saveAll(duties);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 把之前设置的值班表作废(更新删除字段为 1)
     *
     * @param departmentId 部门Id
     * @param typeId       工种Id
     * @param date         日期年月 eq:2017-11
     * @throws Exception
     */
    private void deleteOldDutyFromDepartmentTypeAndDate(long departmentId, long typeId, String date) throws Exception {
        List<WorkDuty> duties = getDuties(departmentId, typeId, date);
        for (WorkDuty duty : duties) {
            duty.setIfDelete(1);
        }
        dutyDao.updateAll(duties);
    }

    /**
     * 根据条件获取 WorkDuty 集合实例
     *
     * @param departmentId 部门Id
     * @param typeId       工种Id
     * @param date         日期年月
     * @return 集合实例
     * @throws Exception
     */
    private List<WorkDuty> getDuties(long departmentId, long typeId, String date) throws Exception {
        String year = date.substring(0, 4);
        String month = date.substring(5, 7);
        int monthInt = Integer.parseInt(month);
        int yearInt = Integer.parseInt(year);
        String startDate = date + "-01";
        String endDate;
        // 计算出该月最后一天 (因为时间只到日, 2017-11-11 00:00:00 , 所以结束时间需要加一天)
        // eq: 2017-11-01 00:00:00 ---> 2017-12-01 00:00:00
        if (monthInt == 12) {
            endDate = (yearInt + 1) + "-01-01";
        } else {
            endDate = year + "-" + (monthInt + 1) + "-01";
        }
        return dutyDao.getDutiesFromDepartmentTypeAndDate(departmentId, typeId, startDate, endDate);
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<JSONObject> getDutiesFromDepartmentTypeAndDate(long departmentId, long typeId, String date) throws Exception {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        List<WorkDuty> duties = getDuties(departmentId, typeId, date);
        // 首先剥离出前端需要的格式,无用数据过滤掉
        List<JSONObject> jsonObjects = new ArrayList<>();
        // 得到原始顺序 且去重
        Set<String> timeSet = new LinkedHashSet<>();
        for (WorkDuty duty : duties) {
            JSONObject obj = new JSONObject();
            // 部门名称
            obj.put("departmentName", duty.getDepartment().getName());
            // 工种名称
            obj.put("typeName", duty.getMaintenanceType().getName());
            // 值班日期
            obj.put("time", format.format(duty.getDutyDate()));
            // 日期类型
            obj.put("type", duty.getDateType());
            // 日期备注
            obj.put("holidayName", duty.getHolidayName() == null ? "" : duty.getHolidayName());
            timeSet.add(format.format(duty.getDutyDate()));
            // 值班人员名称
            // 白班
            if (duty.getIfNight() == 0) {
                obj.put("dayPersonName", duty.getUser().getName());
                obj.put("tel", duty.getUser().getTel());
                obj.put("nightPersonName", null);
            }
            // 夜班
            else {
                obj.put("dayPersonName", null);
                obj.put("nightPersonName", duty.getUser().getName());
                obj.put("tel", duty.getUser().getTel());
            }
            jsonObjects.add(obj);
        }
        JSONArray jsonArray = new JSONArray();
        for (String time : timeSet) {
            JSONObject resultObj = new JSONObject();
            JSONArray dayArray = new JSONArray();
            JSONArray nightArray = new JSONArray();
            int type = 0;
            String holidayName = "";
            for (JSONObject obj : jsonObjects) {
                if (time.equals(obj.get("time"))) {
                    if (obj.get("dayPersonName") != null) {
                        dayArray.add(obj.get("dayPersonName") + " " + obj.get("tel"));
                    } else if (obj.get("nightPersonName") != null) {
                        nightArray.add(obj.get("nightPersonName") + " " + obj.get("tel"));
                    }
                    type = Integer.parseInt(obj.get("type").toString());
                    holidayName = obj.get("holidayName").toString();
                }
            }
            resultObj.put("time", time);
            resultObj.put("type", type);
            resultObj.put("dayPerson", dayArray);
            resultObj.put("nightPerson", nightArray);
            resultObj.put("holidayName", holidayName);
            jsonArray.add(resultObj);
        }
        return jsonArray;
    }

    @Override
    public List<JSONObject> getUserInfoFromDepartmentTypeAndDate(long departmentId, long typeId, String date) throws Exception {
        List<WorkDuty> duties = getDuties(departmentId, typeId, date);
        HashMap<String, Map<String, Integer>> map = new HashMap<>();
        for (WorkDuty duty : duties) {
            String name = duty.getUser().getName();
            Map<String, Integer> countMap = map.get(name);
            if (countMap == null) {
                countMap = new HashMap<>(Collections.emptyMap());
            }
            // 统计值班类型
            Integer dateType = duty.getDateType();
            if (dateType == 0) {
                mapCountAddOne(countMap, "ordinaryDate");
            } else if (dateType == 1) {
                mapCountAddOne(countMap, "weekendsDate");
            } else {
                mapCountAddOne(countMap, "holidayDate");
            }
            // 统计白夜班
            Integer ifNight = duty.getIfNight();
            // 白班
            if (ifNight == 0) {
                mapCountAddOne(countMap, "day");
            } else {
                mapCountAddOne(countMap, "night");
            }
            map.put(name, countMap);
        }
        JSONArray array = new JSONArray();
        for (Map.Entry<String, Map<String, Integer>> entry : map.entrySet()) {
            String name = entry.getKey();
            Map<String, Integer> countMap = entry.getValue();
            JSONObject object = new JSONObject();
            object.put("name", name);
            object.put("ordinaryDate", countMap.get("ordinaryDate"));
            object.put("weekendsDate", countMap.get("weekendsDate"));
            object.put("holidayDate", countMap.get("holidayDate"));
            object.put("day", countMap.get("day"));
            object.put("night", countMap.get("night"));
            object.put("name", name);
            array.add(object);
        }
        return array;
    }

    /**
     * 对指定map的key对应的value 加一
     *
     * @param map
     * @param key
     */
    private void mapCountAddOne(Map<String, Integer> map, String key) {
        Integer value = map.get(key);
        if (value == null) {
            value = 1;
        } else {
            value = 1 + value;
        }
        map.put(key, value);
    }

    @Override
    public JSONArray getDutyDetailsFromDepartmentId(Long id) {
        JSONArray resultArray = new JSONArray();
        List<DepartmentTypeDuty> duties = departmentDao.getDepartmentTypeDutyFromDepartmentId(id);
        Map<String, List<String>> map = Collections.synchronizedMap(
                new HashMap<>(Collections.<String, List<String>>emptyMap()));
        for (DepartmentTypeDuty duty : duties) {
            String typeName = duty.getMaintenanceType().getName();
            String dateStr = duty.getDutyDate();
            String[] dateList = dateStr.split(",", -1);
            // 自然顺序排序
            Arrays.sort(dateList);
            for (String date : dateList) {
                List<String> typeNameList = map.get(date);
                if (typeNameList == null) {
                    typeNameList = new ArrayList<>();
                }
                typeNameList.add(typeName);
                map.put(date, typeNameList);
            }
        }
        for (Map.Entry<String, List<String>> entry : map.entrySet()) {
            List<String> value = entry.getValue();
            // java8 stream 流操作(将集合每个对象使用' / '相连成需要的字符串返回)
            String s = value.stream().collect(Collectors.joining(" / "));
            JSONObject obj = new JSONObject();
            obj.put("date", entry.getKey());
            obj.put("value", s);
            resultArray.add(obj);
        }
        return resultArray;
    }

    /**
     * 根据部门以及工种保存或修改唯一的部门工种值班关系表实例
     *
     * @param department      部门
     * @param maintenanceType 工种
     */
    private void updateDepartmentTypeDutyDate(Department department, MaintenanceType maintenanceType, String newDate) {
        DepartmentTypeDuty duty = dutyDao.getDepartmentTypeDutyDate(department.getId(), maintenanceType.getId());
        if (duty != null) {
            String dutyDate = duty.getDutyDate();
            String[] split = dutyDate.split(",", -1);
            // asList 为固定长度，增删操作报 UnsupportedOperationException
            List<String> dateList = new ArrayList<>(Arrays.asList(split));
            dateList.add(newDate);
            StringBuilder sb = new StringBuilder();
            for (String s : dateList) {
                sb.append(s).append(",");
            }
            String dateStr = sb.toString();
            String newDateStr = dateStr.substring(0, dateStr.length() - 1);
            duty.setDutyDate(newDateStr);
            dutyDao.update(duty);
        } else {
            duty = new DepartmentTypeDuty();
            duty.setDutyDate(newDate);
            duty.setDepartment(department);
            duty.setMaintenanceType(maintenanceType);
            dutyDao.save(duty);
        }
    }

    /**
     * 获取通用的 WorkDuty 实例
     *
     * @param department      部门实例
     * @param maintenanceType 工种实例
     * @param type            日期类型，与model一致
     * @param saveDate        值班日期
     * @return
     */
    private WorkDuty getOriginalObj(Department department, MaintenanceType maintenanceType, int type, Date saveDate, String holidayName) {
        WorkDuty duty = new WorkDuty();
        duty.setDepartment(department);
        duty.setDateType(type);
        duty.setMaintenanceType(maintenanceType);
        duty.setDutyDate(saveDate);
        duty.setHolidayName(holidayName);
        return duty;
    }

}

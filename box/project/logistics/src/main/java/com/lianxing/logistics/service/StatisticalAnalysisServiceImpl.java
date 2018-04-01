package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.StatisticalAnalysisDaoImpl;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service("statisticalAnalysisService")
public class StatisticalAnalysisServiceImpl extends BaseServiceImpl implements StatisticalAnalysisService {

    @Autowired
    private StatisticalAnalysisDaoImpl statisticalAnalysisDao;

    @SuppressWarnings("rawtypes")
    @Override
    public List getMaintainCount(int i, String startTime, String endTime) {
        return statisticalAnalysisDao.getMaintenanceStatisticWithTime(i, startTime, endTime);
    }

    @Override
    public JSONObject getMaintainCountList(List<Map<String, Object>> list, int x) {
        JSONObject dataMap = new JSONObject();
        String[] strArray = new String[x == 240 ? 24 + 1 : x + 1];
        int[] intArray = new int[x == 240 ? 24 + 1 : x + 1];
        if (x == 24 || x == 240) {
            for (int i = 0; i < 25; i++) {
                strArray[i] = String.format("%02d", i);
            }
        } else if (x == 7) {
            strArray = new String[]{"星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"};
            for (int i = 0; i < x + 1; i++) {
                intArray[i] = i;
            }
        } else if (x == 12) {
            strArray = new String[]{"一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"};
            for (int i = 0; i < x + 1; i++) {
                intArray[i] = i;
            }
        }
        int[] array;
        if (x != 240) {
            array = new int[x + 1];
        } else {
            array = new int[24 + 1];
        }
        int p = x == 240 ? 24 : x;
        for (int i = 0; i < p + 1; i++) {
            for (Map<String, Object> map : list) {
                int k = (int) map.get("categories");
                Number num = (Number) map.get("data");
                int value = num.intValue();
                if (x == 24 || x == 240) {
                    String kStr = String.format("%02d", k);
                    if (strArray[i].equals(kStr)) {
                        array[i] = value;
                        break;
                    } else {
                        array[i] = 0;
                    }
                } else if (x == 7) {
                    if (intArray[i] == k) {
                        array[i] = value;
                        break;
                    } else {
                        array[i] = 0;
                    }
                } else if (x == 12) {
                    if (intArray[i] == k) {
                        array[i] = value;
                        break;
                    } else {
                        array[i] = 0;
                    }
                }
            }
        }
        if (x != 240) {
            if (x == 12) {
                dataMap.put("data", JSONArray.fromObject(array).subList(1, array.length));
                dataMap.put("categories", strArray);
            } else if (x == 24) {
                dataMap.put("data", JSONArray.fromObject(array).subList(0, array.length - 1));
                dataMap.put("categories", JSONArray.fromObject(strArray).subList(0, array.length - 1));
            } else {
                dataMap.put("data", JSONArray.fromObject(array).subList(0, array.length - 1));
                dataMap.put("categories", strArray);
            }
        } else {
            JSONArray arr = new JSONArray();
            for (int i = 0; i < strArray.length; i++) {
                JSONObject obj = new JSONObject();
                obj.put("name", strArray[i] + ":00");
                obj.put("value", array[i]);
                arr.add(obj);
            }
            dataMap.put("data", arr);
        }
        return dataMap;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public JSONObject getMaintenanceStatisticWithType(String type, String startTime, String endTime) {
        JSONObject result = new JSONObject();
        List list = statisticalAnalysisDao.getMaintenanceStatisticWithType(type, startTime, endTime);
        if ("repairOriginStatistics".equals(type)) {
            Map<String, String> map = (Map<String, String>) list.get(0);
            JSONArray array = new JSONArray();
            JSONObject webObj = new JSONObject();
            webObj.put("value", getMapValueOrZero(map, "web"));
            webObj.put("name", "网页报修");
            JSONObject weChartObj = new JSONObject();
            weChartObj.put("value", getMapValueOrZero(map, "weChart"));
            weChartObj.put("name", "微信报修");
            array.add(webObj);
            array.add(weChartObj);
            result.put("data", array);
        }
        // 报修类型占比(工种占比)
        else if ("maintenanceTypeStatistics".equals(type)) {
            result.put("data", getJSONDataFromMap(getMapDataFromList(list, "name")));
        }
        // 报修区域占比(区域占比)
        else if ("maintenanceAreaStatistics".equals(type)) {
            HashMap<String, Integer> map = new HashMap<>();
            for (int i = 0; i < list.size(); i++) {
                Map<String, String> temp = (Map<String, String>) list.get(i);
                String area = temp.get("area");
                String campus = temp.get("campus");
                String connectName = campus + "--" + area;
                if (map.get(connectName) == null) {
                    map.put(connectName, 1);
                } else {
                    map.put(connectName, map.get(connectName) + 1);
                }
            }
            result.put("data", getJSONDataFromMap(map));
        }
        return result;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public JSONObject maintenanceStatisticWithQuality(String type, String startTime, String endTime) {
        JSONObject result = new JSONObject();
        List list = statisticalAnalysisDao.getMaintenanceStatisticWithQuality(type, startTime, endTime);
        // 维修评价
        if ("evaluationStatistics".equals(type)) {
            Map<String, String> map = (Map<String, String>) list.get(0);
            JSONArray array = new JSONArray();
            JSONObject good = new JSONObject();
            good.put("value", getMapValueOrZero(map, "good"));
            good.put("name", "好评");
            JSONObject bad = new JSONObject();
            bad.put("value", getMapValueOrZero(map, "bad"));
            bad.put("name", "差评");
            JSONObject mid = new JSONObject();
            mid.put("value", getMapValueOrZero(map, "mid"));
            mid.put("name", "中评");
            array.add(good);
            array.add(bad);
            array.add(mid);
            result.put("data", array);
        } else if ("maintenanceStatusStatistics".equals(type)) {
            result.put("data", getJSONDataFromMap(getMapDataFromList(list, "name")));
        } else if ("timeCostStatistics".equals(type)) {
            Map<String, Integer> map = getMapDataFromList(list, "time");
            Map<String, Integer> tempMap = initTimeCostMap();
            for (Map.Entry<String, Integer> entry : map.entrySet()) {
                Double key = Double.valueOf(entry.getKey());
                Integer value = entry.getValue();
                if (key < 2) {
                    tempMap = putMapValueFromKey(tempMap, "<2小时", value);
                } else if (key < 4) {
                    tempMap = putMapValueFromKey(tempMap, "2~4小时", value);
                } else if (key < 6) {
                    tempMap = putMapValueFromKey(tempMap, "4~6小时", value);
                } else if (key < 8) {
                    tempMap = putMapValueFromKey(tempMap, "6~8小时", value);
                } else {
                    tempMap = putMapValueFromKey(tempMap, ">8小时", value);
                }
            }
            result.put("data", getJSONDataFromMap(tempMap));
        }
        return result;
    }

    @Override
    public JSONObject getLineUseInfoWithType(JSONObject object) {
        JSONArray array = (JSONArray) object.get("data");
        JSONArray value = new JSONArray();
        JSONArray categories = new JSONArray();
        for (Object o : array) {
            JSONObject obj = (JSONObject) o;
            categories.add(obj.get("name"));
            value.add(obj.get("value"));
        }
        JSONObject resultObj = new JSONObject();
        resultObj.put("categories", categories);
        resultObj.put("data", value);
        return resultObj;
    }

    private JSONArray getJSONDataFromMap(Map<String, Integer> map) {
        JSONObject obj = new JSONObject();
        JSONArray array = new JSONArray();
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            obj.put("name", entry.getKey());
            obj.put("value", entry.getValue());
            array.add(obj);
        }
        return array;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private Map<String, Integer> getMapDataFromList(List list, String str) {
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < list.size(); i++) {
            Map<String, String> temp = (Map<String, String>) list.get(i);
            map = putMapValueFromKey(map, temp.get(str));
        }
        return map;
    }

    private Object getMapValueOrZero(Map<String, String> map, String key) {
        return map.get(key) == null ? 0 : map.get(key);
    }

    private Map<String, Integer> putMapValueFromKey(Map<String, Integer> map, String key, Integer... count) {
        if (map.get(key) == null) {
            map.put(key, (count == null || count.length == 0 ? 1 : count[0]));
        } else {
            map.put(key, map.get(key) + (count == null || count.length == 0 ? 1 : count[0]));
        }
        return map;
    }

    private Map<String, Integer> initTimeCostMap() {
        Map<String, Integer> resultMap = new LinkedHashMap<>();
        resultMap.put("<2小时", 0);
        resultMap.put("2~4小时", 0);
        resultMap.put("4~6小时", 0);
        resultMap.put("6~8小时", 0);
        resultMap.put(">8小时", 0);
        return resultMap;
    }

}

package com.lianxing.logistics.util;

import com.lianxing.logistics.util.date.DateJsonValueProcessor;
import com.lianxing.logistics.util.date.DateMorpherEx;
import com.lianxing.logistics.util.date.DateTime;
import com.lianxing.logistics.util.date.DateTimeJsonValueProcessor;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.processors.DefaultValueProcessor;
import net.sf.json.util.CycleDetectionStrategy;
import net.sf.json.util.JSONUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.Map;

public class JsonUtil {

    public static JsonConfig jsonConfig(String flag) {
        JsonConfig jsonConfig = new JsonConfig();
        // 转换的对象包含自身对象时，会抛出异常There is a cycle in the hierarchy
        // 防止自包含
        jsonConfig.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
        jsonConfig.setExcludes(new String[]{"handler", "hibernateLazyInitializer"});
        // 防止将Integer的null转换成0
        jsonConfig.registerDefaultValueProcessor(Integer.class, new DefaultValueProcessor() {

            @Override
            @SuppressWarnings("rawtypes")
            public Object getDefaultValue(Class type) {
                return null;
            }
        });
        // 日期转换成yyyy-MM-dd HH:mm:ss
        if ("dateTime".equals(flag)) {
            jsonConfig.registerJsonValueProcessor(Date.class, new DateTimeJsonValueProcessor());
        }
        // 日期转换成yyyy-MM-dd
        else if ("date".equals(flag)) {
            jsonConfig.registerJsonValueProcessor(Date.class, new DateJsonValueProcessor());
        }

        return jsonConfig;
    }

    @SuppressWarnings("unchecked")
    public static <T> T jsonToObject(Class<T> klass, String json) {
        JSONObject jsonReq = JSONObject.fromObject(json);
        String[] dateFormats = new String[]{DateTime.ymdhms, DateTime.ymd};
        JSONUtils.getMorpherRegistry().registerMorpher(new DateMorpherEx(dateFormats, (Date) null));
        T obj = (T) JSONObject.toBean(jsonReq, klass);
        return obj;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public static <T> T jsonToObject(Class<T> klass, String json, Map<String, Class> klassMap) {
        JSONObject jsonReq = JSONObject.fromObject(json);
        String[] dateFormats = new String[]{DateTime.ymdhms, DateTime.ymd};
        JSONUtils.getMorpherRegistry().registerMorpher(new DateMorpherEx(dateFormats, (Date) null));
        T obj = (T) JSONObject.toBean(jsonReq, klass, klassMap);
        return obj;
    }

    // 将request中的JSON串转成UTF-8编码,再转成对应的JSONObject
    public static JSONObject getJSONObjFromRequset(HttpServletRequest request) throws Exception {
        String encodingType = request.getCharacterEncoding();
        if (Const.UTF_8.equalsIgnoreCase(encodingType)) {
            String plainJson = request.getParameter("data");
            return JSONObject.fromObject(plainJson);
        } else {
            String json = new String(request.getParameter("data").getBytes(encodingType), Const.UTF_8);
            return JSONObject.fromObject(json);
        }
    }

}

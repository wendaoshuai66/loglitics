package com.lianxing.logistics.util;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JavaSMSUtil {

    //模板发送接口的http地址
    private static String URI_TPL_SEND_SMS = "https://sms.yunpian.com/v2/sms/tpl_single_send.json";

    //编码格式。发送编码格式统一用UTF-8
    private static String ENCODING = "UTF-8";

//    public static void main(String[] args) throws IOException, URISyntaxException {
//        // 唯一标识符
//        String apikey = PropertiesUtil.get("apikey", "/sys_config.properties");
//
//        // 短信模板的参数
//        String tpl_value = URLEncoder.encode("#a#", ENCODING) + "="
//                + URLEncoder.encode("翟永杰", ENCODING) + "&"
//                + URLEncoder.encode("#b#", ENCODING) + "="
//                + URLEncoder.encode("长安校区，东南区域，宿管科水电", ENCODING) + "&"
//                + URLEncoder.encode("#c#", ENCODING) + "="
//                + URLEncoder.encode("5", ENCODING);
//
//        long tpl_id = 2059446;// 模板id
//
//        String mobile = "13259895848";// 手机号
//
//        System.out.println(tpl_value);
////        JavaSMSUtil.tplSendSms(apikey, tpl_id, tpl_value, mobile);// 通过模板群发短信
//    }

    /**
     * 通过模板发送短信(不推荐)
     *
     * @param apikey    apikey
     * @param tpl_id    　模板id
     * @param tpl_value 　模板变量值
     * @param mobile    　接受的手机号
     * @return json格式字符串
     * @throws IOException
     */
    public static String tplSendSms(String apikey, long tpl_id, String tpl_value, String mobile) throws IOException {
        Map<String, String> params = new HashMap<>();
        params.put("apikey", apikey);
        params.put("tpl_id", String.valueOf(tpl_id));
        params.put("tpl_value", tpl_value);
        params.put("mobile", mobile);
        return post(URI_TPL_SEND_SMS, params);
    }


    public static String post(String url, Map<String, String> paramsMap) {
        CloseableHttpClient client = HttpClients.createDefault();
        String responseText = "";
        CloseableHttpResponse response = null;
        try {
            HttpPost method = new HttpPost(url);
            if (paramsMap != null) {
                List<NameValuePair> paramList = new ArrayList<>();
                for (Map.Entry<String, String> param : paramsMap.entrySet()) {
                    NameValuePair pair = new BasicNameValuePair(param.getKey(), param.getValue());
                    paramList.add(pair);
                }
                method.setEntity(new UrlEncodedFormEntity(paramList, ENCODING));
            }
            response = client.execute(method);
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                responseText = EntityUtils.toString(entity);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return responseText;
    }
}

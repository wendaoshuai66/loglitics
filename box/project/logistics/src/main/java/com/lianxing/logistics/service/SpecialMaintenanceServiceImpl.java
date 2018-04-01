package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.SpecialMaintenanceDaoImpl;
import com.lianxing.logistics.model.MaintenanceSpecial;
import com.lianxing.logistics.model.WarrantyNumber;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service("specialMaintenanceService")
public class SpecialMaintenanceServiceImpl extends BaseServiceImpl implements SpecialMaintenanceService {

    @Autowired
    private SpecialMaintenanceDaoImpl specialMaintenanceDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String maintenanceNumber = request.getParameter("searchObj[maintenanceNumber]");// 维修单号
        String addDateTimeStart = request.getParameter("searchObj[addDateTimeStart]"); // 报修时间起始
        String addDateTimeEnd = request.getParameter("searchObj[addDateTimeEnd]"); // 报修时间结束

        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("addStart", addDateTimeStart);
        timeMap.put("addEnd", addDateTimeEnd);
        Map likePara = new HashMap<String, String>();
        Map eqPara = new HashMap<String, String>();
        likePara.put("maintenanceNumber", maintenanceNumber);
        // 维修类别为专项维修
        eqPara.put("type", 1);
//        eqPara.put("c.maintenanceSpecial.department.status", 1);
//        eqPara.put("c.maintenanceSpecial.department.ifDelete", 0);
//        eqPara.put("c.maintenanceSpecial.department.campus.status", 1);
//        eqPara.put("c.maintenanceSpecial.department.campus.ifDelete", 0);
//        eqPara.put("c.maintenanceStaff.status", 1);
//        eqPara.put("c.maintenanceStaff.ifDelete", 0);

        Map likeParaSql = new HashMap<String, String>();
        Map eqParaSql = new HashMap<String, String>();
        likeParaSql.put("maintenanceNumber", maintenanceNumber);
        eqParaSql.put("w.type", 1);
//        eqParaSql.put("d.status", 1);
//        eqParaSql.put("d.ifDelete", 0);
//        eqParaSql.put("c.status", 1);
//        eqParaSql.put("c.ifDelete", 0);
//        eqParaSql.put("u.status", 1);
//        eqParaSql.put("u.ifDelete", 0);
        // eqParaSql.put("a.status", 1);
        // eqParaSql.put("a.ifDelete", 0);

        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("eqPara", eqPara);
        paraMap.put("likeParaSql", likeParaSql);
        paraMap.put("eqParaSql", eqParaSql);
        paraMap.put("timeMap", timeMap);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("warranty_number");// 表名
        page.setEntityName("WarrantyNumber");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getSpecialMaintenanceAllCountFromPara(Map<String, Map> para, boolean ifAll) {
        return specialMaintenanceDao.getSpecialMaintenanceAllCountFromPara(para, ifAll);
    }

    @Override
    public String getMaintenanceNumber() {
        try {
            // 补足4位
            Long number = specialMaintenanceDao.getMaintenanceNumber();
            Date date = new Date();
            SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
            String dateStr = format.format(date);
            return dateStr + String.format("%04d", number);
        } catch (ParseException e) {
            return null;
        }
    }

    @Override
    public String getAreaNameListFromIds(String[] ids) {
        return specialMaintenanceDao.getAreaNameListFromIds(ids);
    }

    @Override
    public List<JSONObject> getResultJSONList(List<WarrantyNumber> list) {
        List<JSONObject> resultList = new ArrayList<>();
        for (WarrantyNumber warrantyNumber : list) {
            JSONObject itemObj = new JSONObject();
            itemObj.putAll(JSONObject.fromObject(warrantyNumber, JsonUtil.jsonConfig("dateTime")));

            MaintenanceSpecial special = warrantyNumber.getMaintenanceSpecial();
            String areaIds = special.getMaintenanceAreaIds();
            String[] tempIds = areaIds.split(",", -1);
            String areaName = getAreaNameListFromIds(tempIds); // 获取区域名称串
            ArrayList<Long> ids = new ArrayList<>();
            for (String id : tempIds) {
                ids.add(Long.parseLong(id));
            }
            JSONObject area = new JSONObject();
            area.put("id", ids.toArray(new Long[]{})); // 前端需要的id数组不是字符串数组，需要转换成Long数组
            itemObj.put("maintenanceArea", area);
            itemObj.put("maintenanceAreaName", areaName);
            resultList.add(itemObj);
        }
        return resultList;
    }

//    @SuppressWarnings({"unchecked", "rawtypes"})
//    @Override
//    public List<WarrantyNumber> getFinalList(List<WarrantyNumber> list, List<Object> listB) {
//        List<WarrantyNumber> resultList = new ArrayList();
//        StringBuffer sb = new StringBuffer();
//        boolean first = true;
//        for (Object str : listB) {
//            if (first) {
//                first = false;
//            } else {
//                sb.append(",");
//            }
//            sb.append(str);
//        }
//        String strA = sb.toString();
//        for (int i = 0; i < list.size(); i++) {
//            WarrantyNumber obj = list.get(i);
//            String strB = obj.getMaintenanceSpecial().getMaintenanceAreaIds();
//            boolean flag = getBoolean(strA, strB);
//            //if (flag) {
//            if (true) {
//                resultList.add(obj);
//            }
//        }
//        return resultList;
//    }
//
//    private boolean getBoolean(String strA, String strB) {
//        String[] splitA = strA.split(",", -1);
//        String[] splitB = strB.split(",", -1);
//        int count = 0;
//        List<String> list = Arrays.asList(splitA);
//        for (int i = 0; i < splitB.length; i++) {
//            if (list.indexOf(splitB[i]) >= 0) {
//                count++;
//            }
//        }
//        if (count == splitB.length) {
//            return true;
//        }
//        return false;
//    }

}

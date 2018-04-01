package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.FleaMarketDaoImpl;
import com.lianxing.logistics.model.UploadFile;
import com.lianxing.logistics.util.Page;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service("fleaMarketService")
public class FleaMarketServiceImpl extends BaseServiceImpl implements FleaMarketService {

    @Autowired
    private FleaMarketDaoImpl fleaMarketDao;

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Override
    public Map<String, Map> getSeachMapInfo(HttpServletRequest request) {
        String title = request.getParameter("searchObj[title]");// 标题
        String statusId = request.getParameter("searchObj[type]");// 类别
        String author = request.getParameter("searchObj[person][name]");// 联系人
        String approvalStatusId = request.getParameter("searchObj[approvalStatus]");// 审核状态
        String dealStatus = request.getParameter("searchObj[dealStatus]");// 交易状态
        String addUid = request.getParameter("searchObj[person][id]");// 联系人的id

        String addDateTimeStart = request.getParameter("searchObj[addDateTimeStart]"); // 发布时间 起始
        String addDateTimeEnd = request.getParameter("searchObj[addDateTimeEnd]"); // 发布时间 结束

        if ("2".equals(statusId)) {
            statusId = "0";
        }
        if ("2".equals(approvalStatusId)) {
            approvalStatusId = "0";
        }
        if ("2".equals(dealStatus)) {
            dealStatus = "0";
        }
        HashMap<String, String> timeMap = new HashMap<>();
        timeMap.put("addStart", addDateTimeStart);
        timeMap.put("addEnd", addDateTimeEnd);
        // HQL语句条件 获取完整列表信息
        Map likePara = new HashMap<String, String>();
        likePara.put("c.title", title);
        likePara.put("c.person.name", author);
        //
        Map likeParaSql = new HashMap<String, String>();
        likeParaSql.put("title", title);
        likeParaSql.put("person.name", author);
        //
        Map eqPara = new HashMap<String, String>();
        eqPara.put("c.person.id", addUid);
        eqPara.put("c.type", statusId);
        eqPara.put("c.approvalStatus", approvalStatusId);
        eqPara.put("c.dealStatus", dealStatus);
        eqPara.put("c.person.ifDelete", 0);
        eqPara.put("c.person.status", 1);
        //
        Map<String, Map> paraMap = new HashMap<>();
        paraMap.put("likePara", likePara);
        paraMap.put("likeParaSql", likeParaSql);
        paraMap.put("eqPara", eqPara);
        paraMap.put("eqParaSql", eqPara);
        paraMap.put("timeMap", timeMap);
        return paraMap;
    }

    @Override
    public Page getPageInfo(HttpServletRequest request) {
        Page page = new Page(request);
        page.setTableName("flea_market");// 表名
        page.setEntityName("FleaMarket");// 实体名
        return page;
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Long getFleaMarketAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll) {
        return fleaMarketDao.getFleaMarketAllCountFromPara(para, ifAll);
    }

    @Override
    public String getFileUrlListFromIds(String[] ids) {
        return fleaMarketDao.getFileUrlListFromIds(ids);
    }

    @Override
    public JSONObject dealWithJSONObj(JSONObject requestObject) {
        if(requestObject == null || requestObject.size()==0) {
            throw new NullPointerException();
        }
        String fileUrls = requestObject.get("fileUrls") == null ? "" : requestObject.get("fileUrls").toString();
        if (StringUtils.isBlank(fileUrls)) {
            return requestObject;
        }
        String[] urls = fileUrls.split(",", -1);
        Date date = new Date();
        List<UploadFile> files = new ArrayList<>();
        for (String url : urls) {
            UploadFile file = new UploadFile();
            file.setAddDateTime(date);
            file.setUrl(url);
            file.setName(url);
            files.add(file);
        }
        List<Long> ids = saveAll(files);
        StringBuilder builder = new StringBuilder();
        for (Long id : ids) {
            builder.append(id).append(",");
        }
        String tempIds = builder.toString();
        String saveIds = tempIds.substring(0, tempIds.length() - 1);
        requestObject.remove("fileUrls");
        requestObject.put("fileIds", saveIds);
        return requestObject;
    }

    @Override
    public JSONObject getResultJSONList(String urlIds) {
        JSONObject itemObj = new JSONObject();
        String[] tempIds;
        if (StringUtils.isNotBlank(urlIds)) {
            tempIds = urlIds.split(",", -1);
            String fileUrl = getFileUrlListFromIds(tempIds);
            ArrayList<Long> ids = new ArrayList<>();
            for (String id : tempIds) {
                ids.add(Long.parseLong(id));
            }
            JSONObject file = new JSONObject();
            file.put("id", ids.toArray(new Long[]{}));
            itemObj.put("uploadFile", file);
            itemObj.put("uploadFileUrl", fileUrl);
        } else {
            itemObj.put("uploadFile", null);
            itemObj.put("uploadFileUrl", null);
        }
        return itemObj;
    }

}

package com.lianxing.logistics.controller;

import com.lianxing.logistics.model.User;
import com.lianxing.logistics.service.BaseServiceImpl;
import com.lianxing.logistics.service.UserServiceImpl;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.JsonUtil;
import com.lianxing.logistics.util.PropertiesUtil;
import com.lianxing.logistics.util.data.MD5Util;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Controller
public class BaseController {

    @Autowired
    private BaseServiceImpl baseService;

    @Autowired
    private UserServiceImpl userService;

    /**
     * 构造datatables 需要的JSON串
     *
     * @param list 数据库查出的对象列表
     * @return
     */
    public JSONObject getTableData(List<?> list, Long total) {
        if (list == null) {
            return null;
        }
        JSONObject json = new JSONObject();
        json.put("total", total);
        json.put("data", JSONArray.fromObject(list, JsonUtil.jsonConfig("dateTime")));
        return json;
    }

    /**
     * 检查账号是否重复
     *
     * @param request
     * @throws Exception
     */
    public JSONObject checkCommonRepeat(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            // 将json数据转换为实体对象
            User user;
            user = JsonUtil.jsonToObject(User.class, requestObject.toString());
            // 执行
            HashMap<String, Object> checkMap = new HashMap<>();
            // 将用户的账号先进行大写转换
            if(user != null && user.getAccount() != null) {
                checkMap.put("account", user.getAccount().toUpperCase());
                boolean repeat = baseService.checkRepeat("User", checkMap, user.getId());
                // 重复
                if (!repeat) {
                    json.put("status", Const.REPEAT);
                } else {
                    json.put("status", Const.NOREPEAT);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 检查手机号是否重复
     *
     * @param tel
     * @return
     */
    public JSONObject checkCommonRepeatAboutTel(String tel) {
        JSONObject json = new JSONObject();
        try {
            User user = userService.getUserByTel(tel);
            if (user != null) {
                // 执行
                HashMap<String, Object> checkMap = new HashMap<>();
                checkMap.put("tel", tel);
                boolean repeat = baseService.checkRepeat("User", checkMap, null);
                // 判断重复并且openId为空时
                if (!repeat) {
                    json.put("status", Const.REPEAT);
                    json.put("data", JSONArray.fromObject(user, JsonUtil.jsonConfig("dateTime")));
                }
            } else {
                json.put("status", Const.NOREPEAT);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 根据id删除用户
     *
     * @param id
     * @return
     */
    public JSONObject deleteCommon(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        try {
            // 执行
            User user = baseService.getById(User.class, Long.parseLong(id));
            // 修改删除状态为'删除'
            user.setIfDelete(1);
            baseService.update(user);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 重置用户密码
     *
     * @param id
     * @return
     */
    public JSONObject resetPswUserCommon(@RequestParam("id") String id) {
        JSONObject json = new JSONObject();
        try {
            // 执行
            User user = baseService.getById(User.class, Long.parseLong(id));
            // 修改为: 账号+saltValue+123456
            String saltValue = PropertiesUtil.get("MD5Str");
            String p = user.getAccount() + saltValue + "123456";
            String md5String = MD5Util.getMD5String(p);
            user.setPassword(md5String);
            baseService.update(user);
            String redisToken = MD5Util.getMD5String(md5String) + System.currentTimeMillis();
            baseService.updateRedisKeyAliveTime(redisToken, user.getRole() == 0);
            json.put("token", redisToken);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 注册(保存)/修改用户
     *
     * @param request
     * @return
     */
    public JSONObject registerUser(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        try {
            json = baseService.getJSONFromRequest(request);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 修改用户的OpenId
     *
     * @param request
     * @return
     */
    public JSONObject updateUserWeChatOpenid(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        try {
            json = baseService.getJsonFromUpdateOpenId(request);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 修改密码
     *
     * @param id
     * @return
     */
    public JSONObject updatePassword(@RequestParam("id") String id, @RequestParam("password") String password) {
        JSONObject json = new JSONObject();
        try {
            String redisToken;
            String md5String;
            User user;
            user = baseService.getById(User.class, Long.parseLong(id));
            md5String = baseService.getMd5String(user, password);
            user.setPassword(md5String);
            redisToken = MD5Util.getMD5String(md5String) + System.currentTimeMillis();
            baseService.updateRedisKeyAliveTime(redisToken, user.getRole() == 0);
            json.put("token", redisToken);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 修改用户的状态
     *
     * @param statusType
     * @param id
     * @param request
     * @return
     */
    public JSONObject changeUserStatus(@RequestParam("statusType") String statusType,
                                       @RequestParam("id") String id,
                                       HttpServletRequest request) {
        JSONObject json = new JSONObject();
        try {
            // 执行
            User user = baseService.getById(User.class, Long.parseLong(id));
            String parameterStr = request.getParameter("parameter");
            Integer parameter;
            if ("status".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = user.getStatus() == 1 ? 0 : 1;
                }
                user.setStatus(parameter);
            } else if ("approvalStatus".equals(statusType)) {
                if (parameterStr != null) {
                    parameter = Integer.parseInt(parameterStr);
                } else {
                    parameter = user.getApprovalStatus() == 1 ? 0 : 1;
                }
                if (parameter == 1) {
                    user.setApprovalDateTime(new Date());
                } else if (parameter == 0) {
                    user.setApprovalDateTime(null);
                }
                user.setApprovalStatus(parameter);
            }
            user.setUpdateDateTime(new Date());
            baseService.update(user);
            json.put("status", Const.SUCCESS);
        } catch (Exception e) {
            json.put("status", Const.ERROR);
            e.printStackTrace();
        }
        return json;
    }

}

package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.UserDaoImpl;
import com.lianxing.logistics.model.User;
import com.lianxing.logistics.util.Const;
import com.lianxing.logistics.util.JsonUtil;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service("userService")
public class UserServiceImpl extends BaseServiceImpl implements UserService {

    @Autowired
    private UserDaoImpl userDao;

    @Override
    public JSONObject getUserFromOpenId(String openId) {
        try {
            return userDao.getUserFromOpenId(openId);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public String getUserPasswordById(Long id) {
        return userDao.getUserPasswordById(id);
    }

    @Override
    public JSONObject checkUserPassword(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        try {
            // 将取得的数据转换为json
            JSONObject requestObject = JsonUtil.getJSONObjFromRequset(request);
            // 将json数据转换为实体对象
            User user;
            user = JsonUtil.jsonToObject(User.class, requestObject.toString());
            Long id = user.getId();
            // 取出数据库中的加密的密码
            String passwordFromDataBase = getUserPasswordById(id);
            // 将user中的密码加密
            String md5String;
            md5String = getMd5String(user, user.getPassword());
            // 判断两个加密后的密码是否相等
            if (md5String.equals(passwordFromDataBase)) {
                json.put("status", Const.SUCCESS);
            } else {
                json.put("status", Const.ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return json;
    }

    @Override
    public User getUserByWorkerId(Long workerId) {
        return userDao.getUserByWorkerId(workerId);
    }

    @Override
    public List getUserListForErgodic(List list) {
        List<User> userList = new ArrayList<>();
        Iterator it = list.iterator();
        while (it.hasNext()) {
            Map map = (Map) it.next();
            Long workerId = (Long) map.get("id");
            User user;
            user = userDao.getUserByWorkerId(workerId);
            if (user != null) {
                userList.add(user);
            }
        }
        return userList;
    }

    @Override
    public User getUserByTel(String tel) {
        return userDao.getUserByTel(tel);
    }

    @Override
    public User getAdministrativeUser() {
        return userDao.getAdministrativeUser();
    }

}

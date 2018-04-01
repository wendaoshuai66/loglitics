package com.lianxing.logistics.service;

import com.lianxing.logistics.dao.BaseDaoImpl;
import com.lianxing.logistics.model.MaintenanceWorker;
import com.lianxing.logistics.model.Student;
import com.lianxing.logistics.model.Teacher;
import com.lianxing.logistics.model.User;
import com.lianxing.logistics.util.*;
import com.lianxing.logistics.util.data.MD5Util;
import com.lianxing.logistics.util.date.DateTime;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service("baseService")
public class BaseServiceImpl implements BaseService {

    @Autowired
    BaseDaoImpl baseDao;

    @Override
    public <T> Long save(T entity) {
        return baseDao.save(entity);
    }

    @Override
    public <T> List<Long> saveAll(Collection<T> entitys) {
        return baseDao.saveAll(entitys);
    }

    @Override
    public <T> void delete(T entity) {
        baseDao.delete(entity);
    }

    @Override
    public <T> void deleteAll(Collection<T> entities) {
        baseDao.deleteAll(entities);
    }

    @Override
    @Transactional
    public <T> void update(T entity) {
        baseDao.update(entity);
    }

    @Override
    public <T> T getById(Class<?> clazz, Long id) {
        return baseDao.getById(clazz, id);
    }

    @SuppressWarnings({"rawtypes"})
    @Override
    public <T> List<T> getByObject(Map entity, Integer type, boolean ifAll, String entityName, boolean only) {
        return baseDao.getByObject(entity, type, ifAll, entityName, only);
    }

    @Override
    public <T> List<T> getAll(boolean ifAll, String entityName, String... ignoreDeleteAndStatus) {
        return baseDao.getAll(ifAll, entityName, ignoreDeleteAndStatus);
    }

    @Override
    public boolean checkRepeat(String entityName, Map<String, Object> para, Object id, boolean... flag) throws Exception {
        return baseDao.checkRepeat(entityName, para, id, flag);
    }

    @SuppressWarnings("rawtypes")
    @Override
    public <T> List<T> getList(Page page, Map<String, Map> paraMap, boolean ifAll) {
        return baseDao.getList(page, paraMap, ifAll);
    }

    // @Override
    // public Long getStatusIdFromValue(String value) {
    // return baseDao.getStatusIdFromValue(value);
    // }

    @Override
    public <T> T getObjFromValue(Map<String, String> map) {
        return baseDao.getObjFromValue(map);
    }

    @Override
    public String getMd5String(User user, String newPassword) {
        String saltValue = PropertiesUtil.get("MD5Str");
        String p;
        if (user.getPassword() == null) {
            p = user.getAccount() + saltValue + "123456";
        } else {
            p = user.getAccount() + saltValue + newPassword;
        }
        String md5String = MD5Util.getMD5String(p);
        return md5String;
    }

    @Override
    public JSONObject getJSONFromRequest(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String mobile = request.getParameter("mobile");
        // 保存时清空注册手机的验证码redis缓存
        RedisClient redisClient = new RedisClient();
        redisClient.del(RedisUtil.REDIS_PREFIX + mobile + ".registerCode");
        // 将取得的数据转换为json
        JSONObject requestObject = null;
        try {
            requestObject = JsonUtil.getJSONObjFromRequset(request);
            //requestObject.put("weChatNickName", requestObject.get("weChatNickName").toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 将json数据转换为实体对象
        User user;
        user = JsonUtil.jsonToObject(User.class, requestObject.toString());
        // 将用户的账号进行处理（账号英文字母全部转换为大写）
        String account = user.getAccount().toUpperCase();
        user.setAccount(account);
        // 获取到用户的审核状态
        Integer approvalStatus = user.getApprovalStatus();
        MaintenanceWorker worker;
        Teacher teacher;
        Student student;
        try {
            worker = user.getMaintenanceWorker();
            teacher = user.getTeacher();
            student = user.getStudent();
        } catch (NullPointerException e) {
            return null;
        }
        Integer role = worker == null ? (teacher == null ? 3 : 2) : 1;
        String redisToken;
        String md5String = null;
        Integer sex = user.getSex();
        String headPicture = user.getHeadPicture();
        String male = "images/user/male.jpg";
        String female = "images/user/female.jpg";
        if (user.getId() == null) {
            user.setRole(role);
            if (role == 1) {
                Long id = save(worker);
                worker.setId(id);
                user.setMaintenanceWorker(worker);
                json.put("workerId", id);
            } else if (role == 2) {
                Long id = save(teacher);
                teacher.setId(id);
                user.setTeacher(teacher);
                json.put("teacherId", id);
            } else {
                Long id;
                if (student == null) {
                    Student studentNew = new Student();
                    id = save(studentNew);
                    studentNew.setId(id);
                    user.setStudent(studentNew);
                } else {
                    id = save(student);
                    student.setId(id);
                    user.setStudent(student);
                }
                json.put("studentId", id);
            }
            if (StringUtils.isBlank(headPicture)) {
                // 1：男   0：女
                if (sex == 1) {
                    headPicture = male;
                } else if (sex == 0) {
                    headPicture = female;
                }
                user.setHeadPicture(headPicture);
            }
            md5String = getMd5String(user, user.getPassword());
            user.setPassword(md5String);
            if (approvalStatus == 1) {
                user.setApprovalDateTime(new Date());
            }
            Long userId = save(user);
            json.put("userId", userId);
        } else {
            user.setUpdateDateTime(new Date());
            if (role == 1) {
                update(worker);
            } else if (role == 2) {
                update(teacher);
            } else if (role == 3) {
                update(student);
            }
            // 1：男   0：女
            if (sex == 1) {
                if (female.equals(headPicture)) {
                    headPicture = male;
                }
            } else if (sex == 0) {
                if (male.equals(headPicture)) {
                    headPicture = female;
                }
            }
            user.setHeadPicture(headPicture);
            if (user.getApprovalStatus() == 1) {
                user.setApprovalDateTime(new Date());
            } else if (user.getApprovalStatus() == 0) {
                user.setApprovalDateTime(null);
            }
            update(user);
        }
        redisToken = MD5Util.getMD5String(md5String) + System.currentTimeMillis();
        updateRedisKeyAliveTime(redisToken, user.getRole() == 0);
        json.put("token", redisToken);
        return json;
    }

    @Override
    public JSONObject getJsonFromUpdateOpenId(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        // 将取得的数据转换为json
        JSONObject requestObject = null;
        try {
            requestObject = JsonUtil.getJSONObjFromRequset(request);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 将json数据转换为实体对象
        User user;
        user = JsonUtil.jsonToObject(User.class, requestObject.toString());
        user.setUpdateDateTime(new Date());
        update(user);
        return json;
    }

    /**
     * 根据主key 更新redis存活时间
     *
     * @param key             更新的key
     * @param isAdministrator 是否为超级管理员
     */
    public void updateRedisKeyAliveTime(String key, boolean isAdministrator) {
        // 获取到jedis实例
        RedisClient redisClient = new RedisClient();
        // 存入缓存
        if (!redisClient.exists(RedisUtil.REDIS_PREFIX + key)) {
            if (isAdministrator) {
                redisClient.set(RedisUtil.REDIS_PREFIX + key, "administrator");
            } else {
                redisClient.set(RedisUtil.REDIS_PREFIX + key, "true");
            }
        }
        redisClient.expire(RedisUtil.REDIS_PREFIX + key, DateTime.getSecondFromDay(1));
    }

}

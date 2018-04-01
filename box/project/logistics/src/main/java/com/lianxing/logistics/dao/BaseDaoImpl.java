package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;
import com.lianxing.logistics.util.date.DateTime;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.text.ParseException;
import java.util.*;
import java.util.Map.Entry;

@Repository("baseDao")
public class BaseDaoImpl implements BaseDao {

    /**
     * 初始化Log4j的一个实例
     */
    private static final Logger logger = Logger.getLogger(BaseDaoImpl.class);

    @Autowired
    private HibernateTemplate hibernateTemplate;

    /**
     * 获取session
     *
     * @return session
     */
    public Session getSession() {
        return hibernateTemplate.getSessionFactory().getCurrentSession();
    }

    /**
     * 插入一条记录
     */
    @Override
    public <T> Long save(T entity) {
        try {
            Serializable result = hibernateTemplate.save(entity);
            hibernateTemplate.flush();
            Long id = (Long) result;
            if (logger.isDebugEnabled()) {
                logger.debug("保存实体成功," + entity.getClass().getName());
            }
            return id;
        } catch (RuntimeException e) {
            logger.error("保存实体异常" + entity.getClass().getName(), e);
            e.printStackTrace();
            throw e;
        }
    }


    @Override
    public <T> List<Long> saveAll(Collection<T> entitys) {
        try {
            List<Long> ids = new ArrayList<>();
            for (Object entity : entitys) {
                Serializable result = hibernateTemplate.save(entity);
                hibernateTemplate.flush();
                Long id = (Long) result;
                ids.add(id);
            }
            return ids;
        } catch (RuntimeException e) {
            logger.error("保存实体异常" + entitys.getClass().getName(), e);
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 删除一条记录
     */
    @Override
    public <T> void delete(T entity) {
        try {
            hibernateTemplate.delete(entity);
            hibernateTemplate.flush();
            if (logger.isDebugEnabled()) {
                logger.debug("删除成功," + entity.getClass().getName());
            }
        } catch (RuntimeException e) {
            logger.error("删除异常", e);
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 删除全部的实体
     *
     * @param <T>
     * @param entitys 实体对象集合
     */
    @Override
    public <T> void deleteAll(Collection<T> entitys) {
        for (Object entity : entitys) {
            hibernateTemplate.delete(entity);
            hibernateTemplate.flush();
        }
    }

    /**
     * 更新一条记录
     */
    @Override
    public <T> void update(T entity) {
        try {
            hibernateTemplate.update(entity);
            hibernateTemplate.flush();
            if (logger.isDebugEnabled()) {
                logger.debug("更新成功," + entity.getClass().getName());
            }
        } catch (RuntimeException e) {
            logger.error("更新异常", e);
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 删除全部的实体
     *
     * @param <T>
     * @param entitys 实体对象集合
     */
    @Override
    public <T> void updateAll(Collection<T> entitys) {
        for (Object entity : entitys) {
            hibernateTemplate.update(entity);
            hibernateTemplate.flush();
        }
    }

    /**
     * 根据主键获取对象
     *
     * @param clazz 实体对象的字节码
     * @param id    主键Id
     * @return 匹配的实体对象
     */
    @Override
    public <T> T getById(Class<?> clazz, Long id) {
        if (null == id || "".equals(id)) {
            return null;
        }
        @SuppressWarnings("unchecked")
        T object = (T) hibernateTemplate.get(clazz, id);
        return object;
    }

    /**
     * 根据特定属性获取对象
     *
     * @param entity     包含特定属性的集合
     * @param type       用于确定取集合的第几个属性
     * @param ifAll      是否取全部对象（包括隐藏、不显示等）
     * @param entityName 实体类名
     * @param ifOnlyOne  是否只取唯一的对象
     * @return 获取的满足条件的唯一实体对象
     */
    @SuppressWarnings("rawtypes")
    @Override
    public <T> List<T> getByObject(Map entity, Integer type, boolean ifAll, String entityName,
                                   boolean ifOnlyOne) {
        // 根据条件查询
        StringBuffer condition = new StringBuffer("");
        if (type == 1) {
            // name
            condition.append(" and name= ").append(entity.get("name"));
        } else if (type == 0) {
            condition.append(" and weChatNum = ").append(entity.get("weChatNum"));
            // 根据账号获取 user 信息
        } else if (type == 2) {
            condition.append(" and account = '").append(entity.get("account") + "'");
        } else if (type == 3) {
            condition.append(" and account = '").append(entity.get("account") + "'");
            condition.append(" and role = ").append(entity.get("role"));
        }
        // 实体类名
        String hql = "from " + entityName + " where 1=1 " + condition.toString();
        // 查询全部还是只查询状态为1的
        if (!ifAll) {
            hql += " and status = 1 and ifDelete = 0 and approvalStatus = 1";
        }
        @SuppressWarnings("unchecked")
        List<T> list = (List<T>) hibernateTemplate.find(hql);
        if (list.size() > 0) {
            // 取唯一的对象
            if (ifOnlyOne) {
                return list.subList(0, 1);
            } else {
                return list;
            }
        }
        return null;
    }

    /**
     * 获取全部实体对象
     *
     * @param ifAll      是否取全部对象（包括隐藏、不显示等）
     * @param entityName 实体类名
     * @return 结果集
     */
    @Override
    public <T> List<T> getAll(boolean ifAll, String entityName, String... ignoreDeleteAndStatus) {
        StringBuilder hql = new StringBuilder().append("from ").append(entityName);
        hql.append(" where 1=1 ");
        if (ignoreDeleteAndStatus.length > 0) {
            if ("true".equals(ignoreDeleteAndStatus[0])) {
                return (List<T>) hibernateTemplate.find(hql.toString());
            }
        }
        hql.append(" and ifDelete = 0 ");
        // 查询全部还是只查询状态为1的
        if (!ifAll) {
            hql.append(" and status=1 ");
        }
        hql.append(" ORDER BY addDateTime DESC ");
        return (List<T>) hibernateTemplate.find(hql.toString());
    }

    /**
     * 修改,新增属性判断是否重复
     *
     * @param entityName 实体类名
     * @param para       需要判断的集合对象(key:属性名,value:实际的参数值)
     * @param id         修改判断时，当前实体类的id
     * @param flag       可变参，针对字段中不存在ifDelete情况
     * @return true:不重复,false:重复或异常
     */
    @Override
    public boolean checkRepeat(String entityName, Map<String, Object> para, Object id, boolean... flag) throws Exception {
        try {
            String hql = "from " + entityName + " c where 1=1 ";
            for (Entry<String, Object> entry : para.entrySet()) {
                String key = String.valueOf(entry.getKey());
                Object value = StringUtils.trim(entry.getValue().toString());
                hql += " and c." + key + "='" + value + "'";
            }
            // 修改时,需要把当前id所属的对象除去
            if (id != null) {
                hql += " and c.id <> " + Long.parseLong(id.toString());
            }
            if (flag.length == 0) {
                hql += " and c.ifDelete = 0 ";
            }
            Session session = getSession();
            int i = session.createQuery(hql).list().size();
            if (i == 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 根据模糊条件以及精确条件拼接需要的buffer
     *
     * @param buffer   原始buffer
     * @param likePara 模糊查询条件
     * @param eqPara   精确查询条件
     * @return
     */
    @SuppressWarnings("rawtypes")
    public StringBuffer getParaBuffer(StringBuffer buffer, Map likePara, Map eqPara) {
        // 设置模糊查询参数
        if (likePara != null) {
            Iterator iter = likePara.entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry) iter.next();
                if (entry.getValue() == null || StringUtils.isBlank(entry.getValue().toString())) {
                    continue;
                }
                buffer.append(" and " + entry.getKey() + " like " + "'%" + entry.getValue() + "%'");
            }
        }

        // 设置非模糊查询参数
        if (eqPara != null) {
            Iterator iter = eqPara.entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry) iter.next();
                if (entry.getValue() == null || StringUtils.isBlank(entry.getValue().toString())) {
                    continue;
                }
                buffer.append(" and " + entry.getKey() + " = " + "'" + entry.getValue() + "'");
            }
        }
        return buffer;
    }

    /**
     * 拼接发布时间与审核时间 查询的条件
     *
     * @param buffer
     * @param timeMap
     * @return
     */
    @SuppressWarnings("rawtypes")
    public StringBuffer putTimeQueryInfo(StringBuffer buffer, Map timeMap) {
        if (timeMap == null) {
            return buffer;
        }
        String addStart = (String) timeMap.get("addStart");
        String addEnd = getNextDayStr((String) timeMap.get("addEnd"));
        String reviewStart = (String) timeMap.get("reviewStart");
        String reviewEnd = getNextDayStr((String) timeMap.get("reviewEnd"));
        String storageStart = (String) timeMap.get("storageStart");
        // 入、出库时间只到年月日，不需要加一天操作
        String storageEnd = (String) timeMap.get("storageEnd");
        String stockRemovalStart = (String) timeMap.get("stockRemovalStart");
        String stockRemovalEnd = (String) timeMap.get("stockRemovalEnd");
        buffer.append(" AND ");
        try {
            // 发布时间
            if (StringUtils.isNotBlank(addStart) && StringUtils.isNotBlank(addEnd)) {
                buffer.append("( addDateTime BETWEEN").append(" '" + addStart + "' AND  '" + addEnd + "')");
            } else if (StringUtils.isNotBlank(addStart)) {
                buffer.append(" addDateTime >= '" + addStart + "'");
            } else if (StringUtils.isNotBlank(addEnd)) {
                buffer.append(" addDateTime <= '" + addEnd + "')");
            } else {
                buffer.append(" 1=1 ");
            }
            buffer.append(" AND ");
            // 审核时间
            if (StringUtils.isNotBlank(reviewStart) && StringUtils.isNotBlank(reviewEnd)) {
                buffer.append("( approvalDateTime BETWEEN").append(" '" + reviewStart + "' AND '" + reviewEnd + "')");
            } else if (StringUtils.isNotBlank(reviewStart)) {
                buffer.append(" approvalDateTime >= '" + reviewStart + "'");
            } else if (StringUtils.isNotBlank(reviewEnd)) {
                buffer.append(" approvalDateTime <= '" + reviewEnd + "')");
            } else {
                buffer.append(" 1=1 ");
            }
            buffer.append(" AND ");
            // 入库时间
            if (StringUtils.isNotBlank(storageStart) && StringUtils.isNotBlank(storageEnd)) {
                buffer.append("( storageDate BETWEEN").append(" '" + storageStart + "' AND '" + storageEnd + "')");
            } else if (StringUtils.isNotBlank(storageStart)) {
                buffer.append(" storageDate >= '" + storageStart + "'");
            } else if (StringUtils.isNotBlank(storageEnd)) {
                buffer.append(" storageDate <= '" + storageEnd + "')");
            } else {
                buffer.append(" 1=1 ");
            }
            buffer.append(" AND ");
            // 出库时间
            if (StringUtils.isNotBlank(stockRemovalStart) && StringUtils.isNotBlank(stockRemovalEnd)) {
                buffer.append("( stockRemovalDate BETWEEN")
                        .append(" '" + stockRemovalStart + "' AND '" + stockRemovalEnd + "')");
            } else if (StringUtils.isNotBlank(stockRemovalStart)) {
                buffer.append(" stockRemovalDate >= '" + stockRemovalStart + "'");
            } else if (StringUtils.isNotBlank(stockRemovalEnd)) {
                buffer.append(" stockRemovalDate <= '" + stockRemovalEnd + "')");
            } else {
                buffer.append(" 1=1 ");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return buffer;
    }

    /**
     * 获取nextDay字符串
     *
     * @param day
     * @return
     */
    public String getNextDayStr(String day) {
        if (day == null) {
            return null;
        }
        int status = 1;
        if (day.length() == 6) {
            status = 1;
        } else if (day.length() == 19) {
            status = 3;
        }
        try {
            Date date = DateTime.stringToDate(day, status);
            Date nextDay = new Date(date.getTime() + 86400000L);
            return DateTime.dateToString(nextDay, status);
        } catch (ParseException e) {
            return null;
        }
    }

    /**
     * 拼接单个精确或者模糊SQL片段
     *
     * @param para 具体参数
     * @param col  详细字段
     * @param flag like 或者 = (精确或者模糊)
     * @return
     */
    public String appendSqlBuffer(Object para, String col, String flag) {
        String paraString = "";
        if ("=".equals(flag)) {
            paraString = " '" + para + "' ";
        } else if ("LIKE".equals(flag)) {
            paraString = " '%" + para + "%' ";
        }
        return (para == null || para == "") ? " AND 1=1 " : " AND " + col + " " + flag + paraString + "\n";
    }

    /**
     * 通用查询
     *
     * @param <T>
     * @param page    page对象，封装了实体名、表明、分页起始数、每页个数、排序字段、排序规则、返回值中有满足的条件的总数
     * @param ifAll   是否查询全部（包括隐藏等）Map<String ,Map>
     * @param paraMap <String ,Map> paraMap
     *                key:
     *                likeParaSql: sql中使用的模糊查询条件
     *                eqParaSql: sql中使用的精确查询条件
     *                likePara: hql中使用的模糊查询条件
     *                eqPara: hql中使用的精确查询条件
     * @return 满足分页及条件查询的实体集合
     */
    @SuppressWarnings("rawtypes")
    @Override
    public <T> List<T> getList(Page page, Map<String, Map> paraMap, boolean ifAll) {

        StringBuffer hql = new StringBuffer();
        hql.append("from " + page.getEntityName() + " c where 1=1 and c.ifDelete = 0");
        hql = getParaBuffer(hql, getParaMap(paraMap, "likePara"), getParaMap(paraMap, "eqPara"));
        hql = putTimeQueryInfo(hql, getParaMap(paraMap, "timeMap"));
        // 排序字段的名称
        String orderByField = page.getOrderByName();
        // 排序方式
        String sortMethod = page.getOrderByDesc() ? " desc" : " asc";
        hql.append(" order by " + orderByField + sortMethod);
        Session session = getSession();
        Query query = session.createQuery(hql.toString());
        query.setFirstResult(page.countOffset());
        // page 信息
        query.setMaxResults(page.pageSize);
        @SuppressWarnings("unchecked")
        List<T> list = (List<T>) query.list();
        return list;
    }

    @SuppressWarnings("rawtypes")
    public Map getParaMap(Map<String, Map> paraMap, String key) {
        if (paraMap == null || paraMap.size() == 0) {
            return null;
        }
        return (paraMap.get(key) == null || "".equals(paraMap.get(key).toString())) ? null : paraMap.get(key);
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T> T getObjFromValue(Map<String, String> map) {
        String entityName = map.get("entityName");
        String para = map.get("colName");
        String value = map.get("value");
        String hql = "from " + entityName + " where " + para + "='" + value + "'";
        List<T> find = (List<T>) hibernateTemplate.find(hql);
        T t = find.get(0);
        return t;
    }

}

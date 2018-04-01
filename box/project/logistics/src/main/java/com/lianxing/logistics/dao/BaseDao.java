package com.lianxing.logistics.dao;

import com.lianxing.logistics.util.Page;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * 通用DAO层
 */
public interface BaseDao {

    // 插入一条记录
    <T> Long save(T entity);

    <T> List<Long> saveAll(Collection<T> entitys);

    // 删除一条记录
    <T> void delete(T entity);

    // 删除实体集合
    <T> void deleteAll(Collection<T> entities);

    // 更新一条记录
    <T> void update(T entity);

    // 更新全部集合
    <T> void updateAll(Collection<T> entities);

    // 根据主键获取对象
    <T> T getById(Class<?> clazz, Long id);

    // 根据特定属性获取对象集合
    @SuppressWarnings("rawtypes")
    <T> List<T> getByObject(Map entity, Integer type, boolean ifAll, String entityName, boolean only);

    // 获取全部实体对象
    <T> List<T> getAll(boolean ifAll, String entityName, String... ignoreDeleteAndStatus);

    // 新增&修改判断重复
    boolean checkRepeat(String entityName, Map<String, Object> para, Object id, boolean... flag) throws Exception;

    // 分页&条件数据查询
    @SuppressWarnings("rawtypes")
    <T> List<T> getList(Page page, Map<String, Map> paraMap, boolean ifAll);

    // 通过状态值获取对应状态Id
    // public Long getStatusIdFromValue(String value);

    // 通过查询对象获取唯一对象
    <T> T getObjFromValue(Map<String, String> map);

}

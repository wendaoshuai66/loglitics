package com.lianxing.logistics.dao;

import com.lianxing.logistics.model.InforSlide;
import com.lianxing.logistics.util.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository("slideDao")
public class InforSlideDaoImpl extends BaseDaoImpl implements InforSlideDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HibernateTemplate hibernateTemplate;

    @SuppressWarnings("rawtypes")
    @Override
    public Long getInforSlideAllCountFromPara(Page page, Map<String, Map> para, boolean ifAll, Integer integer) {
        Map likeParaMap = para.get("likePara");
        Map eqParaSqlMap = para.get("eqPara");
        Map likeParaForWechatMap = para.get("likeParaForWechat");
        Map eqParaSqlForWechatMap = para.get("eqParaForWechat");
        Map timeMap = para.get("timeMap");
        String sql = getInforSlideCount(integer);
        if (!ifAll) {
            if (integer == 4) {
                sql += " and i.status = 1 ";
            } else {
                sql += " and c.status = 1 ";
            }
        }
        StringBuffer buffer = new StringBuffer(sql);
        StringBuffer sqlBuffer;
        if (integer == 4) {
            // 4表示微信端的调用
            sqlBuffer = getParaBuffer(buffer, likeParaForWechatMap, eqParaSqlForWechatMap);
        } else {
            // 1表示页面的调用
            sqlBuffer = getParaBuffer(buffer, likeParaMap, eqParaSqlMap);
        }
        sqlBuffer = putTimeQueryInfo(sqlBuffer, timeMap);
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlBuffer.toString());
        return Long.parseLong(map.get("count").toString());
    }

    @Override
    public Long getInforSlideHomeshowCount() {
        String sql = getInforSlideCount(1) + " AND c.homeShow = 1 ";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql);
        return Long.parseLong(map.get("count").toString());
    }

    /**
     * 通用的 infor_slide 查询
     *
     * @param i 标志 i==1 : 求页面的总数   i==2 : 求页面的list   i==3 : 求微信端的list   i==4 : 求微信端的总数
     * @return
     */
    private String getInforSlideCount(int i) {
        if (i > 2) {
            return "SELECT " + ((i == 4) ? " COUNT(1) count " : " i.* ") + " FROM `infor_slide` i,infor_picture p,infor_module m WHERE i.inforId = p.id and p.moduleId = m.id and m.ifDelete = 0 and m.status = 1  AND i.ifDelete = 0 AND p.ifDelete = 0 " +
                    " AND p.approvalStatus = 1 AND i.slideType = 1";
        } else {
            return "SELECT " + ((i == 1) ? " COUNT(1) count " : " c.* ") + " FROM (SELECT * FROM infor_slide i WHERE i.ifDelete = 0 " +
                    " AND i.slideType = 0 UNION all SELECT i.* FROM `infor_slide` i,infor_picture p ,infor_module m WHERE p.moduleId = m.id and m.ifDelete = 0 and m.status = 1 " +
                    " and i.inforId = p.id AND i.ifDelete = 0 AND p.ifDelete = 0 AND p.approvalStatus = 1 AND i.slideType = 1 ) c WHERE 1=1 ";
        }
    }

    @Override
    public void update(Long id, String title) {
        String sql = "UPDATE infor_slide i SET i.title = '" + title + "' WHERE i.inforId = " + id;
        jdbcTemplate.update(sql);
    }

    @Override
    public <T> List<T> getInforSlideList(Page page, Map<String, Map> paraMap, boolean ifAll, Integer integer) {
        StringBuffer sql = new StringBuffer();
        sql.append(getInforSlideCount(integer));
        if (integer == 3) {
            // 3表示微信端的调用
            sql = getParaBuffer(sql, getParaMap(paraMap, "likeParaForWechat"), getParaMap(paraMap, "eqParaForWechat"));
        } else {
            // 2表示页面的调用
            sql = getParaBuffer(sql, getParaMap(paraMap, "likePara"), getParaMap(paraMap, "eqPara"));
        }
        sql = putTimeQueryInfo(sql, getParaMap(paraMap, "timeMap"));
        // 排序字段的名称
        String orderByField = page.getOrderByName();
        // 排序方式
        String sortMethod = page.getOrderByDesc() ? " desc" : " asc";
        sql.append(" order by " + orderByField + sortMethod);
        Integer start = (page.getCurrentPage() - 1) * page.getPageSize();
        Integer end = page.getPageSize();
        sql.append(" limit " + start + "," + end);
        List<T> list = (List<T>) jdbcTemplate.queryForList(sql.toString());
        return list;
    }

    @Override
    public InforSlide getInforSlideList(String id) {
        String hql = "FROM InforSlide i WHERE i.inforPicture.id = " + id;
        List<InforSlide> list = (List<InforSlide>) hibernateTemplate.find(hql);
        if (list.size() > 0) {
            return list.subList(0, 1).get(0);
        } else {
            if (list.size() == 0) {
                return null;
            } else {
                return list.get(0);
            }
        }
    }

    @Override
    public List<InforSlide> getInforSlideListByModuleId(String id) {
        String hql = "FROM InforSlide i WHERE i.inforPicture.inforModule.id = " + id;
        List<InforSlide> list = (List<InforSlide>) hibernateTemplate.find(hql);
        return list;
    }
}

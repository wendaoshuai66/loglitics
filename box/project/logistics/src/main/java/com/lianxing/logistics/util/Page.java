package com.lianxing.logistics.util;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

public class Page {

    // 查询记录总数
    private Long totalRecords;

    // 每页多少条记录
    public Integer pageSize = 10;

    // 第几页
    private Integer pageNum;

    // 当前页
    private Integer currentPage = 1;

    // 排序字段
    String orderByName;

    // 是否倒序
    Boolean orderByDesc;

    // 录制日期起始范围
    Date startDate;

    // 录制日期截止范围
    Date endDate;

    // 实体类名
    private String entityName;
    // 数据库名
    private String tableName;

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getOrderByName() {
        return orderByName;
    }

    public void setOrderByName(String orderByName) {
        this.orderByName = orderByName;
    }

    public Boolean getOrderByDesc() {
        return orderByDesc;
    }

    public void setOrderByDesc(Boolean orderByDesc) {
        this.orderByDesc = orderByDesc;
    }

    public Long getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(Long totalRecords) {
        this.totalRecords = totalRecords;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    /**
     * 计算当前页开始记录
     *
     * @return 当前页开始记录号
     */
    public Integer countOffset() {
        Integer offset = pageSize * (currentPage - 1);
        return offset;
    }

    /**
     * @return 总页数
     * public Integer getTotalPages() {
     * return (totalRecords + pageSize - 1) / pageSize;
     * }
     */

    public Page(HttpServletRequest request) {
        // 排序字段
        this.orderByName = request.getParameter("order[name]");
        String orderDir = request.getParameter("order[dir]");
        String pageSize = request.getParameter("pageSize");
        try {
            if (pageSize != null) {
                int size = Integer.parseInt(pageSize);
                this.setPageSize(size);
            }
        } catch (Exception e) {
            this.setPageSize(10);
        }
        // 排序规则（desc,asc）
        boolean sort = false;
        if ("desc".equalsIgnoreCase(orderDir)) {
            sort = true;
        }
        this.orderByDesc = sort;// desc
        // 当前页
        String pageNumber = request.getParameter("pageNumber");
        this.currentPage = Integer.parseInt(pageNumber);// 当前页
    }

    public Page() {

    }

}
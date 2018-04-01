package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "work_diary")
public class WorkDiary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID-

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "addUid", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1 and role=1 ")
    private User user; // 填写工作日志人员

    private String title; // 标题

    private String content;// 内容

    private Integer status = 1;// 发布状态: 1 已经发布 0 未发布

    private Date workDate; // 日志日期：年月日

    private Date startTime;// 开始时间：时分

    private Date endTime;// 结束时间：时分

    //private String reviewer;// 审核人员

    //private Date reviewDateTime;// 审核时间

    private Date addDateTime = new Date();// 添加时间

    // private Date updateDateTime = new Date(); // 更新时间

    private Integer ifDelete = 0; // 删除标志位（0：未删除，1：删除）

    public Date getWorkDate() {
        return workDate;
    }

    public void setWorkDate(Date workDate) {
        this.workDate = workDate;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

//    public String getReviewer() {
//        return reviewer;
//    }
//
//    public void setReviewer(String reviewer) {
//        this.reviewer = reviewer;
//    }
//
//    public Date getReviewDateTime() {
//        return reviewDateTime;
//    }
//
//    public void setReviewDateTime(Date reviewDateTime) {
//        this.reviewDateTime = reviewDateTime;
//    }

    public Date getAddDateTime() {
        return addDateTime;
    }

    public void setAddDateTime(Date addDateTime) {
        this.addDateTime = addDateTime;
    }
}

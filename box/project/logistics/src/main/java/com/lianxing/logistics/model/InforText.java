package com.lianxing.logistics.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "infor_text")
public class InforText implements java.io.Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    private String title; // 标题

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "addUid", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private User author;// 联系人

    private Date addDateTime = new Date();// 添加时间

    private Integer approvalStatus = 0; // 审核状态，默认未通过0,通过1

    private Date approvalDateTime; // 审核日期

    // private String approvalPerson; // 审核人员

    private Long viewTimes = 0L; // 浏览次数

    private String reply; // 回复

    private Integer ifDelete = 0;// 删除标志位（0：未删除，1：删除）

    @Column(name = "article", length = 1000)
    // @Column(name = "article", columnDefinition = "BLOB", nullable = true)
    private String article; // 文章内容（summernote中的使用的html文本）

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

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Date getAddDateTime() {
        return addDateTime;
    }

    public void setAddDateTime(Date addDateTime) {
        this.addDateTime = addDateTime;
    }

    public Integer getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(Integer approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public Date getApprovalDateTime() {
        return approvalDateTime;
    }

    public void setApprovalDateTime(Date approvalDateTime) {
        this.approvalDateTime = approvalDateTime;
    }

    public Long getViewTimes() {
        return viewTimes;
    }

    public void setViewTimes(Long viewTimes) {
        this.viewTimes = viewTimes;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }

    public String getArticle() {
        return article;
    }

    public void setArticle(String article) {
        this.article = article;
    }

}

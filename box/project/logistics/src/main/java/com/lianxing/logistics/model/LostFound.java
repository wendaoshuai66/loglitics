package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "lost_found")
public class LostFound implements java.io.Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    private String title; // 标题

    private String description; // 内容

    private Integer type = 0;// 类别：1--失物 , 0--招领

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "addUid", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private User person;// 联系人

    private Date addDateTime = new Date();// 发布时间

    private Integer approvalStatus = 0; // 审核状态，默认通过 (0:未通过，1:通过)

    private Integer dealStatus = 0;// 完成状态，默认未完成 (0:未完成，1:完成)

    private Date approvalDateTime; // 审核日期

    // private String approvalPerson; // 审核人员

    private Long viewTimes = 0L; // 浏览次数

    private Integer ifDelete = 0;// 删除标志位（0：未删除，1：删除）

    private String fileIds;// 文件 (存储文件的id，按英文逗号隔开 1,2,3)

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public User getPerson() {
        return person;
    }

    public void setPerson(User person) {
        this.person = person;
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

    public Integer getDealStatus() {
        return dealStatus;
    }

    public void setDealStatus(Integer dealStatus) {
        this.dealStatus = dealStatus;
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

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }

    public String getFileIds() {
        return fileIds;
    }

    public void setFileIds(String fileIds) {
        this.fileIds = fileIds;
    }
}

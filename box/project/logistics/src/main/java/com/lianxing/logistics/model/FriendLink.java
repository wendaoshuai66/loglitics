package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "friend_link")
public class FriendLink implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    private String title; // 链接的标题

    private String url = ""; // 链接地址

    private Date addDateTime = new Date();// 添加时间

    private Date updateDateTime = new Date();// 更新时间

    private Integer ifDelete = 0;// 删除标志位（0：未删除，1：删除）

    private Integer status = 1;// 显示状态（0：禁用，1：启用）

    private String description; // 详情描述

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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Date getAddDateTime() {
        return addDateTime;
    }

    public void setAddDateTime(Date addDateTime) {
        this.addDateTime = addDateTime;
    }

    public Date getUpdateDateTime() {
        return updateDateTime;
    }

    public void setUpdateDateTime(Date updateDateTime) {
        this.updateDateTime = updateDateTime;
    }

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer homeShow) {
        this.status = homeShow;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

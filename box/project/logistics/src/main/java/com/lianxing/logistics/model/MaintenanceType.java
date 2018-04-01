package com.lianxing.logistics.model;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "maintenance_type")
public class MaintenanceType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键

    private String name; // 工种名称

    private String description; // 工种描述

    private Integer status = 1; // 启用禁用状态（0：禁用，1：启用）

    private Date addDateTime = new Date(); // 添加时间

    private Date updateDateTime = new Date(); // 更新时间

    private Integer ifDelete = 0; // 删除标志位（0：未删除，1：删除）

    @OneToMany(mappedBy = "maintenanceType", cascade = {CascadeType.ALL}, fetch = FetchType.LAZY)
    @Where(clause = "ifDelete!=1")
    private Set<MaintenanceCategory> MaintenanceCategories = new HashSet<MaintenanceCategory>();// 维修类别

    public Set<MaintenanceCategory> getMaintenanceCategories() {
        return MaintenanceCategories;
    }

    public void setMaintenanceCategories(Set<MaintenanceCategory> maintenanceCategories) {
        MaintenanceCategories = maintenanceCategories;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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
}

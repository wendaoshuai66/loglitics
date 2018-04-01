package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "maintenance_area")
public class MaintenanceArea implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键

    private String name; // 区域名称

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "campusId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private Campus campus; // 所属校区

    private String description; // 区域描述

    private Integer status = 1; // 启用禁用状态（0：禁用，1：启用）

    private Date addDateTime = new Date(); // 添加时间

    private Date updateDateTime = new Date(); // 更新时间

    private Integer ifDelete = 0; // 删除标志位（0：未删除，1：删除）

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "departmentId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1 and parent is null and ifLogistics=1")
    private Department department; // 负责维修的部门

    @OneToMany(mappedBy = "maintenanceArea", cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
    private Set<MaintenanceAreaWorker> maintenanceAreaWorkers = new HashSet<>();// 维修工种及维修人员

    public Set<MaintenanceAreaWorker> getMaintenanceAreaWorkers() {
        return maintenanceAreaWorkers;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public void setMaintenanceAreaWorkers(Set<MaintenanceAreaWorker> maintenanceAreaWorkers) {
        this.maintenanceAreaWorkers = maintenanceAreaWorkers;
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

    public Campus getCampus() {
        return campus;
    }

    public void setCampus(Campus campus) {
        this.campus = campus;
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

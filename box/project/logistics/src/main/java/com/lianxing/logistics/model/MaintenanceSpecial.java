package com.lianxing.logistics.model;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "maintenance_special")
public class MaintenanceSpecial implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键

    private String maintenanceAreaIds;// 维修区域 (存储维修区域的id，按英文逗号隔开 1,2,3)

    private Integer ifDone = 0; // 维修是否完成标志位（0：未完成，1：已完成）

    private String progressDescription; // 进度说明

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "departmentId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1 and parent is null and ifLogistics=1")
    private Department department; // 负责维修的部门

    public Long getId() {
        return id;
    }

    public String getMaintenanceAreaIds() {
        return maintenanceAreaIds;
    }

    public void setMaintenanceAreaIds(String maintenanceAreaIds) {
        this.maintenanceAreaIds = maintenanceAreaIds;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIfDone() {
        return ifDone;
    }

    public void setIfDone(Integer ifDone) {
        this.ifDone = ifDone;
    }

    public String getProgressDescription() {
        return progressDescription;
    }

    public void setProgressDescription(String progressDescription) {
        this.progressDescription = progressDescription;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

}

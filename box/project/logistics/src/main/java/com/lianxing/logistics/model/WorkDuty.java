package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "work_duty")
public class WorkDuty implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "departmentId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private Department department; // 值班部门

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "typeId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private MaintenanceType maintenanceType; // 值班工种

    private Date dutyDate; // 值班日期：年月日

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "addUid", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1 and role=1 ")
    private User user; // 值班人员

    private Integer ifAllDay = 0; // 是否全天标志位（0：半天，1：全天）

    private Integer ifNight; // 是否夜班标志位（0：白班，1：夜班）

    private Integer dateType = 0; // 班次标志位（0：普通班次 1：普通周末班次，2：节假期班次）

    private String  holidayName = ""; // 节假日名称

    // private Integer dayDutys = 0; // 白班班次

    private Integer ifDelete = 0; // 删除标志位（0：未删除，1：删除）

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public MaintenanceType getMaintenanceType() {
        return maintenanceType;
    }

    public void setMaintenanceType(MaintenanceType maintenanceType) {
        this.maintenanceType = maintenanceType;
    }

    public Date getDutyDate() {
        return dutyDate;
    }

    public void setDutyDate(Date dutyDate) {
        this.dutyDate = dutyDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getIfAllDay() {
        return ifAllDay;
    }

    public void setIfAllDay(Integer ifAllDay) {
        this.ifAllDay = ifAllDay;
    }

    public Integer getIfNight() {
        return ifNight;
    }

    public void setIfNight(Integer ifNight) {
        this.ifNight = ifNight;
    }

    public Integer getDateType() {
        return dateType;
    }

    public void setDateType(Integer dateType) {
        this.dateType = dateType;
    }

    public String getHolidayName() {
        return holidayName;
    }

    public void setHolidayName(String holidayName) {
        this.holidayName = holidayName;
    }

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }
}

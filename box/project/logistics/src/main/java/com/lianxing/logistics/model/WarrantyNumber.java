package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "warranty_number")
public class WarrantyNumber implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键

    private Integer type = 0; // 类型标志位（0：一般维修，1：专项维修）

    private String maintenanceNumber; // 维修单号

    private String address; // 详细地址

    private String maintenanceContent; // 维修内容

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "addUid", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private User repairStaff;// 报修人员

    private Date addDateTime = new Date(); // 报修添加时间

    private Integer repairMethod = 0; // 报修方式标志位（0：网页，1：微信）

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "workerUid", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1 and role=1")
    private User maintenanceStaff;// 维修负责人员

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "maintenanceRecordId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private MaintenanceRecord maintenanceRecord; // 普通维修

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "maintenanceSpecialId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private MaintenanceSpecial maintenanceSpecial; // 专项维修

    private String maintenanceItemName; // 普通维修标题或者专项维修项目名称

    private Date maintenanceStartDateTime; // 维修开始时间: 年月日 时分秒

    private Date maintenanceEndDateTime; // 维修结束时间: 年月日 时分秒

    private String maintenanceTime; // 维修完成用时，自动计算，一般维修单位：小时，专项维修单位：天

    private Integer ifDelete = 0;// 删除标志位（0：未删除，1：删除）

    private Integer ifAutomaticAppoint = 0;// 是否自动指派（0：手动指派维修工；1：自动指派，维修工自己抢单）

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getMaintenanceNumber() {
        return maintenanceNumber;
    }

    public void setMaintenanceNumber(String maintenanceNumber) {
        this.maintenanceNumber = maintenanceNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getMaintenanceItemName() {
        return maintenanceItemName;
    }

    public void setMaintenanceItemName(String maintenanceItemName) {
        this.maintenanceItemName = maintenanceItemName;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMaintenanceContent() {
        return maintenanceContent;
    }

    public void setMaintenanceContent(String maintenanceContent) {
        this.maintenanceContent = maintenanceContent;
    }

    public User getRepairStaff() {
        return repairStaff;
    }

    public void setRepairStaff(User repairStaff) {
        this.repairStaff = repairStaff;
    }

    public Date getAddDateTime() {
        return addDateTime;
    }

    public void setAddDateTime(Date addDateTime) {
        this.addDateTime = addDateTime;
    }

    public Integer getRepairMethod() {
        return repairMethod;
    }

    public void setRepairMethod(Integer repairMethod) {
        this.repairMethod = repairMethod;
    }

    public User getMaintenanceStaff() {
        return maintenanceStaff;
    }

    public void setMaintenanceStaff(User maintenanceStaff) {
        this.maintenanceStaff = maintenanceStaff;
    }

    public MaintenanceRecord getMaintenanceRecord() {
        return maintenanceRecord;
    }

    public void setMaintenanceRecord(MaintenanceRecord maintenanceRecord) {
        this.maintenanceRecord = maintenanceRecord;
    }

    public MaintenanceSpecial getMaintenanceSpecial() {
        return maintenanceSpecial;
    }

    public void setMaintenanceSpecial(MaintenanceSpecial maintenanceSpecial) {
        this.maintenanceSpecial = maintenanceSpecial;
    }

    public Date getMaintenanceStartDateTime() {
        return maintenanceStartDateTime;
    }

    public void setMaintenanceStartDateTime(Date maintenanceStartDateTime) {
        this.maintenanceStartDateTime = maintenanceStartDateTime;
    }

    public Date getMaintenanceEndDateTime() {
        return maintenanceEndDateTime;
    }

    public void setMaintenanceEndDateTime(Date maintenanceEndDateTime) {
        this.maintenanceEndDateTime = maintenanceEndDateTime;
    }

    public String getMaintenanceTime() {
        return maintenanceTime;
    }

    public void setMaintenanceTime(String maintenanceTime) {
        this.maintenanceTime = maintenanceTime;
    }

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }

    public Integer getIfAutomaticAppoint() {
        return ifAutomaticAppoint;
    }

    public void setIfAutomaticAppoint(Integer ifAutomaticAppoint) {
        this.ifAutomaticAppoint = ifAutomaticAppoint;
    }
}

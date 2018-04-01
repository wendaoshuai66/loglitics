package com.lianxing.logistics.model;

import java.util.Date;

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
@Table(name = "material")
public class Material implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    private String name; // 物料名称

    private String specificationsModel; // 规格型号

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "materialCategoryId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private MaterialCategory materialCategory; // 物料类别

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "materialUnitId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private MaterialUnit materialUnit; // 物料单位ID

    private Integer inventoryQuantity; // 库存数量

    private String custodian; // 保管人员

    private String storageLocation; // 存放地址

    private String remarks; // 备注 声明

    private Date addDateTime = new Date();// 添加时间

    private Date updateDateTime = new Date(); // 最后一次更新时间

    private Integer status = 1; // 启用禁用状态（0：禁用，1：启用）

    private Integer ifDelete = 0; // 删除标志位（0：未删除，1：删除）

    private Integer alarmValue; // 报警阈值（库存数量小于该值推送增加库存提示）

    public Date getUpdateDateTime() {
        return updateDateTime;
    }

    public void setUpdateDateTime(Date updateDateTime) {
        this.updateDateTime = updateDateTime;
    }

    public Date getAddDateTime() {
        return addDateTime;
    }

    public void setAddDateTime(Date addDateTime) {
        this.addDateTime = addDateTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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

    public String getSpecificationsModel() {
        return specificationsModel;
    }

    public void setSpecificationsModel(String specificationsModel) {
        this.specificationsModel = specificationsModel;
    }

    public MaterialCategory getMaterialCategory() {
        return materialCategory;
    }

    public void setMaterialCategory(MaterialCategory materialCategory) {
        this.materialCategory = materialCategory;
    }

    public MaterialUnit getMaterialUnit() {
        return materialUnit;
    }

    public void setMaterialUnit(MaterialUnit materialUnit) {
        this.materialUnit = materialUnit;
    }

    public Integer getInventoryQuantity() {
        return inventoryQuantity;
    }

    public void setInventoryQuantity(Integer inventoryQuantity) {
        this.inventoryQuantity = inventoryQuantity;
    }

    public String getCustodian() {
        return custodian;
    }

    public void setCustodian(String custodian) {
        this.custodian = custodian;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Integer getAlarmValue() {
        return alarmValue;
    }

    public void setAlarmValue(Integer alarmValue) {
        this.alarmValue = alarmValue;
    }

}

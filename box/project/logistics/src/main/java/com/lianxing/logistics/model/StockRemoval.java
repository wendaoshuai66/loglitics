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
@Table(name = "stock_removal")
public class StockRemoval implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "materialId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private Material material; // 物料

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "warrantyNumberId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private WarrantyNumber warrantyNumber; // 维修单号

    // 领用人员通过维修记录单号可以追溯到维修工人或者维修负责人员
    // private String stockRemovalPerson;// 领用人员

    private Integer stockRemovalCount = 0; // 出库数量

    private Date stockRemovalDate; // 出库日期

    private Date addDateTime = new Date(); // 记录添加时间

    private Integer ifDelete = 0;// 删除标志位（0：未删除，1：删除）

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public WarrantyNumber getWarrantyNumber() {
        return warrantyNumber;
    }

    public void setWarrantyNumber(WarrantyNumber warrantyNumber) {
        this.warrantyNumber = warrantyNumber;
    }

    public Integer getStockRemovalCount() {
        return stockRemovalCount;
    }

    public void setStockRemovalCount(Integer stockRemovalCount) {
        this.stockRemovalCount = stockRemovalCount;
    }

    public Date getStockRemovalDate() {
        return stockRemovalDate;
    }

    public void setStockRemovalDate(Date stockRemovalDate) {
        this.stockRemovalDate = stockRemovalDate;
    }

    public Date getAddDateTime() {
        return addDateTime;
    }

    public void setAddDateTime(Date addDateTime) {
        this.addDateTime = addDateTime;
    }

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }

}

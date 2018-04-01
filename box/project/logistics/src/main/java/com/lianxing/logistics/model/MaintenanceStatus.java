package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "maintenance_status")
public class MaintenanceStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键

    private String name; // 状态名称

    private String description; // 状态描述

    private Date addDateTime = new Date(); // 添加时间

    private Date updateDateTime = new Date(); // 更新时间

    private Integer ifDelete = 0; // 删除标志位（0：未删除，1：删除）

    private Integer weight = 0; // 权重，决定次序

    private String percent; // 完成进度百分比

    private String percentDsc; // 完成进度百分比说明

    private String percentColor; // 完成进度颜色样式

    private String timeLineIcon;

    private String percentRGB;

    public String getPercent() {
        return percent;
    }

    public void setPercent(String percent) {
        this.percent = percent;
    }

    public String getPercentColor() {
        return percentColor;
    }

    public void setPercentColor(String percentColor) {
        this.percentColor = percentColor;
    }

    public String getPercentDsc() {
        return percentDsc;
    }

    public void setPercentDsc(String percentDsc) {
        this.percentDsc = percentDsc;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
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

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getTimeLineIcon() {
        return timeLineIcon;
    }

    public void setTimeLineIcon(String timeLineIcon) {
        this.timeLineIcon = timeLineIcon;
    }

    public String getPercentRGB() {
        return percentRGB;
    }

    public void setPercentRGB(String percentRGB) {
        this.percentRGB = percentRGB;
    }


}

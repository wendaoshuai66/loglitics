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
@Table(name = "maintenance_area_worker")
public class MaintenanceAreaWorker implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "areaId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private MaintenanceArea maintenanceArea; // 维修区域

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "userId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1 and role = 1")
    private User user; // 维修人员

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MaintenanceArea getMaintenanceArea() {
        return maintenanceArea;
    }

    public void setMaintenanceArea(MaintenanceArea maintenanceArea) {
        this.maintenanceArea = maintenanceArea;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}

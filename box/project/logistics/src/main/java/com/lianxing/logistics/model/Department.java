package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "department")
public class Department implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    private String name; // 部门名称

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "campusId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private Campus campus;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "parentId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private Department parent;// 父部门

    private Integer ifLogistics = 0; // 是否后勤部部门标志位（0：否，1：是），前提是父部门为空或者父部门也是后勤部部门

    private String description; // 部门描述

    private Integer status = 1; // 启用禁用状态（0：禁用，1：启用）

    private Date addDateTime = new Date(); // 添加时间

    private Date updateDateTime = new Date(); // 最后一次更新时间

    private Integer ifDelete = 0; // 删除标志位（0：未删除，1：删除）

    @OneToMany(mappedBy = "parent", cascade = {CascadeType.ALL}, fetch = FetchType.LAZY)
    @Where(clause = "ifDelete!=1")
    // @OrderBy("addDateTime desc")
    private Set<Department> children = new HashSet<>();

    public Integer getIfLogistics() {
        return ifLogistics;
    }

    public void setIfLogistics(Integer ifLogistics) {
        this.ifLogistics = ifLogistics;
    }

    public Set<Department> getChildren() {
        return children;
    }

    public void setChildren(Set<Department> children) {
        this.children = children;
    }

    public void setChildren(Department children) {
        this.children.add(children);
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

    public Department getParent() {
        return parent;
    }

    public void setParent(Department parent) {
        this.parent = parent;
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

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }


}

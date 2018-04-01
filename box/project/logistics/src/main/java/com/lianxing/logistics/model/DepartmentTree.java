package com.lianxing.logistics.model;

import java.util.ArrayList;
import java.util.List;

public class DepartmentTree {

    private Long id; // 主键ID

    private String text; // 名称

    private Long parentId;

    private List<DepartmentTree> children = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public Long getParentId() {
        return parentId;
    }

    public List<DepartmentTree> getChildren() {
        return children;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public void setChildren(List<DepartmentTree> children) {
        this.children = children;
    }
}

package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "student")
public class Student implements java.io.Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}

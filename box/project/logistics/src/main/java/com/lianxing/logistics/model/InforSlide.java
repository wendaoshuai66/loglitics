package com.lianxing.logistics.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "infor_slide")
public class InforSlide implements java.io.Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    private Integer slideType = 0; // 幻灯类型:1文章来源,0自添加

    private String title; // 幻灯标题，如果是文章来源，默认是文章的标题

    @OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.REFRESH }, optional = true)
    @JoinColumn(name = "inforId", insertable = true, unique = true)
    @Where(clause = "ifDelete!=1")
    private InforPicture inforPicture; // 如果是非文章来源，则为空

    private String url = ""; // 幻灯链接，如果是文章来源，默认是文章的标题

    private String slidePicture = ""; // 幻灯图片

    private Date addDateTime = new Date();// 添加时间

    private Date updateDateTime = new Date();// 更新时间

    private Integer ifDelete = 0;// 删除标志位（0：未删除，1：删除）

    private Integer homeShow = 0;// 首页显示默认不显示（0：不显示，1：显示）

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getTitle() {
        return title;
    }

    public Integer getSlideType() {
        return slideType;
    }

    public void setSlideType(Integer slideType) {
        this.slideType = slideType;
    }

    public InforPicture getInforPicture() {
        return inforPicture;
    }

    public void setInforPicture(InforPicture inforPicture) {
        this.inforPicture = inforPicture;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSlidePicture() {
        return slidePicture;
    }

    public void setSlidePicture(String slidePicture) {
        this.slidePicture = slidePicture;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getHomeShow() {
        return homeShow;
    }

    public void setHomeShow(Integer homeShow) {
        this.homeShow = homeShow;
    }

}

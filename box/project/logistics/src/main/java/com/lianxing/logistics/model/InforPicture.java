package com.lianxing.logistics.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "infor_picture")
public class InforPicture implements java.io.Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    private String title; // 标题

    private String author;// 作者

    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.REFRESH }, optional = true)
    @JoinColumn(name = "moduleId", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1")
    private InforModule inforModule;// 所属模块

    private String pictureProvider;// 供图人员

    private Date addDateTime = new Date();// 添加时间

    private Date updateDateTime = new Date();// 更新时间

    private Integer approvalStatus = 0; // 审核状态，默认未通过0,通过1

    private Date approvalDateTime; // 审核日期

    // @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.REFRESH },
    // optional = true)
    // @JoinColumn(name = "approvalUid", insertable = true, unique = false)
    // @Where(clause = "ifDelete!=1")
    // private User approvalPerson; // 审核人员

    private Integer slideShow = 0; // 是否幻灯，默认否0,是1

//    @OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.REFRESH }, optional = true)
//    @JoinColumn(name = "slideId", insertable = true, unique = true)
//    @Where(clause = "ifDelete!=1")
//    private InforSlide inforSlide; // 幻灯，如果slideShow = 0 则为null

    private Long viewTimes = 0L; // 浏览次数

    private String keyword; // 关键字

    private Integer ifDelete = 0;// 删除标志位（0：未删除，1：删除）

    @Column(name = "article", length = 16777216)
    // @Column(name = "article", columnDefinition = "BLOB", nullable = true)
    private String article; // 文章内容（summernote中的使用的html文本）

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public InforModule getInforModule() {
        return inforModule;
    }

    public void setInforModule(InforModule inforModule) {
        this.inforModule = inforModule;
    }

    public String getPictureProvider() {
        return pictureProvider;
    }

    public void setPictureProvider(String pictureProvider) {
        this.pictureProvider = pictureProvider;
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

    public Integer getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(Integer approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public Date getApprovalDateTime() {
        return approvalDateTime;
    }

    public void setApprovalDateTime(Date approvalDateTime) {
        this.approvalDateTime = approvalDateTime;
    }

    public Integer getSlideShow() {
        return slideShow;
    }

    public void setSlideShow(Integer slideShow) {
        this.slideShow = slideShow;
    }

    public Long getViewTimes() {
        return viewTimes;
    }

    public void setViewTimes(Long viewTimes) {
        this.viewTimes = viewTimes;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }

//    public InforSlide getInforSlide() {
//        return inforSlide;
//    }
//
//    public void setInforSlide(InforSlide inforSlide) {
//        this.inforSlide = inforSlide;
//    }

    public String getArticle() {
        return article;
    }

    public void setArticle(String article) {
        this.article = article;
    }

}

package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "maintenance_record")
public class MaintenanceRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "maintenanceAreaId", insertable = true, unique = false)
    private MaintenanceArea maintenanceArea; // 维修区域

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "maintenanceCategoryId", insertable = true, unique = false)
    private MaintenanceCategory maintenanceCategory; // 维修类别--->维修工种（维修项目）

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "maintenanceStatusId", insertable = true, unique = false)
    private MaintenanceStatus maintenanceStatus; // 维修进度：维修状态组成，0开始，1结束

    private String unableRepairReason; // 无法维修原因

    private Integer ifAutoEvaluation = 0; // 是否系统自动评价（0：手动，1：系统自动好评）

    private Integer evaluationGrade; // 评价等级标志位（0：差评，1：好评， 2：中评）

    private String evaluationContent; // 评价内容，差评才需要填写

    private Date evaluationDateTime; // 评价时间

    private Integer approvalStatus = 0; // 评价审核是否通过（1:通过，0:未通过）

    private String fileIds;// 文件 (存储文件的id，按英文逗号隔开 1,2,3)

    public Integer getEvaluationGrade() {
        return evaluationGrade;
    }

    public void setEvaluationGrade(Integer evaluationGrade) {
        this.evaluationGrade = evaluationGrade;
    }

    public String getEvaluationContent() {
        return evaluationContent;
    }

    public void setEvaluationContent(String evaluationContent) {
        this.evaluationContent = evaluationContent;
    }

    public Date getEvaluationDateTime() {
        return evaluationDateTime;
    }

    public String getUnableRepairReason() {
        return unableRepairReason;
    }

    public Integer getIfAutoEvaluation() {
        return ifAutoEvaluation;
    }

    public void setIfAutoEvaluation(Integer ifAutoEvaluation) {
        this.ifAutoEvaluation = ifAutoEvaluation;
    }

    public void setUnableRepairReason(String unableRepairReason) {
        this.unableRepairReason = unableRepairReason;
    }

    public void setEvaluationDateTime(Date evaluationDateTime) {
        this.evaluationDateTime = evaluationDateTime;
    }

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

    public MaintenanceCategory getMaintenanceCategory() {
        return maintenanceCategory;
    }

    public void setMaintenanceCategory(MaintenanceCategory maintenanceCategory) {
        this.maintenanceCategory = maintenanceCategory;
    }

    public MaintenanceStatus getMaintenanceStatus() {
        return maintenanceStatus;
    }

    public void setMaintenanceStatus(MaintenanceStatus maintenanceStatus) {
        this.maintenanceStatus = maintenanceStatus;
    }

    public Integer getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(Integer approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getFileIds() {
        return fileIds;
    }

    public void setFileIds(String fileIds) {
        this.fileIds = fileIds;
    }

}

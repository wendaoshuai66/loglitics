package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "user")
public class User implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    private String name; // 名称

    private Integer sex;// 性别

    private String account;// 账号

    private String password;// 密码

    private String idCardNum;// 身份证号

//    private String weChatNickName;// 微信网名

    private String weChatOpenId;// 微信唯一标示id

    private String tel;// 手机号码

    private String headPicture;// 用户头像

    private Date addDateTime = new Date();// 添加时间

    private Date updateDateTime = new Date();// 更新时间

    private Date lastLoginDateTime;// 最后一次登录时间

    private Integer ifDelete = 0;// 删除标志位（0：未删除，1：删除）

    private Integer role = 1;// 用户角色：0 admin，1 后勤维修人员，2教师，3 学生

    @OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.REFRESH }, optional = true)
    @JoinColumn(name = "teacherId", insertable = true, unique = true)
    private Teacher teacher;

    @OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.REFRESH }, optional = true)
    @JoinColumn(name = "studentId", insertable = true, unique = true)
    private Student student;

    @OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.REFRESH }, optional = true)
    @JoinColumn(name = "workerId", insertable = true, unique = true)
    private MaintenanceWorker maintenanceWorker;

    private Integer status = 1;// 用户状态

    private Integer approvalStatus = 0; // 审核状态，默认通过 (0:未通过，1:通过)

    private Date approvalDateTime; // 审核时间

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getWeChatOpenId() {
        return weChatOpenId;
    }

    public void setWeChatOpenId(String weChatOpenId) {
        this.weChatOpenId = weChatOpenId;
    }

    public MaintenanceWorker getMaintenanceWorker() {
        return maintenanceWorker;
    }

    public void setMaintenanceWorker(MaintenanceWorker maintenanceWorker) {
        this.maintenanceWorker = maintenanceWorker;
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIdCardNum() {
        return idCardNum;
    }

    public void setIdCardNum(String idCardNum) {
        this.idCardNum = idCardNum;
    }

//    public String getWeChatNickName() {
//        return weChatNickName;
//    }
//
//    public void setWeChatNickName(String weChatNickName) {
//        this.weChatNickName = weChatNickName;
//    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getHeadPicture() {
        return headPicture;
    }

    public void setHeadPicture(String headPicture) {
        this.headPicture = headPicture;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Date getLastLoginDateTime() {
        return lastLoginDateTime;
    }

    public void setLastLoginDateTime(Date lastLoginDateTime) {
        this.lastLoginDateTime = lastLoginDateTime;
    }

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
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

}

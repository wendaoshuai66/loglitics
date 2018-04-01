package com.lianxing.logistics.model;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "message_recorder")
public class MessageRecorder implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "identity")
    @GenericGenerator(name = "identity", strategy = "org.hibernate.id.IdentityGenerator")
    private Long id; // 主键ID

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
    @JoinColumn(name = "workerUid", insertable = true, unique = false)
    @Where(clause = "ifDelete!=1 and role=1")
    private User maintenanceStaff;// 维修人员

    private String tel;// 联系电话

    private Date addDateTime = new Date();// 添加时间

    private Date lastSendTime = new Date();// 最后一次发送短信的时间

    private Integer ifSend = 0;// 是否发送（0；未发送，1：已发送）

    private Long sendCount = 0L;// 发送次数

    private String messageContent = "";// 短信内容

    private Integer replySign = 0;// 回复状态（0：未回复，1：已回复）

    private Integer ifDelete = 0;// 删除标志位（0：未删除，1：删除）

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getMaintenanceStaff() {
        return maintenanceStaff;
    }

    public void setMaintenanceStaff(User maintenanceStaff) {
        this.maintenanceStaff = maintenanceStaff;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public Date getAddDateTime() {
        return addDateTime;
    }

    public void setAddDateTime(Date addDateTime) {
        this.addDateTime = addDateTime;
    }

    public Date getLastSendTime() {
        return lastSendTime;
    }

    public void setLastSendTime(Date lastSendTime) {
        this.lastSendTime = lastSendTime;
    }

    public Integer getIfSend() {
        return ifSend;
    }

    public void setIfSend(Integer ifSend) {
        this.ifSend = ifSend;
    }

    public Long getSendCount() {
        return sendCount;
    }

    public void setSendCount(Long sendCount) {
        this.sendCount = sendCount;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public Integer getReplySign() {
        return replySign;
    }

    public void setReplySign(Integer replySign) {
        this.replySign = replySign;
    }

    public Integer getIfDelete() {
        return ifDelete;
    }

    public void setIfDelete(Integer ifDelete) {
        this.ifDelete = ifDelete;
    }

//    // 监听的对象
//    public MessageListener messageListener;
//
//    // 注册监听器
//    @Override
//    public void setEventListener(MessageListener arg) {
//        messageListener = arg;
//    }
//
//    //触发事件
//    public void changeEventHappened() {
//        replySign = 1;
//        messageListener.doChangeReply(this);
//    }
//
//    @Override
//    public Integer getReply() {
//        return replySign;
//    }
}

///**
// * 事件
// */
//interface IEvent {
//
//    void setEventListener(MessageListener arg);
//
//    Integer getReply();
//}
//
///**
// * 事件监听器，调用事件处理器
// */
//interface MessageListener {
//    void doChangeReply(IEvent e);
//}

var app = getApp();
var url = app.globalData.httpDomain + '/saveDiary';
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择日期
    dates: '',
    //开始时间
    startTime: '08:00',
    //结束时间
    endTime: '18:00',
    navigateFlag:true,
    descriptionNumber:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      dates: util.formatDate(new Date()),
    })
  },
  //发送请求  submi事件
  formSubmit: function (inputValue) {
    var that = this;
    var flag = false;
    var warn = "";
    if(!this.data.navigateFlag){
      return
    }
    this.setData({
      navigateFlag:false
    })
    let dateFlag = util.checkDateTimeUpward(that.data.dates + ' ' + that.data.startTime + ':00');
    if (that.data.dates == '') {
      warn = '请选择年/月/日!';
    } else if (that.data.startTime == "") {
      warn = "请选择开始时间!";
    } else if (dateFlag) {
      warn = "工作日期不能大于当前日期!";
    } else if (that.data.endTime == "") {
      warn = "请选择结束时间!";
    } else if (that.data.startTime == that.data.endTime ){
      warn = "开始时间和结束时间不能相等!";
    } else if (inputValue.detail.value.title == "" || inputValue.detail.value.title.trim().length == 0) {
      warn = "请输入标题！";
    } else if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(inputValue.detail.value.title)) {
      warn = "标题只允许输入汉字、字母、数字！"
    } else if (inputValue.detail.value.description == "" || inputValue.detail.value.description.trim().length == 0) {
      warn = "请输入内容！"
    } else {
      flag = true;
    }
    if (flag) {
      wx.showLoading({
        title: '正在保存...',
      })
      var params = {
        workDate: that.data.dates,
        startTime: that.data.dates + " " + that.data.startTime+':00',
        endTime: that.data.dates + " " + that.data.endTime+':00',
        title: inputValue.detail.value.title,
        content: inputValue.detail.value.description,
        user: {
          id: wx.getStorageSync('userId')
        }
      }
      wx.request({
        url: url,
        data: {
          'data': JSON.stringify(params),
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'logistics-session-token': wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.header.Authority == "EXPIRED") {
            wx.showModal({
              title: '提示',
              content: '登录已过期，请重新登录',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.clearStorage('token');
                  wx.redirectTo({
                    url: '../../index/index',
                  })
                }
              }
            })
          } else if (res.data.status == "SUCCESS") {
            wx.showToast({
              title: '保存成功',
            });
            wx.hideLoading();
            setTimeout(function () {
              wx.redirectTo({
                url: '../myList/myList?id=' + params.user.id,
              })

            }, 1000)
          } else {
            wx.showModal({
              title: '提示',
              content: '保存失败',
              showCancel: false
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: warn,
        showCancel: false
      });
      //打开节流阀
      this.setData({
        navigateFlag: true,
      })
      return;
    }


  },
  //listDate改变事件
  listDateChange: function (e) {
    this.setData({
      dates: e.detail.value
    })
  },
  //开始时间改变事件
  startDateChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  //结束时间改变事件
  endDateChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  listenTextareaFromDescription:function(e){
    this.setData({
      descriptionNumber: (e.detail.value).length,
    })
  }
})
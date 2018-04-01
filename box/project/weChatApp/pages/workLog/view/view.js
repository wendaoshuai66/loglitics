// pages/workLog/view/view.js
var app = getApp();
var geturl = app.globalData.httpDomain + '/getDiaryById';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getView(options.id);
  },

  //请求发送
  getView: function (id) {
    var that = this;
    wx.request({
      url: geturl,
      data: {
        id:id
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        let startTime = res.data.data.startTime.split(' ')[1].split(':');
        let endTime = res.data.data.endTime.split(' ')[1].split(':');
        endTime.pop();
        startTime.pop();
        that.setData({
          item:res.data.data,
          startTime: startTime.join(':'),
          endTime: endTime.join(':'),
          workDate:res.data.data.workDate.split(' ')[0],
          addDateTime: res.data.data.addDateTime.split(' ')[0],
          loadingHidden:true,
        })
      }
    })
  }
})
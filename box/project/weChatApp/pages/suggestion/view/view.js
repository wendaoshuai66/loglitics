//建言献策--详情
var util = require('../../../utils/util');
var WxParse = require('../../../wxParse/wxParse');
var app = getApp();
var url = app.globalData.httpDomain + "/getInforTextById";
var viewUrl = app.globalData.httpDomain + "/updateInforTextViewTimesById";
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
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });

    var _id = options.id;
    //根据ID请求对应的详细信息
    wx.request({
      url: url,
      method: "POST",
      data: {
        id: _id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.data) {
          // var _date = util.formatDate(new Date(res.data.data.addDateTime.time));
          var article = res.data.data.article;
          WxParse.wxParse('article', 'html', article, that, 0);
          // res.data.data.addDateTime = _date;
          that.setData({
            data: res.data.data,
            loadingHidden:true,
          });
          //浏览次数+1
          wx.request({
            url: viewUrl,
            method: "POST",
            data: {
              id: _id
            },
            header: { 
              'content-type': 'application/x-www-form-urlencoded',
              'logistics-session-token': wx.getStorageSync('token') },
            success: function (res) {
            }
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
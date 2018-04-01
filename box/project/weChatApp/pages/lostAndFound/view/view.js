//失物招领--详情
var util = require('../../../utils/util');
var WxParse = require('../../../wxParse/wxParse');
var app = getApp();
var url = app.globalData.httpDomain + "/getLostFoundById";
var viewUrl = app.globalData.httpDomain + "/updateLostFoundViewTimesById";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //列表项状态
    statusItems: ['未完成', '已完成'],
    loadingHidden:false,
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
        //动态改变导航标题
        wx.setNavigationBarTitle({
          title: res.data.data.type == 1 ? "失物信息" : "招领信息"
        })
        var imgItems = [];
        if (res.data.data.imgUrls.uploadFileUrl) {
          for (var k in res.data.data.imgUrls.uploadFileUrl.split(',')) {
            imgItems.push(res.data.data.imgUrls.uploadFileUrl.split(',')[k]);
          }
        }
        var article = res.data.data.description;
        WxParse.wxParse('article', 'html', article, that, 0);
        
        //暂时使用空格截取字符串
        res.data.data.addDateTime = res.data.data.addDateTime.split(" ")[0];
        that.setData({
          data: res.data.data,
          imgItems: imgItems,
          loadingHidden:true
        })
      }
    });
    //浏览次数+1
    wx.request({
      url: viewUrl,
      method: "POST",
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      }
    })
  },
  //打电话
  toPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.data.person.tel,
    })
  }


})
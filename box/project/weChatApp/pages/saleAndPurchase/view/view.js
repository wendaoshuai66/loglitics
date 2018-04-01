//出售求购--详情
var util = require('../../../utils/util');
var WxParse = require('../../../wxParse/wxParse');
var app = getApp();
var url = app.globalData.httpDomain + "/getFleaMarketById";
var viewUrl = app.globalData.httpDomain + "/updateFleaMarketViewTimesById";
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
          title: res.data.data.type == 1 ? "出售信息" : "求购信息"
        })
        var article = res.data.data.description;
        var imgItems = [];
        if (res.data.data.imgUrls.uploadFileUrl){
          for (var k in res.data.data.imgUrls.uploadFileUrl.split(',')) {
            imgItems.push(res.data.data.imgUrls.uploadFileUrl.split(',')[k]);
          }
        }

        WxParse.wxParse('article', 'html', article, that, 0);
        res.data.data.addDateTime = res.data.data.addDateTime.split(" ")[0];

        that.setData({
          data: res.data.data,
          imgItems:imgItems,
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //打电话
  toPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.data.person.tel,
    })
  }
})
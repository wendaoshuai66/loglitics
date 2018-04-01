//新闻资讯--详情
var util = require('../../../utils/util');
var WxParse = require('../../../wxParse/wxParse');
var app = getApp();
var url = app.globalData.httpDomain + "/getInforPictureFromIdForWeChat";
var viewUrl = app.globalData.httpDomain + "/updateInforPictureViewTimesById";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var _id = options.id;
    // 根据id请求对应的详细信息
    wx.request({
      url: url,
      method: "POST",
      data: {
        id: _id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _date = util.formatDate(new Date(res.data.data.addDateTime.time));
        var article = res.data.data.article;
        //使用正则替换掉o:p 标签 
        article = article.replace(/o:p/g, "div");
        article = article.replace(/&amp;nbsp;/g, " ");
        WxParse.wxParse('article', 'html', article, that, 0);
        res.data.data.addDateTime = _date;
        that.setData({
          data: res.data.data
        },function(){
          that.setData({
            loadingHidden:true,
          })
        })
        wx.setNavigationBarTitle({
          title: that.data.data.inforModule.name,
        });
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
})
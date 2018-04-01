// pages/maintenance/materialCollar/view/view.js
var app = getApp();
var url = app.globalData.httpDomain + '/getMaterialById';
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
    // if(options.type == '0'){//由物料库存进入
    // wx.setNavigationBarTitle({
    //   title: '物料库存详情',
    // })
    // }else{
    //   wx.setNavigationBarTitle({
    //     title: '我的物料领用详情',
    //   })
    // }
    this.getListData(options.id);
  },
  getListData:function(id){
    let that = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id:id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        that.setData({
          item:res.data.data,
          loadingHidden:true
        })
      }
    });
  }
})
// pages/maintenance/dutyRecord/summary/summary.js
var app = getApp();
var url = app.globalData.httpDomain + '/getUserInfoFromDepartmentTypeAndDate';
Page({

  /**
   * 组件的初始数据
   */
  data: {
    loadingHidden:false,
  },
  onLoad: function (options) {
    var options = JSON.parse(options.requestData);
    this.getData(options);
  },
  getData: function (userData) {
    var that = this;
    wx.request({
      url: url,
      data: {
        departmentId:userData.deparmentId,
        typeId:userData.maintenanceId,
        date:userData.date
        // departmentId: 15,
        // typeId: 24,
        // date: '2017-12'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == "SUCCESS") {
          var res = res.data.data;
          that.setData({
            list: res,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '获取信息失败',
          })
        }
        that.setData({
          loadingHidden:true,
        })
      }
    });

  }
})

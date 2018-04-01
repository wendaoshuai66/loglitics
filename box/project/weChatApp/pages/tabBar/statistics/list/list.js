// pages/statistics/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //列表隐藏/显示
    sharingHidden: true,
    typeHidden: true,
    qualityHidden: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //点击展开/收起
  titleClick: function (e) {
    if (e.target.dataset.type == 'sharing') {
      this.setData({
        sharingHidden: !this.data.sharingHidden
      })
    } else if (e.target.dataset.type == 'type') {
      this.setData({
        typeHidden: !this.data.typeHidden
      })

    } else if (e.target.dataset.type == 'quality') {
      this.setData({
        qualityHidden: !this.data.qualityHidden
      })
    } else {
      return;
    }
  },
  toView: function (e) {
    wx.navigateTo({
      url: '../view/view?type=' + e.target.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //功能测试
  // toTest:function(){
  //   wx.navigateTo({
  //     url: '../../../web/list/list',
  //   })
  // }

})
//建言献策--添加
var app = getApp();
var url = app.globalData.httpDomain + '/saveInforTextFromWeChat';
Page({
  data: {
    title: '',
    article: '',
    navigateFlag:true,
    articleNumber:0
  },
  onLoad: function () {
    var that = this;
    this.setData({
      userId:wx.getStorageSync('userId')
    })
  },
  formSubmit: function (e) {
    if(!this.data.navigateFlag){
      return;
    }
    this.setData({
      navigateFlag:false
    })
    var that = this;
    var inputValue = e.detail.value;
    var userId = this.data.userId;
    if (inputValue.title == '' || inputValue.title.trim().length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入标题！',
        showCancel: false
      });
      //打开节流阀
      this.setData({
        navigateFlag: true,
      })
      return;
    } else if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(inputValue.title)) {
      wx.showModal({
        title: '提示',
        content: '标题只允许输入汉字、字母、数字！',
        showCancel: false
      });
      //打开节流阀
      this.setData({
        navigateFlag: true,
      })
      return;
    } else if (inputValue.article == '' || inputValue.article.trim().length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入内容！',
        showCancel: false
      });
      //打开节流阀
      this.setData({
        navigateFlag: true,
      })
      return;
    }
    this.setData({
      loadingHidden: false,
      loadingText: '正在保存...',
    })
    //数据对象
    var objectData = {
      //标题
      "title": inputValue.title,
      //内容
      "article": inputValue.article,
      // 发布人信息
      "author": {
        "id": userId
      }
    };
    // 打开等待框
    wx.showLoading({
      title: '正在保存...'
    });
    wx.request({
      url: url,
      data: {
        "data": JSON.stringify(objectData)
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'logistics-session-token': wx.getStorageSync('token')
      },
      success: function (res) {
        var id = res.data.id;
        // 关闭等待框
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500
        });
        wx.redirectTo({
          url: '../myList/myList?id=' + that.data.userId
        })
        return;
      }
    });
  },
  listenTextareaFromArticle:function(e){
    this.setData({
      articleNumber: (e.detail.value).length,
    })
  }
})
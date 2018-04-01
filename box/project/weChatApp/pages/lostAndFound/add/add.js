//失物招领--添加
var app = getApp();
var util = require('../../../utils/util.js');
var url = app.globalData.httpDomain + '/saveLostFoundFromWeChat';
//上传图片
var uploadImage = app.globalData.httpDomain + '/summernote/fileupload';
//图片下标 
var i = 0;
//图片数组
var imgItem = [];
// 页面数据及方法定义
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 下拉框数据封装
    typeItems: [{
      name: '失物',
      value: '1',
      checked: 'true'
    }, {
      name: '招领',
      value: '0'
    }],
    // 表单数据
    type: 1,
    title: "",
    description: "",
    //上传的图片临时路径数组
    imgPathItems: [],
    navigateFlag:true,
    descriptionNumber:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      userId: wx.getStorageSync('userId')
    })
  },
  typeChange: function (e) {
    this.setData({
      type: e.detail.value
    })
  },
//提交数据
submitData:function(value,imgUrl){
  var that = this;
  var inputValue = value;
  var userId = this.data.userId;
  // if (inputValue.title == '' || inputValue.title.trim().length == 0) {
  //   wx.showModal({
  //     title: '提示',
  //     content: '请输入标题！',
  //     showCancel: false
  //   });
  //   //打开节流阀
  //   this.setData({
  //     navigateFlag:true,
  //   })
  //   return;
  // } else if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(inputValue.title)) {
  //   wx.showModal({
  //     title: '提示',
  //     content: '标题只允许输入汉字、字母、数字！',
  //     showCancel: false
  //   });
  //   //打开节流阀
  //   this.setData({
  //     navigateFlag: true,
  //   })
  //   return;
  // } else if (inputValue.description == '' || inputValue.description.trim().length == 0) {
  //   wx.showModal({
  //     title: '提示',
  //     content: '请输入内容！',
  //     showCancel: false
  //   });
  //   //打开节流阀
  //   this.setData({
  //     navigateFlag: true,
  //   })
  //   return;
  // }
  // this.setData({
  //   loadingHidden: false,
  //   loadingText: '正在保存...',
  // })
  // 数据对象
  if(imgUrl){
    var objectData = {
      // 失物或招领详情
      "description": inputValue.description,
      // 发布人信息
      "person": {
        "id": userId
      },
      // 失物或招领标题
      "title": inputValue.title,
      // 失物或招领类型
      "type": that.data.type,
      "fileUrls": String(imgUrl.join(',')),
    };
  }else{
    var objectData = {
      // 失物或招领详情
      "description": inputValue.description,
      // 发布人信息
      "person": {
        "id": userId
      },
      // 失物或招领标题
      "title": inputValue.title,
      // 失物或招领类型
      "type": that.data.type,
    };
  }
  //清空全局变量imgItem 防止重新进入imgItem变量仍然未初始化
  imgItem = [];
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
      // console.log(that.data.type)
      if (that.data.type == 1) {
        wx.redirectTo({
          url: '../myFoundList/myFoundList?id=' + that.data.userId+'&type=lost'
        })
      } else {
        wx.redirectTo({
          url: '../myFoundList/myFoundList?id=' + that.data.userId + '&type=found'
        })
      }
      return;
    }
  });
},

//递归执行Promise
recursion: function (value, imgPathItems) {
  var that = this;
  util.runAsync(uploadImage, imgPathItems).then(function (data) {
    if (i < that.data.imgPathItems.length - 1 ) {
      i++;
      imgItem.push(data.url);
      return that.recursion(value, that.data.imgPathItems[i]);
    } else {
      imgItem.push(data.url);
      that.submitData(value, imgItem)
    }
  })
},
//提交事件
formSubmit: function (e) {
  var that = this;
  if(this.data.navigateFlag){
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
    } else if (inputValue.description == '' || inputValue.description.trim().length == 0) {
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
      navigateFlag:false
    })
    wx.showLoading({
      title: '正在保存...'
    });
    if (this.data.imgPathItems.length > 0) {
      
      this.recursion(e.detail.value, this.data.imgPathItems[i]);
    } else {
      this.submitData(e.detail.value, '');
    }
  }
  
},
  //点击选择图片
  clickChooseImage: function () {
    var that = this;
    if (this.data.imgPathItems.length >= 10) {
      wx.showModal({
        title: '提示',
        content: '图片数量最大值为10',
        showCancel: false
      });
      return;
    }
    //相机组件控制
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      // itemColor: "black",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  //选择图片
  chooseWxImage: function (type) {
    var that = this;
    var count = this.data.imgPathItems.length > 0 ? 10 - this.data.imgPathItems.length : 10;
    wx.chooseImage({
      //相机   相册
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      count:count,
      success: function (res) {
        var imageItems = that.data.imgPathItems;
        if ((imageItems.length + res.tempFilePaths.length) > 10) {
          wx.showModal({
            title: '选择图片数量超出',
            content: '已有' + imageItems.length + '张图片,可添加' + (10 - imageItems.length) + '张图片',
          })
          return;
        }
        for (var k in res.tempFilePaths) {
          imageItems.push(res.tempFilePaths[k]);
        }
        that.setData({
          imgPathItems: imageItems,
        })
      }
    })
  },
  //预览图片
  previewClick: function (e) {
    wx.previewImage({
      urls: [this.data.imgPathItems[e.currentTarget.dataset.index]],
    })
  },
  deleteImageClick: function (e) {
    var imgPathItems = this.data.imgPathItems;
    imgPathItems.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgPathItems: imgPathItems,
    })
  },


  listenTextareaFromDescription: function (e) {
    this.setData({
      descriptionNumber: (e.detail.value).length,
    })
  }
})
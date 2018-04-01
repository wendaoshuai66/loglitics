var app = getApp();
var setPasswordUrl = app.globalData.httpDomain + '/updateUserPassword';
var VerificationUrl = app.globalData.httpDomain + '/findUserPassword';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    passwordInit:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('user'),
    });
    //console.log(this.data.passwordInit);
  },
  formSubmit: function (e) {
    var that = this;
    var warn = '';
    var flag = false;
    if (e.detail.value.passwordLater == "") {
      warn = "原密码不能为空！"; 
    } else if (e.detail.value.password == '' && warn == '') {
      warn = '新密码不能为空！';
    } else if (e.detail.value.passwordAgain == '' && warn == '') {
      warn = "确认密码不能为空！";
    } else if (e.detail.value.passwordLater == e.detail.value.password) {
      warn = "原密码不能和新密码相同!";
    } else if (e.detail.value.passwordAgain != e.detail.value.password && warn == '') {
      warn = "两次密码输入不一致！";
    } else {
      flag = true;
    }
    if (e.detail.value.passwordLater == "" || e.detail.value.password == '' || e.detail.value.passwordAgain == ''){
      wx.showModal({
        title: '提示',
        content: warn,
        showCancel:false
      });
      return;
    }
      wx.request({
        url: VerificationUrl,
        method: 'POST',
        data: {
          'data': JSON.stringify({
              'id': that.data.userInfo.id,
              'account': that.data.userInfo.account,
              'password': e.detail.value.passwordLater
            })
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if(res.data.status == "SUCCESS"){
            if(!flag){
              wx.showModal({
                title: '提示',
                content: warn,
                showCancel: false
              });
              return;
            }
            wx.request({
              url: setPasswordUrl,
              method: 'POST',
              data: {
                // 'data': JSON.stringify({
                  'id': that.data.userInfo.id,
                  // 'account': that.data.userInfo.account,
                  'password': e.detail.value.password
                // })
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'logistics-session-token':wx.getStorageSync('token')
              },
              success: function (res) {
                if(res.data.status == "SUCCESS"){
                  wx.showToast({
                    title: '保存成功',
                    icon:'SUCCESS',
                  });
                  //更新token
                  wx.setStorageSync('token', res.data.token);
                  setTimeout(function(){
                    wx.navigateBack();
                  },1000)
                }
              }
            });
          }else if(res.data.status == "ERROR"){
            wx.showModal({
              title: '提示',
              content: '原密码输入错误！',
              showCancel:false
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '未知错误',
            })
          }
        }
      });
      
  },
  //更新缓存
  upDataStorage: function (userId) {
    wx.request({
      url: app.globalData.httpDomain + "/getUserById",
      data: {
        id: userId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.setStorageSync('user', res.data.data);
        //返回上一级
        wx.navigateBack({});
      }
    })
  },
  inputBlur:function(e){
    if (e.detail.value.length < 6 && e.detail.value.length > 0){
      wx.showModal({
        title: '提示',
        content: '密码长度至少为6位！',
        showCancel:false,
        success:()=>{
          this.setData({
            passwordInit:''
          })
        }
      })
    }
  },

})
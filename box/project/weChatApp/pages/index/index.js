//首先加载页，展示项目主题图片和判断用户是否注册
var app = getApp();
var getOpenIdUrl = '/getOpenId';
var getUserIdUrl = '/getUserId';
// 页面数据及方法定义
Page({
  data: {
    windowWidth: app.globalData.systemInfo.windowWidth,
    windowHeight: app.globalData.systemInfo.windowHeight,
    loadingHidden:true,
  },
  // 页面加载数据初始化
  onLoad: function () {
    var that = this;
    //用户授权
    wx.getUserInfo({
      //授权成功
      success: function (res) {
        var userInfo = {};
        userInfo.avatarUrl = res.userInfo.avatarUrl;//微信头像地址
        userInfo.gender = res.userInfo.gender;//1 男 0女
        userInfo.nickName = res.userInfo.nickName;//微信网名（非微信账号）
        //缓存 并 更新缓存
        wx.setStorage({
          key: 'userInfo',
          data: userInfo,
        });
        var userId = wx.getStorageSync('userId');
        // 如果微信登录用户信息未获取或者登录超时，则重新获取登录信息
        // 微信登录
        wx.login({
          success: function (res) {
            if (res.code) {
              //发起网络请求，拿到微信登录用户的openId
              wx.request({
                url: app.globalData.httpDomain + getOpenIdUrl,
                // data: {//旧版本
                //   appid: 'wx2792f4d241a8a158', 
                //   secret: 'ef92b3a90e989fe72abd55a3514899cf',
                //   jsCode: res.code
                // },
                data: {
                  appid: 'wx85e85344742cd3f2',
                  secret: '7f40e71594252a6cad958d47d4688719',
                  jsCode: res.code
                },
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  if (res.data && res.data.openId) {
                    var openId = res.data.openId;
                    // 发起网络请求,获取用户在数据库user表的id
                    wx.request({
                      url: app.globalData.httpDomain + getUserIdUrl,
                      data: {
                        openId: openId
                      },
                      method: "POST",
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        if (res.data && res.data.status && res.data.status === 'SUCCESS') {
                          var userId = res.data.userId;
                          var token = res.data.token;
                          //缓存userId
                          // console.log(userId);
                          // console.log()
                          wx.setStorageSync('userId', userId);
                          wx.setStorageSync("token", token);
                          //缓存用户信息
                          if (userId) {
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
                                if (res.data.data) {
                                  that.setData({
                                    index: res.data.data.role
                                  })
                                  wx.setStorageSync('user', res.data.data);
                                  wx.switchTab({
                                    url: '../tabBar/infor/infor'
                                  });
                                } else {
                                }
                              }
                            })
                          }
                        } else {
                          that.setData({
                            loadingHidden:false
                          })
                          wx.redirectTo({
                            url: '../userInfor/register/step1?openId=' + openId
                          })
                          return;
                        }
                      }
                    })
                  } else {
                    console.log('获取用户openId信息失败！' + res.errMsg);
                  }
                }
              })
            } else {
              console.log('获取用户登录状态失败！' + res.errMsg);
            }
          }
        });
      },
      //拒绝授权处理场景
      fail: (res) => {
        wx.showModal({
          title: '用户未授权',
          content: '如需正常使用本小程序，请按确定并在授权管理中选中用户信息，然后点按确定，重新进入小程序即可',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        })
      }
    });



  }
})

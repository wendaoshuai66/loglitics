// pages/userInfor/register/step2.js
var app = getApp();
var sendCodeURL = app.globalData.httpDomain + '/sendMessageCode';
var checkCodeURL = app.globalData.httpDomain + '/checkMessageCode';
var url = app.globalData.httpDomain + '/updateUserWeChatOpenId';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: 30,
    phoneNumber: '',
    //输入框是否获取光标
    clickItem: 0,
    // index: 1,
    inputItem: [],
    sendCode: '',
    //表示要删除的数组下标
    deleteIndex: '',
    //验证码总长
    valueLength: 0,
    //光标所在位置
    cursor:0,
    //聚焦
    focus:true,
    //跳转的节流阀
    navigateFlag:true,
    loadingHidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openTimer();
    this.setData({
      userData: JSON.parse(options.userData),
      phoneNumber: JSON.parse(options.userData).tel
    })
    if (app.globalData.sendCode) {
      this.sendCode();
    }
  },

  colorChange: function (e) {
    this.setData({
      cursor: e.target.dataset.index,
      focus:true,
      clickItem: e.target.dataset.index - 1,
    })
  },
  //再次发送验证码
  againSend: function () {
    this.setData({
      time: 30,
    })
    this.openTimer();
    this.sendCode();
  },
  //倒计时方法
  openTimer: function () {
    var that = this;
    var timer = setInterval(function () {
      if (that.data.time == 1) { //设为0时一秒内操作过快会导致计时器未清除
        clearInterval(timer);
        that.setData({
          time: 0,
        })
      } else {
        that.setData({
          time: that.data.time - 1,
        })
      }
    }, 1000);
  },
  // 输入框输入方法
  input: function (e) {
    var obj = {};    
    if (e.detail.value.length < this.data.valueLength) { //进入删除模块
      obj[`inputItem[${e.detail.cursor}]`] = '';
      //框色
      var clickItem = e.detail.cursor > 0 ? e.detail.cursor : 0;
      this.setData({
        valueLength: this.data.valueLength - 1,
        clickItem: clickItem,
        cursor: e.detail.cursor-1,
      })
    } else {   //进入input
    //更新inputItems指定数据模块
      obj[`inputItem[${e.detail.cursor - 1}]`] = e.detail.value.substring(e.detail.cursor - 1, e.detail.cursor);
      //框色
      var clickItem = e.detail.cursor < 4 ?e.detail.cursor:3;
      this.setData({
        valueLength: e.detail.value.length,
        clickItem: clickItem,
        cursor :e.detail.cursor+1,
      });
        
    }
    this.setData(obj);
    if (e.detail.value.length >=4 && this.data.navigateFlag){    //验证码输入完整
      //节流阀
      this.setData({
        navigateFlag:false,
        loadingHidden:false
      })
      this.checkCode(e.detail.value);
    }
  },
  // 发送验证码请求
  sendCode: function () {
    wx.request({
      url: sendCodeURL,
      data: {
        mobile: this.data.phoneNumber,
        count: 4,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      }
    })
  },
  // 验证
  checkCode: function (item) {
    var that = this;
    wx.request({
      url: checkCodeURL,
      data: {
        mobile: this.data.phoneNumber,
        msgCode: item,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == "SUCCESS" || !app.globalData.sendCode) {
          that.setData({
            loadingHidden:true,
          })
          wx.showToast({
            title: '验证成功',
          });
          var userData = wx.getStorageSync('user');
          if (that.data.userData.role == 110) {  //确定通过绑定入口进来的
            // wx.navigateTo({
            //   url: '',           将openid写入数据 成功后跳转至infor页面
            // })
            userData.headPicture = wx.getStorageSync('userInfo').avatarUrl;
            userData.weChatOpenId = app.globalData.userInfo.openId;
            wx.request({
              url: url,
              data: {
                "data": JSON.stringify(userData)
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                if (res.data.status == "SUCCESS") {
                  wx.showToast({
                    title: '绑定成功',
                  })
                  wx.redirectTo({
                    url: '../../index/index',
                  })
                } else {
                  that.setData({
                    item: [],
                    focus: [true, false, false, false, false],
                    //关闭节流阀
                    navigateFlag: true,
                    inputItem: [],
                    cursor:0,
                    valueLength:0,
                    clickItem:0,
                  })
                  return;
                }
              }
            })
          } else {
            setTimeout(function () {
              wx.navigateTo({
                url: './step3?userData=' + JSON.stringify(that.data.userData),
              });
              that.setData({
                item: [],
                focus: [true, false, false, false, false],
                //关闭节流阀
                navigateFlag: true,
                cursor:0,
                inputItem: [],
                valueLength:0,
                clickItem:0,
              })
            }, 1000);
          }
        } else {
          that.setData({
            loadingHidden:true,
          })
          wx.showModal({
            title: '验证失败',
            content: '请输入正确的验证码!',
            showCancel: false,
            success: function (e) {
                that.setData({
                  item: [],
                  focus: [true, false, false, false, false],
                  //关闭节流阀
                  navigateFlag:true,
                  cursor:0,
                  inputItem:[],
                  valueLength:0,
                  clickItem:0
                })
              // }
            }
          });
          return;
        }
      }
    })
  }
})
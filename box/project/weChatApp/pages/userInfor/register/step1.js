//用户--注册页面
var app = getApp();
var checkPhoneURL = app.globalData.httpDomain + '/checkRepeatTel';
// 页面数据及方法定义
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //0 注册  1 绑定
    registerType: 0,
    loadingHidden:false,
    telSpanHidden: true,
    // 用户类型数组
    roleItems: [{
      name: '在校学生',
      value: '3',
      checked: 'true'
    }, {
      name: '维修工人',
      value: '1'
    }, {
      name: '教职人员',
      value: '2',
    }
    ],
    //选中的用户类型
    role: 3,
    // 用户联系方式
    tel: '',
    phone: '',
    agreeFlag: false,
    display: 'none',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '注册账号',
    })
    // wx.showLoading({
    //   title: '加载中...',
    // });
    app.globalData.userInfo.openId = options.openId;
  },
  onReady:function(){
    let that = this;
    setTimeout(function () {
      that.setData({
        loadingHidden: true,
      })
    }, 300)
  },
  // 用户角色选择器
  roleChange: function (e) {
    var roleItems = this.data.roleItems;
    for (var k in roleItems) {
      roleItems[k].checked = false;
    }
    roleItems[e.currentTarget.dataset.index].checked = true;
    this.setData({
      roleItems: roleItems,
      role: roleItems[e.currentTarget.dataset.index].value
    })

  
  },
  formSubmit: function (e) {
    let that = this;
    var inputValue = e.detail.value;
    if (inputValue.phone == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的手机号码！',
        showCancel: false
      });
      return;
    } else if (!/^1(3|4|5|7|8)\d{9}$/.test(inputValue.phone)) {
      wx.showModal({
        title: '提示',
        content: '您的手机号码有误!',
        showCancel: false,
        success:function(e){
          that.setData({
            phone: '',
          })
        }
      })
      
      return;
    }
    //传递至第二页面再进行注册请求
    var userData = {
      "role": this.data.role,
      "tel": inputValue.phone,
    }
    wx.navigateTo({
      url: './step2?userData=' + JSON.stringify(userData),
    })
  },

  //手机号输入事件
  inputPhone: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },

  //checkbox改变事件
  checkboxChange: function () {
    this.setData({
      agreeFlag: !this.data.agreeFlag
    })
  },

  //服务条款开启事件
  toTerms: function () {
    this.setData({
      animation: "anmationStart",
      maskAnimation: 'maskStart',
      display: 'block'
    });
  },
  // 关闭服务条款
  cancelTerms: function () {
    this.setData({
      animation: "",
      display: 'none',
      maskAnimation: ''
    })
  },
  //注册 、 绑定类型转换
  registerTypeChange: function (e) {
    this.setData({
      registerType: e.target.dataset.type
    })
    if (this.data.registerType == 1) {
      wx.setNavigationBarTitle({
        title: '绑定号码',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '注册账号',
      })
    }
  },
  //绑定手机提交事件
  bindSubmit: function (e) {
    let that = this;
    if (e.detail.value.phone == "") {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空！',
        showCancel: false
      })
      return;
    } else if (!/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.phone)) {
      wx.showModal({
        title: '提示',
        content: '您的手机号码有误!',
        showCancel: false,
        success:function(e){
          that.setData({
            phone: '',
          })
        }
      })
      return;
    } else {  //手机号码页面验证通过   开始判重
      wx.request({
        url: checkPhoneURL,
        data: {
          tel: e.detail.value.phone,
          // msgCode: item,
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {  //判重结束
          if (res.data.status == "REPEAT"){
            var userData = {
              "role": 110,
              "tel": e.detail.value.phone,
            };
            wx.setStorageSync("user", res.data.data[0]);
            wx.navigateTo({
              url: './step2?userData=' + JSON.stringify(userData),
            })
          } else if (res.data.status == "NOREPEAT"){
            wx.showModal({
              title: '提示',
              content: '此号码未注册!',
              showCancel:false,
              success:function(e){
                that.setData({
                  phone: '',
                })
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '未知错误!',
              showCancel:false
            })
          }
          
        }
      });

    }


  }
})
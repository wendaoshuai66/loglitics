//底部菜单--我的
var app = getApp();
//通过id获取用户信息
Page({
  data: {
    // userType数组下标
    index: 0,
    //用户类型数组
    userTypeItems: ['管理员', '维修人员', '教师', '学生'],
    saleAndPurchaseFlag:false,
    lostAndFoundFlag:false,
    maintenanceFlag:false,
    repairFlag:false,
    showPage:true,
    loadingHidden:false
  },
  // 页面加载数据初始化
  onLoad: function () {
    var that = this;
    //考虑减少缓存
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          nickName: res['data']['nickName'], // 获取到昵称
          avatarUrl: res['data']['avatarUrl']
        })
          wx.getStorage({
            key: 'user',
            success: function (res) {
              //console.log(res.data.status);
              that.setData({
                index: res.data.role,
                approvalStatus: res.data.approvalStatus,
                status:res.data.status,
              })
            },
          })
      },
    });
    //延迟显示
    setTimeout(function(){
      that.setData({
        showPage:false,
        loadingHidden:true
      })
    },500);
  },
  //我的资料信息
  toViewUserInfor: function () {
    wx.navigateTo({
      url: '../../userInfor/view/view',
    })
    // },
    // })
  },
  //我的失物招领
  toLostAndFound: function (e) {
    
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        wx.navigateTo({
          url: '../../lostAndFound/myFoundList/myFoundList?id=' + res.data+'&type='+e.currentTarget.dataset.name,
        })
      },
    })
  },
  //我的出售记录
  toSale: function () {
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        wx.navigateTo({
          url: '../../saleAndPurchase/mySaleList/mySaleList?id=' + res.data,
        })
      },
    })
  },
  //我的求购记录
  toPurchase: function () {
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        wx.navigateTo({
          url: '../../saleAndPurchase/myPurchaseList/myPurchaseList?id=' + res.data,
        })
      },
    })
  },
  //我的报修记录
  toMaintenance: function (e) {
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        wx.navigateTo({
          url: '../../maintenance/repair/list/list?id=' + res.data + '&type=' + e.currentTarget.dataset.type,
        })
      },
    })
  },
  //我的维修记录
  toWorkerList: function (e) {
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        wx.navigateTo({
          url: '../../maintenance/workerList/list/list?id=' + res.data+'&type='+e.currentTarget.dataset.type,
        })
      },
    })
  },
  //我的建言献策
  toSuggestion: function () {
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        wx.navigateTo({
          url: '../../suggestion/myList/myList?id=' + res.data,
        })
      },
    })
  },
  //我的值班记录
  toDutyRecord: function () {
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        wx.navigateTo({
          url: '../../maintenance/dutyRecord/myList/myList?id=' + res.data,
        })
      },
    })
  },
  //跳转我的物料领用记录
  toMyMaterialCollar:function(){
    wx.navigateTo({
      url: '../../maintenance/myMaterialCollar/myMaterialCollar?id='+wx.getStorageSync('userId'),
    })
  },
  // 展开我的出售求购
  showSaleAndPurchase:function(e){
    this.setData({
      saleAndPurchaseFlag: !e.currentTarget.dataset.flag
    })
  },
  //展开我的失物招领
  showLostAndFound:function(e){
    this.setData({
      lostAndFoundFlag: !e.currentTarget.dataset.flag
    })
  },
  //展开我的维修记录
  showMaintenance:function(e){
    this.setData({
      maintenanceFlag:!e.currentTarget.dataset.flag
    })
  },
  //展开我的报修记录
  showRepair:function(e){
    this.setData({
      repairFlag: !e.currentTarget.dataset.flag
    })
  },
  //我的工作日志信息
  toWorkLog:function(){
    wx.navigateTo({
      url: '../../workLog/myList/myList?id=' + wx.getStorageSync('userId'),
    })
  },
  // 修改个人密码
  toModifyPassword:function(){
    wx.navigateTo({
      url: '../../userInfor/modifyPassword/modifyPassword',
    })
  }
});
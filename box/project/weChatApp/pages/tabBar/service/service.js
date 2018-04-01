//底部菜单--服务
var app = getApp();
Page({
  data: {
    loadingHidden:false,
    //轮转相关设置
    indicatorDots: false,//是否显示面板指示点
    autoplay: true,//是否自动切换
    circular: true,//是否采用衔接滑动
    interval: 3000,//自动切换时间间隔
    duration: 1000,//滑动动画时长
    indicatorActiveColor: "#ffffff",//当前选中的指示点颜色
    indicatorColor: "#000000",//指示点颜色
    //当前选中轮转序列
    current: 0,
    //轮转数据
    slideData: [{
      'id': 1,
      'slidePicture': '/images/tabBar/service/repair.jpg'
    }, {
      'id': 2,
      'slidePicture': '/images/tabBar/service/buy.jpg'
    }, {
      'id': 3,
      'slidePicture': '/images/tabBar/service/lost.jpg'
    }, {
      'id': 4,
      'slidePicture': '/images/tabBar/service/advice.jpg'
    }],
  },
  // 页面加载数据初始化
  onLoad: function () {
    var that = this;
    this.setData({
      role:wx.getStorageSync('user').role,
      approvalStatus:wx.getStorageSync('user').approvalStatus,
      status:wx.getStorageSync('user').status,
    });
  },
  onShow:function(){
    this.setData({
      loadingHidden:true,
    })
  },
  // 轮播图发生改变
  bindchange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 点击图片触发事件
  swipclick: function (e) {
    var current = this.data.current;
    if (current === 0) {
      this.toAddMaintenance();
    } else if (current === 1) {
      this.toAddSP();
    } else if (current === 2) {
      this.toAddLF();
    } else if (current === 3) {
      this.toAddSugget();
    }
  },
  // 我要保修
  toAddMaintenance: function () {
    wx.navigateTo({
      url: '../../maintenance/add/add',
    })
  },
  // 出售求购
  toAddSP: function () {
    wx.navigateTo({
      url: '../../saleAndPurchase/add/add',
    })
  },
  // 失物招领
  toAddLF: function () {
    wx.navigateTo({
      url: '../../lostAndFound/add/add',
    })
  },
  // 建言献策
  toAddSugget: function () {
    var that = this;
    wx.navigateTo({
      url: '../../suggestion/add/add',
    })
  },
  //工作日志
  toWorkLog:function(){
    wx.navigateTo({
      url: '../../workLog/add/add',
    })
  }
})

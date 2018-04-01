//底部菜单--信息
var app = getApp();
//获取最新首页显示图文列表信息url
var url = app.globalData.httpDomain + "/getInforSlideList";
// var util = require('../../../utils/util.js');
Page({
  data: {
    //轮转相关设置
    indicatorDots: false,//是否显示面板指示点
    autoplay: true,//是否自动切换
    circular: true,//是否采用衔接滑动
    interval: 3000,//自动切换时间间隔
    duration: 1000,//滑动动画时长
    indicatorActiveColor: "#ffffff",//当前选中的指示点颜色
    indicatorColor: "#000000",//指示点颜色
    slideData: [{
      'id': 1,
      'slidePicture': '/images/tabBar/infor/news01.jpg'
    }, {
      'id': 2,
      'slidePicture': '/images/tabBar/infor/news02.jpg'
    }, {
      'id': 3,
      'slidePicture': '/images/tabBar/infor/news03.jpg'
    }, {
      'id': 4,
      'slidePicture': '/images/tabBar/infor/news04.jpg'
    }],
    newslist: [],
    loadingHidden: false,
    //返回数据页码
    pageNumber: 1,
    ifAllText: '暂无数据',
    loadingAnimation: 123534567,
  },
  // 页面加载数据初始化
  onLoad: function () {
    var that = this;
    this.setData({
      role: wx.getStorageSync('user').role,
    }, function () {
      that.getNewsListData();
    })
  },
  //获取首页列表
  getNewsListData: function (callback) {
    var that = this;
    that.setData({
      loadingHidden: false,
    });
    var params = {
      pageNumber: 1,
      pageSize: 20,
      "searchObj[homeShowFlag]": true,
      "searchObj[addDateTimeStart]": "",
      "searchObj[addDateTimeEnd]": "",
      "searchObj[approvalStatus]": 1,
      "searchObj[showSlide]": 1,
      "order[name]": "addDateTime",
      "order[dir]": "desc",
      "searchObj[flag]": false
    };
    wx.request({
      url: url,
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = that.data.newslist;
        for (var k in res.data.data) {
          list.push(res.data.data[k]);
        }
        that.setData({
          newslist: list,
          loadingHidden: true,
        })
        if (!that.data.newslist.length <= 0) {
          that.setData({
            ifAllText: '查看更多'
          })
        }
        if (callback) {
          callback();
        }
      }
    })
  },
  //进入文章详情
  toView: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id == 'undefined') {
      wx.showModal({
        title: '提示',
        content: '文章没有inforPicture对象',
      });
      return;
    }
    wx.navigateTo({
      url: '../../information/view/view?id=' + id
    })
  },
  //新闻资讯
  toInforList: function () {
    wx.navigateTo({
      url: '../../information/list/list'
    })
  },
  //失物招领
  toLostAndFoundList: function () {
    wx.navigateTo({
      url: '../../lostAndFound/list/list'
    })
  },
  //跳蚤市场
  toSaleAndPurchaseList: function () {
    wx.navigateTo({
      url: '../../saleAndPurchase/list/list'
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.initSeachListParam();
    that.getNewsListData(function () {
      wx.stopPullDownRefresh(); // 停止下拉刷新
    })
  },
  //初始化参数
  initSeachListParam: function () {
    var that = this;
    that.setData({
      pageNum: 1,
      pageSize: 10,
      list: [],
      ifAll: false,
      newslist: []
    });
  },
  //查看更多
  toManyMessage: function () {
    wx.navigateTo({
      url: '../../information/list/list?type=' + 'manyMessage',
    })
  },
  //维修服务
  toMaintenanceServer: function () {
    wx.navigateTo({
      url: '../../maintenance/list/list',
    })
  },
  //工作日志列表
  toWorkList: function () {
    wx.navigateTo({
      url: '../../workLog/list/list',
    })
  },
  //物料库存列表
  toMaterialCollar: function () {
    wx.navigateTo({
      url: '../../maintenance/materialCollar/list/list',
    })
  },
  //值班安排
  toDutyRecord: function () {
    wx.navigateTo({
      url: '../../maintenance/dutyRecord/list/list',
    })
  },
  //建言献策
  toSuggestion: function () {
    wx.navigateTo({
      url: '../../suggestion/list/list',
    })
  }
})
//建言献策--我提交的
var util = require('../../../utils/util');
var WxParse = require('../../../wxParse/wxParse');
var app = getApp();
var url = app.globalData.httpDomain + "/getInforTextList";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loadingHidden: false,
    //渲染暂无数据
    showNoneText: false,
    pageNumber: 1,
    searchTitle: '',
    ifAll: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      windowHeightInit: app.globalData.systemInfo.windowHeight,
      logItem: wx.getStorageSync("logFromMySuggestion") || [],
    })
    //第一个参数为回调方法,第二个为用户id
    that.getListData(function () { that.setData({ loadingHidden: true }) });
  },
  //获取列表信息
  getListData: function (callback) {
    var that = this;
    wx.request({
      url: url,
      data: {
        pageNumber: this.data.pageNumber,
        pageSize: 10,
        "searchObj[title]": this.data.searchTitle,
        "searchObj[addDateTimeStart]": '',
        "searchObj[addDateTimeEnd]": '',
        "searchObj[author][id]": this.data.id,
        "order[name]": "addDateTime",
        "order[dir]": "desc"
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var data = res.data.data;

        that.setData({
          list: data,
          pageNumber: that.data.pageNumber + 1,
        })
        if (res.data.total == data.length) {
          if (res.data.total <= 0) {
            that.setData({
              ifAll: true,
              ifAllText: '暂无数据'
            })
          } else {
            that.setData({
              ifAll: true,
              ifAllText: '已经加载全部数据',
            })
          }
        }
        if (callback) {
          callback();
        }
      }
    })
  },
  toView: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../view/view?id=' + id
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //搜索框完成事件
  searchConfirm: function () {
    this.setData({
      maskFlag: false,
    })
    this.setLogItem(this.data.searchValue);
    
  },
  //搜索框获取焦点事件
  searchFoucs: function () {
    this.setData({
      maskFlag: true,
      searchValue: '',
    })
  },
  // 搜索框失去焦点事件
  searchBlur: function () {
    //搜索框值
  },
  //设置历史缓存
  setLogItem: function (value, callback) {
    var that = this;
    if (value != '') {
      //获取缓存中的数据或者创建一个新数组
      var log = wx.getStorageSync('logFromMySuggestion') || [];
      //去重 排序
      for (var k in log) {
        if (log[k] == value) {
          //去重截取
          log.splice(log.indexOf(value), 1);
        }
      }
      //由头部添加
      log.unshift(value);
      if (log.length > 5) { //如果缓存大于5项，删除最后一项
        log.pop();
      }
      wx.setStorageSync('logFromMySuggestion', log);
      this.setData({
        searchTitle: value,
        logItem: log,
        loadingHidden: false
      });
      this.initSeachListParam();
      this.getListData(function () {
        that.setData({
          loadingHidden: true,
        })
      });
    } else {
      this.setData({
        searchTitle: value,
        loadingHidden: false
      });
      this.initSeachListParam();
      this.getListData(function () {
        that.setData({
          loadingHidden: true,
        })
      });
    }
  },
  //搜索框输入事件
  searchInput: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  // 遮罩层点击事件
  maskTap: function () {
    this.setData({
      maskFlag: false,
    })
  },
  //历史记录项点击事件
  logItemClick: function (e) {
    this.setLogItem(e.target.dataset.name);
    this.setData({
      searchValue: e.target.dataset.name,
      maskFlag: false,
    })
  },
  //清空历史记录
  clearLog: function () {
    wx.removeStorageSync('logFromMySuggestion');
    this.setData({
      maskFlag: false,
      logItem: wx.getStorageSync("logFromMySuggestion") || [],

    })
  },
  //点击搜索框取消按钮
  initClick: function () {
    var that = this;
    this.setData({
      searchTitle: '',
      maskFlag: false,
      loadingHidden: false
    });
    this.initSeachListParam();
    this.getListData(function () {
      that.setData({
        loadingHidden: true,
      })
    });
  },
  //初始化参数
  initSeachListParam: function () {
    var that = this;
    that.setData({
      pageNumber: 1,
      pageSize: 10,
      list: [],
      ifAll: false,
    });
  },
})
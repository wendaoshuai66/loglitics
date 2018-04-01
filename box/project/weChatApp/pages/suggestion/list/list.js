
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
    pageNumber: 0,
    searchTitle: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.id) {
      that.setData({
        id: options.id
      })
    }
    this.setData({
      windowHeightInit: app.globalData.systemInfo.windowHeight,
      logItem: wx.getStorageSync("logFromSuggestion") || [],
    })
    //第一个参数为回调方法,第二个为用户id
    this.getListData(function () { that.setData({ loadingHidden: true }) }, options.id);
  },
  //获取列表信息
  getListData: function (callback, id) {
    var that = this;

    if (this.data.ifAll) {
      return;
    }
    this.setData({
      loadingHidden: false,
      pageNumber: this.data.pageNumber + 1,
    })
    wx.request({
      url: url,
      data: {
        pageNumber: this.data.pageNumber,
        pageSize: 10,
        "searchObj[title]": "",
        "searchObj[addDateTimeStart]": '',
        "searchObj[addDateTimeEnd]": '',
        // "searchObj[author][id]": id,
        "searchObj[approvalStatus]": 1,
        "order[name]": "addDateTime",
        "order[dir]": "desc",
        "searchObj[title]": this.data.searchTitle,
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var response = res;
        var data = res.data.data;
        var list = that.data.list;
        for (var k in data) {
          if (data[k].author.headPicture == "images/user/male.jpg" || data[k].author.headPicture == "images/user/female.jpg") {
            data[k].author.headPicture = "http://logistics.joriving.com/web/" + data[k].author.headPicture;
          }
        }



        const obj = {};
        let j = 0;
        res = data;
        //赋值至obj对象
        for (let i = list.length; i < (list.length + res.length); i++) {
          obj[`list[${i}]`] = res[j];
          j++;
        }
        // 追加进data
        that.setData(obj);

        that.setData({
          loadingHidden: true,
        })
        if (that.data.list.length == response.data.total) {
          if (response.data.total <= 0) {
            that.setData({
              ifAll: true,
              ifAllText: '暂无数据',
            });
          } else {
            that.setData({
              ifAll: true,
              ifAllText: '已经加载全部数据',
            });
          }
          return;
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
    var that = this;
    //第一个参数为回调方法,第二个为用户id
    this.getListData(function () { that.setData({ loadingHidden: true }) });
  },
  //跳转详情
  toView: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../view/view?id=' + id
    })
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
      var log = wx.getStorageSync('logFromSuggestion') || [];
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
      wx.setStorageSync('logFromSuggestion', log);
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
    wx.removeStorageSync('logFromSuggestion');
    this.setData({
      maskFlag: false,
      logItem: wx.getStorageSync("logFromSuggestion") || [],

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
      pageNumber: 0,
      pageSize: 10,
      list: [],
      ifAll: false,
    });
  },
})
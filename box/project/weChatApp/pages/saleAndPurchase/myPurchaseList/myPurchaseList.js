//我的出售列表
var util = require('../../../utils/util');
var app = getApp();
var url = app.globalData.httpDomain + "/getFleaMarketList";
var dealUrl = app.globalData.httpDomain + "/changeFleaMarketStatus";
var deleteUrl = app.globalData.httpDomain + "/deleteFleaMarket";
Page({
  data: {
    loadingHidden: true,
    dateStart_start: "2000-01-01", // 设置开始时间的起始日期为2000年
    dateEnd_start: "2000-01-01", // 设置结束日期的起始时间为2000年
    ifAllText: '暂无数据',
    searchTitle:''
  },
  onLoad: function () {
    var that = this;
    var today = util.formatDate(new Date());
    that.initSeachListParam();
    var windowWidth = app.globalData.systemInfo.windowWidth;
    that.setData({
      // 计算查询按钮的便宜位置
      seachButtonMarginLeft: windowWidth - 20 - windowWidth * 0.4,
      dateStart_end: today, // 设置开始日期的结束时间为今天
      dateEnd_end: today // 设置结束日期的结束时间为今天
    });
    this.setData({
      userId:wx.getStorageSync('userId'),
      logItem: wx.getStorageSync('logFromMyPurchase') || [],
      windowHeightInit: app.globalData.systemInfo.windowHeight,
    })
  },
  onShow: function () {
    // 在页面展示之后先获取一次数据
    var that = this;
    that.initSeachListParam();
    that.getListData();
  },
  // 加载更多
  onReachBottom: function () {
    var that = this;
    that.getListData();
  },
  // 获取模块名称以及对应的id
  getTypeNameAndId: function () {
    var that = this;
    wx.request({
      url: url,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // 先把之前页数的数据存入临时变量
        var list = res.data.data;
        var typeNames = [];
        list.map((item) => {
          typeNames.push(item.name);
        })
        that.setData({
          typeNames: typeNames,
        })
      }
    });
  },
  scroll: function (event) {
    // 该方法绑定了页面滚动时的事件，记录当前位置Y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.initSeachListParam();
    wx.showNavigationBarLoading(); // 在标题栏中显示加载
    that.getListData(function () {
      wx.hideNavigationBarLoading(); // 完成停止加载
      wx.stopPullDownRefresh(); // 停止下拉刷新
    })
  },
  toView: function (e) {
    // 取出当前的id;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../view/view?id=' + id
    })
  },
  getListData: function (callback, seachData) {
    var that = this;
    that.setData({
      loadingHidden: false
    });
    var searchObj = {
      title: '',
      typeId: '',
      addDateTimeStart: '',
      addDateTimeEnd: ''
    }
    if (seachData) {
      searchObj = seachData
    }
    // 针对已经加载完成，禁止继续发送请求
    // 第一次请求后获取到总记录数之后触发
    if (that.data.ifAll) {
      that.setData({
        loadingHidden: true
      });
      if (callback) {
        callback();
      }
      return;
    }
    var params = {
      pageNumber: that.data.pageNum,
      pageSize: that.data.pageSize,
      "searchObj[title]": this.data.searchTitle,
      "searchObj[type]": 0,
      "searchObj[addDateTimeStart]": searchObj.addDateTimeStart,
      "searchObj[addDateTimeEnd]": searchObj.addDateTimeEnd,
      "order[name]": "addDateTime",
      "order[dir]": "desc",
      "searchObj[person][id]": this.data.userId,
    };
    wx.request({
      url: url,
      method: "POST",
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // 先把之前页数的数据存入临时变量
        var list = that.data.list;
        // 追加新页数据到list变量
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].addDateTime = util.scliceHMO(res.data.data[i].addDateTime);
          list.push(res.data.data[i]);
        }
        if (list.length == res.data.total) {
          that.setData({
            ifAll: true
          });
        }
        var _pageNum = that.data.pageNum + 1;
        that.setData({
          list: list,
          loadingHidden: true,
          pageNum: _pageNum
        });
        if (that.data.list.length <= 0) {
          that.setData({
            ifAllText: '暂无数据'
          })
        } else {
          that.setData({
            ifAllText: '已经加载全部数据'
          })
        }
        // 调用存在的回调函数
        if (callback) {
          callback();
        }
      }
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindDateStart: function (e) {
    var that = this;
    var _dateStart = e.detail.value;
    this.setData({
      dateStart: _dateStart,
      dateEnd_start: _dateStart // 结束日期的起始时间大于等于开始日期
    })
  },
  bindDateEnd: function (e) {
    var that = this;
    var _dateEnd = e.detail.value;
    this.setData({
      dateEnd: _dateEnd,
      dateStart_end: _dateEnd // 开始日期的结束时间小于等于结束日期
    })
  },
  getInfoWithoutNull: function (target) {
    return target == null ? "" : target;
  },
  initSeachListParam: function () {
    var that = this;
    that.setData({
      pageNum: 1,
      pageSize: 10,
      list: [],
      ifAll: false
    });
  },
  clearSeachInfo: function () {
    var that = this;
    // 删除掉wxSearchData显示的值
    delete that.data.wxSearchData.value;
    that.setData({
      wxSearchData: that.data.wxSearchData,
      index: null,
      dateStart: '',
      dateEnd: ''
    });
  },
  dealClick: function (e) {
    var that = this;
    wx.showModal({
      title: '确认交易',
      content: '当前交易未完成，确认交易完成?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: dealUrl,
            method: "POST",
            data: {
              statusType: 'dealStatus',
              id: e.target.dataset.id,

            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'logistics-session-token': wx.getStorageSync('token')
            },
            success: function (res) {
              if (res.data.status == 'SUCCESS') {
                that.initSeachListParam();
                that.getListData();
              }
            }
          });
        } else {
        }
      }
    })
  },
  //删除事件
  deleteItem: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确认要删除这条记录吗?',
      success: function (res) {
        if (res.confirm) {   //点击了 是否删除 模态框 的确定
          that.deleteRequest(e.target.dataset.id)
        } else {
          return;
        }
      }
    })
  },
  // 删除item事件
  deleteRequest: function (id) {
    var that = this;
    wx.request({
      url: deleteUrl,
      data: {
        id: id,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'logistics-session-token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.status == "SUCCESS") {
          that.initSeachListParam();
          that.getListData();
        } else {
        }
      }
    });
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
      var log = wx.getStorageSync('logFromMyPurchase') || [];
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
      wx.setStorageSync('logFromMyPurchase', log);
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
    wx.removeStorageSync('logFromMyPurchase');
    this.setData({
      maskFlag: false,
      logItem: wx.getStorageSync("logFromMyPurchase") || []
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
      pageNum: 1,
      pageSize: 10,
      list: [],
      ifAll: false,
    });
  },
})
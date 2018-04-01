//失物招领--全部列表
var util = require('../../../utils/util');
var app = getApp();
var url = app.globalData.httpDomain + "/getLostFoundList";
var dealUrl = app.globalData.httpDomain + "/changeLostFoundStatus";
var deleteUrl = app.globalData.httpDomain + "/deleteLostFound";
Page({
  data: {
    //导航项
    typeItems: ['全部类型', '失物', '招领'],
    timeItems: ['全部时间', '一年内', '一月内', '一周内', '今日'],
    typeIds: ['1', '0'],
    loadingHidden: true,
    //组件显示/隐藏
    typeHidden: true,
    timeHidden: true,
    //动画对象
    animationType: {},
    animationTime: {},
    //列表类型
    id: "",
    //开始日期
    dateStart: '',
    //结束日期
    dateEnd: '',
    //类型和时间数组下标
    typeIndex: 0,
    timeIndex: 0,
    //列表项状态
    statusItems: ['未完成', '已完成'],
    ifAllText: '暂无数据',
    searchTitle:'',
  },
  onLoad: function (options) {
    var that = this;
    that.initSeachListParam();
    if(options.type == 'lost'){
      this.setData({
        id:1,
        userId: options.id,
        logName:'logFromMyLost'
      });
      wx.setNavigationBarTitle({
        title: '我的失物记录',
      });
    }else{
      this.setData({
        id: 0,
        userId: options.id,
        logName:'logFromMyFound'
      });
      wx.setNavigationBarTitle({
        title: '我的招领记录',
      });
    }
    this.setData({
      logItem: wx.getStorageSync(this.data.logName) || [],
      windowHeightInit: app.globalData.systemInfo.windowHeight,
    })
    that.getListData();
  },
  //加载更多
  onReachBottom: function () {
    var that = this;
    that.getListData(function () {  });
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
        var typeIds = [];
        list.map((item) => {
          typeNames.push(item.name);
          typeIds.push(item.id)
        })
        that.setData({
          typeNames: typeNames,
          typrIds: typeIds,
        })
      }
    });
  },
  bindscrolltolower: function () {
  },
  scroll: function (event) {
    //绑定页面滚动事件,记录当前位置的Y值,请求数据之后把页面定位到这里
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.initSeachListParam();
    //在标题栏中显示加载
    wx.showNavigationBarLoading();
    that.getListData(function () {
      //完成停止加载
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    })
  },
  toView: function (e) {
    //取出当前ID
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../view/view?id=' + id
    })
  },
  getListData: function (callback) {
    var that = this;
    that.setData({
      loadingHidden: false
    });
    // 针对已经加载完成，禁止继续发送请求
    // 第一次请求后获取到总记录数之后触发
    if (that.data.ifAll) {
      that.setData({
        loadingHidden: true,
        ifAllText: '已经加载全部数据',
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
      "searchObj[type]": that.data.id,
      "searchObj[addDateTimeStart]": that.data.dateStart,
      "searchObj[addDateTimeEnd]": that.data.dateEnd,
      // "searchObj[approvalStatus]": 1,
      "searchObj[person][id]": that.data.userId,
      "order[name]": "addDateTime",
      "order[dir]": "desc"
    };
    wx.request({
      url: url,
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        //把之前也输得数据存入临时的list变量中
        var list = that.data.list;
        //追加新页数到list变量中
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
        //调用存在的回调函数
        if (callback) {
          callback();
        }

      }
    })
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSearchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  getInfoWithoutNull: function (target) {
    return target == null ? "" : target;
  },
  //初始化参数
  initSeachListParam: function () {
    var that = this;
    that.setData({
      pageNum: 1,
      pageSize: 10,
      list: [],
      ifAll: false
    });
  },
  //nav选择点击事件
  //真机测试bug:初步推测  缺少节流阀
  titleClick: function (e) {
    var that = this;
    var animationStart = util.animationFn(true);
    //初始动画对象
    var animationInit = util.animationFn(false);
    if (e.target.dataset.type == 'type') {
      if (that.data.typeHidden) {
        this.setData({
          typeHidden: !this.data.typeHidden,
          timeHidden: true,
        });
        that.setData({
          animationType: animationStart.export(),
          animationTime: animationInit.export()
        })
      } else {
        that.setData({
          animationType: animationInit.export(),
          animationTime: animationInit.export()
        })
        setTimeout(function () {
          that.setData({
            typeHidden: !that.data.typeHidden,
            timeHidden: true,
          });
        }, 500)
      }

    } else if (e.target.dataset.type == 'time') {

      if (that.data.timeHidden) {

        this.setData({
          timeHidden: !this.data.timeHidden,
          typeHidden: true,
        });
        that.setData({
          animationTime: animationStart.export(),
          animationType: animationInit.export()
        })
      } else {

        that.setData({
          animationTime: animationInit.export(),
          animationType: animationInit.export()
        })
        setTimeout(function () {
          that.setData({
            timeHidden: !that.data.timeHidden,
            typeHidden: true,
          });
        }, 500)
      }
    } else {
      return;
    }
  },
  //nav类型选择点击事件
  typeChange: function (e) {
    this.initSeachListParam();
    if (e.target.dataset.index == 0) {
      var id = "";
    } else if (e.target.dataset.index == 2) {
      id = 0;
    } else {
      id = 1;
    }
    this.setData({
      id: id,
      typeHidden: true,
      typeIndex: e.target.dataset.index
    })
    this.getListData();
  },
  //nav事件选择点击事件
  timeChange: function (e) {
    var that = this;
    that.initSeachListParam();
    if (e.target.dataset.index == 0) {
      this.setData({
        dateStart: '',
        timeHidden: true,
        dateEnd: '',
        timeIndex: e.target.dataset.index,
      })
    } else {
      var date_star = util.formatDate(new Date);
      var date_end = util.informentionDate(e.target.dataset.index - 1, date_star);
      this.setData({
        dateStart: date_end,
        dateEnd: date_star,
        timeHidden: true,
        timeIndex: e.target.dataset.index
      })
    }
    //回调函数加
    that.getListData(function () {  });
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
              }else{
                wx.showModal({
                  title: '提示',
                  content: '更改失败',
                })
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
      var log = wx.getStorageSync(this.data.logName) || [];
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
      wx.setStorageSync(this.data.logName, log);
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
    wx.removeStorageSync(this.data.logName);
    this.setData({
      maskFlag: false,
      logItem: wx.getStorageSync("logFromMyMaterial") || []
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
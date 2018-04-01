//出售求购--全部列表
var util = require('../../../utils/util');
var app = getApp();
var url = app.globalData.httpDomain + "/getFleaMarketList";
Page({
  data: {
    //搜索框内容
    searchData: '',
    //遮罩层状态
    maskFlag: false,
    //搜索框值
    searchValue: '',
    //nav标题
    typeName: '类型',
    timeName: '时间',
    //小三角显示隐藏
    flagTypeHidden: true,
    flagTimeHidden: true,
    // 类型参数'
    searchType: "",
    dateStart: "", // 设置开始时间的起始日期为2000年
    dateEnd: "", // 设置结束日期的起始时间为2000年
    //类型
    typeIds: ['1', '0'],
    loadingHidden: true,
    //类型数组
    typeItems: ['全部类型', '出售', '求购'],
    // 时间数组
    timeItems: ['全部时间', '本年', '本月', '本周', '昨天', '今天'],
    typeIndex: 0,
    timeIndex: 0,
    //类型下拉框隐藏/显示
    typeHidden: true,
    //时间下拉框隐藏/显示
    timeHidden: true,
    //状态数组
    statusItems: ['未完成', '已完成'],
    // 类型
    id: '',
    ifAllText: '暂无数据',
    searchTitle: '',
  },
  onLoad: function () {
    var that = this;
    that.initSeachListParam();
    var windowHeight = app.globalData.systemInfo.windowHeight;
    this.setData({
      windowHeightInit: windowHeight,
      logItem: wx.getStorageSync('logFromSaleAndPurchase') || [],
    });
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
        var typeIds = [];
        list.map((item) => {
          typeNames.push(item.name);
          typeIds.push(item.id);
        })
        that.setData({
          typeNames: typeNames,
          typeIds: typeIds
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
    // wx.startPullDownRefresh()
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
        ifAllText: '已经加载全部数据'
      });
      if (callback) {
        callback();
      }
      return;
    }
    var params = {
      pageNumber: that.data.pageNum,
      pageSize: that.data.pageSize,
      "searchObj[title]": that.data.searchTitle,
      "searchObj[type]": that.data.id,
      "searchObj[addDateTimeStart]": that.data.dateStart,
      "searchObj[addDateTimeEnd]": that.data.dateEnd,
      "searchObj[approvalStatus]": 1,
      "order[name]": "addDateTime",
      "order[dir]": "desc"
    };
    wx.request({
      url: url,
      method: "POST",
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var response = res;
        // 先把之前页数的数据存入临时变量
        var list = that.data.list;
        // 追加新页数据到list变量
        if (res.data.data) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].addDateTime = util.scliceHMO(res.data.data[i].addDateTime);
          }

          const obj = {};
          let j = 0;
          res = res.data.data;
          //赋值至obj对象
          for (let i = list.length; i < (list.length + res.length); i++) {
            obj[`list[${i}]`] = res[j];
            j++;
          }
          // 追加进data
          that.setData(obj);

          if (list.length == response.data.total) {
            that.setData({
              ifAll: true
            });
          }
          var _pageNum = that.data.pageNum + 1;
          that.setData({
            // list: list,
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
        } else {
          that.setData({
            ifAllText: '暂无数据',
            loadingHidden: true,
            ifAll: true
          })
        }

      }
    });
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
  //顶部点击下拉框事件
  titleClick: function (e) {
    var that = this;
    var animationStart = util.animationFn(true);
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
      if (e.target.dataset.index == 4) { // 昨天
        date_star = date_end;
      } else {
        date_star = util.informentionDate(1000, date_star);
      }
      this.setData({
        dateStart: date_end,
        dateEnd: date_star,
        timeHidden: true,
        timeIndex: e.target.dataset.index
      })
    }
    that.getListData();
  },

  //搜索框获取焦点事件
  searchFoucs: function () {
    this.setData({
      maskFlag: true,
      searchValue: '',
    })
  },
  //设置历史缓存
  setLogItem: function (value, callback) {
    if (value != '') {
      //获取缓存中的数据或者创建一个新数组
      var log = wx.getStorageSync('logFromSaleAndPurchase') || [];
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
      wx.setStorageSync('logFromSaleAndPurchase', log);
      this.setData({
        searchTitle: value,
        logItem: log,
      });
      this.initSeachListParam();
      this.getListData();
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

  //搜索框完成事件
  searchConfirm: function () {
    this.setData({
      maskFlag: false,
    })
    this.setLogItem(this.data.searchValue);
    
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
    wx.removeStorageSync('logFromSaleAndPurchase');
    this.setData({
      maskFlag: false,
      logItem: wx.getStorageSync("logFromSaleAndPurchase") || []
    })
  },
  //点击搜索框取消按钮
  initClick: function () {
    this.setData({
      searchTitle: '',
      maskFlag: false
    });
    this.initSeachListParam();
    this.getListData();
  }
})
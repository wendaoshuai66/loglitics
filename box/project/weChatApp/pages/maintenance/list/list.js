//维修服务--全部列表
var util = require('../../../utils/util');

var app = getApp();
var url = app.globalData.httpDomain + "/getMaintenanceRecord";
var moduleUrl = app.globalData.httpDomain + "/getAllMaintenanceStatus";
Page({
  data: {
    //遮罩层状态
    maskFlag: false,
    //搜索框值
    searchValue: '',
    //导航项
    typeItems: ['全部状态', '失物', '招领'],
    timeItems: ['全部时间', '本年', '本月', '本周', '昨天', '今天'],
    typeIds: [],
    loadingHidden: false,
    //组件显示/隐藏
    typeHidden: true,
    timeHidden: true,
    //动画对象
    animationType: {},
    animationTime: {},
    //列表类型
    id: 0,
    //开始日期
    dateStart: '',
    //结束日期
    dateEnd: '',
    //类型和时间数组下标
    typeIndex: 0,
    timeIndex: 0,
    //列表项状态
    statusItems: ['未完成', '已完成'],
    ifAllText: '',
    //搜索框内容
    searchTitle: '',
    //加载更多节流阀
    reachFlag: true,
    //搜索框内容
    searchData: '',
    //显示遮罩页面
    showPage: false,
    pageNum:1,
  },
  onLoad: function (options) {
    var that = this;
    var today = util.formatDate(new Date());
    var windowHeight = app.globalData.systemInfo.windowHeight;
    this.setData({
      windowHeightInit: windowHeight,
      logItem: wx.getStorageSync('logFromMaintenance') || [],
    })
    wx.createSelectorQuery().select('.TopBlock').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY']
    }, function (res) {
      windowHeight = windowHeight - res.height;
      wx.createSelectorQuery().select('.searchBar').fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY']
      }, function (res) {
        windowHeight = windowHeight - res.height;
        that.setData({
          windowHeight: windowHeight,
        })
        that.initSeachListParam();
        that.getListData();
        that.getTypeNameAndId();
      }).exec();
    }).exec();
  },
  onShow: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        showPage: true
      })
    }, 500);
  },
  // 获取模块名称以及对应的id
  getTypeNameAndId: function () {
    var that = this;
    wx.request({
      url: moduleUrl,
      data: {
        pageNumber: 1,
        pageSize: 30,
        'order[dir]': "desc",
        'order[name]': "name",
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // 先把之前页数的数据存入临时变量
        var list = res.data.data;
        var typeNames = ['全部状态'];
        var typeIds = [];
        list.map((item) => {
          typeNames.push(item.name);
          typeIds.push(item.id)
        })
        that.setData({
          typeItems: typeNames,
          typeIds: typeIds,
        })
      }
    });
  },
  //加载更多
  onReachBottom: function () {
    var that = this;
    // console.log('触底事件')
    if (this.data.reachFlag) {
      this.setData({
        reachFlag: false
      })
      that.getListData(function () {
        that.setData({
          reachFlag: true,
        })
      });
    }else{
      return;
    }
  },
  scroll: function (event) {
    //绑定页面滚动事件,记录当前位置的Y值,请求数据之后把页面定位到这里
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  toView: function (e) {
    //取出当前ID
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../repair/view/view?id=' + id + "&type=InServer"
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
      "searchObj[maintenanceNumber]": that.data.searchTitle,
      "searchObj[searchStatusId]": that.data.id,
      "searchObj[addDateTimeStart]": that.data.dateStart,
      "searchObj[addDateTimeEnd]": that.data.dateEnd,
      "order[name]": "addDateTime",
      "order[dir]": "desc"
    };
    wx.request({
      url: url,
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        let response = res;
        // console.log(res);
        if (res.data.data) {
          //把之前也输得数据存入临时的list变量中
          var list = that.data.list;
          var _pageNum = that.data.pageNum + 1;
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
          //加条件限制或者try
          if (true) {
            that.setData({
              // list: list,
              // ifAll:false,
              loadingHidden: true,
              pageNum: _pageNum,
            });
          }
          // console.log(that.data.list.length)
          if (list.length == response.data.total) {
            that.setData({
              ifAll: true,
              ifAllText: '已经加载全部数据'
            });
          }
          if (that.data.list.length <= 0) {
            that.setData({
              ifAllText: '暂无数据'
            })
          } 
          //调用存在的回调函数
          if (callback) {
            callback();
          }
        }


      }
    })
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
      this.setData({
        id: 0,
        typeHidden: true,
        typeIndex: e.target.dataset.index,
        // searchTitle:'',
      })
    } else {
      this.setData({
        id: this.data.typeIds[e.target.dataset.index - 1],
        typeHidden: true,
        typeIndex: e.target.dataset.index,
        // searchTitle: this.data.typeItems[e.target.dataset.index],
      })
    }
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
    //回调函数加
    that.getListData(function () {  });
  },






  //搜索框完成事件
  searchConfirm: function () {
    this.setData({
      maskFlag: false,
    });
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
    // this.setLogItem(this.data.searchValue);
  },
  //设置历史缓存
  setLogItem: function (value, callback) {
    var that = this;
    if (value != '') {
      //获取缓存中的数据或者创建一个新数组
      var log = wx.getStorageSync('logFromMaintenance') || [];
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
      wx.setStorageSync('logFromMaintenance', log);
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
    wx.removeStorageSync('logFromMaintenance');
    this.setData({
      maskFlag: false,
      logItem: wx.getStorageSync("logFromMaintenance") || []
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
  // initSeachListParam: function () {
  //   var that = this;
  //   that.setData({
  //     pageNum: 1,
  //     pageSize: 10,
  //     list: [],
  //     ifAll: false,
  //   });
  // },
})
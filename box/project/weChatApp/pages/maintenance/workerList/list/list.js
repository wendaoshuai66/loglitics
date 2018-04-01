//我的维修记录
// var util = require('../../../utils/util');
// var WxParse = require('../../../wxParse/wxParse');
var app = getApp();
var url = app.globalData.httpDomain + "/getMaintenanceRecord";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    warnHidden:true,
    //数据列表
    list: [],
    //页码
    pageNum: 1,
    searchTitle:'',
    searchStatusId:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type == 'finished'){
      this.setData({
        searchStatusId:[6,7,8],
        logName:'logFromMyWorkerFinished'
      });
      wx.setNavigationBarTitle({
        title: '我的维修记录(已完成)',
      })
    }else{
      this.setData({
        searchStatusId:[1,2,3,4,5],
        logName: 'logFromMyWorkerUnfinished'
      });
      wx.setNavigationBarTitle({
        title: '我的维修记录(未完成)',
      })
    }
    wx.showLoading({
      title: '加载中···',
    })
    this.setData({
      id: options.id,
      logItem: wx.getStorageSync(this.data.logName) || [],
      windowHeightInit: app.globalData.systemInfo.windowHeight,
    })
    this.getListData(this.data.id);
  },
  onReachBottom: function () {
    this.getListData(this.data.id);
  },
  getListData: function (id) {
    var that = this;
    wx.showLoading({
      title: '加载中···',
    });
    if (that.data.ifAll) {
      wx.hideLoading();
      return;
    }
    var params = {
      pageSize: 10,
      start: 0,
      pageNumber: that.data.pageNum,
      'order[dir]': 'desc',
      'order[name]': 'maintenanceStartDateTime',
      //此参数为用户id 考虑要看效果暂时写死，后期将options.id换进来就行 1
      'searchObj[maintenanceStaff][id]': that.data.id,
      'searchObj[maintenanceNumber]':that.data.searchTitle,
      "searchObj[searchStatusId]":that.data.searchStatusId,
    }
    wx.request({
      url: url,
      method: "POST",
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = that.data.list;
        for (var i = 0; i < res.data.data.length; i++) {
          list.push(res.data.data[i]);
        }
        
        var warnHidden = false;
        if(list.length > 0){
            warnHidden = true;
        }else{
          warnHidden = false;
        }
        // return;
        that.setData({
          list: list,
          pageNum: that.data.pageNum + 1,
          warnHidden: warnHidden
        })
        if (list.length == res.data.total) {
          if (res.data.total <= 0) {
            that.setData({
              // warnHidden: false,
              ifAllText: '暂无数据',
              ifAll: true,
            })
          } else {
            that.setData({
              // warnHidden: false,
              ifAllText: '已经加载全部数据',
              ifAll: true,
            })
          }
        }
        wx.hideLoading();
      }
    });
  },
  //跳转详情页面
  toView: function (e) {
    wx.navigateTo({
      url: '../../repair/view/view?id=' + e.currentTarget.dataset.id+"&type=maintenance",
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
    }else{
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
      logItem: wx.getStorageSync(this.data.logName) || []
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

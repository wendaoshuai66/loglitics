// pages/workLog/myList/myList.js
var app = getApp();
var geturl = app.globalData.httpDomain + '/getDiaryList';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber:0,
    list:[],
    searchTitle:'',
    loadingHidden:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeightInit: app.globalData.systemInfo.windowHeight,
      logItem: wx.getStorageSync('logFromWorkLog') || [],
    })
    this.getListData();
  },
  getListData: function () {
    var that = this;
    this.setData({
      pageNumber:that.data.pageNumber+1,
      loadingHidden:false,
    })
    wx.request({
      url: geturl,
      data: {
        pageSize: 10,
        start: 0,
        pageNumber: that.data.pageNumber,
        "searchObj[title]":this.data.searchTitle,
        "order[dir]": "desc",
        "order[name]": "addDateTime",
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var data = res.data.data;
        var list = that.data.list;
        var startTime = '',endTime = '';
        for (var k in data) {
          data[k].addDateTime = data[k].addDateTime.split(' ')[0];
          data[k].workDate = data[k].workDate.split(' ')[0];
          startTime = data[k].startTime.split(' ')[1];
          endTime = data[k].endTime.split(' ')[1];
          startTime = startTime.split(':');
          endTime = endTime.split(':');
          startTime.pop();
          endTime.pop();
          data[k].startTime = startTime.join(':');
          data[k].endTime = endTime.join(':');
        }
        

        const obj = {};
        let j = 0;
        //赋值至obj对象
        for (let i = list.length; i < (list.length + data.length); i++) {
          obj[`list[${i}]`] = data[j];
          j++;
        }
        // 追加进data
        that.setData(obj);
        if (res.data.total == that.data.list.length) {
          if (res.data.total <= 0) {
            that.setData({
              ifAll: true,
              ifAllText: '暂无数据'
            })
          } else {
            that.setData({
              ifAll: true,
              ifAllText: '已经加载全部数据'
            })
          }
        }
        that.setData({
          loadingHidden:true
        })
      }
    })
  },
  //随机颜色生成
  // getRandomColor: function () {
  //   return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
  // },
  //跳转至详情
  toView:function(e){
    wx.navigateTo({
      url: '../view/view?id=' + e.currentTarget.dataset.id,
    })
  },
  onReachBottom:function(){
    this.getListData();
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
      var log = wx.getStorageSync('logFromWorkLog') || [];
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
      wx.setStorageSync('logFromWorkLog', log);
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
    wx.removeStorageSync('logFromWorkLog');
    this.setData({
      maskFlag: false,
      logItem: wx.getStorageSync("logFromWorkLog") || [],
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
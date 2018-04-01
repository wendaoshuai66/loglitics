// pages/workLog/myList/myList.js
var app = getApp();
var geturl = app.globalData.httpDomain + '/getDiaryList';
var deleteUrl = app.globalData.httpDomain + '/deleteDiary';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户id
    userId:'',
    searchTitle:'',
    loadingHidden:false,
    ifAll:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId:options.id,
      logItem: wx.getStorageSync('logFromMyLog_work') || [],
      windowHeightInit: app.globalData.systemInfo.windowHeight,
    })
    this.getListData();
  },
  getListData: function () {
    var that = this;
    this.setData({
      loadingHidden:false,
    })
    wx.request({
      url: geturl,
      data: {
        pageSize: 10,
        start: 0,
        pageNumber: 1,
        "order[dir]": "desc",
        "order[name]": "addDateTime",
        "searchObj[user][id]": this.data.userId,
        "searchObj[title]":this.data.searchTitle
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var data = res.data.data;
        var startTime = '', endTime = '';
        for (var k in data) {
          // data[k].mouth = data[k].addDateTime.split(' ')[0].split('-')[1];
          // data[k].day = data[k].addDateTime.split(' ')[0].split('-')[2];
          // data[k].startTime = data[k].startTime.split(' ')[1];
          // data[k].endTime = data[k].endTime.split(' ')[1];
          // data[k].addDateTime = data[k].addDateTime.split(' ')[0];
          // data[k].workDate = data[k].workDate.split(' ')[0];
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
        if (res.data.data) {
          that.setData({
            list: data,
            loadingHidden:true,
          });
          if(res.data.total == data.length){
            if(res.data.total <= 0){
              that.setData({
                ifAll: true,
                ifAllText: '暂无数据'
              })
            }else{
              that.setData({
                ifAll: true,
                ifAllText: '已经加载全部数据'
              })
            }
          }
        }
      }
    })
  },
  //跳转至详情
  toView: function (e) {
    wx.navigateTo({
      url: '../view/view?id=' + e.currentTarget.dataset.id,
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
        id:id,
      },
      method: "POST",
      header: {
         'content-type': 'application/x-www-form-urlencoded',
         'logistics-session-token': wx.getStorageSync('token')
      },
      success: function (res) {
        if(res.data.status == "SUCCESS"){
          that.getListData(that.data.userId);
        }else{
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
      var log = wx.getStorageSync('logFromMyLog_work') || [];
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
      wx.setStorageSync('logFromMyLog_work', log);
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
    wx.removeStorageSync('logFromMyLog_work');
    this.setData({
      maskFlag: false,
      logItem: wx.getStorageSync("logFromMyLog_work") || []
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
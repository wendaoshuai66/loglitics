// pages/maintenance/myMaterialCollar/myMaterialCollar.js
var app = getApp();
var url = app.globalData.httpDomain + '/getMaterialList';
Page({
  data: {
    flipFlag:true,
    //列表项
    list:[],
    //页码
    pageNumber:1,
    //全部加载状态
    ifAll:false,
    loadingHidden:false,
    searchTitle:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.setData({
      windowHeightInit: app.globalData.systemInfo.windowHeight,
      logItem: wx.getStorageSync('logFromMaterial') || [],
    })
    this.getListData();
  },
  // onShow:function(){
    
  // },
  onReachBottom:function(){
    this.getListData();
  },
  //获取列表数据
  getListData: function(){
    var that = this;
    if(that.data.ifAll){
      that.setData({
        loadingHidden:true,
      })
      return;
    }else{
      
    }
    that.setData({
      loadingHidden: false,
    })
    wx.request({
      url: url,
      method: 'POST',
      data: {
        pageNumber: that.data.pageNumber,
        pageSize: 10,
        "order[name]": "addDateTime",
        "order[dir]": "desc",
        "searchObj[name]":this.data.searchTitle,
        "searchObj[status]":1,
        start:1,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var response = res;
        var list = that.data.list;
        res = res.data.data;
        if(res.length > 0){
          for(var k in res){
            res[k].flipFlag = false;
          }
        }

        const obj = {};
        let j = 0;
        
        //赋值至obj对象
        for (let i = list.length; i < (list.length + res.length); i++) {
          obj[`list[${i}]`] = res[j];
          j++;
        }
        // 追加进data
        that.setData(obj);
        if (list.length == response.data.total){
          that.setData({
            ifAll:true,
            ifAllText:'已加载全部数据'
          })
        }
        if(list.length <= 0){
          that.setData({
            ifAllText: '暂无数据'            
          })
        }
        setTimeout(function(){
          that.setData({
            titleHeight: 320,
            // list: list,
            loadingHidden: true,
            pageNumber: that.data.pageNumber + 1
          })
        },1000)
      },
      fail: function (res) {
      }
    })
  },
  //跳转至详情
  toView:function(e){
    wx.navigateTo({
      url: '../view/view?id='+e.currentTarget.dataset.id+'&type=0',
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
      var log = wx.getStorageSync('logFromMaterial') || [];
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
      wx.setStorageSync('logFromMaterial', log);
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
    wx.removeStorageSync('logFromMaterial');
    this.setData({
      maskFlag: false,
      logItem: wx.getStorageSync("logFromMaterial") || []
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
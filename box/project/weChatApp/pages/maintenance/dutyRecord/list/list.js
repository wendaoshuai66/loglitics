
var app = getApp();
var util = require('../../../../utils/util.js');
var geturl = app.globalData.httpDomain + '/getDutiesFromDepartmentTypeAndDate';
var getDerpartmentList = app.globalData.httpDomain + '/getDepartmentSelectList';
var getPositionSelectList = app.globalData.httpDomain + '/getPositionSelectList';
var getMaintenanceTypeSelectList = app.globalData.httpDomain + '/getMaintenanceTypeSelectList';
var getCampusSelectList = app.globalData.httpDomain + '/getCampusSelectList';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFlag:false,
    //月份菜单显示
    menuFlag:false,
    dateItem: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dateMouthName:'点击选择月份',
    item:[],
    //最终请求发送的日期
    dateYear:'点击选择年份',
    dateMouth:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      userInfo:wx.getStorageSync("user"),
      dateYear:'请选择年份',
      dateMouth:'',
      dateMouthName: '请选择月份',
      campusName: '请选择校区',
      campusId: '',
      departmentName: '请选择部门',
      departmentId: '',
      maintenanceName: '请选择工种',
      maintenanceId: '',
    },function(){
      that.setData({
        userInfo: wx.getStorageSync('user'),
        windowWidth: app.globalData.systemInfo.windowWidth,
      });
      that.getCampusSelectList();
      that.getDerpartmentList(that.data.campusId);
      that.getPositionSelectList();
      that.getList();
    });
  },

  //获取值班信息
  getList:function(){
    var that = this;
    if (!this.data.departmentId || !this.data.maintenanceId || !this.data.dateMouth || this.data.dateYear == "请选择年份"){   //判断是否都已选择完整  否 则return
      return;
    }
    wx.request({
      url: geturl,
      data: {
        departmentId: this.data.departmentId,
        typeId: this.data.maintenanceId,
        date:  this.data.dateMouth < 10 ? this.data.dateYear + '-0' + this.data.dateMouth : this.data.dateYear + '-' + this.data.dateMouth,
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var item = res.data.data;
        for(var k in item){
          item[k].dayTel = item[k].dayPerson[0].split(' ')[0];
          item[k].dayName = item[k].dayPerson[0].split(' ')[1];
          item[k].nightTel = item[k].nightPerson[0].split(' ')[0];
          item[k].nightName = item[k].nightPerson[0].split(' ')[1];
          let time = item[k].time;
          item[k].week = util.getWeekNumber(time, 'string');
        }
        that.setData({
          item:item
        });
      }
    })
  },
  //选择年份事件
  bindDateChange:function(e){
    this.setData({
      dateYear:e.detail.value,
    });
    this.getList();
  },
  // 获取校区信息
  getCampusSelectList: function () {
    var that = this;
    wx.request({
      url: getCampusSelectList,
      data: {},
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        var campusItems = [];
        var campusIdItems = [];
        for (var k in data) {
          campusItems.push(data[k].name);
          campusIdItems.push(data[k].id);
        }
        that.setData({
          campusItems: campusItems,
          campusIdItems: campusIdItems,
        });
      },
    })
  },
  //获取部门信息
  getDerpartmentList: function (id) {
    var that = this;
    wx.request({
      url: getDerpartmentList,
      data: {
        campusId: id,
        ifLogistics: 1,
        getAll: false
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        var dapartmentItems = [];
        for (var k in data) {
          if (data[k].treeLevel == 0) {
            data[k].parentId = 0;
            continue;
          }
          data[k].flag = false;
        }
        that.setData({
          departmentItems: data,
        })
      },
    })
  },
  //  获取工种信息
  getPositionSelectList: function (url) {
    var that = this;
    wx.request({
      url: getMaintenanceTypeSelectList,
      data: {},
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        var positionNameArray = [];
        var positionIdArray = [];
        for (var k in data) {
          positionNameArray.push(data[k].name);
          positionIdArray.push(data[k].id);
        }
        that.setData({
          positionNameItems: positionNameArray,
          positionIdItems: positionIdArray
        },function(){})
      }
    })
  },
  //选择校区 
  showChoose:function(){
    this.setData({
      showFlag:true,
    });
  },
  //校区选择框改变事件
  campusPickerChange:function(e){
    var that = this;
    this.setData({
      campusName:this.data.campusItems[e.detail.value],
      campusId: this.data.campusIdItems[e.detail.value],
      departmentName: '请选择部门',
      departmentId: '',
    },function(){
      that.getDerpartmentList(that.data.campusId);
    })
    
  },
  //取消选择部门框
  toCancel:function(){
    this.setData({
      showFlag:false,
    });
    this.getList();
  },
  //点击展开/收缩  点击绑定部门id   树形结构
  clickTree: function (e) {
    var data = this.data.departmentItems;
    for (var k in data) {
      if (data[k].parentId == e.target.dataset.id) {
        data[k].flag = !data[k].flag;
      }
    }
    this.setData({
      departmentItems: data,
      departmentId: e.target.dataset.id,
      departmentName: e.target.dataset.name
    })
  },
  //职务选择
  positionChange:function(e){
    this.setData({
      maintenanceName: this.data.positionNameItems[e.detail.value],
      maintenanceId: this.data.positionIdItems[e.detail.value]
    });
    this.getList();
  },
  //月份选择器
  bindDateMouth:function(e){
    this.setData({
      dateMouth:Number(e.detail.value)+1,
      dateMouthName: this.data.dateItem[e.detail.value]
    });
    this.getList();
  },
  //查看当月信息汇总
  toSummary:function(){
    var requestData = {
      deparmentId:this.data.departmentId,
      maintenanceId: this.data.maintenanceId,
      date: this.data.dateMouth < 10 ? this.data.dateYear + '-0' + this.data.dateMouth : this.data.dateYear + '-' + this.data.dateMouth,
    };
    requestData = JSON.stringify(requestData);
    wx.navigateTo({
      url: '../summary/summary?requestData=' + requestData,
    })
  },
  //点击选择部门input事件
  toChooseBox: function () {
    if (this.data.campusName == "请选择校区") {
      wx.showModal({
        title: '提示',
        content: '请先选择校区！',
        showCancel: false
      })
      return;
    }
    this.setData({
      showFlag: true,
    })
  },
})
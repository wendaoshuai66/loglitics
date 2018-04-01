// pages/statistics/view/view.js
var Charts = require('../../../../wxParse/wxCharts.js');
var util = require('../../../../utils/util.js');
var app = getApp();
var getTime = app.globalData.httpDomain + "/getMaintenanceStatisticWithTime";
var getType = app.globalData.httpDomain + "/getMaintenanceStatisticWithType";
var getQuality = app.globalData.httpDomain + "/maintenanceStatisticWithQuality";
//定时器
var timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //折线、柱状图状态判断
    switchType: true,
    btnHidden: true,
    dateItems: [],
    dateStatusItems: [],
    dateStart: '',
    dateEnd: '',
    loadingHidden: false,
    showFlag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      width: app.globalData.systemInfo.windowWidth,
      height: app.globalData.systemInfo.windowHeight,
      heightInit: app.globalData.systemInfo.windowHeight,
      datatype: options.type
    }),
      wx.setNavigationBarTitle({
        title: options.type,
      })
    //判断是否显示切换按钮
    if (options.type == '24小时' || options.type == '周期' || options.type == '月度') {
      this.setData({
        btnHidden: false
      })
    }
    if (options.type == '24小时') {
      // this.Line(this.data.switchType, 24);
      this.setData({
        dateItems: ['全部', '本年', '本月', '本周','昨天','今天'],
        dateStatusItems: [false, false, false, true,false,false],
      })
      let obj = {
        currentTarget: {
          dataset: {
            index: 3
          }
        }
      }
      this.chooseDateTime(obj)
    } else if (options.type == '周期') {
      this.setData({
        dateItems: ['全部', '本年', '本月', '本周'],
        dateStatusItems: [true, false, false, false],
      })
      let obj = {
        currentTarget: {
          dataset: {
            index: 3
          }
        }
      }
      this.chooseDateTime(obj)
      // this.Line(this.data.switchType, 7);
    } else if (options.type == '月度') {
      this.setData({
        dateItems: ['全部', '本年'],
        dateStatusItems: [true, false],
      })
      let obj = {
        currentTarget:{
          dataset:{
            index:1
          }
        }
      }
      this.chooseDateTime(obj)
      // this.Line(this.data.switchType, 12);
    } else if (options.type == '报修来源') {
      this.setData({
        dateItems: ['全部', '本年', '本月', '本周', '昨天', '今天'],
        dateStatusItems: [false, false, false, true, false, false],
      })
      let obj = {
        currentTarget: {
          dataset: {
            index: 3
          }
        }
      }
      this.chooseDateTime(obj)
      // this.typePie(getType, 'repairOriginStatistics');
    } else if (options.type == '维修项目') {
      this.setData({
        dateItems: ['全部', '本年', '本月', '本周', '昨天', '今天'],
        dateStatusItems: [false, false, false, true, false, false],
      })
      let obj = {
        currentTarget: {
          dataset: {
            index: 3
          }
        }
      }
      this.chooseDateTime(obj)
      // this.typePie(getType, 'maintenanceTypeStatistics');
    } else if (options.type == '维修区域') {
      this.setData({
        dateItems: ['全部', '本年', '本月', '本周', '昨天', '今天'],
        dateStatusItems: [false, false, false, true, false, false],
      })
      let obj = {
        currentTarget: {
          dataset: {
            index: 3
          }
        }
      }
      this.chooseDateTime(obj)
      // this.typePie(getType, 'maintenanceAreaStatistics');
    } else if (options.type == '维修用时') {
      this.setData({
        dateItems: ['全部', '本年', '本月', '本周', '昨天', '今天'],
        dateStatusItems: [false, false, false, true, false, false],
      })
      let obj = {
        currentTarget: {
          dataset: {
            index: 3
          }
        }
      }
      this.chooseDateTime(obj)
      // this.typePie(getQuality, 'timeCostStatistics');
    } else if (options.type == '维修评价') {
      this.setData({
        dateItems: ['全部', '本年', '本月', '本周', '昨天', '今天'],
        dateStatusItems: [false, false, false, true, false, false],
      })
      let obj = {
        currentTarget: {
          dataset: {
            index: 3
          }
        }
      }
      this.chooseDateTime(obj)
      // this.typePie(getQuality, 'evaluationStatistics');
    } else if (options.type == '维修状态') {
      this.setData({
        dateItems: ['全部', '本年', '本月', '本周', '昨天', '今天'],
        dateStatusItems: [false, false, false, true, false, false],
      })
      let obj = {
        currentTarget: {
          dataset: {
            index: 3
          }
        }
      }
      this.chooseDateTime(obj)
      // this.typePie(getQuality, 'maintenanceStatusStatistics');
    } else {
      return;
    }
  },

  //折线图     通过flag判断切换为折线图还是柱状图
  Line: function (flag, data) {
    var that = this;

    wx.request({
      url: getTime,
      method: 'POST',
      data: {
        timeSpan: data,
        startTime: this.data.dateStart,
        endTime: this.data.dateEnd,
        // endTime: '2019-01-01',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        var chartsType = 'line';
        if (data.data) {
          var series = [{
            name: '维修量',
            data: data.data,
            format: function (val) {
              return val.toFixed(0);
            }
          }];
          if (flag) {
            chartsType = 'line';
          } else {
            chartsType = 'column'
          }
          new Charts(that.wxCharts(data.categories, series, '维修数量(件)', chartsType));
        } else {
        }
        that.setData({
          loadingHidden: true,
        })
      }
    });
  },
  //报修来源  维修区域 报修类型 完工用时 维修评价 维修状态 饼图
  typePie: function (url, data) {
    var that = this;
    var self = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        typeSpan: data,
        startTime: this.data.dateStart,
        endTime: this.data.dateEnd,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        let flag = false;
        for(let k in data){
          if(data[k].value != 0){
            flag = true;
          }
        }
        if(!flag){
          that.setData({
            showFlag:true,
          });
          return;
        }else{
          that.setData({
            showFlag: false,
          });
        }
        if(res.data.data.length == 0){
          wx.showModal({
            title: '提示',
            content: '无数据',
            showCancel:false,
          })
          return;                  
        }
        if(data.length >= 25){
          that.setData({
            height: that.data.heightInit *1.2,
          })
        }else{
          that.setData({
            height: that.data.heightInit / 1.2,
          })
        }
        if (data) {
          var series = [];
            for (let i = 0; i < data.length; i++) {
              series[i] = {
                name: data[i].name,
                data: data[i].value,
                // color: data[i].color,
                color: that.getRandomColor(),
                format: function (e) {
                  // 我是一个异步操作
                  // return data[i].name + '(' + (e * 100).toFixed(0) + '%)';
                  // return data[i].name + ' ( ' + data[i].value + ' ) '
                  return data[i].value
                }
              }
            }
          // }
          
          new Charts(that.wxCharts(0, series, '', 'pie'));
        } else {
        }
        that.setData({
          loadingHidden: true,
        })
      }
    });
  },
//随机色
  getRandomColor: function () {
    return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
  },
  //charts对象    x轴值    数据数组  y描述  图表类型
  wxCharts: function (item, series, yDsc, staType) {
    if (staType == 'pie') {
      return {
        canvasId: 'canvas',
        type: staType,
        series: series,
        width: this.data.width * 1,
        height: this.data.height,
      }
    } else {
      return {
        canvasId: 'canvas',
        type: staType,
        categories: item,
        series: series,
        yAxis: {
          title: yDsc,
          format: function (val) {
            return val.toFixed(0);
          },
          min: 0
        },
        width: this.data.width,
        height: this.data.height / 2
      }
    }

  },
  //切换按钮事件
  changeBtn: function () {
    if (this.data.datatype == '24小时') {
      this.Line(!this.data.switchType, 24);
      this.setData({
        switchType: !this.data.switchType
      })
    } else if (this.data.datatype == '周期') {
      this.Line(!this.data.switchType, 7);
      this.setData({
        switchType: !this.data.switchType
      })
    } else if (this.data.datatype == '月度') {
      this.Line(!this.data.switchType, 12);
      this.setData({
        switchType: !this.data.switchType
      })
    } else {
      return;
    }
  },
  //选择日期段
  chooseDateTime: function (e) {
    //改变背景色
    let dateStatusItems = [false, false, false, false, false, false];
    dateStatusItems[e.currentTarget.dataset.index] = true;
    this.setData({
      dateStatusItems: dateStatusItems,
    });
    if (e.currentTarget.dataset.index == 0) {
      this.setData({
        dateStart: '',
        dateEnd: '',
      });
    } else {
      var startTime = util.formatDate(new Date());
      var endTime = util.informentionDate(e.currentTarget.dataset.index - 1, startTime);
      if (e.currentTarget.dataset.index == 1){
        startTime = util.informentionDate(-1, startTime); //转换格式
      }else{
        startTime = util.informentionDate(1000, startTime); //转换格式        
      }
      if (e.currentTarget.dataset.index == 4) {//昨天
        startTime = endTime;
      }
      this.setData({
        dateStart: endTime,
        dateEnd: startTime
      })
    }
    if (this.data.datatype == '24小时') {
      this.Line(this.data.switchType, 24);
    } else if (this.data.datatype == '周期') {
      this.Line(this.data.switchType, 7);
    } else if (this.data.datatype == '月度') {
      this.Line(this.data.switchType, 12);
    } else if (this.data.datatype == '报修来源') {
      this.typePie(getType, 'repairOriginStatistics');
    } else if (this.data.datatype == '维修项目') {
      this.typePie(getType, 'maintenanceTypeStatistics');
    } else if (this.data.datatype == '维修区域') {
      this.typePie(getType, 'maintenanceAreaStatistics');
    } else if (this.data.datatype == '维修用时') {
      this.typePie(getQuality, 'timeCostStatistics');
    } else if (this.data.datatype == '维修评价') {
      this.typePie(getQuality, 'evaluationStatistics');
    } else if (this.data.datatype == '维修状态') {
      this.typePie(getQuality, 'maintenanceStatusStatistics');
    } else {
      return;
    }
  }
})
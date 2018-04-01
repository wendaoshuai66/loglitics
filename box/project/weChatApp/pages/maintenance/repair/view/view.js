//我的记录--详情
var app = getApp();
var util = require('../../../../utils/util.js');
var url = app.globalData.httpDomain + "/getMaintenanceRecordById";
var commentUrl = app.globalData.httpDomain + "/saveMaintenanceRecord";
var getMaterialSelectList = app.globalData.httpDomain + "/getMaterialSelectList";
var saveStockRemoval = app.globalData.httpDomain + "/saveStockRemoval";
var completionMaintenanceRecordForWorker = app.globalData.httpDomain + "/completionMaintenanceRecordForWorker";
var materIalUrl = app.globalData.httpDomain + "/getStockRemovalList";
var deleteStockRemoval = app.globalData.httpDomain + "/deleteStockRemoval";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    // 轮播 start
    imgUrls: [],
    interval: 5000,
    duration: 1000,
    // 轮播 end
    commentIndex: 1,
    commentItems: [{
      value: '好评',
      name: 1,
      checked: true
    }, {
      value: '中评',
      name: 2,
      checked: false
    }, {
      value: '差评',
      name: 0,
      checked: false
    }],
    list: [],
    //返回的weight状态值
    status: 0,
    //主干进度条百分比
    statusTrunk: 0,
    //判断是否是自动调度 0 是手动 1 是自动
    autoFlag: 0,
    //经过的字体颜色
    textColor: '#EBEBEB',
    //经过的小圆点背景颜色
    roundBackgroundColor: '#EBEBEB',
    //进度条是否加载
    progressFlag: false,
    // 不显示物料出库界面
    showMateriel: true,
    //不显示标记完成界面
    showSuccess: true,
    loadingHidden: true,
    // 物料下标
    materialIndex: '',
    //物料名称
    materialName: '---请选择---',
    //物料id数组
    materialIdItems: [],
    // 物料名称数组
    materialNameItems: [],
    // 规格型号数组
    materialSpeacificationsModelItems: [],
    //物料类别
    materialCategoryItems: [],
    //物料单位
    materialUnitNameItems: [],
    //日期
    date: '---选择日期---',
    statusItems: [
      { name: '5', value: '维修完成', checked: 'true' },
      { name: '7', value: '重复报修' },
      { name: '8', value: '无法维修' },
    ],
    radioValue: 5,
    userId: '',
    loadingHidden: false,
    //显示物料添加按钮
    showMaterielBtn: false,
    //显示标记完成按钮
    showSuccessBtn: false,
    //维修处理信息显示状态
    showHandle: false,
    //物料信息列表显示状态
    showMaterialList: false,
    commentTextNumber:0,
    complete_txtareaNumber:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          id: options.id,
          optionsType: options.type,
          userId: wx.getStorageSync('userId'),
          windowHeight: app.globalData.systemInfo.windowHeight,
        }, function () {
          var _id = options.id;
          if (options.type == 'maintenance') {
            wx.setNavigationBarTitle({
              title: '我的维修详情',
            })
          } else if (options.type == 'repair') {
            wx.setNavigationBarTitle({
              title: '我的报修详情',
            })
          } else {
            wx.setNavigationBarTitle({
              title: '维修服务详情',
            })
          }
          //根据ID请求对应的详细信息
          that.getListData(_id);
        });
      }
    });
  },
  getListData: function (_id) {
    var that = this;
    wx.request({
      url: url,
      method: "POST",
      data: {
        id: _id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        let statusName = res.data.data.maintenanceRecord.maintenanceStatus.name;
        let maintenanceNumber = res.data.data.maintenanceNumber;
        let imgUrls = res.data.imgUrls.uploadFileUrl ? res.data.imgUrls.uploadFileUrl : '';
        if (imgUrls) {
          imgUrls = imgUrls.split(',');
        }
        that.setData({
          list: res.data.data,
          imgUrls: imgUrls,
          //获取设置状态迁移图进度
          status: res.data.data.maintenanceRecord.maintenanceStatus.weight,
          autoFlag: res.data.data.ifAutomaticAppoint,
        }, function () {
          that.getMeteriel();
          that.setJudgeStatus(that.data.status);
        })
        if (statusName == '待受理') {
          that.setData({
          })
        } else if (statusName == '待派工') {
          that.setData({
          })
        } else if (statusName == '维修中') {
          that.setData({
            showHandle: true,
            showMaterielBtn: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
            showSuccessBtn: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
            showMaterialList: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
          })
        } else if (statusName == '待评价') {
          that.setData({
            showHandle: true,
            showMaterielBtn: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
            showSuccessBtn: false,
            showMaterialList: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
          })
        } else if (statusName == '评价待审核') {
          that.setData({
            showHandle: true,
            showMaterielBtn: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
            showSuccessBtn: false,
            showMaterialList: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
          })
        } else if (statusName == '已完成') {
          that.setData({
            showHandle: true,
            showMaterielBtn: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
            showSuccessBtn: false,
            showMaterialList: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
          })
        } else if (statusName == '重复报修') {
          that.setData({
            showHandle: true,
            showMaterielBtn: false,
            showSuccessBtn: false,
            showMaterialList: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
          })
        } else if (statusName == '无法维修') {
          that.setData({
            showSuccessBtn: false,
            showHandle: true,
            showMaterialList: res.data.data.maintenanceStaff.id == that.data.userId ? true : false,
          })
        }
        //请求维修物料列表
        that.getMaterialList(maintenanceNumber);
      }
    })
  },
  //请求维修物料列表
  getMaterialList: function (maintenanceNumber) {
    var that = this;
    wx.request({
      url: materIalUrl,
      method: "POST",
      data: {
        'pageSize': 100,
        'pageNumber': 1,
        'start': 0,
        'order[dir]': 'desc',
        'order[name]': 'stockRemovalDate',
        'searchObj[warrantyNumber][maintenanceNumber]': maintenanceNumber
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.data.length > 0) {
          that.setData({
            materialItemList: res.data.data,
            materialItemListLength:res.data.data.length
          })
        } else {
          that.setData({
            materialItemList: res.data.data,
            materialItemListLength: res.data.data.length
          })
        }
        that.setData({
          loadingHidden: true
        })
      }
    })
  },

  //提交评价信息
  formSubmitComment: function (e) {
    var that = this;
    if (e.detail.value.commentText == "" && this.data.commentIndex == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入评价信息!',
        showCancel: false
      });
      return;
    } else if (e.detail.value.commentText.length < 5 && this.data.commentIndex == 0) {
      wx.showModal({
        title: '提示',
        content: '最少输入五个字!',
        showCancel: false
      });
      return;
    }
    var listData = this.data.list;
    listData.maintenanceRecord.evaluationGrade = this.data.commentIndex;
    if (this.data.commentIndex == 0) {
      listData.maintenanceRecord.evaluationContent = e.detail.value.commentText
    }
    wx.request({
      url: commentUrl,
      method: 'POST',
      data: {
        'data': JSON.stringify(listData),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'logistics-session-token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.status == "SUCCESS") {
          wx.showToast({
            title: '评价成功',
            icon: 'success',
            duration: 1000
          });
          that.getListData(that.data.id);
        } else {
          wx.showToast({
            title: '评价失败',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })


  },
  //判断status的值给与主干进度条百分比
  setJudgeStatus: function (status) {
    var value = 0;
    switch (status) {
      case 1:
        value = 10;
        break;
      case 2:
        value = 20;
        break;
      case 3:
        value = 41;   //维修中进度
        break;
      case 4:
        value = 70;
        break;
      case 5:
        value = 88;
        break;
      case 6:
        value = 100;
        break;
      case 8:
      case 7:
        value = 55;
        break;
      default:
        break;
    }
    this.setData({
      statusTrunk: value,
      roundBackgroundColor: '#09BB07',
      textColor: '#09BB07',
      //进度条是否加载
      progressFlag: true,
    });
  },
  //评价选择改变事件
  radioChange: function (e) {
    this.setData({
      commentIndex: e.detail.value
    })
  },
  //维修状态改变事件
  radioStatusChange: function (e) {
    this.setData({
      radioValue: e.detail.value
    })
  },
  // 预览图片
  perviewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.imgUrls,
    })
  },
  //显示物料添加界面
  showMateriel: function () {
    this.setData({
      loadingHidden: false,
      showMateriel: false,
      showLoading: false,
    })
  },
  //显示标记完成页面
  showSuccess: function () {
    this.setData({
      loadingHidden: false,
      showSuccess: false,
      showLoading: false,
    })
  },
  //点击遮罩事件 
  loadingClick: function () {
    this.setData({
      loadingHidden: true,
      showMateriel: true,
      showSuccess: true,
    })
  },
  toCancel: function () {
    this.setData({
      loadingHidden: true,
      showMateriel: true,
      showSuccess: true,
    })
  },
  // 获取物料信息
  getMeteriel: function () {
    var that = this;
    wx.request({
      url: getMaterialSelectList,
      method: 'POST',
      data: {
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'logistics-session-token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.data.length > 0) {
          var obj = {};
          for (var i = 0; i < res.data.data.length; i++) {
            //物料名称与id
            obj[`materialNameItems[${i}]`] = res.data.data[i].name;
            obj[`materialIdItems[${i}]`] = res.data.data[i].id;
            //规格型号
            obj[`materialSpeacificationsModelItems[${i}]`] = res.data.data[i].specificationsModel;
            //物料类别
            obj[`materialCategotyItems[${i}]`] = res.data.data[i].materialCategory.name;
            //物料单位
            obj[`materialUnitNameItems[${i}]`] = res.data.data[i].materialUnit.name;
            //materialIdItems
            obj[`materialNumber[${i}]`] = res.data.data[i].inventoryQuantity;

          }
          obj.materialList = res.data.data;
          that.setData(obj);
        }
      }
    })
  },
  //选择物料名称改变事件
  materialNameChange: function (e) {
    this.setData({
      materialId: this.data.materialIdItems[e.detail.value],
      materialName: this.data.materialNameItems[e.detail.value],
      materialIndex: e.detail.value,
      materialMax: this.data.materialNumber[e.detail.value],
    })
  },
  formSubmit: function (e) {
    var that = this;
    //检查日期是否小于当前日期
    let dateFlag = util.checkDateTimeUpward(this.data.date + ' 00:00:00');
    if (this.data.materialName == "---请选择---") {
      wx.showModal({
        title: '提示',
        content: '请选择物料名称!',
        showCancel: false,
      })
      return;
    } else if (e.detail.value.outNumber == '') {
      wx.showModal({
        title: '提示',
        content: '请填写出库数量！',
        showCancel: false,
      })
      return;
    } else if (this.data.materialMax <= 0) {
      wx.showModal({
        title: '提示',
        content: '物料无库存!',
        showCancel: false,
        success: function (e) {
          if (e.confirm) {
            that.setData({
              outNumber: '',
            })
          }
        }
      });
      return;
    } else if (e.detail.value.outNumber <= 0){
      wx.showModal({
        title: '提示',
        content: '出库数量不能小于1!',
        showCancel:false,
        success:function(e){
          if(e.confirm){
            that.setData({
              outNumber: '',
            })
          }
        }
      });
      return;
    } else if (e.detail.value.outNumber > this.data.materialMax){
      wx.showModal({
        title: '提示',
        content: '出库数量不能大于' + this.data.materialMax+'!',
        showCancel: false,
        success: function (e) {
          if (e.confirm) {
            that.setData({
              outNumber: '',
            })
          }
        }
      });
      return;
    } else if (this.data.date == "---选择日期---") {
      wx.showModal({
        title: '提示',
        content: '请选择出库日期!',
        showCancel: false,
      })
      return;
    } else if (dateFlag) {
      wx.showModal({
        title: '提示',
        content: '出库日期不能大于当前日期!',
        showCancel: false,
      })
      return;
    } else {
      var data = {};
      data.material = this.data.materialList[this.data.materialIndex];
      data.stockRemovalCount = e.detail.value.outNumber;
      data.stockRemovalDate = this.data.date;
      data.warrantyNumber = {
        id: this.data.id
      }
      var that = this;
      wx.request({
        url: saveStockRemoval,
        method: 'POST',
        data: {
          'data': JSON.stringify(data),
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'logistics-session-token': wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.data.status == "SUCCESS") {
            wx.showToast({
              title: '新增成功',
            });
            that.setData({
              // 物料下标
              materialIndex: '',
              //物料名称
              materialName: '---请选择---',
              //日期
              date: '---选择日期---',
              outNumber: '',
            })
            that.getListData(that.data.id);
          } else {
            wx.showToast({
              title: '失败',
            });
          }
          that.setData({
            loadingHidden: true,
            showMateriel: true,
            showSuccess: true,
          })
        }
      });
    }
  },
  //日期改变事件
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //设置维修状态提交事件
  formSubmitStatus: function (e) {
    var that = this;
    var textarea = e.detail.value.textarea ? e.detail.value.textarea : '';
    if (this.data.radioValue == 8) {
      if (e.detail.value.textarea == "") {
        wx.showModal({
          title: '提示',
          content: '请输入无法维修原因！',
          showCancel: false
        });
        return;
      }
    }
    var data = {
      id: this.data.id,
      maintenanceStatusId: this.data.radioValue,
      unableRepairReason: textarea,
    };
    wx.request({
      url: completionMaintenanceRecordForWorker,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'logistics-session-token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.status == "SUCCESS") {
          wx.showModal({
            title: '提示',
            content: '手动设置状态成功!',
            showCancel: false,
          });
          that.getListData(that.data.id);
        } else if (res.data.status == "ERROR") {
          wx.showModal({
            title: '提示',
            content: '手动设置状态失败!',
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '未知错误',
          });
        }
        that.setData({
          loadingHidden: true,
          showMateriel: true,
          showSuccess: true,
        })
      }
    })
  },
  //删除物料列表
  deleteMaterial: function (res) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确认要删除这条记录吗？',
      success: function (e) {
        if (e.confirm) {
          wx.request({
            url: deleteStockRemoval,
            method: "POST",
            data: {
              id: res.target.dataset.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'logistics-session-token': wx.getStorageSync('token')
            },
            success: function (res) {
              if (res.data.status == "SUCCESS") {
                that.getListData(that.data.id);
              }
            }
          })
        } else {
        }
      }
    })

  },
  listenTextareaFromCommentText:function(e){
    this.setData({
      commentTextNumber: (e.detail.value).length,
    })
  },
  listenTextareaFromcomplete_txtarea: function (e) {
    this.setData({
      complete_txtareaNumber: (e.detail.value).length,
    })
  }
})

//维修--发布
const app = getApp();
const domainUrl = app.globalData.httpDomain;
// const getmaintenanceTypeList = domainUrl + '/getCategoryTypeJson';
//获取校区
const getcampusList = domainUrl + '/getCampusSelectList';
const getMaintenanceAreaSelectList = domainUrl + '/getMaintenanceAreaSelectList';
//获取工种
const getMaintenanceTypeSelectList = domainUrl + '/getMaintenanceTypeSelectList';
//获取维修类别
const getMaintenanceCateaorySelectList = domainUrl + '/getMaintenanceCateaorySelectList';
// const getcampusList = domainUrl + '/getCampusAreaJson';
const saveUrl = domainUrl + '/saveMaintenanceRecord';
const util = require('../../../utils/util.js');
//上传图片
var uploadImage = app.globalData.httpDomain + '/summernote/fileupload';
var i = 0;
//图片数组
var imgItem = [];
// 
Page({
  /**
   * 页面的初始数据      
   */
  data: {
    //校区Id
    campusId: '',
    campusAreaId: '',
    //校区显示名称
    campusName: '--请选择--',
    campusAreaName: '--请选择--',
    // 维修项目显示名称
    maintenanceName: '--请选择--',
    maintenanceTypeName: '--请选择--',
    // 维修id
    maintenanceId: '',
    maintenanceTypeId: '',
    //上传的图片临时路径数组
    imgPathItems: [],
    loadingHidden: false,
    navigateFlag: true,
    loadingText: '加载中...',
    repailAreaNumber: 0,
    repailItemNumber: 0,

  },
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data // 获取到userId
        })
        that.getpickerInfoArea();
        that.getpickerInfoType();
        that.getpickerInfo();
        that.getpickerInfoCampus();
      },
    });
  },
  //递归执行Promise
  recursion: function (value, imgPathItems) {
    var that = this;
    util.runAsync(uploadImage, imgPathItems).then(function (data) {
      if (i < that.data.imgPathItems.length - 1) {
        i++;
        imgItem.push(data.url);
        return that.recursion(value, that.data.imgPathItems[i]);
      } else {
        imgItem.push(data.url);
        that.submitData(value, imgItem)
      }
    })
  },
  //点击确认提交按钮事件
  formSubmit: function (e) {
    var that = this;
    // 详细地址
    const repAreaDetail = e.detail.value.repailArea;
    // 维修内容
    const repItemDetail = e.detail.value.repailItem;
    const repTitle = e.detail.value.title;
    var warn = "";
    let flag = true;
    if (this.data.campusId == '') {
      warn = "请选择所属校区!";
    } else if (this.data.campusAreaId == '') {
      warn = "请选择维修区域!";
    } else if (repAreaDetail == '' || repAreaDetail.trim().length == 0) {
      warn = "请输入详细地址！";
    } else if (this.data.maintenanceId == '') {
      warn = "请选择维修项目!";
    } else if (this.data.maintenanceTypeId == '') {
      warn = "请选择维修类别!";
    } else if (repTitle == '' || repTitle.trim().length == 0) {
      warn = "请输入维修标题！";
    } else if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(repTitle)) {
      warn = "标题只允许输入汉字、字母、数字！"
    } else if (repItemDetail == '' || repItemDetail.trim().length == 0) {
      warn = "请输入维修详情！";
    } else {
      flag = false;
    };
    if (flag) {
      wx.showModal({
        title: '提示',
        content: warn,
        showCancel: false
      })
      //打开节流阀
      this.setData({
        navigateFlag: true,
      })
      return;
    }
    if (this.data.navigateFlag) {
      //关闭节流阀
      this.setData({
        navigateFlag: false,
      })
      wx.showLoading({
        title: '正在保存...'
      });
      if (this.data.imgPathItems.length > 0) {
        
        this.recursion(e.detail.value, this.data.imgPathItems[i]);
      } else {
        this.submitData(e.detail.value, '');
      }
    }

  },
  //提交数据事件
  submitData: function (e, imgUrl) {
    let that = this;
    // 详细地址
    const repAreaDetail = e.repailArea;
    // 维修内容
    const repItemDetail = e.repailItem;
    const repTitle = e.title;
    if (imgUrl) {
      var data = {
        "repairMethod": 1,
        "maintenanceRecord": {
          "maintenanceArea": {
            "campus": {
              "id": this.data.campusId
            },
            "id": this.data.campusAreaId
          },
          "maintenanceCategory": {
            "maintenanceType": {
              "id": this.data.maintenanceId
            },
            "id": this.data.maintenanceTypeId
          }
        },
        "address": repAreaDetail,
        "maintenanceContent": repItemDetail,
        "repairStaff": {
          "id": this.data.userId
        },
        "maintenanceItemName": repTitle,
        "fileUrls": String(imgUrl.join(',')),
      }
    } else {
      var data = {
        "repairMethod": 1,
        "maintenanceRecord": {
          "maintenanceArea": {
            "campus": {
              "id": this.data.campusId
            },
            "id": this.data.campusAreaId
          },
          "maintenanceCategory": {
            "maintenanceType": {
              "id": this.data.maintenanceId
            },
            "id": this.data.maintenanceTypeId
          }
        },
        "address": repAreaDetail,
        "maintenanceContent": repItemDetail,
        "repairStaff": {
          "id": this.data.userId
        },
        "maintenanceItemName": repTitle,
        // "fileUrls": String(imgUrl.join(',')),
      }
    }
    //清空全局变量imgItem
    imgItem = [];
    // return;
    wx.request({
      url: saveUrl,
      method: "POST",
      data: {
        data: JSON.stringify(data)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'logistics-session-token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.status == 'SUCCESS') {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
          wx.redirectTo({
            url: '../repair/list/list?id=' + that.data.userId,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '保存失败',
            showCancel: false,
          })
        }
        that.setData({
          loadingHidden: false,
        })

      }
    })
  },
  //所属校区选择器
  campusChange: function (e) {
    let campusNameItems = this.data.campusNameItems;
    let campusIdItems = this.data.campusIdItems;
    let campusAreaInit = this.data.campusAreaItemsInit;
    let campusAreaNameItems = [], campusAreaIdItems = [];
    this.setData({
      campusId: campusIdItems[e.detail.value],
      campusName: campusNameItems[e.detail.value],
    })
    for (var k in campusAreaInit) {
      if (campusAreaInit[k].fatherID == this.data.campusId) {
        campusAreaNameItems.push(campusAreaInit[k].name);
        campusAreaIdItems.push(campusAreaInit[k].id);
      }
    }
    this.setData({
      campusAreaNameItems: campusAreaNameItems,
      campusAreaIdItems: campusAreaIdItems,
      campusAreaName: '--请选择--',
      campusAreaId: ''
    })
  },
  //维修区域选择器
  campusAreaChange: function (e) {
    this.setData({
      campusAreaId: this.data.campusAreaIdItems[e.detail.value],
      campusAreaName: this.data.campusAreaNameItems[e.detail.value]
    })
  },
  //维修项目选择器
  maintenanceCategoryChange: function (e) {
    this.setData({
      maintenanceName: this.data.maintenanceNameItems[e.detail.value],
      maintenanceId: this.data.maintenanceIdItems[e.detail.value]
    })
    let init = this.data.maintenanceCategoryInit, categoryItems = [], categoryIdItems = [];
    for (var k in init) {
      if (init[k].fatherID == this.data.maintenanceId) {
        categoryItems.push(init[k].name);
        categoryIdItems.push(init[k].id);
      }
    }
    this.setData({
      categoryIdItems: categoryIdItems,
      categoryItems: categoryItems,
      maintenanceTypeName: '--请选择--',
      maintenanceTypeId: ''
    });
  },
  //维修类别选择器
  maintenanceTypeChange: function (e) {
    this.setData({
      maintenanceTypeName: this.data.categoryItems[e.detail.value],
      maintenanceTypeId: this.data.categoryIdItems[e.detail.value]
    })
  },
  //获取校区下拉框列表
  getpickerInfoCampus: function (callback) {
    let that = this;
    wx.request({
      url: getcampusList,
      method: "POST",
      data: {
        
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let campusNameItems = [], campusIdItems = [], campusAreaItemsInit = [];
        for (var k in res.data.data) {
          campusNameItems.push(res.data.data[k].name);
          campusIdItems.push(res.data.data[k].id);
        }
        that.setData({
          campusNameItems: campusNameItems,
          campusIdItems: campusIdItems,
          campusAreaItemsInit: campusAreaItemsInit,
          loadingHidden: true,
        });
      }
    })
  },
  //获取维修区域下拉框
  getpickerInfoArea: function (callback) {
    let that = this;
    wx.request({
      url: getMaintenanceAreaSelectList,
      method: "POST",
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data.data;
        let campusAreaItemsInit = [];
        for (var j in data) {
          let campusArea = {};
          campusArea = {
            name: data[j].name,
            id: data[j].id,
            fatherID: data[j].campus.id,
          }
          campusAreaItemsInit.push(campusArea);
        }
        that.setData({
          campusAreaItemsInit: campusAreaItemsInit,
          loadingHidden: true,
        });
      }
    })
  },
  //获取维修项目
  getpickerInfoType: function () {
    let that = this;
    wx.request({
      url: getMaintenanceTypeSelectList,
      method: "POST",
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let maintenanceTypeList = res.data.data;
        let maintenanceNameItems = [], maintenanceIdItems = [];
        for (var k in maintenanceTypeList) {
          maintenanceNameItems.push(maintenanceTypeList[k].name);
          maintenanceIdItems.push(maintenanceTypeList[k].id);
        }
        that.setData({
          maintenanceNameItems: maintenanceNameItems,
          maintenanceIdItems: maintenanceIdItems,
        })
      }
    })
  },
  //获取维修类别
  getpickerInfo: function () {
    let that = this;
    wx.request({
      url: getMaintenanceCateaorySelectList,
      method: "POST",
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data.data;
        let maintenanceCategoryInit = [];
        for (var k in data) {
            let maintenanceObject = {
              name: data[k].name,
              id: data[k].id,
              fatherID: data[k].maintenanceType.id
            }
            maintenanceCategoryInit.push(maintenanceObject);
          }
        that.setData({
          maintenanceCategoryInit: maintenanceCategoryInit
        })
      }
    })
  },
  //点击选择图片
  clickChooseImage: function () {
    var that = this;
    if (this.data.imgPathItems.length >= 10) {
      wx.showModal({
        title: '提示',
        content: '图片数量最大值为10',
        showCancel: false
      });
      return;
    }
    //相机组件控制
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      // itemColor: "black",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  //选择图片
  chooseWxImage: function (type) {
    var that = this;
    var count = this.data.imgPathItems.length > 0 ? 10 - this.data.imgPathItems.length : 10;
    wx.chooseImage({
      //相机   相册
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      count: count,
      success: function (res) {
        var imageItems = that.data.imgPathItems;
        if ((imageItems.length + res.tempFilePaths.length) > 10) {
          wx.showModal({
            title: '选择图片数量超出',
            content: '已有' + imageItems.length + '张图片,可添加' + (10 - imageItems.length) + '张图片',
          })
          return;
        }
        for (var k in res.tempFilePaths) {
          imageItems.push(res.tempFilePaths[k]);
        }
        that.setData({
          imgPathItems: imageItems,
        })
      }
    })
  },
  //预览图片
  previewClick: function (e) {
    wx.previewImage({
      urls: [this.data.imgPathItems[e.currentTarget.dataset.index]],
    })
  },
  //删除图片事件
  deleteImageClick: function (e) {
    var imgPathItems = this.data.imgPathItems;
    imgPathItems.splice(e.currentTarget.dataset.index, 1);

    this.setData({
      imgPathItems: imgPathItems,
    })
  },
  //监听textarea框输入事件
  listenTextareaFromRepailArea: function (e) {
    this.setData({
      repailAreaNumber: (e.detail.value).length,
    })
  },
  listenTextareaFromRepailItem: function (e) {
    this.setData({
      repailItemNumber: (e.detail.value).length,
    })
  },
  campusAreaClick:function(e){
    if(this.data.campusAreaNameItems.length == 0){
      wx.showModal({
        title: '提示',
        content: '该校区未设置维修区域!',
        showCancel:false,
      });
    }
  },
  maintenanceClick:function(e){
    if (this.data.categoryItems.length == 0) {
      wx.showModal({
        title: '提示',
        content: '该维修项目未设置维修类别!',
        showCancel: false,
      });
    }
  }
})


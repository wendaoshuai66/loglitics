//用户--查看个人信息
var app = getApp();
var maintenanceWorkerURL = app.globalData.httpDomain + "/saveMaintenanceWorker";   //维修工注册
var teacherURL = app.globalData.httpDomain + '/saveTeacher';
var studentURL = app.globalData.httpDomain + '/saveStudent';
var getDerpartmentList = app.globalData.httpDomain + '/getDepartmentSelectList';
var getPositionSelectListURL = app.globalData.httpDomain + '/getPositionSelectList';
var getMaintenanceTypeSelectListURL = app.globalData.httpDomain + '/getMaintenanceTypeSelectList';
var getCampusSelectList = app.globalData.httpDomain + '/getCampusSelectList';
Page({
  data: {
    //部门名称
    departmentName: '',
    //用户信息
    userInfo: {},
    //性别wxml数组显示
    genderItem: [{
      name: '男',
      checked: true,
      value: 1
    }, {
      name: '女',
      value: 0
    }],
    //性别 用于提交
    gender: '',
    //  校区下标
    campus: 0,
    //校区id
    campusId: 1,
    //职务下标 工种
    positionAndMaintenance: 0,
    //显示隐藏教师/工种 picker栏
    hiddenTeacher: true,
    hiddenWorker: true,
    //用户类型数组
    roleItems: ['管理员', '维修人员', '教师', '学生'],
    showPage: true,
    //维修，非维修
    ifLogisticsType: '',
  },
  onLoad: function () {
    var that = this;
    let genderIndex = '';
    wx.showLoading({
      title: '加载中···',
    })
    setTimeout(function () {
      that.setData({
        showPage: false
      });
      //提取 user 缓存
      wx.getStorage({
        key: 'user',
        success: function (res) {
          var data = res.data;
          // 性别统一初始化
          var gender = that.data.genderItem;

          for (var k in gender) {
            delete gender[k].checked
            if (data.sex == gender[k].value) {
              gender[k].checked = true;
              genderIndex = gender[k].value;
            }
          }

          if (data.role == 0) {
            that.setData({
              hiddenWorker: false,
              hiddenTeacher: false,
              genderItem: gender,
              userInfo: data,
              nickName: wx.getStorageSync('userInfo').nickName,
              gender: genderIndex
            });
            //获取campusItems所有校区信息以及部门信息
            that.getCampusSelectList();
            //获取所有的工种信息
            that.getPositionSelectList(getMaintenanceTypeSelectListURL);
            //获取所有的职务信息
            that.getPositionSelectList(getPositionSelectListURL);
          } else if (data.role == 1) {//维修工初始化input数据
            that.setData({
              hiddenWorker: false,
              genderItem: gender,
              userInfo: data,
              nickName: wx.getStorageSync('userInfo').nickName,
              ifLogisticsType: 1,
              gender: genderIndex
            })
            //获取campusItems所有校区信息以及部门信息
            that.getCampusSelectList();
            //获取所有的工种信息
            that.getPositionSelectList(getMaintenanceTypeSelectListURL);
          } else if (data.role == 2) {//教师初始化input框内数据
            that.setData({
              hiddenTeacher: false,
              genderItem: gender,
              userInfo: data,
              nickName: wx.getStorageSync('userInfo').nickName,
              ifLogisticsType: 0,
              gender: genderIndex
            })
            //获取campusItems所有校区信息以及部门信息
            that.getCampusSelectList();
            //获取所有的职务信息
            that.getPositionSelectList(getPositionSelectListURL);
          } else { //学生初始化
            that.setData({
              genderItem: gender,
              userInfo: data,
              nickName: wx.getStorageSync('userInfo').nickName,
              gender: genderIndex
            })
            wx.hideLoading();
          }
        },
      });
    }, 500);
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
        if (that.data.userInfo.role == 2) {  // 教师
          that.setData({
            campus: campusItems.indexOf(that.data.userInfo.teacher.department.campus.name),
            campusId: that.data.userInfo.teacher.department.campus.id,
            departmentName: that.data.userInfo.teacher.department.name,
            departmentId: that.data.userInfo.teacher.department.id,
            campusItems: campusItems,
            campusIdItems: campusIdItems
          })
        } else if (that.data.userInfo.role == 1) {// 维修工

          that.setData({
            campus: campusItems.indexOf(that.data.userInfo.maintenanceWorker.department.campus.name),
            campusId: that.data.userInfo.maintenanceWorker.department.campus.id,
            departmentName: that.data.userInfo.maintenanceWorker.department.name,
            departmentId: that.data.userInfo.maintenanceWorker.department.id,
            campusItems: campusItems,
            campusIdItems: campusIdItems
          })
        } else if (that.data.userInfo.role == 0) {
          that.setData({
            campus: campusItems.indexOf(that.data.userInfo.maintenanceWorker.department.campus.name) || campusItems.indexOf(that.data.userInfo.teacher.department.campus.name) || '无数据',
            campusId: that.data.userInfo.maintenanceWorker.department.campus.id || that.data.userInfo.teacher.department.campus.id || 0,
            departmentName: that.data.userInfo.maintenanceWorker.department.name || that.data.userInfo.teacher.department.name || '',
            departmentId: that.data.userInfo.maintenanceWorker.department.id || that.data.userInfo.teacher.department.id || '',
            campusItems: campusItems,
            campusIdItems: campusIdItems
          })
        }
        //存入department所有的部门信息  第二个参数 非维修  维修 部门
        that.getDerpartmentList(that.data.campusId, that.data.ifLogisticsType);
      }
    })
  },
  //获取部门信息
  getDerpartmentList: function (id, ifLogisticsType) {
    var that = this;
    wx.request({
      url: getDerpartmentList,
      data: {
        campusId: id,
        ifLogistics: ifLogisticsType,
        getAll: false
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        var dapartmentItems = [];
        var dapartmentIdItems = [];
        for (var k in data) {
          dapartmentIdItems.push(data[k].id);
          if (data[k].treeLevel == 0) {
            data[k].parentId = 0;
            continue;
          }
          //改变树形结构默认样式
          data[k].flag = false;
        }
        that.setData({
          departmentItems: data,
          dapartmentIdItems: dapartmentIdItems
        });
      },
    })
  },
  //获取职务信息
  getPositionSelectList: function (url) {
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        var positionArray = [];
        var positionIdItems = [];
        for (var k in data) {
          positionArray.push(data[k].name);
          positionIdItems.push(data[k].id);
        }
        that.setData({
          positionItems: positionArray,
          positionIdItems: positionIdItems
        });

        if (that.data.userInfo.role == 2) {//教师
          that.setData({
            position: positionIdItems.indexOf(that.data.userInfo.teacher.position.id),
          })
        } else if (that.data.userInfo.role == 1) { // 维修人员
          that.setData({
            position: positionIdItems.indexOf(that.data.userInfo.maintenanceWorker.maintenanceType.id),
          })
        } else if (that.data.userInfo.role == 0) {
          that.setData({
            position: positionIdItems.indexOf(that.data.userInfo.maintenanceWorker.maintenanceType.id) || positionIdItems.indexOf(that.data.userInfo.teacher.position.id),
          })
        }
        wx.hideLoading();
      },
    })
  },
  //更改性别
  bindPickersex: function (e) {
    this.setData({
      gender: e.detail.value
    })
  },
  //校区选择器
  campusPickerChange: function (e) {
    this.setData({
      campus: e.detail.value,
      departmentName: '请选择',
      departmentId: ''
    }),
    this.getDerpartmentList(this.data.campusIdItems[this.data.campus], this.data.ifLogisticsType);
  },
  // 职务选择器
  positionPickerChange: function (e) {
    this.setData({
      position: e.detail.value
    });
  },
  //修改按钮点击事件
  formSubmit: function (e) {
    var that = this;
    var inputValue = e.detail.value;
    var url = '';
    //验证用户输入信息    
    var warn = "";// 弹框时提示的内容
    var flag = true;// 判断信息输入是否完整
    // 判断的顺序依次是：工号-昵称-密码-手机号-身份证号码
    if (inputValue.account == "") {
      warn = "请输入您的工号！";
    } else if (inputValue.name == '') {
      warn = "请输入您的真实姓名！"
    } else if (!isNaN(parseInt(inputValue.name)) || inputValue.name.length < 2 || !/^[\u4E00-\u9FA5A-Za-z]+$/.test(inputValue.name)) {
      warn = "真实姓名只能输入2-10位中文或字母！"
    } else if (inputValue.card != '' && !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(inputValue.card)) {
      warn = "身份证号码格式不正确！";
    } else if (inputValue.tel == '') {
      warn = "请输入您的手机号码！";
    } else if (!/^1(3|4|5|7|8)\d{9}$/.test(inputValue.tel)) {
      warn = "手机号码格式不正确！";
    } else {
      flag = false;// 若必要信息都填写，则不用弹框，且页面可以进行跳转
    }
    if (flag == true) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: warn
      });
      return;
    }
    wx.showLoading({
      title: '正在保存',
      mask: true,
    });
    var userData = wx.getStorageSync('user');
    userData['account'] = inputValue.account;
    userData['name'] = inputValue.name;
    userData['idCardNum'] = inputValue.card;
    userData['tel'] = inputValue.tel;
    userData['sex'] = that.data.gender;
    if (userData.role == 1) {   //维修工
      url = maintenanceWorkerURL;

      userData.maintenanceWorker = {
        "department": {
          'id': that.data.departmentId
        },
        "id": userData.maintenanceWorker.id,
        "maintenanceType": {
          "id": that.data.positionIdItems[that.data.position],
        },
      }
    } else if (userData.role == 2) { //教师
      delete userData.student;
      delete userData.maintenanceWorker;
      url = teacherURL;
      userData.teacher = {
        "department": {
          'id': that.data.departmentId,
        },
        "id": userData.teacher.id,
        "position": {
          "id": that.data.positionIdItems[that.data.position],
        },
      };
    } else {   //学生
      url = studentURL;
      userData.student = {
        'approvalType': 0,
        'id': userData.student.id
      }
    }
    delete userData.addDateTime;
    delete userData.lastLoginDateTime;
    delete userData.status;
    delete userData.updateDateTime;
    delete userData.ifDelete;
    //发送请求开始
    wx.request({
      url: url,
      data: {
        "data": JSON.stringify(userData)
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideToast();
        if (res.data.status == 'SUCCESS') {
          wx.showToast({
            title: '保存成功',
          })
          //更新缓存
          that.upDataStorage(userData.id);
        } else {
          wx.showToast({
            title: '保存出错',
          })
        }

      },
    });
  },
  //弹出选择部门
  toChooseBox: function () {
    // this.getDerpartmentList(this.data.campusId, 1);
    this.setData({
      showFlag: true,
    })
  },
  //移除选择部门的遮罩层
  toCancel: function () {
    this.setData({
      showFlag: false,
    })
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
  //更新缓存
  upDataStorage: function (userId) {
    wx.request({
      url: app.globalData.httpDomain + "/getUserById",
      data: {
        id: userId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.setStorageSync('user', res.data.data);
        //返回上一级
        wx.navigateBack({});
      }
    })
  },
})

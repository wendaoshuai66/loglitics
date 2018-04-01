//用户--注册补充信息页面
var app = getApp();
// 获取app.js中同通用初始化数据
var maintenanceWorkerURL = app.globalData.httpDomain + "/saveMaintenanceWorker";   //维修工注册
var teacherURL = app.globalData.httpDomain + '/saveTeacher';
var studentURL = app.globalData.httpDomain + '/saveStudent';
var getDerpartmentList = app.globalData.httpDomain + '/getDepartmentSelectList';
//获取职位
var getPositionSelectList = app.globalData.httpDomain + '/getPositionSelectList';
//获取工种
var getMaintenanceTypeSelectList = app.globalData.httpDomain + '/getMaintenanceTypeSelectList';
var getCampusSelectList = app.globalData.httpDomain + '/getCampusSelectList';
// 页面数据及方法定义
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //部门类型  0非维修 1维修
    departmentType: '',
    //部门名称
    departmentName: '选择部门',
    campusName: '选择校区',
    positionName: '',
    parentId: -1000,
    boxTop: '100%',
    //用户类型
    role: "",
    // 工号/学号
    roleItem: ['工号', '学号'],
    //用户类型下标
    roleIndex: 0,
    // 职务数组
    positionNameItems: ['正在加载...'],
    // 选中的职务下标
    position: '',
    //选中的职务id
    positionId: '',
    //校区数组
    campusItems: ['正在加载...'],
    //选中的校区
    campus: 0,
    // 部门数组
    departmentItems: ['正在加载...'],
    //选中的部门id
    departmentId: '',
    //性别数组
    genderItem: [{
      name: '男',
      checked: true,
      value: 1
    }, {
      name: '女',
      value: 0
    }],
    // 绑定微信用户id
    uid: '',
    // 用户性别,1:男，0:女
    gender: 1,
    //微信昵称
    weChatNickName: '',
    //微信头像
    headPicture: '',
    //微信openid
    weChatOpenId: '',
    //是否隐藏维修人员的工种
    hiddenWorker: true,
    //是否隐藏教职人员的职位
    hiddenTeacher: true,
    //用户绑定的手机号码
    tel: '',
    departmentHidden: false,
    // loadingHidden:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask:true,
    })
    var userData = JSON.parse(options.userData);
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (userData.role == 3) { //学生身份进入
          that.setData({
            //用户类型
            role: 3,
            //用于判断显示为学号/工号
            roleIndex: 1,
            //微信昵称
            weChatNickName: res.data.nickName,
            //用户头像
            headPicture: res.data.avatarUrl,
            tel: userData.tel,
            departmentHidden: true,
            departmentType:0
          })
        } else if (userData.role == 1) {            //维修工身份进入
          that.setData({
            // 用户类型
            role: 1,
            hiddenTeacher: true,
            hiddenWorker: false,
            //微信昵称
            weChatNickName: res.data.nickName,
            //用户头像
            headPicture: res.data.avatarUrl,
            tel: userData.tel,
            positionName: '选择工种',
            departmentType:1
          },function(){
            //获取校区信息 
            that.getCampusSelectList();
            //获取工种信息
            that.getPositionSelectList(getMaintenanceTypeSelectList);
          })
        } else if (userData.role == 2) {            //教师身份进入
          that.setData({
            role: 2,
            //微信昵称
            weChatNickName: res.data.nickName,
            //用户头像
            headPicture: res.data.avatarUrl,
            tel: userData.tel,
            hiddenTeacher: false,
            hiddenWorker: true,
            positionName: '选择职务',
            departmentType:0
          },function(){
            //获取校区信息 
            that.getCampusSelectList();
            //获取职位信息 
            that.getPositionSelectList(getPositionSelectList);
          })
        } else {
          return;
        }
        wx.hideLoading();
      }
    })
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
        })
        
      },
    })
  },
  //获取部门信息
  getDerpartmentList: function (id, departmentType) {
    var that = this;
    wx.request({
      url: getDerpartmentList,
      data: {
        campusId: id,
        ifLogistics: departmentType,
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
          //改变树形结构默认样式
          data[k].flag = false;
        }
        that.setData({
          departmentItems: data,
        })
      },
    })
  },
  //获取职务信息  获取工种信息
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
        var positionNameArray = [];
        var positionIdArray = [];
        for (var k in data) {
          positionNameArray.push(data[k].name);
          positionIdArray.push(data[k].id);
        }
        that.setData({
          positionNameItems: positionNameArray,
          positionIdItems: positionIdArray
        })
      }
    })
  },
  //校区选择器
  campusPickerChange: function (e) {
    var items = this.data.campusItems;
    this.setData({
      campus: e.detail.value,
      campusName: items[e.detail.value],
      campusId: true,
      departmentName:'选择部门',
      departmentId:''

    });
    //第二个参数控制返回的是维修部门还是非维修部门，维修部门0暂时无数据，未测试
    this.getDerpartmentList(this.data.campusIdItems[e.detail.value], this.data.departmentType);
  },
  // 职务选择器   工种选择器
  positionPickerChange: function (e) {
    this.setData({
      position: e.detail.value,
      positionId: this.data.positionIdItems[e.detail.value],
      positionName: this.data.positionNameItems[e.detail.value]
    })
  },

  // 性别选择器事件响应
  genderChange: function (e) {
    this.setData({
      gender: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this;
    var inputValue = e.detail.value;
    var url = '';
    //验证用户输入信息    
    var warn = "";// 弹框时提示的内容
    var flag = true;// 判断信息输入是否完整


    if (inputValue.account == "") {
      if (that.data.role == 3) {
        warn = "请输入您的学号!";
      } else {
        warn = "请输入您的工号！";
      }
    } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$/.test(inputValue.account)) {
      if (that.data.role == 3) {
        warn = "学号为8位字母、数字，不能为纯数字或字母!";
      } else {
        warn = "工号为8位字母、数字，不能为纯数字或字母!";
      }
    } else if (inputValue.password == "") {
      warn = "请输入您的登录密码！";
    } else if (inputValue.password.length < 6) {
      warn = "密码长度至少为6位！"
    } else if (inputValue.passwordAgain == "") {
      warn = "请输入确认密码！";
    } else if (inputValue.password !== inputValue.passwordAgain) {
      warn = "两次密码输入不一致！";
    } else if (inputValue.name == '') {
      warn = "请输入您的真实姓名！"
    } else if (!isNaN(parseInt(inputValue.name)) || inputValue.name.length < 2 || !/^[\u4E00-\u9FA5A-Za-z]+$/.test(inputValue.name)){
      warn = "真实姓名只能输入2-10位中文或字母！"
    } else if (inputValue.card != '' && !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(inputValue.card)) {
        warn = "身份证格式不正确！";
    } else if (!that.data.campusId && that.data.role != 3) {
      warn = "请选择您所在的校区！";
    } else if (that.data.departmentId == '' && that.data.role != 3) {
      warn = "请选择您所在的部门！";
    } else if (that.data.positionId == '' && that.data.role == 2) {
      warn = "请选择您的职务！";
    } else if (that.data.positionId == '' && that.data.role == 1) {
      warn = "请选择您的工种！";
    } else if (that.data.repeatAccount){
      warn = that.data.roleItem[that.data.roleIndex]+'重复，请重新输入!';
    } else {
      flag = false;// 若必要信息都填写，则不用弹框，且页面可以进行跳转
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn,
        showCancel: false
      });
      return;
    }

    var userData = {
      // 用户类型
      "role": that.data.role,
      // 用户工号/学号
      "account": inputValue.account,
      // 用户姓名
      "name": inputValue.name,
      // 用户性别
      "sex": that.data.gender,
      // 用户密码
      "password": inputValue.password,
      // 用户联系方式
      "tel": that.data.tel,
      // 身份证号码
      "idCardNum": inputValue.card,
      // 微信网名
      'weChatNickName': that.data.weChatNickName,
      //openId
      'weChatOpenId': app.globalData.userInfo.openId,
      //用户头像
      'headPicture': that.data.headPicture,
    };
    if (that.data.role == 1) {   //维修工
      url = maintenanceWorkerURL;
      userData.maintenanceWorker = {
        "department": {
          'id': that.data.departmentId
        },
        "maintenanceType": {
          "id": that.data.positionId,
        },
      }
    } else if (that.data.role == 2) { //教师
      url = teacherURL;
      userData.teacher = {
        "department": {
          'id': that.data.departmentId,
        },
        "position": {
          "id": that.data.positionId,
        },
      };
    } else {   //学生
      url = studentURL;
      userData.student = {
        'approvalType': 0
      }
    }
    wx.showLoading({
      title: '提交中...',
      icon: 'loading',
      duration: 100,
    });
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

        var id = res.data.userId;
        //缓存token
        wx.setStorageSync("token", res.data.token);
        //缓存新注册用户id
        wx.setStorageSync('userId', id);
        //缓存用户信息
        // if (!wx.getStorageSync('user') || wx.getStorageSync('user') == "") {
          wx.getStorage({
            key: 'userId',
            success: function (res) {
              if (res.data) {
                wx.request({
                  url: app.globalData.httpDomain + "/getUserById",
                  data: {
                    id: id,
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    that.setData({
                      index: res.data.data.role
                    })
                    wx.setStorage({
                      key: 'user',
                      data: res.data.data,
                    });
                    wx.showToast({
                      title: '提交成功',
                      icon: 'success',
                      duration: 500,
                      success: function () {
                        // 关闭等待框
                        wx.hideLoading();
                        wx.switchTab({
                          url: '../../tabBar/infor/infor',
                        })
                      }
                    });
                  }
                })
              }
            },
          })
        // }
        
      },
      fail: function (res) {
      }
    })
  },
  //点击选择部门input事件
  toChooseBox: function () {
    if (this.data.departmentItems[0] == "正在加载..."){
      wx.showModal({
        title: '提示',
        content: '请先选择校区！',
        showCancel:false
      })
      return;
    }
    this.getDerpartmentList(this.data.campusIdItems[this.data.campus], this.data.departmentType);
    this.setData({
      showFlag: true,
    })
  },
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
  //验证工号/学号是否唯一
  accountBlur:function(e){
    if(e.detail.value == ''){
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.httpDomain + "/checkRepeatAccount",
      data: {
        'data': JSON.stringify({
          account:e.detail.value,
        })
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      if(res.data.status == "REPEAT"){
        wx.showModal({
          title: '提示',
          content: that.data.roleItem[that.data.roleIndex]+"重复，请重新输入!",
          showCancel:false
        })
        //清空学号
        that.setData({
          repeatAccount: true,
          account:''
        })
      }else{
        that.setData({
          repeatAccount:false,
        })
      }
      }
    });
  }
})
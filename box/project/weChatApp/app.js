//使用cmd模块化规范引入结构js,这个js可以放到任何一个js中,只要你路径正确就可以。
//app.js是小程序的入口文件,放在这里在后面就可以直接引用了。
App({ // 全局变量
  globalData: {
    // httpDomain: "http://192.168.1.121:8088/logistics",
    httpDomain: "http://192.168.0.133:8088/logistics",     //133
    // httpDomain: "http://192.168.0.150:8088/logistics",  //永杰  联兴科技
    // httpDomain: "http://192.168.1.101:8088/logistics",//联兴科技1 永杰
    // httpDomain: "https://api.joriving.com/logistics",   //正式
    userInfo: {},
    systemInfo: {},
    //发送验证码   true开启短信验证，false关闭短信验证默认通过
    sendCode: true,
  },
  onLaunch: function () {
    var that = this;
    // 设备屏幕信息
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        var systemInfo = {};
        systemInfo.windowWidth = res.windowWidth;
        // second部分高度 = 利用窗口可使用高度 - first部分高度
        //（这里的高度单位为px，所有利用比例将300rpx转换为px）
        systemInfo.windowHeight = res.windowHeight;
        //systemInfo.pixelRatio = res.pixelRatio;// 像素比
        that.globalData.systemInfo = systemInfo;
      }
    });
  }
})

//获取当前日期  
function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var array = [];
  array.push(year);
  array.push(month);
  array.push(day);
  return array.join('-');
}
//截取掉时分秒
function scliceHMO(date) {
  return date.split(' ')[0];
}
//检查日期是否小于等于当前日期
function checkDateTime(date) {
  var newDate = new Date();
  var date = new Date(Date.parse(date));
  return date <= newDate;
}
//检查日期是否大于当前日期
function checkDateTimeUpward(date) {
  var newDate = new Date();
  var date = new Date(Date.parse(date));
  return date > newDate;
}
// 转换时间参数
function informentionDate(id, date) {
  var date = date.split('-');
  //一年内
  if (id == 0) { //本年
    date[1] = '1';
    date[2] = '1';
  } else if (id == 1) {   //本月
    date[2] = '1';
  } else if (id == 2) {  //本周
    let week = getWeekNumber(date.join('/'), 'number');
    if (week == 0) {
      week = 7;
    }
    if (week == 1) { //刚好等于星期一 

    } else { // 为周一时数据有问题，暂用if规避.
      if (date[2] - (week - 1) < 1) {  //如果减去已过的周内天数小于1 ，则需要减去月份
        if (date[1] - 1 < 1) { // 如果恰好减去月份小于1 则需要减去年份
          date[0] = date[0] - 1;
          date[1] = 12;
          date[2] = manyDay(date[0], date[1]) + date[2] - (week - 1);
        } else {
          date[1] = date[1] - 1;
          date[2] = manyDay(date[0], date[1]) + date[2] - (week - 1);
        }
      } else {
        date[2] = date[2] - (week - 1);
      }
    }

  } else if (id == 3) {//昨天
    if (date[2] - 1 < 1) {//如果减去1刚好小于1，则减去月份
      if (date[1] - 1 < 1) { // 如果恰好减去月份小于1 则需要减去年份
        date[0] = date[0] - 1;
        date[1] = 12;
        date[2] = manyDay(date[0], date[1]) + date[2] - 1;
      } else {
        date[1] = date[1] - 1;
        date[2] = manyDay(date[0], date[1]) + date[2] - 1;
      }
    } else {
      date[2] = date[2] - 1;
    }
  } else if(id == -1){
    date[0] = Number(date[0]) + 1;
    date[1] = 1;
    date[2] = 1;
  } else { // 今天
    //原路返回，不做任何处理
  }

  date[1] = date[1] < 10 ? '0' + date[1] : date[1];
  date[2] = date[2] < 10 ? '0' + date[2] : date[2];
  return date.join('-');
}
// 判断天数
function manyDay(year, month) {
  var days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
    days[2] = 29;
  }
  return days[month];
}

//nav下拉动画
function animationFn(option) {
  var animation = wx.createAnimation({
    duration: 500,
    timingFunction: 'ease',
  })
  if (option) { // 下拉动画
    animation.top('88%').step();
    return animation;
  } else {//归位动画
    animation.top('-700rpx').step();
    return animation;
  }
}
//promise函数
function runAsync(uploadUrl, imgFilPath) {
  var p = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: uploadUrl,
      filePath: imgFilPath,
      name: 'image',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: function (res) {
        var res = JSON.parse(res.data);
        if (res.message == "SUCCESS") {
          resolve(res);
        } else {
          reject(res);
        }
      }
    });
  });
  return p;
}

// 加载动画构造
function createLoadingAnimation() {
  var animation = wx.createAnimation({
    duration: 300,
    timingFunction: 'linear'
  });
  // animation.rotate(deg).step();
  return animation;
}
//加载动画循环播放
// function animationInfinite(animation,deg,loadingHidden){
//   animation.rotate(deg).step;
//   if(!loadingHidden){
//     return;
//   }else{
//     deg++;
//     this.animationInfinite(animation, deg);
//   }

// }

//获取某年某月某日是周几
//weekType 为number 返回数字型(用于nav下拉选择本周)  默认为汉字
function getWeekNumber(time, weekType) {
  var date = new Date(time).getDay();
  if (weekType == 'number') {
    return date;
  } else {
    switch (date) {
      case 1:
        return '周一';
        break;
      case 2:
        return '周二';
        break;
      case 3:
        return '周三';
        break;
      case 4:
        return '周四';
        break;
      case 5:
        return '周五';
        break;
      case 6:
        return '周六';
        break;
      case 0:
        return '周日';
        break;
    }
  }
}


module.exports = {
  formatDate: formatDate,
  informentionDate: informentionDate,
  manyDay: manyDay,
  animationFn: animationFn,
  runAsync: runAsync,
  createLoadingAnimation: createLoadingAnimation,
  getWeekNumber: getWeekNumber,
  checkDateTime: checkDateTime,
  checkDateTimeUpward: checkDateTimeUpward,
  scliceHMO: scliceHMO,
}

/**
 * js中更改日期 y年， m月， d日， h小时， n分钟，s秒
 */
Date.prototype.add = function (part, value) {
  value *= 1;
  if (isNaN(value)) {
    value = 0;
  }
  switch (part) {
    case "y":
      this.setFullYear(this.getFullYear() + value);
      break;
    case "m":
      this.setMonth(this.getMonth() + value);
      break;
    case "d":
      this.setDate(this.getDate() + value);
      break;
    case "h":
      this.setHours(this.getHours() + value);
      break;
    case "n":
      this.setMinutes(this.getMinutes() + value);
      break;
    case "s":
      this.setSeconds(this.getSeconds() + value);
      break;
    default:
  }
}

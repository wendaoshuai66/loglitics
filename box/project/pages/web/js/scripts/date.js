// 日期格式化
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds()
    // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for ( var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
// 定义获取和更新时间的函数
$(function() {
    setInterval(showTime, 1000);
    function showTime() {
        var date = new Date();
        // 获取年月日时分秒
        var year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), hours = date.getHours(), minutes = date
                .getMinutes(), seconds = date.getSeconds(), date = date.getDate();
        // 获取日期id
        hours = hours >= 10 ? hours : "0" + hours;
        minutes = minutes >= 10 ? minutes : "0" + minutes;
        seconds = seconds >= 10 ? seconds : "0" + seconds;
        var t = year + "年" + month + "月" + day + "日 " + hours + ":" + minutes + ":" + seconds;
        $("#clock").html(t);
    }
});
// 从日期得到星期几
function getWeek(dateString) {
    var date;
    if (isNull(dateString)) {
        date = new Date();
    } else {
        var dateArray = dateString.split("-");
        date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    }
    return "周" + "日一二三四五六".charAt(date.getDay());
};
var dateUtil = function () {
    function isNull(object) {
        if(object == null || typeof object == "undefined"){
            return true;
        }
        return false;
    };
    return {
        getWeekStr: function (dateString) {
            var date;
            if (isNull(dateString)) {
                date = new Date();
            } else {
                var dateArray = dateString.split("-");
                date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
            }
            return "周" + "日一二三四五六".charAt(date.getDay());
        },
    };
}();
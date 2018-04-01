//我的工作日志
angular.module("MetronicApp").controller('myWorkLogController', ['$scope', '$http', '$compile', '$location', '$filter', myWorkLogController]);
function myWorkLogController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.controllerName = 'myWorkLog';
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "title"
    }, {
        "data": "user.name"
    }, {
        "data": "workDate"
    }, {
        "data": "startTime"
    }, {
        "data": "endTime"
	}, {
        "data": "addDateTime"
    }];
    $scope.orderableAry = [0,1,2,3,4,5];
    $scope.order = [[6, "desc"]];
    $scope.viewWorkLogAry = [1];
    $scope.dateFormatMonthDay = [3];
    $scope.dateFormatHourDay = [4,5];
    $scope.targetsOpt = 7;
    $scope.optHtmlAry = ["remove" ];//"editWorkLog", 
    var url = "getDiaryList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.searchObj.user = {"id":$scope.loginUser.id};
    $scope.searchInit = true;
    $scope.initDataTablesName='myWorkLogDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteDiary";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope, function () {
            $scope.url = 'getDiaryList';
            $scope.reloadUrl = 'getDiaryList';
            $('#' + $scope.initDataTablesName).DataTable().ajax.reload(function () {}, false);
        });
    };
};
//我要发布
angular.module("MetronicApp").controller('workLogAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
    '$stateParams', '$q', '$state', workLogAddController]);

function workLogAddController($scope, $http, $compile, $location, $filter, $timeout, $stateParams, $q, $state) {
    ComponentsBootstrapMaxlength.init();
    $scope.data = {};
    // 保存按钮响应
    $scope.save = function () {
        // 更新数据
        var data = {
            'startTime': $scope.data.workDate + " " + $scope.data.workLogStartTime + ":00",
            'endTime': $scope.data.workDate + " " + $scope.data.workLogEndTime + ":00"
        };
        $.extend($scope.data, data);
        delete $scope.data.workLogStartTime;
        delete $scope.data.workLogEndTime;
        $scope.addLoading();
        $scope.optName = "保存";
        $scope.url = "saveDiary";
        $scope.data.user = {"id": $scope.loginUser.id};
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $scope.stateNewPage = true;
        $scope.returnControllerName = 'myWorkLogList';
        $scope.postApi($scope);
    };
    // 将子scope修改为false，防止父datePicker初始化配置影响子配置
    $scope.searchInit = false;
    $scope.option = {
        format: "yyyy-mm-dd",
        minView: 2,
        endDate: new Date()
    };
    $scope.datetimepickerId = ['workLog'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 小时时间框配置文件
    $scope.option = {
        format: "hh:ii",
        minView: 0
    };
    $scope.formInitTime = true;
    $scope.timepickerId = ['workLog'];
    timePickers.init($scope, $http, $compile, $location, $filter);
    // 设置小时视图中 显示年月功能隐藏(年月显示有问题)
    $('.table-condensed .switch').css({'visibility': 'hidden'});
    $scope.data.workDate = new Date().Format('yyyy-MM-dd');
    $scope.data.workLogStartTime = '08:00';
    $scope.data.workLogEndTime = '18:00';
    // 监听起始时间
    $scope.workLogStartChange = function () {
        angular.forEach($scope.timepickerId, function (id) {

            $("#" + id + "End").datetimepicker('setStartDate', $scope.getNextOrPrev5minTime($scope.data[id + "StartTime"], false));
            $scope.checkErrorInputAndFixed(id);
            $("#" + id + "Start").datetimepicker('hide');
        });
    };
    // 监听结束时间
    $scope.workLogEndChange = function () {
        angular.forEach($scope.timepickerId, function (id) {

            $("#" + id + "Start").datetimepicker('setEndDate', $scope.getNextOrPrev5minTime($scope.data[id + "EndTime"], true));
            $scope.checkErrorInputAndFixed(id);
            $("#" + id + "End").datetimepicker('hide');
        });
    };
    // 获取到传入时间的后5分钟时间或前5分钟时间
    $scope.getNextOrPrev5minTime = function (timeStr, flag) {
        var dateList = timeStr.split(':');
        var hour = dateList[0];
        var minute = dateList[1];
        // 向前5分钟
        if (flag) {
            if ((minute << 0) >= 5) {
                return hour + ":" + $scope.timeLeftAddZero((minute << 0) - 5);
            }
            else {
                return $scope.timeLeftAddZero((hour << 0) - 1) + ":55";
            }
        }
        // 向后5分钟
        else {
            if ((minute << 0) <= 55) {
                return hour + ":" + $scope.timeLeftAddZero((minute << 0) + 5);
            }
            else {
                return $scope.timeLeftAddZero((hour << 0) + 1) + ":00";
            }
        }
    };
    // 采用二级输入 输入了脏数据(起始与终止时间错乱)后的处理
    $scope.checkErrorInputAndFixed = function (id) {
        var startDateList = $scope.data[id + "StartTime"].split(':');
        var startHour = startDateList[0];
        var startMinute = startDateList[1];
        var endDateList = $scope.data[id + "EndTime"].split(':');
        var endHour = endDateList[0];
        var endMinute = endDateList[1];
        var startOverEndFlag = false;
        if (startHour > endHour) {
            startOverEndFlag = true;
        }
        else if (startHour == endHour) {
            if (startMinute >= endMinute) {
                startOverEndFlag = true;
            }
        }
        if (startOverEndFlag) {
            // 分钟大于等于5分钟
            if (endMinute << 0 >= 5) {
                $scope.data[id + "StartTime"] = $scope.timeLeftAddZero(endHour << 0) + ':' + $scope.timeLeftAddZero((endMinute << 0) - 5)
            }
            // 分钟正好为0分钟,且小时不为0时
            else if (endHour != 0) {
                $scope.data[id + "StartTime"] = $scope.timeLeftAddZero((endHour << 0) - 1) + ':55';
            }
            else {
                $scope.data[id + "EndTime"] = '00:05';
            }
        }
    };
    $scope.workLogStartChange();
    $scope.workLogEndChange();
};
//详情
angular.module("MetronicApp").controller('workLogViewController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
    '$stateParams', '$q', workLogViewController]);

function workLogViewController($scope, $http, $compile, $location, $filter, $timeout, $stateParams, $q) {
    // 传来的数据为空(页面刷新情况)
    var id;
    if (!$stateParams.id) {
        //id = $scope.getControllerPageId('workLogId');
    }
    else {
        id = $stateParams.id;
        //$scope.setControllerPageId('workLogId', id);
    }
    $scope.url = "getDiaryById";
    $scope.params = {"id": id};
    $http({
        method: 'POST',
        url: $scope.httpDomain + $scope.url,
        params: $scope.params
    }).success(function (data) {
        // console.log(data.data.workDate.split(" ")[0]);
        $scope.data = data.data;
        var startTime = $scope.data.startTime.split(' ')[1].split(':');
        var endTime = $scope.data.endTime.split(' ')[1].split(':');
        endTime.pop();
        startTime.pop();
        startTime.join(':');
        endTime.join(':');
        $scope.data.startTime = startTime.join(':');
        $scope.data.endTime = endTime.join(':');
        $scope.data.workDate = $scope.data.workDate.split(" ")[0];
        $scope.data.addDateTime = $scope.data.addDateTime.split(" ")[0];
    });
};
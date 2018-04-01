angular.module("MetronicApp").controller('commonRepairController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', commonRepairController]);

function commonRepairController($scope, $http, $compile, $location, $filter, $q) {
    // 页面中使用到的 labelauty 控件进行初始化设置
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'commonRepair';
    $scope.redirectUrl = 'viewMyRepair';
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "maintenanceNumber"
    }, {
        "data": "maintenanceRecord.maintenanceArea.campus.name"
    }, {
        "data": "maintenanceRecord.maintenanceArea.name"
    }, {
        "data": "maintenanceRecord.maintenanceCategory.maintenanceType.name"
    }, {
        "data": "maintenanceRecord.maintenanceCategory.name"
    }, {
        "data": "maintenanceItemName"
    }, {
        "data": "repairStaff.name"
    }, {
        "data": "addDateTime"
    }, {
        "data": "maintenanceRecord.maintenanceStatus.name"
    }, {
        "data": "maintenanceTime"
    }];
    $scope.orderableAry = [0,1,2,3,4,5,7,9,10];
    //$scope.htmlType = [10];
    $scope.wrapShortAry = [2,3,4,5,7];
    $scope.wrapAry = [6];
    //$scope.nullStr = [9];
    $scope.order = [[8, "desc"]];
    $scope.redirectionNewPage = [1];
    $scope.dateFormatMonthDay = [8];
    var url = "getMaintenanceRecord";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.repairMethod = 0;
    $scope.initDataTablesName='commonRepairDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 获取维修状态信息 (待审核,待受理 等)
    $q.all([getMaintenanceStatusData($scope, $http, $compile, $location, $filter)]).then(function () {
        $scope.getThisYearUseDateInfo($scope);
        $scope.peeledOffMaintenanceStatus($scope);
        $scope.initDateTimeRange();
        $scope.getSearchData();
    });
    // 剥离冗余数据,拼接html
    $scope.peeledOffMaintenanceStatus = function ($scope) {
        var status = angular.copy($scope.maintenanceStatusData);
        // 简洁数据
        var simplifyStatus = [];
        // 存放维修状态id
        $scope.maintenanceStatusIds = [0];
        var statusHtml = '<input type="checkbox" data-labelauty="全部" ng-model="maintenanceStatus._0" ng-click="changeMaintenanceStatus(' + 0 + ')"/>\n';
        var timeTitles = ['全部', '本年', '本月', '本周', '昨天', '今天'];
        var timeHtml = '';
        angular.forEach(status, function (value) {
            var strHtml = '<input type="checkbox" data-labelauty="' + value['name'] + '" ng-model="maintenanceStatus._' + value['id'] + '" ng-click="changeMaintenanceStatus(' + value['id'] + ')"/>\n';
            var obj = {
                'id': value['id'],
                'name': value['name']
            };
            simplifyStatus.push(obj);
            statusHtml += strHtml;
            $scope.maintenanceStatusIds.push(value['id']);
        });
        timeTitles.forEach(function (value, index) {
            var timeStr = '<input type="checkbox" data-labelauty="' + value + '" ng-model="maintenanceTime._' + index + '" ng-click="changeMaintenanceTime(\'_' + index + '\')"/>\n';
            timeHtml += timeStr;
        });
        $scope.maintenanceStatus = [];
        // labelauty 控件不支持 ng-repeat 使用jQuery 拼接html 再使用 $compile 重新编译从而可以使用ng指令
        $compile($('#maintenanceStatus').html(statusHtml))($scope);
        $compile($('#maintenanceTime').html(timeHtml))($scope);
        // 渲染控件
        $(':checkbox').labelauty({minimum_width: "65px"});
        $scope.initStatus();
    };
    // 初始化维修状态 以及报修时间的 model值
    $scope.initStatus = function () {
        // 初始化将全选设置为 true
        $scope['maintenanceTime'] = [];
        $scope['maintenanceStatus']['_0'] = true;
        $scope['maintenanceTime']['_3'] = true;
    };
    // 对修改报修时间进行点击触发(只能单选)
    $scope.changeMaintenanceTime = function (key) {
        $scope['maintenanceTime'] = [];
        $scope['maintenanceTime'][key] = true;
        $scope.changeDateTimeWithBtnType(key);
        $scope.getSearchData();
    };
    // 通过 时间范围 key 将日期框起始终止时间进行修改
    $scope.changeDateTimeWithBtnType = function (key) {
        var key = key.split('_')[1];
        var dateInfo = $scope.thisYearUseDateInfo;
        var dateStrList = ['thisYear', 'thisMonth', 'thisWeek', 'yesterday', 'today'];
        var dateStr;
        var timeObj = $('#dateTimeRange').data('daterangepicker');
        if (key == 0) {
            $('#dateTimeRange').val('');
            $('#dateTimeRange').parent().addClass('hide');
            return;
        }
        else {
            $('#dateTimeRange').parent().removeClass('hide');
        }
        dateStr = dateStrList[key - 1];
        var obj = dateInfo[dateStr];
        var start = obj.start;
        var end = obj.end;
        timeObj.setStartDate(start);
        timeObj.setEndDate(end);
    };
    // 修改维修状态时触发(多级条件)
    $scope.changeMaintenanceStatus = function (key) {
        // 选择全部时(只留下全部状态)
        if (key == '0') {
            $scope['maintenanceStatus'] = [];
            $scope['maintenanceStatus']['_0'] = true;
        }
        // 选择其他时(全部按钮取消)
        else {
            var count = [];
            for (var key in $scope['maintenanceStatus']) {
                count.push(key)
            }
            var num = 0;
            for (var i = 0; i < count.length; i++) {
                if ($scope['maintenanceStatus'][count[i]] == false) {
                    num++;
                }
            }
            if (count.length == num) {
                $scope['maintenanceStatus']['_0'] = true;
            }
            else {
                $scope['maintenanceStatus']['_0'] = false;
            }
        }
        $scope.getSearchData();
    };
    // 取出查询条件，发送查询请求
    $scope.getSearchData = function (flag) {
        // flag 不为空,表明已经从自定义日期中绑定了时间范围,与选择按钮无关
        if(!flag) {
            var searchStatusId = [];
            var searchTimeId = [];
            $scope.maintenanceStatusIds.forEach(function (value) {
                var _value = $scope['maintenanceStatus']['_' + value];
                if (_value) {
                    searchStatusId.push(value);
                }
            });
            for (var i = 0; i < 6; i++) {
                var _value = $scope['maintenanceTime']['_' + i];
                if (_value) {
                    searchTimeId.push(i);
                    break;
                }
            }
            $scope.searchObj.searchStatusId = searchStatusId.toString();
            var timeId = searchTimeId.toString();
            $scope.dealSearchTimeFromTimeId(timeId);
        }
        // 处理完成后请求数据
        $scope.addLoading();
        $q.all([$scope.initPagination($scope)]).then(function () {
        	$('#' + $scope.initDataTablesName).DataTable().ajax.reload(function () {
                $scope.removeLoading();
            }, true);
        });
    };
    $scope.dealSearchTimeFromTimeId = function (timeId) {
        // 查询全部不需要设置查询时间
        if (timeId == 0) {
            delete $scope.searchObj.addDateTimeStart;
            delete $scope.searchObj.addDateTimeEnd;
            return;
        }
        // 本年
        else if (timeId == 1) {
            $scope.searchObj.addDateTimeStart = $scope.thisYearUseDateInfo.thisYear.start;
            $scope.searchObj.addDateTimeEnd = $scope.thisYearUseDateInfo.thisYear.end;
        }
        // 本月
        else if (timeId == 2) {
            $scope.searchObj.addDateTimeStart = $scope.thisYearUseDateInfo.thisMonth.start;
            $scope.searchObj.addDateTimeEnd = $scope.thisYearUseDateInfo.thisMonth.end;
        }
        // 本周
        else if (timeId == 3) {
            $scope.searchObj.addDateTimeStart = $scope.thisYearUseDateInfo.thisWeek.start;
            $scope.searchObj.addDateTimeEnd = $scope.thisYearUseDateInfo.thisWeek.end;
        }
        // 昨天
        else if (timeId == 4) {
            $scope.searchObj.addDateTimeStart = $scope.thisYearUseDateInfo.yesterday.start;
            $scope.searchObj.addDateTimeEnd = $scope.thisYearUseDateInfo.yesterday.end;
        }
        // 今天
        else if (timeId == 5) {
            $scope.searchObj.addDateTimeStart = $scope.thisYearUseDateInfo.today.start;
            $scope.searchObj.addDateTimeEnd = $scope.thisYearUseDateInfo.today.end;
        }
    };
    // dateTimeRange初始化
    $scope.initDateTimeRange = function () {
        $('#dateTimeRange').daterangepicker(
            {
                applyClass: 'btn-sm btn-success',
                cancelClass: 'btn-sm btn-default',
                locale: {
                    applyLabel: '确认',
                    cancelLabel: '取消',
                    fromLabel: '起始时间',
                    toLabel: '结束时间',
                    customRangeLabel: '自定义',
                    firstDay: 1,
                    format: 'YYYY-MM-DD',
                    separator: '   至   ',
                    daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                    monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                        '七月', '八月', '九月', '十月', '十一月', '十二月' ],
                },
                timePicker: false,
                ranges: {
                    '今日': [moment().startOf('day'), moment()],
                    '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
                    '最近7日': [moment().subtract('days', 6), moment()],
                    '最近30日': [moment().subtract('days', 29), moment()],
                    '本月': [moment().startOf("month"), moment().endOf("month")],
                    '上个月': [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
                },
                startDate: $scope.thisYearUseDateInfo.thisWeek.start,
                endDate: $scope.thisYearUseDateInfo.thisWeek.end,
                opens: 'left',    // 日期选择框的弹出位置
            },  // 监听日期变化
            function (start, end, label) {
                var _start = start.format('YYYY-MM-DD');
                var _end = end.format('YYYY-MM-DD');
                $scope.searchObj.addDateTimeStart = _start;
                $scope.searchObj.addDateTimeEnd = _end;
                $scope.checkBtnFromDateRange(_start, _end);
                $scope.getSearchData(true);
            }
        );
    };
    // 点击日期框按钮同时触发查询功能
    $('.applyBtn.btn.btn-sm.btn-success').bind('click', function () {
        $scope.getSearchData(true);
    });
    // 根据传入的起始于结束时间,如果可以选中对应的按钮就选中,全部不能选中则置灰
    // eq: dateRange 选中了 今天 那么左边的按钮 '今天' 需要被选中 如果我选择了 三天时间,那么所有的按钮置灰
    $scope.checkBtnFromDateRange = function (startTime, endTime) {
        // 先取消所有的按钮选择
        for (var i = 0; i < 6; i++) {
            $scope.$apply(function () {
                $scope['maintenanceTime']['_' + i] = false;
            });
        }
        var dateObj = $scope.thisYearUseDateInfo;
        for (var i in dateObj) {
            var obj = dateObj[i];
            // 对应上 将该按钮选上
            if (obj.start == startTime && obj.end == endTime) {
                var _type = obj.type << 0;
                $scope.$apply(function () {
                    $scope['maintenanceTime']['_' + _type] = true;
                });
            }
        }
    };
};
angular.module("MetronicApp").controller('monthStatisticsController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', monthStatisticsController]);

function monthStatisticsController($scope, $http, $compile, $location, $filter, $state) {
    $scope.demoNames = ['monthStatistics'];
    $scope.echartOptions = [{
        title: {
            text: '月份分时统计'
        },
        xAxis: {
            name: '时间段/月份'
        },
        yAxis: {
            name: '维修量/单'
        },
        legend: {
            data: ['维修量']
        },
        series: [{
            name: '维修量',
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(0, 136, 212, 0.8)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(0, 136, 212, 0.3)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        }]
    }];
    $scope.params = [{
        "timeSpan": 12
    }];
    $scope.noEChartsData = false;
    // 自定义查询按钮
    $scope.timeTitles = ['全部', '本年'];
    $scope.echartsIds = ['monthLine'];
    $scope.echartUrls = ['getMaintenanceStatisticWithTime'];
    $scope.echartTypes = ['Line'];
    $scope.getThisYearUseDateInfo($scope);
    // 自定义日期框的起始时间以及选中的按钮
    $scope.dateTimeRange = {
        myCheckedTime: 1,
        myStartDate: $scope.thisYearUseDateInfo.thisYear.start.substring(0, 7),
        myEndDate: $scope.thisYearUseDateInfo.thisYear.end.substring(0, 7),
        ranges: {},
        format: 'YYYY-MM',
        increment: 60 * 24 * 7 // 跨度为一周
    };
    $scope.initDateRangeAndLabelauty($scope);
    // 根据时间条件刷新图表以及列表内容 图表个数不定类型不定 暂且不进行抽取
    $scope.getSearchData = function () {
        // yyyy-MM
        var _start = $scope.addDateTimeStart || '';
        var startTime = '';
        if (_start && _start !== '') {
            if (_start.length === 7) {
                startTime = _start + '-' + '01';
            }
            else {
                startTime = _start;
            }
        }
        var _end = $scope.addDateTimeEnd || '';
        var endTime = '';
        if (_end && _end !== '') {
            endTime = getNextDayFromYearMonth(_end);
        }
        if ($scope.params[0].startTime && $scope.params[0].endTime) {
            $scope.params[0].startTime = startTime;
            $scope.params[0].endTime = endTime;
        } else {
            $.extend($scope.params[0], {
                startTime: startTime,
                endTime: endTime
            });
        }
        commonECharts.init($scope, $state);
    };

    // 根据传入的年月日期 获取到 endTime
    function getNextDayFromYearMonth(_end) {
        var split = _end.split('-');
        var year = split[0];
        var month = split[1];
        if (month == 12) {
            return ((year << 0) + 1) + '-01-01';
        }
        else {
            return year + '-' + $scope.timeLeftAddZero((month << 0) + 1) + '-01';
        }
    }

    // 对报表时间进行点击触发(只能单选)
    $scope.changeTime = function (key) {
        $scope['time'] = [];
        $scope['time'][key] = true;
        $scope.changeDateTimeWithBtnType($scope, key);
        $scope.getSearchData();
    };
    // 条件都选择上后 自执行
    $scope.getSearchData();
};

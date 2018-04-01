angular.module("MetronicApp").controller('weekStatisticsController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', weekStatisticsController]);
function weekStatisticsController($scope, $http, $compile, $location, $filter, $state) {
    $scope.demoNames = ['weekStatistics'];
    $scope.echartOptions = [{
        title: {
            text: '周期分时统计'
        },
        xAxis: {
            name: '时间段/星期'
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
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        }]
    }];
    $scope.params = [{
        "timeSpan": 7
    }];
    $scope.noEChartsData = false;
    $scope.timeTitles = ['全部', '本年' ,'本月', '本周'];
    $scope.dateTimeRange = {};
    $scope.echartsIds = ['weekLine'];
    $scope.echartUrls = ['getMaintenanceStatisticWithTime'];
    $scope.echartTypes = ['Line'];
    $scope.initDateRangeAndLabelauty($scope);
    // 对报表时间进行点击触发(只能单选)
    $scope.changeTime = function (key) {
        $scope['time'] = [];
        $scope['time'][key] = true;
        $scope.changeDateTimeWithBtnType($scope, key);
        $scope.getSearchData($scope, $state);
    };
    // 条件都选择上后 自执行
    $scope.getSearchData($scope, $state);
};

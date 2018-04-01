angular.module("MetronicApp").controller('evaluationStatisticsController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', evaluationStatisticsController]);
function evaluationStatisticsController($scope, $http, $compile, $location, $filter, $state) {
    // 自定义配置项
    $scope.demoNames = ['evaluationStatistics'];
    $scope.echartOptions = [{
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    show: false
                },
                restore: {
                    show: false
                },
                magicType: {
                    type: false
                }
            }
        },
        title: {
            text: '维修评价分类统计'
        },
        series: [
            {
                name: '报修比例',
                roseType: false, // 南丁格尔图
                hoverOffset: 20 // 鼠标放上去放大偏移(默认10)
            }
        ]
    }];
    $scope.params = [{
        "typeSpan": "evaluationStatistics"
    }];
    $scope.noEChartsData = false;
    $scope.dateTimeRange = {};
    $scope.echartsIds = ['evaluationPie'];
    $scope.echartUrls = ['maintenanceStatisticWithQuality'];
    $scope.echartTypes = ['Pie'];
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

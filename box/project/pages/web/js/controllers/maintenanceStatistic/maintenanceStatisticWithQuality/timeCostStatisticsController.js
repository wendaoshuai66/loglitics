angular.module("MetronicApp").controller('timeCostStatisticsController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', timeCostStatisticsController]);
function timeCostStatisticsController($scope, $http, $compile, $location, $filter, $state) {
    // 自定义配置项
    $scope.demoNames = ['timeCostStatistics'];
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
            text: '维修用时分段统计'
        },
        series: [
            {
                name: '报修比例',
                roseType: false // 南丁格尔图
            }
        ]
    }];
    $scope.params = [{
        "typeSpan": "timeCostStatistics"
    }];
    $scope.noEChartsData = false;
    $scope.dateTimeRange = {};
    $scope.echartsIds = ['timeCostPie'];
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

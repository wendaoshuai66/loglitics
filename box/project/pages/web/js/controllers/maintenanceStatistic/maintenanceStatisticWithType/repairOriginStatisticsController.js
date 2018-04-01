angular.module("MetronicApp").controller('repairOriginStatisticsController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', repairOriginStatisticsController]);
function repairOriginStatisticsController($scope, $http, $compile, $location, $filter, $state) {
    // 自定义配置项
    $scope.demoNames = ['repairOriginStatistics'];
    $scope.echartOptions = [{
        toolbox: { //可视化的工具箱
            show: true,
            feature: {
                dataZoom: { //数据缩放视图
                    show: false
                },
                restore: { // 重置按钮不显示
                    show: false
                },
                magicType: { //动态类型切换
                    type: false
                }
            }
        },
        title: {
            text: '报修来源分类统计'
        },
        series: [
            {
                name: '报修比例',
                radius: ['35%', '50%'],
            }
        ]
    }];
    $scope.params = [{
        "typeSpan": "repairOriginStatistics"
    }];
    $scope.noEChartsData = false;
    $scope.dateTimeRange = {};
    $scope.echartsIds = ['originPie'];
    $scope.echartUrls = ['getMaintenanceStatisticWithType'];
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

angular.module("MetronicApp").controller('maintenanceTypeStatisticsController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', maintenanceTypeStatisticsController]);
function maintenanceTypeStatisticsController($scope, $http, $compile, $location, $filter, $state) {
    // 自定义配置项
    $scope.demoNames = ['maintenanceTypeStatistics', 'maintenanceTypeStatisticsLine'];
    var pieOption = {
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
            text: '维修项目分类统计'
        },
        legend: {
            // 图例较多的情况下可进行滚动
            type: 'scroll',
            orient: 'vertical',
            left: 20,
            top: 20,
            bottom: 20
        },
        series: [
            {
                name: '报修比例',
                roseType: false // 南丁格尔图
            }
        ]
    };
    var lineOption = {
        toolbox: { //可视化的工具箱
            x: '600px',
        },
        title: {
            text: '维修项目与维修量关系统计'
        },
        xAxis: {
            name: '项目类别',
            // axisLabel:{
            //     interval:0,//横轴信息全部显示
            //     rotate:-30,//-30度角倾斜显示
            // }
        },
        yAxis: {
            name: '维修量/单'
        },
        dataZoom: [
            {
                show: true,
                start: 60,
                end: 100
            },
            {
                type: 'inside',
                start: 60,
                end: 100
            }
        ],
        legend: {
            data: ['维修量']
        },
        series: [{
            name: '维修量',
            // markPoint: {
            //     data: [
            //         {type: 'max', name: '最大值'},
            //         {type: 'min', name: '最小值'}
            //     ]
            // },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            },
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
        }]
    };
    $scope.echartOptions = [pieOption, lineOption];
    $scope.params = [{
        "typeSpan": "maintenanceTypeStatistics"
    },{
        "typeSpan": "maintenanceTypeStatistics",
        "lineUse": true
    }];
    $scope.noEChartsData = false;
    $scope.dateTimeRange = {};
    $scope.echartsIds = ['typePie', 'typeLine'];
    $scope.echartUrls = ['getMaintenanceStatisticWithType', 'getMaintenanceStatisticWithType'];
    $scope.echartTypes = ['Pie', 'Line'];
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

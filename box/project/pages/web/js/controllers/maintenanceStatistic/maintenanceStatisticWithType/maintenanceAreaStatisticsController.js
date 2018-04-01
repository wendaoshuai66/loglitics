angular.module("MetronicApp").controller('maintenanceAreaStatisticsController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', maintenanceAreaStatisticsController]);
function maintenanceAreaStatisticsController($scope, $http, $compile, $location, $filter, $state) {
    // 自定义配置项
    $scope.demoNames = ['maintenanceAreaStatistics', 'maintenanceAreaStatisticsLine'];
    var pieOption = {
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
        legend: {
            // 图例较多的情况下可进行滚动
            type: 'scroll',
            // 图例每次滚动到的初始位置(重置图例位置)
            scrollDataIndex: 0,
            orient: 'horizontal',
            left: 'center',
            x : 'center',
            y : '40',
        },
        title: {
            text: '维修区域分类统计'
        },
        series: [
            {
                name: '报修比例',
                center: ['50%', '50%'], // 位置
                roseType: false // 南丁格尔图
            }
        ],
    };
    var lineOption = {
        toolbox: {
            x: '600px',
        },
        title: {
            text: '维修区域与维修量关系统计'
        },
        xAxis: {
            name: '校区/区域',
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
        "typeSpan": "maintenanceAreaStatistics"
    },{
        "typeSpan": "maintenanceAreaStatistics",
        "lineUse": true
    }];
    $scope.noEChartsData = false;
    $scope.dateTimeRange = {};
    $scope.echartsIds = ['areaPie', 'areaLine'];
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

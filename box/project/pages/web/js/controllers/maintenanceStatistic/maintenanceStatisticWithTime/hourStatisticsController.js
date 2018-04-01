angular.module("MetronicApp").controller('hourStatisticsController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', hourStatisticsController]);

function hourStatisticsController($scope, $http, $compile, $location, $filter, $state) {
    // 针对第二个双环形图特殊处理
    var secondOption = (function () {
        var data = [];
        var labelData = [];
        for (var i = 0; i < 24; ++i) {
            labelData.push({
                value: 1,
                name: i + ':00'
            });
        }
        var option = {
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
                text: '时间段与维修量关系',
                left: '50%',
                textAlign: 'center',
                top: '20%'
            },
            tooltip: {
                trigger: 'item',
                formatter: "时间段 : 维修量 <br/>{b} : {c} ({d}%)"
            },
            legend: {
                show: false
            },
            color: ['#22C3AA'],
            series: [{
                type: 'pie',
                data: data,
                roseType: 'area',
                center: ['50%', '50%'],
                itemStyle: {
                    normal: {
                        color: 'white',
                        borderColor: '#22C3AA'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        show: false
                    }
                }
            }, {
                tooltip: {
                    show: false
                },
                type: 'pie',
                data: labelData,
                radius: ['70%', '95%'],
                zlevel: -2,
                itemStyle: {
                    normal: {
                        color: '#22C3AA',
                        borderColor: 'white'
                    }
                },
                label: {
                    normal: {
                        position: 'inside'
                    }
                }
            }]
        };
        return option;
    })();
    // demo版读取的文件名
    $scope.demoNames = ['hourStatistics', 'hourPieStatistics'];
    $scope.echartOptions = [{
        title: {
            text: '24小时分时统计'
        },
        tooltip: {
            formatter: "时间 : {b} 时  <br/>维修量 : {c}"
        },
        xAxis: {
            name: '时间段/小时'
        },
        yAxis: {
            name: '维修量/单'
        },
        legend: {
            data: ['维修量']
        },
        series: [{
            name: '维修量',
            symbol: 'circle',
            symbolSize: 2,
            showSymbol: true,
            itemStyle: {
                normal: {
                    // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，
                    // 相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                    color: {
                        // 线性过度
                        type: 'linear',
                        // 该处设置为从y= 0% ~ 100%的配置
                        x: 0,
                        y: 1,
                        x2: 0,
                        y2: 0,
                        colorStops: [{
                            offset: 0, color: '#9933FF' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#99CCFF' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#9933FF'
                    }, {
                        offset: 0.8,
                        color: '#99CCFF'
                    }], false),
                }
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        }]
    }, secondOption];
    $scope.params = [{
        "timeSpan": 24
    }, {
        "timeSpan": 240
    }];
    $scope.noEChartsData = false;
    $scope.dateTimeRange = {};
    $scope.echartsIds = ['hourLine', 'hourPie'];
    $scope.echartUrls = ['getMaintenanceStatisticWithTime', 'getMaintenanceStatisticWithTime'];
    $scope.echartTypes = ['Line', 'Pie']; // 目前只有Line(折线图与柱状图)、Pie(环形图与饼图)
    // data 数据多组存放，按照声明顺序
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

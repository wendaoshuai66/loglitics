var commonECharts = (function (scope) {
    // 全局通用配置
    var commonOption = {
        toolbox: { //可视化的工具箱
            show: true,
            // 工具箱距离左侧位置，(默认位置会造成最后一个工具的toolTip上的文字显示不全)
            x: '750px',
            feature: {
                dataView: { //数据视图
                    show: false
                },
                restore: { //重置
                    show: true
                },
                dataZoom: { //数据缩放视图
                    show: true
                },
                saveAsImage: {//保存图片
                    show: true
                },
                magicType: {//动态类型切换
                    type: ['bar', 'line']
                }
            }
        },
        title: {
            text: '',
            left: 'center',
        },
        // 图例偏移(默认中间显示与标题重合)
        legend: {
            left: '20%'
        }
    };
    return {
        // 折线图&柱状图的全局配置
        commonLineOption: {
            toolbox: commonOption.toolbox,
            title: commonOption.title,
            legend: commonOption.legend,
            color: ['#3398DB', '#996666', '#99CC66', '#CC3333', '#CC99FF', '#FF9933'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                data: [],
                name: 'x轴'
            },
            yAxis: {
                name: 'y轴'
            },
            series: [{
                type: 'line',
                smooth: true, // 设置为平滑
                data: [],
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                smoothMonotone: 'x', // 折线平滑后在x维度上保持单调性
                // 柱状图或者折线图等上方显示数据
                label: {
                    normal: {
                        color: '#999999', // 文字颜色
                        fontWeight: 'bold', // 加粗
                        show: true,
                        position: [10, -25], // 位置偏移(不进行偏移 x轴为0的数据文字会与y轴重合)
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(0,136,212)',
                        borderColor: 'rgba(0,136,212,0.5)',
                        borderWidth: 12

                    }
                },
            }]
        },
        // 饼状图&环状图的全局配置
        commonPieOption: {
            toolbox: commonOption.toolbox,
            title: commonOption.title,
            color: ['#2ec7c9', '#b6a2de', '#ffb980', '#5ab1ef', '#d87a80', '#8d98b3', '#e5cf0d'],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: '20%',
                data: []
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '50%', // 默认饼图
                    center: ['50%', '40%'], // 位置
                    data: [],
                    itemStyle: {
                        // 默认阴影以及偏移
                        normal: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowOffsetY: 5,
                        },
                        // 高亮的阴影效果
                        emphasis: {
                            shadowBlur: 40,
                            shadowOffsetX: 0,
                            shadowOffsetY: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        },
        // 异步加载折线图&柱状图数据
        postLineApi: function (myChart, scope, i, state) {
            myChart.showLoading();
            var url = (!scope.ifOpenApi) ? "demo/" + scope.demoNames[i] + ".json" : scope.httpDomain + scope.echartUrls[i];
            $.ajax({
                type: "POST",
                url: url,
                data: scope.params[i], // 传入组装的参数
                dataType: "json",
                headers: {
                    'logistics-session-token': scope.getToken()
                }
            }).done(function (data) {
                // 将异步请求的数据放入$scope.data中
                scope.$apply(function () {
                    scope.data[i] = data;
                });
                var _target = $('#' + scope.echartsIds[i]);
                // 模拟异步加载耗时
                // 关闭遮罩层
                myChart.hideLoading();
                if (data['data'].length === 0) {
                    scope.$apply(function () {
                        scope.noEChartsData = true;
                    });
                    _target.addClass('hide');
                    return;
                }
                scope.$apply(function () {
                    scope.noEChartsData = false;
                });
                _target.removeClass('hide');
                // 填入数据
                myChart.setOption({
                    xAxis: {
                        data: data.categories
                    },
                    series: [{
                        data: data.data
                    }]
                });
                window.onresize = function () {
                    myChart.resize();
                };
                // Chrome 62 版本最小化时,图例会隐藏不见,该路由进行刷新
                if (document.addEventListener) {
                    document.addEventListener('webkitvisibilitychange', function () {
                        if (BrowserVersion.type == 'Chrome' && BrowserVersion.version.split('.')[0] << 0 >= 62) {
                            state.reload();
                        }
                    });
                }
            });
        },
        // 异步加载饼状图&环状图数据
        postPieApi: function (myChart, scope, i, state) {
            myChart.showLoading();
            var url = (!scope.ifOpenApi) ? "demo/" + scope.demoNames[i] + ".json" : scope.httpDomain + scope.echartUrls[i];
            $.ajax({
                type: "POST",
                url: url,
                data: scope.params[i], // 传入组装的参数
                dataType: "json",
                headers: {
                    'logistics-session-token': scope.getToken()
                }
            }).done(function (data) {
                try {
                    // 同上
                    scope.$apply(function () {
                        scope.data[i] = data
                    });
                    var _target = $('#' + scope.echartsIds[i]);
                    if (data['data'].length === 0) {
                        _target.addClass('hide');
                        scope.$apply(function () {
                            scope.noEChartsData = true;
                        });
                        myChart.hideLoading();
                        return;
                    }
                    scope.$apply(function () {
                        scope.noEChartsData = false;
                    });
                    _target.removeClass('hide');
                    var _legend = [];
                    // 图例文本放入
                    data['data'].forEach(function (value) {
                        _legend.push(value.name)
                    });
                    // 关闭遮罩层
                    myChart.hideLoading();
                    // 填入数据
                    myChart.setOption({
                        series: [{
                            data: data.data
                        }],
                        legend: {
                            data: _legend
                        }
                    });
                    window.onresize = function () {
                        myChart.resize();
                    };
                    if (document.addEventListener) {
                        document.addEventListener('webkitvisibilitychange', function () {
                            if (BrowserVersion.type == 'Chrome' && BrowserVersion.version.split('.')[0] << 0 >= 62) {
                                state.reload();
                            }

                        });
                    }
                } catch (e) {
                    myChart.hideLoading();
                }
            });
        },
        // init
        init: function (scope, state) {
            for (var i = 0; i < scope.echartsIds.length; i++) {
                var myChart = echarts.init(document.getElementById(scope.echartsIds[i]));
                var option = undefined;
                var echartType = scope.echartTypes[i];
                // 为了拼接方便,目前图表格式规定为 Line 与 Pie
                if (echartType === 'Line' || echartType === 'Pie') {
                    var _option = eval("commonECharts.common" + echartType + "Option");
                    // 需要将commonOption对象copy,因为$.extend深合并时，会修改掉原始的commonOption
                    // 进而下一个图表会自动带上上一个配置
                    option = $.extend(true, angular.copy(_option), scope.echartOptions[i]);
                    myChart.setOption(option);
                    // 异步加载
                    eval("commonECharts.post" + echartType + "Api(myChart, scope, i, state)");
                }
            }
        }
    };
})();
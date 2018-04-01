function PercentPie(option) {
    this.backgroundColor = option.backgroundColor;
    this.color = option.color || ['#38a8da', '#ccc'];
    this.fontSize = option.fontSize || 12;
    this.domEle = option.domEle;
    this.value = option.value;
    this.name = option.name;
    this.title = option.title;
}
PercentPie.prototype.init = function (state) {
    var _that = this;
    var option = {
        backgroundColor: _that.backgroundColor,
        color: _that.color,
        title: {
            text: _that.title,
            top: '3%',
            left: '1%',
            textStyle: {
                color: '#333',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 16,
            }
        },
        series: [{
            name: '来源',
            type: 'pie',
            radius: ['60%', '75%'],
            avoidLabelOverlap: false,
            hoverAnimation: true,
            label: {
                normal: {
                    show: false,
                    position: 'center',
                    textStyle: {
                        fontSize: _that.fontSize,
                        fontWeight: 'bold'
                    },
                    formatter: '{b}\n{c}%'
                }
            },
            data: [{
                value: _that.value,
                name: _that.name,
                label: {
                    normal: {
                        show: true
                    }
                }
            },
                {
                    value: 100 - _that.value,
                    name: ''
                }
            ]
        }]
    };
    var myChart = echarts.init(_that.domEle);
    myChart.setOption(option);
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
};
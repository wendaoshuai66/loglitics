// 日历控件初始化
var calendar = function () {
    var initCalendar = function () {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        // 初始化FullCalendar
        $('#calendar')
            .fullCalendar(
                {
                    // 国际化默认值为'en'，代表使用英文
                    lang: 'zh-cn',
                    // 设置头部信息，如果不想显示，可以设置header为false
                    header: {
                        // 日历头部左边：初始化切换按钮
                        left: 'prev,next today',
                        // 日历头部中间：显示当前日期信息
                        center: 'title',
                        // 日历头部右边：初始化视图
                        right: 'month,agendaWeek,agendaDay'
                    },
                    // 设置是否显示周六和周日，设为false则不显示
                    weekends: true,
                    // 日历初始化时显示的日期，月视图显示该月，周视图显示该周，日视图显示该天，和当前日期没有关系
                    // defaultDate: y+'-'+m+'-'+d,
                    // 日程数据

                    // start:起始日期,end:终止日期,timezone:时区(默认false),callback:回调函数
                    events: function (start, end, timezone, callback) {
                        var date = this.getDate().format('YYYY-MM');
                        $.ajax({
                            url: 'demo/duty.json',
                            dataType: 'json',
                            data: {
                                date: date,
                            },
                            success: function (json) {
                                // 数据格式:
                                // title:标题
                                // start:起始时间 时间格式:2017-07-12 12:00:00(非全天) 或者2017-07-12(全天)
                                // end:截止时间
                                // backgroundColor:背景色
                                // color:颜色，效果与背景色一致
                                var events = [];
                                $.each(json.data, function (i, c) {
                                    events.push({
                                        title: c.title,
                                        start: c.start,
                                        end: c.end,
                                        color: c.color,
                                        id: c.id
                                    });

                                });
                                callback(events);
                            }
                        });
                    },
                    // 日历点击事件
                    dayClick: function (date, jsEvent, view) {
                        var events = $('#calendar')
                            .fullCalendar(
                                'clientEvents',
                                function (event) {
                                    var eventStart = event.start.format('YYYY-MM-DD');
                                    var eventEnd = event.end ? event.end.format('YYYY-MM-DD') : null;
                                    var theDate = date.format('YYYY-MM-DD');
                                    // Make sure the event starts on or before date
                                    // and ends afterward
                                    // Events that have no end date specified (null)
                                    // end that day, so check if start = date
                                    return (eventStart <= theDate && (eventEnd >= theDate) && !(eventStart < theDate && (eventEnd == theDate)))
                                        || (eventStart == theDate && (eventEnd === null));
                                });
                    },
                    // // 日程点击事件
                    // eventClick: function (calEvent, jsEvent, view) {
                    //     // 起始时间
                    //     var startTime = calEvent.start.format('YYYY-MM-DD HH:mm:ss');
                    //     // 结束时间
                    //     var endTime = calEvent.end.format('YYYY-MM-DD HH:mm:ss');
                    //     // 标题
                    //     var title = calEvent.title;
                    //     // 隐藏Id
                    //     var id = calEvent.id;
                    //     console.log({
                    //         "startTime": startTime,
                    //         "endTime": endTime,
                    //         "title": title,
                    //         "id": id
                    //     });
                    // }
                });
    };
    var initRegisterCalendar = function (scope) {
        $('#calendar')
            .fullCalendar(
                {
                    lang: 'zh-cn',
                    header: {
                        left: 'prev,next',
                        center: 'title',
                        right: 'today'
                    },
                    weekends: true,
                    selectable: true,
                    unselectAuto: false,
                    events: function (start, end, timezone, callback) {
                        var _year = new Date(this.getDate()).Format('yyyy');
                        var _month = new Date(this.getDate()).Format('MM');
                        // 浏览器缓存中的日期集合,使用逗号分割
                        var checkedDateList = localStorage.getItem("com.logistics.duty.checkedDateList");
                        // 缓存的选中年份与月份 '2017-10' 格式
                        var checkedYearMonth = localStorage.getItem("com.logistics.duty.checkedYearMonth");
                        if (checkedYearMonth && checkedYearMonth !== 'null') {
                            var callbackToFirstFlag = localStorage.getItem('com.logistics.duty.callbackToFirst');
                            // 记录上一次设置值班的年月日期 且为从后面步骤跳回第一步
                            // 日历跳转到缓存年月
                            if(callbackToFirstFlag == 'true') {
                                this.gotoDate(new Date(checkedYearMonth + "-01"));
                                localStorage.setItem('com.logistics.duty.callbackToFirst', false);
                            }
                            // 前一月 后一月操作
                            else {
                                localStorage.removeItem('com.logistics.duty.checkedDateList');
                                localStorage.removeItem('com.logistics.duty.checkedYearMonth');
                                // 跳转的日期与缓存的一致
                                if (_year + '-' + _month !== checkedYearMonth) {
                                    checkedDateList = null;
                                }
                                else {
                                    _year = checkedYearMonth.substring(0, 4);
                                    _month = checkedYearMonth.substring(5, 7);
                                }
                            }
                        }
                        scope.addLoading();
                        $.ajax({
                            url: scope.httpDomain + scope.url,
                            dataType: 'json',
                            type: "POST",
                            // 根据当前年月取出 普通周末以及放假节假日,并将其背景色修改
                            data: {
                                year: _year,
                                month: _month
                            },
                            headers: {
                                'logistics-session-token': scope.getToken()
                            },
                            success: function (json) {
                                var allDayTd = $('td.fc-day');
                                allDayTd.addClass('calendarTableDone');
                                scope.holidayDate = json.data;
                                // 将该年月的普通周末节假日信息存入缓存
                                localStorage.setItem('com.logistics.duty.AllHolidayFromDate', JSON.stringify(scope.holidayDate));
                                var events = [];
                                $.each(json.data, function (i, c) {
                                    events.push({
                                        title: c.title,
                                        start: c.start,
                                        end: c.end,
                                        backgroundColor: (c.type == '2') ? '#E7505A' : '#36D7B7'
                                    });
                                    // 浏览器缓存中没有记录选中的日期
                                    // 第一次选择
                                    if (checkedDateList === null || checkedDateList === 'null') {
                                        // c.start 即为拿到的节假日时间,定位到该 Td 背景色修改为红色
                                        initFalseDateAndIcon(c.start, false);
                                    }
                                });
                                // 并非第一次选择
                                if (checkedDateList && checkedDateList !== 'null') {
                                    var allDays = getDaysInMonth(_year, _month);
                                    var dates = checkedDateList.split(',');
                                    dates.forEach(function (date) {
                                        allDays.splice($.inArray(date, allDays), 1);
                                    });
                                    allDays.forEach(function (date) {
                                        initFalseDateAndIcon(date, false);
                                    });
                                }
                                // 针对今天添加 '今天图标'
                                $('td.fc-today.fc-state-highlight.calendarTableDone').append(todayImgStr);
                                $('td.fc-day-number.fc-today.fc-state-highlight').removeClass().addClass('calendarTodayBar');
                                callback(events);
                                changeDisableTbClass();
                                getCheckedDate(scope);
                                // 添加所有的选中值班的 对号 图标
                                var dutyDayTd = $('td.fc-day.calendarTableDone:not(.calendarTableDisabled,.calendarTableFalse)');
                                dutyDayTd.append(trueImgStr);
                                // 针对今天样式单独处理
                                if (checkedDateList && checkedDateList !== 'null') {
                                    $('td.fc-day.fc-today').removeClass('fc-today');
                                }
                                scope.removeLoading();
                            },
                            error: function () {
                                scope.removeLoading();
                                sweetAlert("警告", "获取失败,请重试!", "error");
                            }
                        });
                    },
                    // 日历点击事件
                    dayClick: function (date, jsEvent, view) {
                        // 当前状态为未记录日历情况
                        if ($(this).hasClass('calendarTableFalse')) {
                            $(this).removeClass('calendarTableFalse');
                            $(this).children('img.calendarTipImg').remove();
                            $(this).append(trueImgStr);
                            getCheckedDate(scope);
                        }
                        else if (!$(this).hasClass('calendarTableDisabled')) {
                            // 不是今天框情况，简单处理
                            if (!$(this).hasClass('fc-today')) {
                                $(this).addClass('calendarTableFalse');
                            }
                            // 今天框 删除掉今天 class,添加上false的class
                            else {
                                $(this).removeClass('fc-today').addClass('calendarTableFalse');
                            }
                            $(this).append(falseImgStr);
                            getCheckedDate(scope);
                        }
                        var events = $('#calendar')
                            .fullCalendar(
                                'clientEvents',
                                function (event) {
                                    var eventStart = event.start.format('YYYY-MM-DD');
                                    var eventEnd = event.end ? event.end.format('YYYY-MM-DD') : null;
                                    var theDate = date.format('YYYY-MM-DD');
                                    // Make sure the event starts on or before date
                                    // and ends afterward
                                    // Events that have no end date specified (null)
                                    // end that day, so check if start = date
                                    return (eventStart <= theDate && (eventEnd >= theDate) && !(eventStart < theDate && (eventEnd == theDate)))
                                        || (eventStart == theDate && (eventEnd === null));
                                });
                    },
                });
    };
    var initAutoDuty = function () {
        // 初始化FullCalendar
        $('#calendar')
            .fullCalendar(
                {
                    // 国际化默认值为'en'，代表使用英文
                    lang: 'zh-cn',
                    // 设置头部信息，如果不想显示，可以设置header为false
                    header: {
                        // 日历头部左边：初始化切换按钮
                        left: '',
                        // 日历头部中间：显示当前日期信息
                        center: 'title',
                        // 日历头部右边：初始化视图
                        right: ''
                    },
                    weekends: true,
                    // event排序规则，默认使用title
                    eventOrder: ['-backgroundColor', '-color'],
                    events: function (start, end, timezone, callback) {
                        var checkedYearMonth = localStorage.getItem("com.logistics.duty.checkedYearMonth");
                        if (checkedYearMonth && checkedYearMonth !== 'null') {
                            // 日期跳转到之前配置的年月
                            this.gotoDate(new Date(checkedYearMonth + "-01").Format('yyyy-MM'));
                        }
                        var _year = checkedYearMonth.substring(0, 4);
                        var _month = checkedYearMonth.substring(5, 7);

                        var checkedDateList = localStorage.getItem("com.logistics.duty.checkedDateList");
                        var allDayTd = $('td.fc-day');
                        allDayTd.addClass('calendarTableDone');
                        // 缓存中取出要设置排班的日期
                        if (checkedDateList && checkedDateList !== 'null') {
                            var allDays = getDaysInMonth(_year, _month);
                            var dates = checkedDateList.split(',');
                            dates.forEach(function (date) {
                                allDays.splice($.inArray(date, allDays), 1);
                            });
                            allDays.forEach(function (date) {
                                initFalseDateAndIcon(date, true);
                            });
                        }
                        // 针对今天添加 '今天图标'
                        // $('td.fc-today.fc-state-highlight.calendarTableDone').append(todayImgStr);
                        $('td.fc-day-number.fc-today.fc-state-highlight').removeClass().addClass('calendarTodayBar');
                        if (checkedDateList && checkedDateList !== 'null') {
                            $('td.fc-day.fc-today').removeClass('fc-today');
                        }
                        changeDisableTbClass();
                    }
                });

    };
    var initManualDuty = function (scope) {
        // 初始化FullCalendar
        $('#calendar')
            .fullCalendar(
                {
                    // 国际化默认值为'en'，代表使用英文
                    lang: 'zh-cn',
                    // 设置头部信息，如果不想显示，可以设置header为false
                    header: {
                        // 日历头部左边：初始化切换按钮
                        left: '',
                        // 日历头部中间：显示当前日期信息
                        center: 'title',
                        // 日历头部右边：初始化视图
                        right: ''
                    },
                    weekends: true,
                    // event排序规则，默认使用title
                    eventOrder: ['-backgroundColor', '-color'],
                    editable: true, // 允许拖动
                    eventStartEditable: true, // 允许修改起始时间
                    eventDurationEditable: false, // 不允许修改长度
                    dragOpacity: {// 设置拖动时事件的透明度
                        agenda: .5,
                        '': .6
                    },
                    //拖动事件
                    // event 拖动对象以及对应属性
                    // dayDelta 日期偏移量 _days eq:-1向前移动一天,2向后移动两天
                    // revertFunc 恢复原状
                    eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                        localStorage.getItem('com.logistics.duty.checkedDateList');
                        // 不允许拖拽到的目标
                        var newStartDate = eventDropAllow(scope, event, delta);
                        if (!newStartDate) {
                            revertFunc();
                        }
                        else {
                            // 自动调整模式
                            if(scope.select.isSelected) {
                                moveOriginalEventToStartDate(scope);
                            }
                        }
                    },
                    events: function (start, end, timezone, callback) {
                        var checkedYearMonth = localStorage.getItem("com.logistics.duty.checkedYearMonth");
                        if (checkedYearMonth && checkedYearMonth !== 'null') {
                            // 日期跳转到之前配置的年月
                            this.gotoDate(new Date(checkedYearMonth + "-01").Format('yyyy-MM'));
                        }
                        var _year = checkedYearMonth.substring(0, 4);
                        var _month = checkedYearMonth.substring(5, 7);
                        var checkedDateList = localStorage.getItem("com.logistics.duty.checkedDateList");
                        var allDayTd = $('td.fc-day');
                        allDayTd.addClass('calendarTableDone');
                        // 缓存中取出要设置排班的日期
                        if (checkedDateList && checkedDateList !== 'null') {
                            var allDays = getDaysInMonth(_year, _month);
                            var dates = checkedDateList.split(',');
                            dates.forEach(function (date) {
                                allDays.splice($.inArray(date, allDays), 1);
                            });
                            allDays.forEach(function (date) {
                                initFalseDateAndIcon(date, true);
                            });
                        }
                        $('td.fc-day-number.fc-today.fc-state-highlight').removeClass().addClass('calendarTodayBar');
                        if (checkedDateList && checkedDateList !== 'null') {
                            $('td.fc-day.fc-today').removeClass('fc-today');
                        }
                        changeDisableTbClass();
                        var events = scope.events;
                        callback(events);
                    }
                });

    };
    var initLastDuty = function (scope) {
        $('#calendar')
            .fullCalendar(
                {
                    // 国际化默认值为'en'，代表使用英文
                    lang: 'zh-cn',
                    // 设置头部信息，如果不想显示，可以设置header为false
                    header: {
                        // 日历头部左边：初始化切换按钮
                        left: '',
                        // 日历头部中间：显示当前日期信息
                        center: 'title',
                        // 日历头部右边：初始化视图
                        right: ''
                    },
                    weekends: true,
                    // event排序规则，默认使用title
                    eventOrder: ['-backgroundColor', '-color'],
                    events: function (start, end, timezone, callback) {
                        var checkedYearMonth = localStorage.getItem("com.logistics.duty.checkedYearMonth");
                        if (checkedYearMonth && checkedYearMonth !== 'null') {
                            // 日期跳转到之前配置的年月
                            this.gotoDate(new Date(checkedYearMonth + "-01").Format('yyyy-MM'));
                        }
                        var _year = checkedYearMonth.substring(0, 4);
                        var _month = checkedYearMonth.substring(5, 7);
                        var checkedDateList = localStorage.getItem("com.logistics.duty.checkedDateList");
                        var allDayTd = $('td.fc-day');
                        allDayTd.addClass('calendarTableDone');
                        // 缓存中取出要设置排班的日期
                        if (checkedDateList && checkedDateList !== 'null') {
                            var allDays = getDaysInMonth(_year, _month);
                            var dates = checkedDateList.split(',');
                            dates.forEach(function (date) {
                                allDays.splice($.inArray(date, allDays), 1);
                            });
                            allDays.forEach(function (date) {
                                initFalseDateAndIcon(date, true);
                            });
                        }
                        $('td.fc-day-number.fc-today.fc-state-highlight').removeClass().addClass('calendarTodayBar');
                        if (checkedDateList && checkedDateList !== 'null') {
                            $('td.fc-day.fc-today').removeClass('fc-today');
                        }
                        changeDisableTbClass();
                        var events = scope.events;
                        callback(events);
                    }
                });

    };
    // 将前一个月以及后一个月其他月份的 Tb 修改为禁用色
    // 将该月除过节假日的 Tb 修改为绿色
    // 将节假日，休息日的 Tb 修改为红色
    var changeDisableTbClass = function () {
        // 不属于该月份
        var otherMonthTd = $('td.fc-other-month');
        otherMonthTd.addClass('calendarTableDisabled').children('img').remove();
    };
    // 统计目前选中的参与排班的该月日期
    var getCheckedDate = function (scope) {
        var allCheckedDayTd = $('td.fc-day.calendarTableDone:not(.calendarTableDisabled,.calendarTableFalse)');
        var checkedDate = [];
        allCheckedDayTd.each(function () {
            checkedDate.push($(this).attr('data-date'));
        });
        scope.$apply(function () {
            scope.checkedDayList = checkedDate;
        });
    };
    var initFalseDateAndIcon = function (date, flag) {
        var _td = $('td[data-date="' + date + '"].calendarTableDone');
        _td.addClass('calendarTableFalse');
        // 移除最开始全部添加的 '对号' 图标
        _td.remove('img');
        if (!flag) {
            // 添加 '叉号' 图标
            _td.append(falseImgStr);
        }
    };
    // 根据年月获取当前所有的日期列表
    var getDaysInMonth = function (year, month) {
        var temp = new Date(year, month, 0);
        var allDay = temp.getDate();
        var returnDateList = [];
        for (var i = 1; i <= allDay; i++) {
            returnDateList.push(new Date(year, month - 1, i).Format('yyyy-MM-dd'));
        }
        return returnDateList;
    };
    // 传入 event 对象,得到目标是否可以进行拖拽
    // 不适用于 event.start._i 获取到起始日期进行判断,由于event生成后不能进行修改
    // 调用 updateEvent rerenderEvents 刷新无效 暂时未找出原因
    var eventDropAllow = function (scope, event, delta) {
        var thisId = event.id;
        var dayFlag = thisId.split('#')[2]; // Day or Night
        var startDate = getStartDateFromId(scope, event.id);
        var endDate = scope.getNextDayStr(startDate, delta._days);
        var checkedDateList = scope.checkedDateList;
        if ($.inArray(endDate, checkedDateList) < 0) {
            return false;
        }
        // 允许拖拽到目的日期框,并且刷新scope上绑定的内容
        else {
            var firstId;
            angular.forEach(scope.events, function (_event) {
                if (event.id == _event.id) {
                    firstId = event.id;
                    scope.$apply(function () {
                        _event.start = endDate;
                        _event.end = scope.getNextDayStr(endDate);
                    });
                }
            });
            angular.forEach(scope.events, function (_event) {
                if (_event.start == endDate && _event.id!=firstId && _event.id.indexOf(dayFlag)!==-1) {
                    scope.$apply(function () {
                        scope.reloadCalendarId = _event.id;
                        scope.reloadCalendarEnd = startDate;
                    });
                }
            });
            return true;
        }
    };
    // 可选功能,开关开启启用该功能(保持白夜班都有人),不开启，日历表可随意拖动
    // 移动该event后，需要将新日期框中的同时段 *(白班或夜班) 移动至旧时间框
    // eq: 18#2017-11-02#Day <---> 14#2017-11-03#Day 时间互换，不影响其他的event
    var moveOriginalEventToStartDate = function (scope) {
        angular.forEach(scope.events, function (_event) {
            if (_event.id == scope.reloadCalendarId) {
                scope.$apply(function () {
                    _event.start = scope.reloadCalendarEnd;
                    _event.end = scope.getNextDayStr(scope.reloadCalendarEnd);
                });
            }
        });
        var _calendar = $('#calendar');
        // 原始日历对象remove,在原始日历对象上刷新 events 无效
        _calendar.fullCalendar('destroy');
        calendar.manualGenerateDuty(scope);
    };
    // 通过 event id从scope中得到对应的 时间
    var getStartDateFromId = function (scope, id) {
        var result;
        angular.forEach(scope.events, function (_event) {
            if (_event.id == id) {
                result = _event.start;
            }
        });
        return result;
    };
    var commonImgStr = "<img class='calendarTipImg' src='./../assets/global/img/";
    var trueImgStr = commonImgStr + "true.png'/>";
    var falseImgStr = commonImgStr + "false.png'/>";
    var todayImgStr = "<img class='calendarTodayImg' src='./../assets/global/img/today.png'/>";

    return {
        // 日历通用设置
        init: function () {
            initCalendar();
        },
        // 针对注册第一步进行选择需要设置值班的配置,传入scope对象 (将普通周末放假节假日背景区分)
        // 点击日历块区,对选中&不选中进行切换
        registerInitMonth: function (scope) {
            initRegisterCalendar(scope);
        },
        // 自动生成排班表配置
        autoGenerateDuty: function (scope) {
            initAutoDuty(scope);
        },
        // 手动配置微调值班表
        manualGenerateDuty: function (scope) {
            initManualDuty(scope);
        },
        // 最后打印前进行预览
        showLastDuty: function (scope) {
            initLastDuty(scope);
        }
    };
}();

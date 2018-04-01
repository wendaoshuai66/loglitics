angular.module("MetronicApp").controller('dutyController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', dutyController]);

function dutyController($scope, $http, $compile, $location, $filter, $state) {
    $scope.data = {};
    // 默认只查询后勤部门,显示状态
    $scope.searchObj = {
        'ifLogistics': 1,
        'getDutyInfo': true,
        'status': 1
    };
    // controller名称初始化
    $scope.controllerName = 'duty';
    $scope.data.maintenanceItems = [];
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "name"
    }, {
        "data": "campus.name"
    }, {
        "data": "parent.name"
    }, {
        "data": "description"
    }, {
        "data": "typeList"
    }, {
        "data": "dateStr"
    }, {
        "data": "addDateTime"
    }];
    $scope.orderableAry = [0, 3];
    $scope.htmlType = [4];
    $scope.wrapAry = [2];
    $scope.wrapLongAry = [1, 3];
    $scope.targetsOpt = 8;
    $scope.order = [[7, "desc"]];
    $scope.optHtmlAry = ["duty", "dutyShow"];//, "dutyList"
    var url = "getDepartmentList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'dutyDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 路由跳转到详细部门的值班设置
    $scope.dutySite = function (id, name, campusName) {
        // 记录部门Id
        localStorage.setItem('com.logistics.duty.departmentSelectedName', name);
        localStorage.setItem('com.logistics.duty.departmentSelectedId', id);
        localStorage.setItem('com.logistics.duty.departmentSelectedCampusName', campusName);
        $state.go('dutyRegister', {'id': id});
    };
    // 路由跳转到本部门的值班表列表
    $scope.dutyShowView = function (id, name) {
        localStorage.setItem('com.logistics.duty.dutyShowDepartmentId', id);
        localStorage.setItem('com.logistics.duty.dutyShowDepartmentName', name);
        $state.go('dutyShow', {'id': id});
    };
    // 部门,工种值班表是否配置详情
    $scope.dutyList = function (id, name) {
        localStorage.setItem('com.logistics.duty.departmentSelectedId', id);
        localStorage.setItem('com.logistics.duty.dutyShowDepartmentName', name);
        $state.go('dutyList', {'id': id});
    };
};
// 值班管理注册流程
angular.module("MetronicApp").controller('dutyRegisterController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', '$q', dutyRegisterController]);

function dutyRegisterController($scope, $http, $compile, $location, $filter, $state, $q) {
    // 部门名称
    var dutyDepartmentName = localStorage.getItem('com.logistics.duty.departmentSelectedName');
    // 校区名称
    var campusName = localStorage.getItem('com.logistics.duty.departmentSelectedCampusName');
    $scope.dutyDepartmentName = dutyDepartmentName;
    $scope.campusName = campusName;
	// 缓存当前进行到的步骤
    var registerStep = localStorage.getItem('com.logistics.duty.registerStep');
    var registerDone = localStorage.getItem('com.logistics.duty.registerDone');
    if (registerStep != null && registerStep != 'null') {
        registerStep = registerStep << 0;
    }
    if (registerDone != null && registerDone != 'null') {
        registerDone = registerDone << 0;
    }
    $scope.registerStep = (registerStep) ? registerStep : 1;
    $scope.registerDone = (registerDone) ? registerDone : 1;
    $scope.nextCheckDown = false;
    // 前一步
    $scope.previous = function () {
        if ($scope.registerStep > 1) {
            $scope.registerStep = $scope.registerStep - 1;
        }
        $('#previousStep').blur();
    };
    // 后一步
    $scope.nextStep = function () {
        if ($scope.registerStep < 6) {
            $scope.registerStep = $scope.registerStep + 1;
            if ($scope.registerDone < $scope.registerStep) {
                $scope.registerDone = $scope.registerDone + 1;
            }
        }
        $('#nextStep').blur();
    };
    // 生成值班表，存库完毕，跳转到列表页
    $scope.closeRegister = function () {
        // 跳转之前把所有以 com.logistics.duty 开头的缓存全部清空
        for (var key in localStorage) {
            if (key.startsWith('com.logistics.duty')) {
                localStorage.removeItem(key);
            }
        }
        $state.go('duty');
    };
    // 监听注册流程变化
    $scope.$watch('registerStep', function (newValue, oldValue) {
        // 将注册进行到 第几步 以及 执行完毕的第几步 进行缓存
        localStorage.setItem('com.logistics.duty.registerStep', newValue);
        localStorage.setItem('com.logistics.duty.registerDone', $scope.registerDone);
        // 从第一步跳出,需要记录已经选择的日期以及配置所属的年月 eq:'2017-10'
        // 从第一步跳出才进行记录
        if (newValue !== oldValue && oldValue === 1) {
            var oneStepScope = $scope.getScope('dutyRegisterOneStep');
            var _checkedDayList = oneStepScope.checkedDayList;
            if (_checkedDayList != null && _checkedDayList.length > 0) {
                var dayListStr = _checkedDayList.join(',');
                localStorage.setItem('com.logistics.duty.checkedDateList', dayListStr);
                localStorage.setItem('com.logistics.duty.checkedYearMonth', _checkedDayList[0].substring(0, 7));
            }
        }
        // 记录第二步中配置的 人员信息
        if (newValue !== oldValue && oldValue === 2) {
            var twoStepScope = $scope.getScope('dutyRegisterTwoStep');
            var typeSelectId = twoStepScope.typeSelectData;
            var allType = twoStepScope.maintenanceTypeSelectData;
            angular.forEach(allType, function (type) {
                if (type.id == typeSelectId) {
                    // 记录当前工种的名称
                    localStorage.setItem('com.logistics.duty.typeSelectedName', type.name);
                }
            });
            localStorage.setItem('com.logistics.duty.typeSelectedId', typeSelectId);
            var _items = twoStepScope["maintenanceItems"][typeSelectId];
            localStorage.setItem('com.logistics.duty.checkedTypeWorker' + typeSelectId, (_items != null ? _items : 'null').toString());
        }
        // 记录第四步中配置的 最终的值班表信息
        if (newValue !== oldValue && oldValue === 4) {
            var fourStepScope = $scope.getScope('dutyRegisterFourStep');
            var events = fourStepScope.events;
            localStorage.setItem('com.logistics.duty.lastEvents', JSON.stringify(events));
        }
        // 从第五步跳到第六步 , 生成值班表
        if (newValue === 6 && oldValue === 5) {
            $scope.addLoading();
            var fiveStepScope = $scope.getScope('dutyRegisterFiveStep');
            // 工种Id
            var typeId = localStorage.getItem('com.logistics.duty.typeSelectedId');
            // 部门Id
            var departmentId = localStorage.getItem('com.logistics.duty.departmentSelectedId');
            // time: '2017-11-11',
            // dayPersonName: ['zhangsan', 'wangwu'],
            // nightPersonName: ['wangwu', 'zhangsan'],
            // dayId: ['1', '2'], // 对应的白班人员id
            // nightId: ['2', '1'], // 夜班人员id
            // type: 0 (普通上班日)、 1(普通周末)、 2(节假日), // 当天类型
            // name: null、 节假日第一天 // 当天名称
            var tableListData = fiveStepScope.tableListData;
            var savedDutyListStr = JSON.stringify(tableListData);
            // 将保存数据库的值班表保存缓存
            localStorage.setItem('com.logistics.duty.savedDutyList', savedDutyListStr);
            $scope.url = 'saveDuty';
            $scope.params = {
                typeId: typeId,
                departmentId: departmentId,
                tableListData: savedDutyListStr
            };
            $scope.optName = '生成值班记录';
            // 保存完成,跳转到步骤六
            $q.all([$scope.postApiNoReload($scope)]).then(function () {
                var sixScope = $scope.getScope('dutyRegisterSixStep');
                sixScope.getTableDateInfo(sixScope)
            }, function () {
                // 执行保存失败不予跳转
                $scope.registerStep = oldValue;
                localStorage.setItem('com.logistics.duty.registerStep', oldValue);
                return;
            });
        }
        // 跳回第一步 , 并非切换 前一月 后一月 按钮变换events
        if (newValue === 1 && oldValue !== newValue) {
            localStorage.setItem('com.logistics.duty.callbackToFirst', 'true');
        }
    });
    $scope.getRegisterLineClass = function (value) {
        return "(registerStep==" + value + "&&registerDone>" + value + ")?'error':(registerStep==" + value + "?'error':(registerDone>=" + value + "?'done':'info'))"
    }
};
// 注册流程第一步
angular.module("MetronicApp").controller('dutyRegisterOneStepController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', dutyRegisterOneStepController]);

function dutyRegisterOneStepController($scope, $http, $compile, $location, $filter, $state) {
    $scope.stepOne = 'hello';
    $scope.holidayDate = [];
    $scope.controllerName = 'dutyRegisterOneStep';
    var date = new Date();
    $scope.url = 'getInitCalendarHolidayFromDate';
    $scope.year = date.getFullYear();
    $scope.month = date.getMonth();
    // 初始化请求
    calendar.registerInitMonth($scope);
    // 监听值班日期列表内容 通知 步骤三 自动排班内容清空
    $scope.$watch('checkedDayList', function () {
        localStorage.setItem('com.logistics.duty.autoDuty.dirtyDataDuty', true);
    });
};
// 注册流程第二步
angular.module("MetronicApp").controller('dutyRegisterTwoStepController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', '$q', '$timeout', dutyRegisterTwoStepController]);

function dutyRegisterTwoStepController($scope, $http, $compile, $location, $filter, $state, $q, $timeout) {
    $scope.addLoading();
    $scope.selectedTypeInfo = [];
    $scope.allTypeHasOwnWorkerFlag = false;
    // 人员与工种的关联关系
    $scope['maintenanceItems'] = {};
    // 首先获取在用且启用的所有工种
    $q.all([getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
        return getWorkerSelectData($scope, $http, $compile, $location, $filter);
    }).then(function () {
        var typeSelectId = localStorage.getItem('com.logistics.duty.typeSelectedId');
        if (typeSelectId != null && typeSelectId != 'null') {
            $scope.typeSelectData = typeSelectId << 0;
            $timeout(function () {
                $('#selectOne').triggerHandler('change');
                $scope.typeSelectChange();
            }, 0);
        }
        $scope.checkoutSelectInfo();
        $scope.removeLoading();
    });
    // 修改工种单选下拉框
    $scope.typeSelectChange = function () {
        var thisTypeId = $scope.typeSelectData;
        thisTypeId ? $scope.typeIsValid = true : $scope.typeIsValid = false
        // 更新选中的工种
        localStorage.setItem('com.logistics.duty.typeSelectedId', thisTypeId);
        angular.forEach($scope.maintenanceTypeSelectData, function (val) {
            if (val.id === thisTypeId) {
                $scope.selectedTypeInfo.splice(0);
                $scope.selectedTypeInfo.push(val);
            }
        });
        $scope.checkAllTypeHasOwnWorker();
    };
    // 把取回的工种列表以及维修工列表进行加工,处理成页面列表需要的格式
    $scope.checkoutSelectInfo = function () {
        // 工种列表
        var allTypeData = $scope.maintenanceTypeSelectData;
        // 得到该部门所有的工人 $scope.workerAllList
        $scope.getWorkerListFromDepartment();
        // 将维修人员剥离并与工种的关系进行关联
        angular.forEach(allTypeData, function (val) {
            var typeWorkerList = localStorage.getItem('com.logistics.duty.checkedTypeWorker' + val.id);
            $scope.getWorkerListFromType(val.id);
            if (typeWorkerList != null && typeWorkerList != 'null') {
                $scope['maintenanceItems'][val.id] = eval('[' + typeWorkerList + ']');
            }
        });
        $scope.checkAllTypeHasOwnWorker();
    };
    // 根据获取到所有的维修工处理
    $scope.getWorkerListFromDepartment = function () {
        var thisDepartmentId = localStorage.getItem('com.logistics.duty.departmentSelectedId');
        var thisDepartmentWorkers = [];
        $scope.workerSelectData.map(function (val) {
            if (thisDepartmentId != null && val.maintenanceWorker.department.id == thisDepartmentId) {
                thisDepartmentWorkers.push(val);
            }
        });
        // 将该部门的所有人员过滤出来
        $scope.workerAllList = thisDepartmentWorkers;
    };
    // 根据工种获取对应的维修工,并挂载到唯一key的scope上
    $scope.getWorkerListFromType = function (id) {
        var thisTypeWorkers = [];
        angular.forEach($scope.workerAllList, function (val) {
            if (val.maintenanceWorker.maintenanceType.id == id) {
                thisTypeWorkers.push(val);
            }
        });
        // eq:$scope.workerFromType18 = [...]
        $scope['workerFromType' + id] = thisTypeWorkers;
    };
    // 修改工种的人员时,检测是否所有的工种都至少有一个维修工对应
    $scope.checkAllTypeHasOwnWorker = function () {
        var allType = $scope.selectedTypeInfo;
        var tempLength = 0;
        angular.forEach(allType, function (val) {
            var _items = $scope["maintenanceItems"][val.id];
            if (_items != null && _items.length > 0) {
                tempLength++;
            }
        });
        var typeSelect = $scope.typeSelectData;
        // 获取下一步按钮,没有通过验证下一步按钮禁用
        var dutyRegisterScope = $scope.getScope('dutyRegister');
        if (typeSelect && tempLength > 0) {
            $scope.allTypeHasOwnWorkerFlag = true;
            dutyRegisterScope.nextCheckDown = true;
        }
        else {
            $scope.allTypeHasOwnWorkerFlag = false;
            dutyRegisterScope.nextCheckDown = false;
        }
        // 获取到工种id
        var typeId = $scope.typeSelectData;
        var savedWorkerObjList = eval('[' + localStorage.getItem('com.logistics.duty.checkedTypeWorker' + typeId) + ']');
        var savedWorkers = (savedWorkerObjList == null ? null : savedWorkerObjList.toString());
        var nowWorkerObjList = $scope["maintenanceItems"][typeId];
        var nowWorkers = (nowWorkerObjList == null ? null : nowWorkerObjList.toString());
        if (savedWorkers !== nowWorkers) {
            // 人员修改时 需要通知 步骤三清空已生成的自动排班内容
            localStorage.setItem('com.logistics.duty.autoDuty.dirtyDataDuty', true);
        }
    };

    $scope.$watch('typeSelectData', function (newValue, oldValue) {
        if (newValue !== oldValue && oldValue != null) {
            localStorage.setItem('com.logistics.duty.autoDuty.dirtyDataDuty', true);
        }
    });
};
// 注册流程第三步
angular.module("MetronicApp").controller('dutyRegisterThreeStepController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', '$q', '$timeout', dutyRegisterThreeStepController]);

function dutyRegisterThreeStepController($scope, $http, $compile, $location, $filter, $state, $q, $timeout) {
    // 暴露出来 清空自动排班缓存 以及选中的工种，部门的接口
    $scope.cleanEvents = function () {
        localStorage.removeItem('com.logistics.duty.autoDutyEvents');
        localStorage.removeItem('com.logistics.duty.autoDuty.dayDutyPersonId');
        localStorage.removeItem('com.logistics.duty.autoDuty.nightDutyPersonId');
        // 清空内容后，将标记清除
        localStorage.removeItem('com.logistics.duty.autoDuty.dirtyDataDuty');
        sweetAlert({
            title: "您修改了值班日期或人员",
            text: "请重新生成值班表",
            type: "warning",
            timer: 2000,
            showConfirmButton: false
        });
    };
    // 是否生成了值班表
    var dutyRegisterScope = $scope.getScope('dutyRegister');
    // 数据已经变脏(值班日历变化 , 工种以及人员变化)
    if (localStorage.getItem('com.logistics.duty.autoDuty.dirtyDataDuty') == 'true') {
        $scope.cleanEvents();
    }
    $scope.autoDutyDown = false;
    dutyRegisterScope.nextCheckDown = false;
    $scope.checkAllPersonSelectStr = 'dayDutyPersonId==null || nightDutyPersonId==null';
    var typeSelectedId = localStorage.getItem("com.logistics.duty.typeSelectedId");
    var personIds = eval('[' + localStorage.getItem("com.logistics.duty.checkedTypeWorker" + typeSelectedId) + ']');
    $q.all([getWorkerSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
        $scope.getPersonListFromIds(personIds);
    });
    // 根据缓存中上一步选择的 id 列表获取到 维修工列表
    $scope.getPersonListFromIds = function (ids) {
        var allWorkers = $scope.workerSelectData;
        var typePerson = [];
        angular.forEach(allWorkers, function (worker) {
            if ($.inArray(worker.id, ids) > -1) {
                typePerson.push(worker);
            }
        });
        $scope.dutyPerson = typePerson;
        // 缓存中是否存在自动排班表
        var events = localStorage.getItem('com.logistics.duty.autoDutyEvents');
        var _dayDutyPersonId = localStorage.getItem('com.logistics.duty.autoDuty.dayDutyPersonId');
        var _nightDutyPersonId = localStorage.getItem('com.logistics.duty.autoDuty.nightDutyPersonId');
        if (_dayDutyPersonId != null) {
            $scope.dayDutyPersonId = _dayDutyPersonId << 0;
        }
        if (_nightDutyPersonId != null) {
            $scope.nightDutyPersonId = _nightDutyPersonId << 0;
        }
        angular.forEach(['selectDay', 'selectNight'], function (value) {
            $timeout(function () {
                angular.element('[id=' + value + ']').triggerHandler('change');
            }, 0);
        });
        if (events != null && events != 'null') {
            $scope.generateAutoDuty(JSON.parse(events));
        }
    };
    $scope.controllerName = 'dutyRegisterThreeStep';
    // 初始化请求(空壳日历，修改背景)
    calendar.autoGenerateDuty($scope);
    // 生成值班表
    $scope.generateAutoDuty = function (lastEvents) {
        if (!$scope.dayDutyPersonId || !$scope.nightDutyPersonId) return;
        $scope.addLoading();
        var dutyRegisterScope = $scope.getScope('dutyRegister');
        $scope.autoDutyDown = false;
        dutyRegisterScope.nextCheckDown = false;
        var _calendar = $('#calendar');
        // 原始日历对象remove,在原始日历对象上刷新 events 无效
        _calendar.fullCalendar('destroy');
        calendar.autoGenerateDuty($scope);
        // 数据进行整理并挂载在scope上
        $scope.getDayAndNightDutyListFromDate();
        // 重新调用 calendar 进行渲染
        var events = $scope.dayCalendarData.concat($scope.nightCalendarData);
        localStorage.setItem('com.logistics.duty.autoDutyEvents', JSON.stringify(events));
        // 缓存中存在记录的自动排班表
        if (lastEvents) {
            _calendar.fullCalendar('addEventSource', lastEvents);
        }
        else {
            _calendar.fullCalendar('addEventSource', events);
            // 将白班&夜班起始 人员id进行记录
            localStorage.setItem('com.logistics.duty.autoDuty.dayDutyPersonId', $scope.dayDutyPersonId);
            localStorage.setItem('com.logistics.duty.autoDuty.nightDutyPersonId', $scope.nightDutyPersonId);
        }
        _calendar.fullCalendar('removeEventSource');
        $scope.removeLoading();
        // 日历正常生成后
        $scope.autoDutyDown = true;
        // 可以进行下一步
        dutyRegisterScope.nextCheckDown = true;
    };
    // 根据值班日以及白班与夜班的起始人员得到 白班以及夜班的完整顺序
    $scope.getDayAndNightDutyListFromDate = function () {
        // 获取出全部需要值班的日期
        var dutyDateListStr = localStorage.getItem("com.logistics.duty.checkedDateList");
        var dutyDateList = (dutyDateListStr != null ? dutyDateListStr.split(',') : []);
        // 需要值班的人员列表
        var dutyPersonList = angular.copy($scope.dutyPerson);
        // 白班的起始索引
        var dayFirstIndexFromPersonList = -1;
        // 夜班的起始索引
        var nightFirstIndexFromPersonList = -1;
        // 得到白班与夜班起始索引
        dutyPersonList.forEach(function (person, index) {
            if (person.id == $scope.dayDutyPersonId) {
                dayFirstIndexFromPersonList = index;
            }
            if (person.id == $scope.nightDutyPersonId) {
                nightFirstIndexFromPersonList = index;
            }
        });
        $scope.dayCalendarData = $scope.concatDutyList(dutyDateList, dutyPersonList, dayFirstIndexFromPersonList, true);
        $scope.nightCalendarData = $scope.concatDutyList(dutyDateList, dutyPersonList, nightFirstIndexFromPersonList, false);
    };
    // 拼接每个日期所对应的人员集合
    $scope.concatDutyList = function (dutyDateList, personList, personStartIndex, flag) {
        if (personStartIndex == -1) return;
        var idSuffix = 'Day';
        if (!flag) {
            idSuffix = 'Night';
        }
        // 对personList是指针引用,修改形参一样会修改原始personList,需要copy之后操作
        var copyPersonList = angular.copy(personList);
        // 原始 张三，李四，王五 ，起始位置为2 ->> 王五，张三，李四
        var startTempList = copyPersonList.splice(0, personStartIndex);
        var sortedPersonList = copyPersonList.concat(startTempList);
        var personListSize = sortedPersonList.length;
        // 用于记录当前遍历的下标
        var countIndex = 0;
        var calendarData = [];
        angular.forEach(dutyDateList, function (date) {
            var obj = {
                title: sortedPersonList[countIndex].name,
                start: date,
                end: $scope.getNextDayStr(date),
                // id: eq:18#2017-09-09#Day
                id: sortedPersonList[countIndex].id + '#' + date + '#' + idSuffix,
                backgroundColor: (flag) ? '#eeeeee' : '#333333',
                textColor: (flag) ? '#222222' : '#ffffff',
            };
            calendarData.push(obj);
            if ((countIndex + 1) >= personListSize) {
                countIndex = 0;
            }
            else {
                countIndex++;
            }
        });
        return calendarData;
    };
};
// 注册流程第四步
angular.module("MetronicApp").controller('dutyRegisterFourStepController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', '$q', '$timeout', dutyRegisterFourStepController]);

function dutyRegisterFourStepController($scope, $http, $compile, $location, $filter, $state, $q, $timeout) {
    $scope.controllerName = 'dutyRegisterFourStep';
    var events = localStorage.getItem('com.logistics.duty.autoDutyEvents');
    // 取出之前选中参与排班的日期列表
    var checkedDateList = localStorage.getItem('com.logistics.duty.checkedDateList').split(',');
    $scope.checkedDateList = checkedDateList;
    $scope.events = JSON.parse(events);
    // 初始化请求(空壳日历，修改背景)
    calendar.manualGenerateDuty($scope);
    // angular-bootstrap-switch 配置
    $scope.select = {};
    $scope.select.isSelected = true;
    $scope.select.onText = '自动调整';
    $scope.select.offText = '手动调整';
    $scope.select.isActive = true;
    $scope.select.size = 'normal';
    $scope.select.animate = true;
    $scope.select.radioOff = true;
    $scope.select.handleWidth = "auto";
    $scope.select.labelWidth = "auto";
    $scope.select.inverse = true;
    $scope.select.onColor = 'info';
    $scope.select.offColor = 'danger';
    // 切换选择按钮
    $scope.toggle = function () {
        $scope.select.isSelected = !$scope.select.isSelected;
    };
    // // 默认提示图片不显示
    // $scope.tipsImgShow = false;
    // // 点击显示与隐藏提示图片
    // $scope.showOrHideTipsImg = function () {
    //     $scope.tipsImgShow = !$scope.tipsImgShow;
    // }
};
// 注册流程第五步
angular.module("MetronicApp").controller('dutyRegisterFiveStepController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', '$q', '$timeout', dutyRegisterFiveStepController]);

function dutyRegisterFiveStepController($scope, $http, $compile, $location, $filter, $state, $q, $timeout) {
    var lastEventsStr = localStorage.getItem('com.logistics.duty.lastEvents');
    // 取出上一步的
    var events = JSON.parse(lastEventsStr);
    $scope.events = events;
    // 根据传入的日期获取到缓存中的日期类型以及节日名称
    $scope.getHolidayInfoFromDate = function (dateStr) {
        var allHoliday = JSON.parse(localStorage.getItem('com.logistics.duty.AllHolidayFromDate'));
        // 返回 type ,与后端一致 1 普通周末 2 法定节假日(第一天会有title 其余的均没有)
        var resultObj = {};
        angular.forEach(allHoliday, function (dateInfo) {
            if (dateInfo.start == dateStr) {
                resultObj.type = dateInfo.type;
                resultObj.name = (dateInfo.title == null || dateInfo.title == '') ? null : dateInfo.title
            }
        });
        return resultObj;
    };
    $scope.checkoutTableUseInfo = function () {
        // 数组细化粒度
        var tempList = [];
        var dutyDateList = [];
        angular.forEach($scope.events, function (event) {
            var obj = {};
            obj.time = event.start;
            dutyDateList.push(event.start);
            // 白班
            var realId = event.id.split('#')[0];
            if (event.id.indexOf('Day') != -1) {
                obj.dayPersonName = event.title;
                obj.dayId = realId
            }
            // 夜班
            else {
                obj.nightPersonName = event.title;
                obj.nightId = realId
            }
            tempList.push(obj);
        });
        // 数组项合并，项数为值班天数，白班，夜班均为数组对象
        var tableList = [];
        // 时间去重
        dutyDateList = $scope.uniqueList(dutyDateList);
        angular.forEach(dutyDateList, function (dutyDate) {
            var dateInfo = $scope.getHolidayInfoFromDate(dutyDate);
            var result = {
                time: dutyDate + ' (' + dateUtil.getWeekStr(dutyDate) + ')',
                dayPersonName: [],
                nightPersonName: [],
                dayId: [], // 对应的白班人员id
                nightId: [], // 夜班人员id
                type: dateInfo == null ? 0 : dateInfo.type, // 当天类型
                name: dateInfo == null ? null : dateInfo.name // 当天名称
            };
            angular.forEach(tempList, function (obj) {
                if (dutyDate == obj.time) {
                    if (obj.dayPersonName) {
                        result.dayPersonName.push(obj.dayPersonName);
                        result.dayId.push(obj.dayId);
                    }
                    if (obj.nightPersonName) {
                        result.nightPersonName.push(obj.nightPersonName);
                        result.nightId.push(obj.nightId);
                    }
                }
            });
            tableList.push(result);
        });
        $scope.tableListData = tableList;
    };

    // 将白班夜班的数据分开
    $scope.checkoutTableUseInfo();
    calendar.showLastDuty($scope);
    // 排班的年月 eq:2017-11
    var dutyDate = localStorage.getItem('com.logistics.duty.checkedYearMonth');
    // 工种名称
    var dutyTypeName = localStorage.getItem('com.logistics.duty.typeSelectedName');
    // 部门名称
    var dutyDepartmentName = localStorage.getItem('com.logistics.duty.departmentSelectedName');
    $scope.dutyYear = dutyDate.split('-')[0];
    $scope.dutyMonth = dutyDate.split('-')[1];
    $scope.dutyTypeName = dutyTypeName;
    $scope.dutyDepartmentName = dutyDepartmentName;
};
// 注册流程第六步
angular.module("MetronicApp").controller('dutyRegisterSixStepController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', '$q', '$timeout', dutyRegisterSixStepController]);

function dutyRegisterSixStepController($scope, $http, $compile, $location, $filter, $state, $q, $timeout) {
    // var savedDutyList = localStorage.getItem('com.logistics.duty.savedDutyList');
    // $scope.tableListData = JSON.parse(savedDutyList);
    $scope.getTableDateInfo = function ($scope) {
        var dutyDate = localStorage.getItem('com.logistics.duty.checkedYearMonth');
        // 工种名称
        var dutyTypeName = localStorage.getItem('com.logistics.duty.typeSelectedName');
        // 部门名称
        var dutyDepartmentName = localStorage.getItem('com.logistics.duty.departmentSelectedName');
        $scope.dutyYear = dutyDate.split('-')[0];
        $scope.dutyMonth = dutyDate.split('-')[1];
        $scope.dutyTypeName = dutyTypeName;
        $scope.dutyDepartmentName = dutyDepartmentName;
        $scope.date = $scope.dutyYear + '-' + $scope.dutyMonth;
        $scope.departmentId = localStorage.getItem('com.logistics.duty.departmentSelectedId') << 0;
        $scope.typeId = localStorage.getItem('com.logistics.duty.typeSelectedId') << 0;
        $scope.getDutyInfo($scope);
    };
    // 保存值班表为图片
    $scope.saveDutyImg = function () {
        var content = $('#dutyTable');
        html2canvas(content, {
            onrendered: function (canvas) {
                //添加属性
                canvas.setAttribute('id', 'thecanvas');
                //读取属性值
                document.getElementById('canvasImg').appendChild(canvas);
                var oCanvas = document.getElementById("thecanvas");
                var img_data1 = Canvas2Image.saveAsPNG(oCanvas, true).getAttribute('src');
                $scope.saveImage(img_data1, $scope.dutyDepartmentName + ' , ' + $scope.dutyTypeName + ' , ' + $scope.dutyYear
                    + ' 年 ' + $scope.dutyMonth + ' 月 值班表', oCanvas);
            }
        });
    };
    // 打印值班表
    $scope.printDutyTable = function () {
        $("#dutyTable").print();
    };
};
// 值班表内容查看
angular.module("MetronicApp").controller('dutyShowListController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', '$q', '$timeout', dutyShowListController]);

function dutyShowListController($scope, $http, $compile, $location, $filter, $state, $q, $timeout) {
    var departmentId = localStorage.getItem('com.logistics.duty.dutyShowDepartmentId');
    var departmentName = localStorage.getItem('com.logistics.duty.dutyShowDepartmentName');
    $scope.departmentName = departmentName;
    // 人员与工种的关联关系
    $scope['maintenanceItems'] = {};
    $scope.checkedTypeAndDate = false;
    // 首先获取在用且启用的所有工种
    $q.all([getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter)]);
    // 日历配置
    $scope.option = {
        format: 'yyyy-mm',
        weekStart: 1,
        autoclose: true,
        startView: 3,
        minView: 3,
        forceParse: false,
    };
    $scope.getTypeNameFromId = function (id) {
        var typeList = $scope.maintenanceTypeSelectData;
        angular.forEach(typeList, function (type) {
            if (type.id == id) {
                $scope.typeName = type.name;
                $scope.typeId = type.id;
            }
        });
    };
    datePickers.init($scope, $http, $compile, $location, $filter);
    $('table tfoot .today').html('本月');
    // 重新取值班表
    $scope.checkedChange = function () {
        delete $scope.tableListData;
        // 取出工种名称
        $scope.getTypeNameFromId($scope.typeSelectData);
        // 取出年月
        if ($scope.dutyYearMonth) {
            $scope.dutyYear = $scope.dutyYearMonth.substring(0, 4);
            $scope.dutyMonth = $scope.dutyYearMonth.substring(5, 7);
        }
        if ($scope.typeSelectData && $scope.dutyYearMonth) {
            $scope.checkedTypeAndDate = true;
            $scope.addLoading();
            $scope.departmentId = departmentId << 0;
            $scope.typeId = $scope.typeId << 0;
            $scope.date = $scope.dutyYear + "-" + $scope.dutyMonth;
            $scope.getDutyInfo($scope);
        }
    };
    // 跳转到注册值班页面 ,且 部门id,工种id,当前年月已经选中(将其中的值存入缓存,跳转过去即可)
    $scope.addDuty = function () {
        // 设置当前年月
        localStorage.setItem("com.logistics.duty.checkedYearMonth", $scope.dutyYearMonth);
        // 设置部门id
        localStorage.setItem('com.logistics.duty.departmentSelectedId', departmentId);
        // 设置工种id
        localStorage.setItem('com.logistics.duty.typeSelectedId', $scope.typeId);
        // 设置从其他页面跳转到注册步骤一的状态
        localStorage.setItem('com.logistics.duty.callbackToFirst', true);
        $state.go('dutyRegister');
    };
    // 保存值班表为图片
    $scope.saveDutyImg = function () {
        var content = $('#dutyTable');
        html2canvas(content, {
            onrendered: function (canvas) {
                //添加属性
                canvas.setAttribute('id', 'thecanvas');
                //读取属性值
                document.getElementById('canvasImg').appendChild(canvas);
                var oCanvas = document.getElementById("thecanvas");
                var img_data1 = Canvas2Image.saveAsPNG(oCanvas, true).getAttribute('src');
                $scope.saveImage(img_data1, $scope.departmentName + ' , ' + $scope.typeName + ' , ' + $scope.dutyYear
                    + ' 年 ' + $scope.dutyMonth + ' 月 值班表', oCanvas);
            }
        });
    };
    // 打印值班表
    $scope.printDutyTable = function () {
        $("#dutyTable").print();
    };
};

// 部门,工种值班表是否配置详情
angular.module("MetronicApp").controller('dutyDetailController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', '$q', '$timeout', dutyDetailController]);

function dutyDetailController($scope, $http, $compile, $location, $filter, $state, $q, $timeout) {
    var departmentId = localStorage.getItem('com.logistics.duty.dutyShowDepartmentId');
    var departmentName = localStorage.getItem('com.logistics.duty.dutyShowDepartmentName');
    $scope.departmentName = departmentName;
    $scope.selectUrl = 'getDutiesDetailFromDepartmentId';
    $scope.selectParams = {
        'departmentId': departmentId
    };
    $scope.selectPara = 'dutyInfo';
    $scope.selectOptName = '获取' + departmentName + '值班配置';
    $q.all([($scope.getSelectInfoApi($scope))]).then(function () {
        if ($scope.dutyInfo == null || $scope.dutyInfo.length === 0) {
            $scope.noData = true;
        }
        else {
            $scope.noData = false;
        }
    });
};
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
    $scope.wrapAry = [2, 3];
    $scope.wrapLongAry = [1];
    $scope.targetsOpt = 8;
    $scope.order = [[7, "desc"]];
    $scope.optHtmlAry = ["dutyList"];
    var url = "getDepartmentList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'dutyDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 部门,工种值班表是否配置详情
    $scope.dutyList = function (id, name, type) {
        localStorage.setItem('com.logistics.duty.departmentSelectedId', id);
        localStorage.setItem('com.logistics.duty.dutyShowDepartmentName', name);
        var maintenanceTypeID = '';
        if(type){
        	maintenanceTypeID = $scope.loginUser.maintenanceTypeID;
        }
        localStorage.setItem('com.logistics.duty.dutyShowMaintenanceTypeID', maintenanceTypeID);
        $state.go('dutyDetail', {'id': id,'type':type});
    };
};
angular.module("MetronicApp").controller('dutyShowListController', ['$scope', '$http', '$compile', '$location', '$filter', '$state', '$q', '$timeout', dutyShowListController]);

function dutyShowListController($scope, $http, $compile, $location, $filter, $state, $q,$timeout) {
    var departmentId = localStorage.getItem('com.logistics.duty.departmentSelectedId');
    var departmentName = localStorage.getItem('com.logistics.duty.dutyShowDepartmentName');
    var maintenanceTypeID = localStorage.getItem('com.logistics.duty.dutyShowMaintenanceTypeID');
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    month =(month<10 ? "0"+month:month);
    var mydate = (year.toString()+"-"+month.toString());
    $scope.departmentName = departmentName;
    $scope.dutyYearMonth  = mydate;
    // 人员与工种的关联关系
    $scope['maintenanceItems'] = {};
    $scope.checkedTypeAndDate = false;
    // 首先获取在用且启用的所有工种
    $q.all([getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter)]).then(function(){
    	$timeout(function () {
    		$scope.$apply(function () {
    			$scope.typeSelectData = maintenanceTypeID << 0;
    			$scope.checkedChange();
            });
        }, 0);
        $scope.selectIdList = ['selectSearch'];
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
    });
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
    // 将日历表的月份框中的 '今天' 修改为 '本月'
    $scope.dateClick = function () {
        $('table tfoot .today').html('本月');
    };
    $scope.dateClick();
    // 重新取值班表
    $scope.checkedChange = function () {
        // 请求开始前先将DOM隐藏 (防止闪动)
        $('#checkedTypeAndDate').addClass('hide');
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
            $scope.selectUrl = 'getDutiesFromDepartmentTypeAndDate';
            $scope.selectParams = {
                departmentId: departmentId << 0,
                typeId: $scope.typeId << 0,
                date: $scope.dutyYear + "-" + $scope.dutyMonth
            };
            $scope.selectPara = 'tableData';
            $q.all([($scope.getSelectInfoApi($scope))]).then(function () {
                var deferred = $q.defer();
                var tableListData = [];
                angular.forEach($scope['tableData'], function (value) {
                    var obj = {};
                    obj.time = value.time + ' (' + dateUtil.getWeekStr(value.time) + ')';
                    obj.dayPerson = value.dayPerson;
                    obj.nightPerson = value.nightPerson;
                    //obj.detail = (value.type) ? (value.type == 1 ? '普通周末' : (value.name ? value.name : '节假日')) : '';
                    obj.detail = value.holidayName;
                    tableListData.push(obj);
                });
                $scope.tableListData = tableListData;
                deferred.resolve();
                return deferred.promise;
            }).then(function () {
                $scope.selectUrl = 'getUserInfoFromDepartmentTypeAndDate';
                $scope.selectPara = 'listData';
                return $scope.getSelectInfoApi($scope);
            }).then(function () {
                $scope.removeLoading();
                // 解除隐藏
                $('#checkedTypeAndDate').removeClass('hide');
            }).catch(function () {
                $scope.removeLoading();
            });
        }
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
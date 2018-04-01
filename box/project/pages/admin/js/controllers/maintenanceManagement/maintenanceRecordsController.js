angular.module("MetronicApp").controller('maintenanceRecordsController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
        maintenanceRecordsController]);
function maintenanceRecordsController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    $scope.selectIdList = ['select'];
    // controller名称初始化
    $scope.controllerName = 'maintenanceRecords';
    // 下拉框id初始化
    $scope.searchInit = true;
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "maintenanceNumber"
    }, {
        "data": "maintenanceRecord.maintenanceArea.campus.name"
    }, {
        "data": "maintenanceRecord.maintenanceArea.name"
    }, {
        "data": "address"
    }, {
        "data": "maintenanceItemName"
    }, {
        "data": "maintenanceRecord.maintenanceCategory.maintenanceType.name"
    }, {
        "data": "maintenanceRecord.maintenanceCategory.name"
    }, {
        "data": "maintenanceContent"
    }, {
        "data": "repairStaff.name"
    }, {
        "data": "repairStaff.tel"
    }, {
        "data": "addDateTime"
    }, {
        "data": "repairMethod"
    }, {
        "data": "maintenanceStaff.name"
    },{
        "data": "maintenanceStaff.tel"
    }, {
        "data": "maintenanceStartDateTime"
    }, {
        "data": "maintenanceEndDateTime"
	}, {
        "data": "maintenanceTime"
    }, {
        "data": "maintenanceRecord.maintenanceStatus.name"
    }, {
        "data": "maintenanceRecord.unableRepairReason"
    }];
    $scope.orderableAry = [0];
    $scope.wrapShortAry = [1, 2, 3, 6, 7, 9];
    $scope.htmlType = [8];
    $scope.repairType = 12;
    $scope.nullStr = [10,13,14];
    $scope.targetsOpt = 20;
    $scope.order = [[11, "desc"]];
    $scope.optHtmlAry = ["detail", "assigned", "print"];
    var url = "getMaintenanceRecord";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'maintenanceRecordsDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteDepartmentById";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 设置手动指派
    $scope.assignedModal = function (id, flag) {
        if (flag) return;
        var assignedScope = $scope.getScope('maintenanceRecordsAssigned');
        assignedScope.data = {
            assignedWorker: {
                id: null
            }
        };
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        // 获取可手动设置维修人员列表
        $scope.selectUrl = 'getUserListByRecord';
        $scope.selectParams = {
            id: id
        };
        $scope.selectPara = 'assignedWorkerList';
        $scope.selectedAssignId = id;
        $scope.selectOptName = '获取手动指派人员';
        $q.all([($scope.getSelectInfoApi($scope))]).then(function () {
            $('#assignedModal').modal();
        });
    };
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
    // 打印预览跳转
    $scope.maintenancePrint = function (id, flag) {
    	if(!flag) {
	        var url = portType + '://' + window.location.host + previewLocationSuffix + "#/viewMyRecord";
	        window.open(url + "?id=" + id);
    	}
    };
}
angular.module("MetronicApp").controller('maintenanceRecordsAssignedController', ['$scope', '$http', '$compile', '$location', '$filter',
    maintenanceRecordsAssignedController]);
function maintenanceRecordsAssignedController($scope, $http, $compile, $location, $filter) {
    // 保存手动指派维修内容
    $scope.assignedSave = function () {
        // 维修订单id
        var id = $scope.selectedAssignId;
        var workerId = $scope.data.assignedWorker.id;
        $('#assignedModal').modal('hide');
        $scope.url = 'addMaintenanceRecordForUser';
        $scope.params = {
            maintenanceId: id,
            userId: workerId
        };
        $scope.optName = '手动指派维修人员';
        $scope.postApi($scope);
    }
}
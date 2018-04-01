angular.module("MetronicApp").controller('maintenanceEvaluationController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceEvaluationController]);
function maintenanceEvaluationController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'maintenanceEvaluation';
    // 单选框初始化
    getStatusUseTypeData($scope, $http, $compile, $location, $filter);
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2'];
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "maintenanceNumber"
    }, {
        "data": "maintenanceItemName"
    },  {
        "data": "maintenanceRecord.maintenanceArea.campus.name"
    }, {
        "data": "maintenanceRecord.maintenanceArea.name"
    }, {
        "data": "address"
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
    }, {
        "data": "maintenanceStaff.tel"
    }, {
        "data": "maintenanceStaff.maintenanceWorker.department.name"
    }, {
        "data": "maintenanceStartDateTime"
    }, {
        "data": "maintenanceEndDateTime"
    }, {
        "data": "maintenanceTime"
    }, {
        "data": "maintenanceRecord.approvalStatus"
    }, {
        "data": "maintenanceRecord.evaluationContent"
    }, {
        "data": "maintenanceRecord.evaluationDateTime"
    }];
    $scope.orderableAry = [0];
    $scope.wrapShortAry = [2,9,13,15];
    $scope.htmlType = [8];
    $scope.repairType = 12;
    $scope.nullStr = [10,14];
    $scope.approvalStatus = 19;
    $scope.targetsOpt = 22;
    $scope.order = [[11, "desc"]];
    $scope.optHtmlAry = ["detail"];
    var url = "getMaintenanceRecord";
    $scope.url = url;
    $scope.reloadUrl = url;
    // 只查差评标志
    $scope.searchObj.badReview = 1;
    $scope.initDataTablesName = 'maintenanceEvaluationDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.searchInit = true;
    $scope.datetimepickerId = ['reviewDateTime'];
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
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('reviewDateTimeEnd', 'reviewDateTimeStart');
        // 差评查询条件重新添加
        $scope.searchObj.badReview = 1;
    };
    // 所有修改状态确认按钮响应
    $scope.changeStatus = function() {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeMaintenanceRecordStatus";
        $scope.optName = "修改审核状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
}
angular.module("MetronicApp").controller('myRepairController', ['$scope', '$http', '$compile', '$location', '$filter', '$state',
    myRepairController]);
function myRepairController($scope, $http, $compile, $location, $filter, $state) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'myRepair';
    // 下拉框id初始化
    $scope.searchInit = true;
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "maintenanceNumber"
    }, {
        "data": "maintenanceItemName"
    }, {
        "data": "maintenanceRecord.maintenanceArea.name"
    }, {
        "data": "maintenanceRecord.maintenanceCategory.maintenanceType.name"
    }, {
        "data": "maintenanceRecord.maintenanceCategory.name"
    }, {
        "data": "repairStaff.name"
    }, {
        "data": "repairStaff.tel"
    }, {
        "data": "addDateTime"
    }, {
        "data": "maintenanceRecord.maintenanceStatus.name"
    }];
    $scope.orderableAry = [1,2,3,4,5,6,7,9];
    $scope.wrapAry = [2,3,4,5];
    $scope.order = [[8, "desc"]];
    $scope.dateFormatMonthDay = [8];
    $scope.viewCommonRepairAry = [1];
    //$scope.optHtmlAry = ["print"];
    //$scope.targetsOpt = 10;
    var url = "getMaintenanceRecord";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.searchObj.maintenanceStaff={"id":$scope.loginUser.id};
    $scope.initDataTablesName='myRepairDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
}
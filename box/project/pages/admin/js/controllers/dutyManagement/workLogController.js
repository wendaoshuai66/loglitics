angular.module("MetronicApp").controller('workLogController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', workLogController]);
function workLogController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch', 'selectSearch2', 'selectSearch3'];
    $scope.selectIdList = ['select'];
    // controller名称初始化
    $scope.controllerName = 'workLog';
    //getFinishedSelectData($scope, $http, $compile, $location, $filter);
    getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter);
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "title"
    }, {
        "data": "user.name"
    }, {
        "data": "user.maintenanceWorker.department.campus.name"
    }, {
        "data": "user.maintenanceWorker.department.name"
    }, {
        "data": "user.maintenanceWorker.maintenanceType.name"
    }, {
        "data": "user.tel"
    }, {
        "data": "workDate"
    }, {
        "data": "startTime"
    }, {
        "data": "endTime"
    }, {
        "data": "content"
    //}, {
    //    "data": "status"
    }, {
        "data": "addDateTime"
    }];
    $scope.orderableAry = [0];
    $scope.wrapAry = [1];
    $scope.wrapShortAry = [2,5];
    //$scope.switchStatus = 10;
    $scope.order = [[11, "desc"]];
    $scope.targetsOpt = 12;
    $scope.dateFormatHourDay = [8, 9];
    $scope.dateFormatMonthDay = [7];
    $scope.optHtmlAry = ["detail"];//, "print"
    var url = "getDiaryList";
    $scope.url = url;
    $scope.reloadUrl = url;
    // 说明是列表页面需要查询的日期框初始化，需要添加结束日期与起始日期的数值校验
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    $scope.initDataTablesName = 'workLogDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    // 查询条件重置
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
};

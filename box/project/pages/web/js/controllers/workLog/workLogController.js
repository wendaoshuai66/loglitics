//工作日志
angular.module("MetronicApp").controller('workLogController', ['$scope', '$http', '$compile', '$location', '$filter', workLogController]);

function workLogController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch', 'selectSearch2', 'selectSearch3'];
    $scope.selectIdList = ['select'];
    // controller名称初始化
    $scope.controllerName = 'workLog';
    getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter);
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "title"
    }, {
        "data": "user.name"
    }, {
        "data": "user.maintenanceWorker.maintenanceType.name"
    }, {
        "data": "workDate"
    }, {
        "data": "startTime"
    }, {
        "data": "endTime"
    }, {
        "data": "addDateTime"
    }];
    $scope.orderableAry = [0, 1, 2, 3, 4, 5, 6];
    $scope.wrapShortAry = [2,3];
    $scope.order = [[7, "desc"]];
    $scope.viewWorkLogAry = [1];
    var url = "getDiaryList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    $scope.dateFormatMonthDay = [4];
    $scope.dateFormatHourDay = [5, 6];
    datePickers.init($scope, $http, $compile, $location, $filter);
    $scope.initDataTablesName = 'workLogDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 查询按钮响应
    $scope.search = function () {
        $scope.searchInfo($scope);
    };
    // 查询条件重置
    $scope.reset = function () {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
};



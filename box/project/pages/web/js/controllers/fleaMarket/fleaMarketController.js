angular.module("MetronicApp").controller('fleaMarketController',['$scope', '$http', '$compile', '$location', '$filter', '$timeout','$stateParams', '$q','$state',fleaMarketController]);
function fleaMarketController($scope, $http, $compile, $location, $filter,$timeout, $stateParams, $q, $state) {
	var type;
    if ($stateParams.type===null) {
    	type = $scope.getControllerPageId('fleaMarketType');
    }
    else {
    	type = $stateParams.type;
        $scope.setControllerPageId('fleaMarketType', type);
    }
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'fleaMarket';
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "title"
    }, {
        "data": "person.name"
    }, {
        "data": "person.tel"
    }, {
        "data": "price"
    }, {
        "data": "addDateTime"
    }, {
        "data": "dealStatus"
    }];
    $scope.orderableAry = [0, 1, 2, 3, 4, 6];
    $scope.viewFleaMarketAry = [1];
    $scope.dealStatus = 6;
    $scope.order = [ [ 5, "desc" ] ];
    var url = "getFleaMarketList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'fleaMarketDataTable';
    $scope.searchObj.type = type;
    $scope.searchObj.approvalStatus = 1;
    // 只初始化第一个dateTable
    $scope.dataTableInit = {};
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
    // 切换tab页进行init&reload
    $scope.changeTab = function (flag) {
        // 第一个tab页已经init只需reload
        if (flag === 1 || flag === '1') {
            $scope.searchObj.type = 1;
            $('#' + $scope.initDataTablesName).DataTable().ajax.reload(function () {}, false);
        }
        else {
            $scope.tableName = 'dataTable1';
            $scope.searchInit = true;
            $scope.searchObj.type = 0;
            // 如果已经init reload
            if ($scope.dataTableInit[$scope.tableName]) {
                $('#' + $scope.initDataTablesName).DataTable().ajax.reload(function () {}, false);
            }
            // init操作
            else {
                dataTables.init($scope, $http, $compile, $location, $filter);
            }
        }
    };
};



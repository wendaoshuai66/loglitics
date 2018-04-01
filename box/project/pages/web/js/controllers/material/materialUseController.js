//物料使用情况
angular.module("MetronicApp").controller('materialUseController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
    materialUseController]);
function materialUseController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'materialUse';
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2'];
    // 下拉框数据初始化
    $q.all([getMaterialCategorySelectData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getMaterialSelectData($scope, $http, $compile, $location, $filter);
    }).then(function() {
        return getWarrantyNumberSelectData($scope, $http, $compile, $location, $filter);
    });
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "material.name"
    }, {
        "data": "material.specificationsModel"
    }, {
        "data": "material.materialCategory.name"
    }, {
        "data": "warrantyNumber.maintenanceNumber"
    }, {
        "data": "stockRemovalCount"
    }, {
        "data": "material.materialUnit.name"
    }, {
        "data": "stockRemovalDate"
    }, {
        "data": "addDateTime"
    }];
    $scope.orderableAry = [0,1,2,3,4,5,6];
    $scope.wrapAry = [2, 3];
    //$scope.targetsOpt = 9;
    $scope.dateFormatAry = 7;
    $scope.viewMyMaterialAry = [1];
    $scope.viewMyRepairAry = [4];
    $scope.order = [[7, "desc"]];
    //$scope.optHtmlAry = ["print"];
    var url = "getStockRemovalList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'materialUseDataTable';
    $scope.searchObj.warrantyNumber={"maintenanceStaff":{"id":$scope.loginUser.id}};
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.searchInit = true;
    $scope.datetimepickerId = ['stockRemovalDate'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('stockRemovalDateEnd', 'stockRemovalDateStart');
    };
};
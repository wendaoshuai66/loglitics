angular.module("MetronicApp").controller('materialController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', materialController]);
function materialController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'material';
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2'];
    // 下拉框数据初始化
    // 防止多次发送Ajax请求，数据绑定错误或者第二次请求冲掉第一次数据($scope上绑定的$scope.selectPara会使用最后一次的值),
    // 使用AngularJS内置的promise实现$q，链式调用即可，执行完MaterialCategory再去执行MaterialUnit
    $q.all([getMaterialCategorySelectData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getMaterialUnitSelectData($scope, $http, $compile, $location, $filter)
    });
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "name"
    }, {
        "data": "specificationsModel"
    }, {
        "data": "materialCategory.name"
    }, {
        "data": "inventoryQuantity"
    }, {
        "data": "materialUnit.name"
    }, {
        "data": "custodian"
    }, {
        "data": "storageLocation"
    }, {
        "data": "remarks"
    }, {
        "data": "addDateTime"
    }];
    $scope.orderableAry = [0,1,2,3,4,5];
    $scope.viewMaterialAry = [1];
    $scope.wrapAry = [2, 3];
    //$scope.targetsOpt = 10;
    //$scope.dateFormatMonthDay = [9];
    $scope.order = [[9, "desc"]];
    //$scope.optHtmlAry = ["detail"];
    var url = "getMaterialList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.searchObj.status=1;
    $scope.initDataTablesName = 'materialDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter)
    };
}
angular.module("MetronicApp").controller('materialViewController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
    '$stateParams', '$q', '$sce','$state', materialViewController]);
function materialViewController($scope, $http, $compile, $location, $filter,
                            $timeout, $stateParams, $q, $sce,$state) {
    // 传来的数据为空(页面刷新情况)
    var id;
    if(!$stateParams.id) {
        //id = $scope.getControllerPageId('materialId');
    }
    else {
        id = $stateParams.id;
        //$scope.setControllerPageId('materialId', id);
    }
    $scope.selectUrl = 'getMaterialById';
    $scope.selectParams = {"id":id};
    $scope.selectPara = 'data';
    $scope.getSelectInfoApi($scope);
};
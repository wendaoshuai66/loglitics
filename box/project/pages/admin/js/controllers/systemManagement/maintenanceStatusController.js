angular.module("MetronicApp").controller('maintenanceStatusController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceStatusController]);
function maintenanceStatusController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'maintenanceStatus';
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "name"
    }, {
        "data": "description"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }, {
        "data": "weight"
    }];
    $scope.orderableAry = [0, 1, 2];
    $scope.htmlType = [2];
    $scope.wrapAry = [1];
    // $scope.targetsOpt = 6;
    $scope.order = [[5, "asc"]];
    // $scope.optHtmlAry = ["detail"];// ["detail", "edit", "remove"]
    var url = "getMaintenanceStatusList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'maintenanceStatusDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 添加页面
    $scope.addModal = function() {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加维修状态信息';
        $scope.data.status = "1";
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
        $scope.data = data;
        $scope.modalTitle = '修改维修状态信息';
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
    };
    // 状态迁移页面
    $scope.actPicModal= function() {
        $scope.modalTitle = '状态迁移图';
        $('#actPicModal').modal();
    };
};
angular.module("MetronicApp").controller('maintenanceStatusAddController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceStatusAddController]);
function maintenanceStatusAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
    }
};
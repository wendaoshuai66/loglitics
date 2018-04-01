angular.module("MetronicApp").controller('maintenanceTypeController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceTypeController]);
function maintenanceTypeController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'maintenanceType';
    // 单选框初始化
    getStatusUseTypeData($scope, $http, $compile, $location, $filter);
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "name"
    }, {
        "data": "description"
    }, {
        "data": "status"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }];
    $scope.orderableAry = [0];
    $scope.wrapLongAry = [1];
    $scope.htmlType = [2];
    $scope.switchStatus = 3;
    $scope.targetsOpt = 6;
    $scope.order = [[4, "desc"]];
    $scope.optHtmlAry = ["detail", "edit", "remove"];
    var url = "getMaintenanceTypeList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'maintenanceTypeDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 添加页面
    $scope.resetInputList = ['name'];
    $scope.addModal = function() {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加维修工种';
        $scope.data.status = "1";
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
        $scope.data = data;
        $scope.modalTitle = '修改维修工种';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteMaintenanceType";
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
    // 修改状态确认按钮响应
    $scope.changeStatus = function() {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeMaintenanceTypeStatus";
        $scope.optName = "修改工种状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
};
angular.module("MetronicApp").controller('maintenanceTypeAddController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceTypeAddController]);
function maintenanceTypeAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveMaintenanceType";
        // 修改
        if ($scope.data.id !== undefined) {
            // 将set字段去除掉
            delete $scope.data.maintenanceCategories;
            $scope.optName = "修改";
        }
        // 添加
        else {
            $scope.dataRefresh = true;
            $scope.optName = "添加";
        }
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $scope.postApi($scope);
    };
    // 监听需要检查是否重复项
    $scope.checkRepeat = function() {
        $scope.repeatName = "工种名称";
        $scope.repeatUrl = "checkRepeatMaintenanceType";
        $scope.checkRepeatName = "name";
        $scope.checkRepeatApi($scope);
    };
};
angular.module("MetronicApp").controller('maintenanceCategoryController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
        maintenanceCategoryController]);
function maintenanceCategoryController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'maintenanceCategory';
    $q.all([getStatusUseTypeData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter);
    });
    // 下拉框id初始化
    $scope.selectIdList = ['select'];
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "name"
    }, {
        "data": "maintenanceType.name"
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
    $scope.wrapAry = [1, 2];
    $scope.htmlType = [3];
    $scope.switchStatus = 4;
    $scope.targetsOpt = 7;
    $scope.order = [[5, "desc"]];
    $scope.optHtmlAry = ["detail", "edit", "remove"];
    var url = "getMaintenanceCategoryList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'maintenanceCategoryDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.resetInputList = ['name'];
    // 添加页面
    $scope.addModal = function() {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加维修类别信息';
        $scope.data.status = "1";
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
        getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter);
        $scope.data = data;
        $scope.modalTitle = '修改维修类别信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 树结构页面
    $scope.treeModal = function() {
        $scope.treeUrl = 'getCategoryTypeTreeList';
        getTrees($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '维修类别结构树';
        $('#treeModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteMaintenanceCategory";
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
        $scope.url = "changeMaintenanceCategoryStatus";
        $scope.optName = "修改类别状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
};
angular.module("MetronicApp").controller('maintenanceCategoryAddController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceCategoryAddController]);
function maintenanceCategoryAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveMaintenanceCategory";
        // 修改
        if ($scope.data.id !== undefined) {
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
        $scope.repeatName = "类别名称";
        $scope.repeatUrl = "checkRepeatMaintenanceCategory";
        $scope.checkRepeatName = "name";
        $scope.checkRepeatApi($scope);
    };
};
angular.module("MetronicApp").controller('maintenanceCategoryTreeController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceCategoryTreeController]);
function maintenanceCategoryTreeController($scope, $http, $compile, $location, $filter) {

}
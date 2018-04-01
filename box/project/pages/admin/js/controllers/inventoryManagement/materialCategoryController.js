angular.module("MetronicApp").controller('materialCategoryController', ['$scope', '$http', '$compile', '$location', '$filter',
        materialCategoryController]);
function materialCategoryController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'materialCategory';
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
    $scope.targetsOpt = 6;
    $scope.switchStatus = 3;
    $scope.order = [[4, "desc"]];
    $scope.optHtmlAry = ["detail", "edit"];//, "remove"
    var url = "getMaterialCategoryList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'materialCategoryDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.resetInputList = ['name'];
    // 添加页面
    $scope.addModal = function() {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加物料类别';
        $scope.data.status = "1";
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
    	$scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.data = data;
        $scope.modalTitle = '修改物料类别';
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteMaterialCategory";
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
        $scope.url = "changeMaterialCategoryStatus";
        $scope.optName = "修改物料类别状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter)
    };
};
angular.module("MetronicApp").controller('materialCategoryAddController', ['$scope', '$http', '$compile', '$location', '$filter',
        materialCategoryAddController]);
function materialCategoryAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveMaterialCategory";
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
        $scope.repeatName = "物料类别名称";
        $scope.repeatUrl = "checkRepeatMaterialCategory";
        $scope.checkRepeatName = "name";
        $scope.checkRepeatApi($scope);
    };
};

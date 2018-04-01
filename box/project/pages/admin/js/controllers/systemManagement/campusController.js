angular.module("MetronicApp").controller('campusController',
        ['$scope', '$http', '$compile', '$location', '$filter', '$timeout', campusController]);
function campusController($scope, $http, $compile, $location, $filter, $timeout) {
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'campus';
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
    var url = "getCampusList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'campusDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 对于需要校验的输入内容清空操作
    $scope.resetInputList = ['name'];
    // 添加页面
    $scope.addModal = function() {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加校区信息';
        $scope.data.status = "1";
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
    	//$scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.data = data;
        $scope.modalTitle = '修改校区信息';
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteCampus";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 所有修改状态确认按钮响应
    $scope.changeStatus = function() {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeCampusStatus";
        $scope.optName = "修改校区状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
};
angular.module("MetronicApp").controller('campusAddController', ['$scope', '$http', '$compile', '$location', '$filter', campusAddController]);
function campusAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveCampus";
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
        $scope.repeatName = "校区名称";
        $scope.repeatUrl = "checkRepeatCampus";
        $scope.checkRepeatName = "name";
        $scope.checkRepeatApi($scope);
    };
};

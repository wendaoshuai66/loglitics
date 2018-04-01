angular.module("MetronicApp").controller('inforModuleController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
        inforModuleController]);
function inforModuleController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'inforModule';
    // 单选框初始化
    $q.all([getStatusUseTypeData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getShowStatusData($scope, $http, $compile, $location, $filter);
    });
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
        "data": "homeShow"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }];
    // InforPicture
    $scope.orderableAry = [0];
    $scope.htmlType = [2];
    $scope.switchStatus = 3;
    $scope.wrapAry = [1];
    // $scope.inforType = 2;
    $scope.switchHomeShow = 4;
    $scope.targetsOpt = 7;
    $scope.order = [[5, "desc"]];
    $scope.optHtmlAry = ["detail", "edit", "remove"];
    var url = "getInforModuleList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'inforModuleDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.resetInputList = ['name'];
    // 添加页面
    $scope.addModal = function() {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加信息模块';
        $scope.data.status = "1";
        $scope.data.inforType = "1";
        //$scope.data.homeShow = "1";
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
        $scope.data = data;
        $scope.modalTitle = '修改信息模块';
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteInforModule";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 修改状态确认按钮响应
    $scope.changeStatus = function() {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeInforModuleStatus";
        $scope.optName = "修改信息模块状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
};
angular.module("MetronicApp").controller('inforModuleAddController', ['$scope', '$http', '$compile', '$location', '$filter',
        inforModuleAddController]);
function inforModuleAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveInforModule";
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
        $scope.repeatName = "模块名称";
        $scope.repeatUrl = "checkRepeatInforModule";
        $scope.checkRepeatName = "name";
        $scope.checkRepeatApi($scope);
    };
};
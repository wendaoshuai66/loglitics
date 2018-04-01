angular.module("MetronicApp").controller('serviceController',
    ['$scope', '$http', '$compile', '$location', '$filter', '$timeout', serviceController]);
function serviceController($scope, $http, $compile, $location, $filter, $timeout) {
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'service';
    // 单选框初始化
    getStatusUseTypeData($scope, $http, $compile, $location, $filter);
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "title"
    }, {
        "data": "url"
    }, {
        "data": "description"
    }, {
        "data": "status"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }];
    $scope.orderableAry = [0,1,2,3];
    $scope.wrapLongAry = [1];
    $scope.htmlType = [3];
    $scope.urlAry=[2];
    $scope.switchStatus =4;
    $scope.targetsOpt =7;
    $scope.order = [[5, "desc"]];
    $scope.optHtmlAry = ["detail", "edit", "remove"];
    var url = "getConvenientServiceList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'serviceDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 对于需要校验的输入内容清空操作
    $scope.resetInputList = ['title', 'url'];
    // 添加页面
    $scope.addModal = function() {
    	//var serviceAddScope = $scope.getScope('serviceAdd');
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.data.url = '';
        $scope.modalTitle = '添加链接信息';
        $scope.data.status = "1";
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
        $scope.data = data;
        $scope.modalTitle = '修改链接信息';
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteConvenientService";
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
        $scope.url = "changeConvenientServiceStatus";
        $scope.optName = "修改链接状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };

};
angular.module("MetronicApp").controller('serviceAddController', ['$scope', '$http', '$compile', '$location', '$filter', serviceAddController]);
function serviceAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = " saveConvenientService";
        // 修改
        if ($scope.data.id !== undefined){
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
    // 监听名称重复
    $scope.checkRepeat = function() {
        $scope.repeatName = "链接名称";
        $scope.repeatUrl = "checkRepeatConvenientService";
        $scope.checkRepeatName = "title";
        $scope.checkRepeatApi($scope);
    };
};

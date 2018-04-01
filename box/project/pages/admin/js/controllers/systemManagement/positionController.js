angular.module("MetronicApp").controller('positionController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', positionController]);
function positionController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'position';
    // 下拉框id初始化
    // $scope.selectIdList = ['select'];
    // 下拉框数据初始化
    $q.all([getStatusTypeData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getPositionSelectData($scope, $http, $compile, $location, $filter);
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
        "data": "cardDisplay"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }];
    $scope.orderableAry = [0];
    $scope.htmlType = [2];
    $scope.switchStatus = 3;
    $scope.cardDisplay = 4;
    $scope.wrapLongAry = [1];
    $scope.targetsOpt = 7;
    $scope.order = [[5, "desc"]];
    $scope.optHtmlAry = ["detail", "edit", "remove"];
    var url = "getPositionList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'positionDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 添加页面
    $scope.resetInputList = ['name'];
    $scope.addModal = function() {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加职务信息';
        $scope.data.cardDisplay = "1";
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
        $scope.data = data;
        $scope.modalTitle = '修改职务信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 树结构页面
    $scope.treeModal = function() {
        $scope.modalTitle = '职务结构树';
        $('#treeModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deletePosition";
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
        $scope.url = "changeCardStatus";
        $scope.optName = "修改职务状态";
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
angular.module("MetronicApp").controller('positionAddController', ['$scope', '$http', '$compile', '$location', '$filter', positionAddController]);
function positionAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "savePosition";
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
        $scope.repeatName = "职务名称";
        $scope.repeatUrl = "checkRepeatPosition";
        $scope.checkRepeatName = "name";
        $scope.checkRepeatApi($scope);
    };
};
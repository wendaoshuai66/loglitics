angular.module("MetronicApp").controller('studentController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', studentController]);
function studentController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'student';
    // 单选框初始化
    $q.all([getSexTypeData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getApprovalStatusData($scope, $http, $compile, $location, $filter);
    });
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "account"
    }, {
        "data": "name"
    }, {
        "data": "weChatOpenId"
    }, {
        "data": "sex"
    }, {
        "data": "tel"
    }, {
        "data": "status"
    }, {
        "data": "addDateTime"
    }, {
        "data": "lastLoginDateTime"
    }, {
        "data": "approvalStatus"
    }, {
        "data": "idCardNum"
    }, {
        "data": "approvalDateTime"
    }];
    $scope.orderableAry = [0];
    $scope.wrapAry = [2];
    $scope.targetsOpt = 12;
    $scope.sexType = 4;
    $scope.switchStatus = 6;
    $scope.approvalStatus = 9;
    $scope.order = [[7, "desc"]];
    $scope.optHtmlAry = ["detail", "remove", "resetPsw"];// "edit",
    var url = "getStudentList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'studentDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteStudent";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 重置密码确认按钮响应
    $scope.resetPsw = function() {
        $('#resetPswModal').modal('hide');
        $scope.addLoading();
        $scope.url = "resetPswStudent";
        $scope.optName = "重置用户密码";
        $scope.params = {
            "id": $scope.resetPswId
        };
        $scope.postApiNoReload($scope);
    };
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    // 修改状态确认按钮响应
    $scope.changeStatus = function() {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeStudentStatus";
        $scope.optName = "修改学生状态";
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
angular.module("MetronicApp").controller('studentAddController', ['$scope', '$http', '$compile', '$location', '$filter', studentAddController]);
function studentAddController($scope, $http, $compile, $location, $filter) {
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveStudent";
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
        $scope.repeatName = "学号";
        $scope.repeatUrl = "checkRepeatAccount";
        $scope.checkRepeatName = "account";
        $scope.checkRepeatApi($scope);
    };
};


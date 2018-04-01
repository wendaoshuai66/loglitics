angular.module("MetronicApp").controller('lostFoundController',
        ['$scope', '$http', '$compile', '$location', '$filter', '$q', lostFoundController]);
function lostFoundController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch', 'selectSearch2', 'selectSearch3'];
    // controller名称初始化
    $scope.controllerName = 'lostFound';
    $q.all([getApprovalStatusData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getFinishedSelectData($scope, $http, $compile, $location, $filter);
    }).then(function() {
        return getLostFoundStatusData($scope, $http, $compile, $location, $filter);
    });
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "title"
    }, {
        "data": "type"
    }, {
        "data": "description"
    }, {
        "data": "person.name"
    }, {
        "data": "person.tel"
    }, {
        "data": "addDateTime"
    }, {
        "data": "approvalStatus"
    }, {
        "data": "approvalDateTime"
    }, {
        "data": "viewTimes"
    }, {
        "data": "dealStatus"
    }];
    $scope.orderableAry = [0];
    $scope.lostFoundType = 2;
    $scope.htmlType = [3];
    $scope.wrapAry = [1];
    $scope.wrapShortAry = [4];
    $scope.dealStatus = 10;
    $scope.approvalStatus = 7;
    $scope.targetsOpt = 11;
    $scope.order = [[6, "desc"]];
    $scope.optHtmlAry = ["preview", "detail", "remove"];
    var url = "getLostFoundList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'lostFoundDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteLostFound";
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
    // 查询条件重置
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        // 将日期联动框约束关系解除
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
    // 修改状态确认按钮响应
    $scope.changeStatus = function() {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeLostFoundStatus";
        $scope.optName = "修改状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
    // 说明是列表页面需要查询的日期框初始化，需要添加结束日期与起始日期的数值校验
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 预览
    $scope.preview = function (id) {
        var url = portType + '://' + window.location.host + previewLocationSuffix + "#/viewLostFound";
        window.open(url + "?id=" + id);
    };
};


angular.module("MetronicApp").controller('fleaMarketController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
        fleaMarketController]);
function fleaMarketController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch', 'selectSearch2', 'selectSearch3'];
    // controller名称初始化
    $scope.controllerName = 'fleaMarket';
    $q.all([getApprovalStatusData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getFinishedSelectData($scope, $http, $compile, $location, $filter);
    }).then(function() {
        return getFleaMarketStatusData($scope, $http, $compile, $location, $filter);
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
        "data": "price"
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
    $scope.fleaMarketType = 2;
    $scope.htmlType = [3];
    $scope.wrapAry = [1];
    $scope.wrapShortAry = [4];
    $scope.dealStatus = 11;
    $scope.approvalStatus = 8;
    $scope.targetsOpt = 12;
    $scope.order = [[7, "desc"]];
    $scope.optHtmlAry = ["preview", "detail", "remove"];
    var url = "getFleaMarketList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'fleaMarketDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteFleaMarket";
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
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
    // 修改状态确认按钮响应
    $scope.changeStatus = function() {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeFleaMarketStatus";
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
        var url = portType + '://' + window.location.host + previewLocationSuffix + "#/viewFleaMarket";
        window.open(url + "?id=" + id);
    };
};


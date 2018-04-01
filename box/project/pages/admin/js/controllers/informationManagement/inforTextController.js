angular.module("MetronicApp").controller('inforTextController', ['$scope', '$http', '$compile', '$location', '$filter', inforTextController]);
function inforTextController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'inforText';
    $scope.selectSearchIdList = ['selectSearch'];
    getApprovalStatusData($scope, $http, $compile, $location, $filter);
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "title"
    }, {
        "data": "author.name"
    }, {
        "data": "article"
    }, {
        "data": "addDateTime"
    //}, {
    //    "data": "viewTimes"
    }, {
        "data": "reply"
    }, {
        "data": "approvalStatus"
    }, {
        "data": "approvalDateTime"
    }];
    $scope.orderableAry = [0];
    $scope.wrapLongAry = [1];
    $scope.wrapShortAry = [2];
    $scope.htmlType = [3];
    $scope.targetsOpt = 8;
    $scope.approvalStatus = 6;
    $scope.order = [[4, "desc"]];
    $scope.optHtmlAry = ["detail", "reply", "remove"];
    var url = "getInforTextList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'inforTextDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 说明是列表页面需要查询的日期框初始化，需要添加结束日期与起始日期的数值校验
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteInforText";
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
        $scope.url = "changeInforTextStatus";
        $scope.optName = "修改建言献策状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
    // 打开回复内容
    $scope.replyModal = function(id, flag) {
        if (flag)
            return; // 对已经回复的内容进行拦截
        $scope.replyId = id;
        $scope.replyTitle = '建言献策回复';
        $scope.getScope('inforTextReply').reply = '';
        $('#replyModal').modal();
    };

    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
};
angular.module("MetronicApp").controller('inforTextReplyController', ['$scope', '$http', '$compile', '$location', '$filter',
        inforTextReplyController]);
function inforTextReplyController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 确认回复提交
    $scope.confirmReply = function() {
        $('#replyModal').modal('hide');
        $scope.addLoading();
        $scope.url = "confirmReplyInforText";
        $scope.optName = "设置回复";
        $scope.params = {
            "data": JSON.stringify({
                "reply": $scope.reply,
                "id": $scope.replyId
            })
        };
        $scope.postApi($scope);
    };
}
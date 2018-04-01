angular.module("MetronicApp").controller('slideController', ['$scope', '$http', '$compile', '$location', '$filter', slideController]);
function slideController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'slide';
    getShowStatusData($scope, $http, $compile, $location, $filter);
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "title"
    }, {
        "data": "url"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }, {
        "data": "homeShow"
    }];
    $scope.orderableAry = [0, 2];
    $scope.switchHomeShow = 5;
    $scope.targetsOpt = 6;
    $scope.order = [[3, "desc"]];
    $scope.wrapLongAry = [1];
    $scope.optHtmlAry = ["urlView", "edit","imgView"];// , "remove"
    var url = "getInforSlideList";
    $scope.url = url;
    $scope.reloadUrl = url;
    // 说明是列表页面需要查询的日期框初始化，需要添加结束日期与起始日期的数值校验
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    $scope.initDataTablesName = 'slideDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.resetInputList = ['title', 'url'];
    // 添加页面
    $scope.addModal = function () {
        // 清空上传队列
        $scope.clearQueue();
        var addScope = $scope.getScope('slideAdd');
        //$scope.uploadAdd = false; // 添加页面必须上传一张图片
        addScope.data = {};
        $scope.resetErrorInput(addScope, $http, $compile, $location, $filter);
        addScope.data.url = '';
        addScope.modalTitle = '添加幻灯';
        addScope.data.homeShow = "0";
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function (data) {
    	$scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        // 清空上传队列
        $scope.clearQueue();
        //$scope.uploadAdd = true;// 修改页面没有必须上传限制，如果上传就替换掉原有的
        var addScope = $scope.getScope('slideAdd');
        addScope.data = data;
        addScope.modalTitle ='修改幻灯';
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function () {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteInforSlide";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 修改状态确认按钮响应
    $scope.changeStatus= function () {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeInforSlideStatus";
        $scope.optName = "修改幻灯管理状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
    // 记录设置为首页显示的状态个数
    $scope.homeShowCount=function(value,callback) {
        $scope.url="getInforSlideHomeshow";
        $http({
            url: $scope.httpDomain + $scope.url,
            method: 'POST',
            headers: {
                'logistics-session-token': $scope.getToken()
            }
        }).success(function (data) {
            if(data.count>9 && value===0 ){
                sweetAlert("警告", "首页显示个数不能超过10个！","error");
                $scope.countFlag = false;
            }
            else {
                $scope.countFlag = true;
                callback();
            }
        })
    };
    // 查询按钮响应
    $scope.search = function () {
        $scope.searchInfo($scope);
    };
    $scope.reset = function () {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
};
// 幻灯添加页面
angular.module("MetronicApp").controller('slideAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$stateParams',
    slideAddController]);
function slideAddController($scope, $http, $compile, $location, $filter, $stateParams) {
    // 取出传递过来的参数
    var data = $stateParams.messageData;
    $scope.data = data;
    // 单选框初始化
    getShowStatusData($scope, $http, $compile, $location, $filter);
    // 保存按钮响应
    $scope.save = function () {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveInforSlide";
        // 修改
        if ($scope.data.id !== undefined) {
            $scope.optName = "修改";
        }
        // 添加
        else {
            $scope.dataRefresh = true;
            $scope.optName = "添加";
        }
        // 上传后的图片绝对路径
        var uploadScope = $scope.getScope('slideUpload');
        var tempUrl;
        if(uploadScope.uploadDown) {
            tempUrl = uploadScope.uploadDown.url;
        }
        if(!$scope.data.slidePicture || ($scope.data.slidePicture !== tempUrl)) {
            $scope.data.slidePicture = tempUrl;
        }
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $scope.postApi($scope);
    };
    $scope.upload = function () {
        var slideScope = $scope.getScope('slideUpload');
        // 不上传新图片
        if(slideScope.uploader.queue.length == 0) {
            $scope.save();
        }
        else {
            slideScope.uploader.uploadAll();
        }
    };
};
//我的跳蚤市场
angular.module("MetronicApp").controller(
    'myFleaMarketController',
    ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
        '$stateParams', '$q','$state',
        myFleaMarketController]);
function myFleaMarketController($scope, $http, $compile, $location, $filter,
                                $timeout, $stateParams, $q, $state) {
    var type;
    if ($stateParams.type===null) {
        type = $scope.getControllerPageId('fleaMarketType');
    }
    else {
        type = $stateParams.type;
        $scope.setControllerPageId('fleaMarketType', type);
    }
    $scope.data = {};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'myFleaMarket';
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    },{
        "data": "title"
    },{
        "data": "price"
    },{
        "data": "addDateTime"
    }, {
        "data": "approvalStatus"
    }, {
        "data": "dealStatus"
    }];
    $scope.orderableAry = [0, 1, 2, 4, 5];
    $scope.viewFleaMarketAry = [1];
    $scope.approvalStatus = 4;
    $scope.dealStatus = 5;
    $scope.targetsOpt = 6;
    $scope.optHtmlAry = ["remove" ];//"editFleaMarket", 
    $scope.order = [ [ 3, "desc" ] ];
    var url = "getFleaMarketList";
    $scope.url = url;
    $scope.reloadUrl=url;
    $scope.searchInit = true;
    $scope.searchObj.type = type;
    $scope.searchObj.person = {"id":$scope.loginUser.id};
    // 只初始化第一个dateTable
    $scope.dataTableInit = {};
    $scope.initDataTablesName = 'myFleaMarketDataTable';
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
        $scope.postApi($scope, function () {
            $scope.url = 'getFleaMarketList';
            $scope.reloadUrl = 'getFleaMarketList';
            $('#' + $scope.initDataTablesName).DataTable().ajax.reload(function() {},false);
        });
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
        $scope.postApi($scope, function() {
            $scope.url = 'getFleaMarketList';
            $scope.reloadUrl = 'getFleaMarketList';
            $('#' + $scope.initDataTablesName).DataTable().ajax.reload(function() {},false);
        });
    };
    // 切换tab页进行init&reload
    $scope.changeTab = function (flag) {
        // 第一个tab页已经init只需reload
        if (flag === 1 || flag === '1') {
            $scope.searchObj.type = 1;
            $('#' + $scope.initDataTablesName).DataTable().ajax.reload(function() {},false);
        }
        else {
            $scope.tableName = 'dataTable1';
            $scope.searchInit = true;
            $scope.searchObj.type = 0;
            // 如果已经init reload
            if ($scope.dataTableInit[$scope.tableName]) {
                $('#' + $scope.initDataTablesName).DataTable().ajax.reload(function() {},false);
            }
            // init操作
            else {
                dataTables.init($scope, $http, $compile, $location, $filter);
            }
        }
    };
};
//我要发布
angular.module("MetronicApp").controller('fleaMarketAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout', '$stateParams', '$q', '$state', fleaMarketAddController]);
function fleaMarketAddController($scope, $http, $compile, $location, $filter, $timeout, $stateParams, $q ,$state) {
    // 存放上传图片路径集合
    $scope.uploadSuccessImgUrl = [];
    // 用于记录表单中添加的图片个数
    $scope.thisPageAddImgCount = 0;
    $scope.uploadTypeOnlyImg = true; // 只能上传图片
    $scope.maxImg = uploadImgMaxCount; // 最多上传10张
    // 上传图片配置
    Upload.init($scope, $timeout);
    priceConfig();
	getFleaMarketStatusData($scope, $http, $compile, $location, $filter);
    //
    var id;
    if (!$stateParams.id) {
        //id = $scope.getControllerPageId('fleaMarketId');
    }
    else {
        id = $stateParams.id;
    }
    //获取详情数据
    $scope.data = {};
    $scope.params ={'id':id};
    if(id) {
    	getViewDataShow($scope, $http, $compile, $location, $filter);
    }else{
    	// 传来的数据为空(页面刷新情况)
        if ($stateParams.type===null) {
            $scope.data.type = $scope.getControllerPageId('fleaMarketType');
        }
        else {
            $scope.data.type = $stateParams.type;
            $scope.setControllerPageId('fleaMarketType', $scope.data.type);
        }
    }
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function () {
        // 更新数据
        $scope.addLoading();
        $scope.url = "saveFleaMarket";
        $scope.data.person = {"id":$scope.loginUser.id};
        $scope.optName = "保存";
        $scope.data.price = $('#price').val();
        // 保存上传图片的路径 用逗号隔开
        // 去除数组中空值
        var tempUrl = $scope.unEmptyList($scope.uploadSuccessImgUrl);
        $scope.data.fileUrls = tempUrl.join(',');
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $scope.stateNewPage = false;
        $scope.initDataTablesName = 'myFleaMarketDataTable';
        $q.all([$scope.postApi($scope)]).then(function () {
            if($scope.data.type) {
                $state.go("myFleaMarketListSale",{type:$scope.data.type});
            }else{
                $state.go("myFleaMarketListPurchase",{type:$scope.data.type});
            }
        });
    };
};
// 详情
angular.module("MetronicApp").controller(
    'fleaMarketViewController',
    ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
        '$stateParams', '$q','$state', fleaMarketViewController]);
function fleaMarketViewController($scope, $http, $compile, $location, $filter,
                                  $timeout, $stateParams, $q, $state) {
    getFleaMarketStatusData($scope, $http, $compile, $location, $filter);
    // 传来的数据为空(页面刷新情况)
    var id;
    if (!$stateParams.id) {
        //id = $scope.getControllerPageId('fleaMarketId');
    }
    else {
        id = $stateParams.id;
        //$scope.setControllerPageId('fleaMarketId', id);
    }
    //获取浏览次数
    $scope.url='updateFleaMarketViewTimesById';
    $scope.params ={'id':id};
    $scope.slideImageWidth = slideImageWidth;
    $scope.slideImageHeight = slideImageHeight;//黄金比例0.618
    $http({
        method: 'POST',
        url: $scope.httpDomain+$scope.url,
        data: $scope.params
    }).success(function (data) {
    });
    getViewDataShow($scope, $http, $compile, $location, $filter);
    //Deal状态弹出框
    $scope.changeStatus = function() {
        var _temp;
        _temp = $scope.data.dealStatus ==='1'?'0':'1';
        $scope.data.dealStatus = _temp;
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeFleaMarketStatus";
        $scope.optName = "修改状态";
        $scope.params = {
            "statusType" : 'dealStatus',
            "id": id
        };
        $scope.postApi($scope, function() {
            $scope.url = 'getFleaMarketList';
            $scope.reloadUrl = 'getFleaMarketList';
            $('#' + $scope.initDataTablesName).DataTable().ajax.reload(function () {}, false);
        });
    };
    //修改状态按钮
    $scope.showModule = function () {
        $('#changeStatusModal').modal();
    };
};
function getViewDataShow($scope, $http, $compile, $location, $filter) {
	$scope.url = "getFleaMarketById";
    $scope.ifAuthorSelf = false;
    $http({
        method: 'POST',
        url: $scope.httpDomain + $scope.url,
        data: $scope.params
    }).success(function (data) {
        $scope.data = data.data;
        var urls;
        if(data.data && data.data.imgUrls && data.data.imgUrls.uploadFileUrl) {
            urls = data.data.imgUrls.uploadFileUrl.split(',');
        }
        if(urls){
        	$scope.data.urls = urls;
        }
        if($scope.loginUser && $scope.loginUser.id && $scope.data && $scope.data.person && $scope.loginUser.id == $scope.data.person.id) {
        	$scope.ifAuthorSelf = true;
        }
    });
};
angular.module("MetronicApp").controller('newsController', ['$scope', '$http', '$compile', '$location', '$filter', newsController]);
function newsController($scope, $http, $compile, $location, $filter) {
    //获取文章分类列表
    $scope.getInforModuleList = function () {
        $http({
            url: $scope.httpDomain + $scope.url,
            method: 'POST',
            data: $scope.params
        }).success(function (data) {
            $scope.inforModuleList = data.data;
            // console.log($scope.inforModuleList);
        })
    };
    // 新闻资讯
    $scope.url = "getInforModuleSelectList";
    $scope.params = {};
    $scope.getInforModuleList();
    //
    //获取文章列表
    $scope.data = {};
    $scope.searchObj = {
        'approvalStatus' :1
    };
    // controller名称初始化
    $scope.controllerName = 'news';
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "inforModule.name"
    }, {
        "data": "title"
    }, {
        "data": "addDateTime"
    }];
    $scope.orderableAry = [0, 1, 2];
    $scope.wrapShortAry = [1];
    $scope.viewNewsAry = [2];
    $scope.order = [[3, "desc"]];
    var url = "getInforPictureList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.searchInit = true;
    $scope.initDataTablesName='newsDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.changeInforModule = function (newsType) {
        $scope.newsType = newsType;
        $scope.searchObj = {};
        if ($scope.newsType != 0) {
            $scope.searchObj = {
                "module": {
                    "id": $scope.newsType,
                    "approvalStatus" :1
                }
            };
        }
        $scope.searchInit = true;
        $('#' + $scope.initDataTablesName).DataTable().ajax.reload(function () {}, true);
    };
};
// 详情
angular.module("MetronicApp").controller('newsViewController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
        '$stateParams', '$q', '$sce', newsViewController]);
function newsViewController($scope, $http, $compile, $location, $filter,
                            $timeout, $stateParams, $q, $sce) {
    // 传来的数据为空(页面刷新情况)
    var id;
    if(!$stateParams.id) {
        //id = $scope.getControllerPageId('newsId');
    }
    else {
        id = $stateParams.id;
        //$scope.setControllerPageId('newsId', id);
    }
    //获取浏览次数
    $scope.url='updateInforPictureViewTimesById';
    $scope.params ={'id':id};
    $http({
        method: 'POST',
        url: $scope.httpDomain+$scope.url,
        data: $scope.params
    }).success(function (data) {
    });
    //获取详情
    $scope.url = "getInforPictureById";
    $scope.params = {"id":id};
    $http({
        method: 'POST',
        url: $scope.httpDomain + $scope.url,
        params: $scope.params
    }).success(function (data) {
        var data = data.data;
        if(data && data.article) {
            data.article = $scope.specialCharChange(data.article);
        }
        $scope.data = data;
    });
    $scope.deliberatelyTrustDangerousSnippet = function(content) {
        return $sce.trustAsHtml(content);
    };
};

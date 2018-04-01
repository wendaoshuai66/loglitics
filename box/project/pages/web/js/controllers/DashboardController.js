angular.module('MetronicApp').controller('DashboardController', ['$rootScope', '$scope', '$http', '$timeout', '$compile', '$location', '$filter', DashboardController]);

function DashboardController($rootScope, $scope, $http, $timeout, $complie, $location, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    var requestUrl;
    if ($rootScope.ifOpenApi) {
        requestUrl = $scope.httpDomain + 'getHomeWebClassifyCount';
    } else {
        requestUrl = 'demo/homeWebClassifyCount.json';
    }
    $http({
        url: requestUrl,
        method: 'POST',
        data: {},
        headers: {
            'logistics-session-token': $scope.getToken()
        }
    }).success(function (data, status, headers, config) {
        $scope.countNameList = ['commonRepairRecordCount', 'specialRepairRecordCount', 'saleCount', 'lostCount', 'purchaseCount', 'foundCount'];
        angular.forEach($scope.countNameList, function (value) {
            $('#' + value).attr("data-value", data.data[value]);
        });
        $scope.startCounterUp();
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    // 开始counterUp动画
    $scope.startCounterUp = function () {
        $("[data-counter='counterup']").counterUp({
            delay: 10,
            time: 1000
        });
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    /////////////////////////////////////////////////////////
    $scope.params = {
        "pageSize": 6,
        "start": 0,
        "pageNumber": 1,
        "order[name]": 'addDateTime',
        "order[dir]": 'desc',
        "searchObj[homeShowFlag]": true,
        "searchObj[approvalStatus]": '1'
    };

    //新闻资讯
    $scope.url = $scope.httpDomain + "getInforPictureList";
    $scope.getInforPictureList = function () {
        $http({
            url: $scope.url,
            method: 'POST',
            data: $scope.params
        }).success(function (data) {
            $scope.newsList = data.data;
        })
    };
    $scope.getInforPictureList();

    $scope.params = {
        "pageSize": 4,
        "start": 0,
        "pageNumber": 1,
        "order[name]": 'addDateTime',
        "order[dir]": 'desc'
    };
    $scope.params.searchObj = {
        approvalStatus :1,
        dealStatus :0
    };
    //失物招领
    $scope.url = $scope.httpDomain + "getLostFoundList";
    $scope.getLostFoundList = function () {
        $http({
            url: $scope.url,
            method: 'POST',
            data: $scope.params
        }).success(function (data) {
            $scope.lostFoundList = data.data;
        })
    };
    $scope.getLostFoundList();

    //跳蚤市场
    $scope.url = $scope.httpDomain + "getFleaMarketList";
    $scope.getFleaMarketList = function () {
        $http({
            url: $scope.url,
            method: 'POST',
            data: $scope.params
        }).success(function (data) {
            $scope.marketList = data.data;
        })
    };
    $scope.getFleaMarketList();

    $scope.params = {
        "pageSize": 10,
        "start": 0,
        "pageNumber": 1,
        "order[name]": 'addDateTime',
        "order[dir]": 'desc'
    };
    //维修服务
    $scope.url = $scope.httpDomain + "getMaintenanceRecord";
    $scope.getMaintenanceCategoryList = function () {
        $http({
            url: $scope.url,
            method: 'POST',
            data: $scope.params
        }).success(function (data) {
            $scope.repairList = data.data;
        })
    };
    $scope.getMaintenanceCategoryList();

    // 建言献策
    $scope.params = {
        "pageSize": 4,
        "start": 0,
        "pageNumber": 1,
        "order[name]": 'addDateTime',
        "order[dir]": 'desc'
    };
    $scope.url = $scope.httpDomain + "getInforTextList";
    $scope.params.searchObj = {
        approvalStatus :1
    };
    $scope.getInforTextList = function () {
        $http({
            url: $scope.url,
            method: 'POST',
            data: $scope.params
        }).success(function (data) {
            $scope.inforTextList = data.data;
        })
    };
    $scope.getInforTextList();
}

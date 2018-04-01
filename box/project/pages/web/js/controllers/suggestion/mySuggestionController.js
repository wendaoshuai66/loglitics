angular.module("MetronicApp").controller('mySuggestionController', ['$scope', '$http', '$compile', '$location', '$filter', mySuggestionController]);
function mySuggestionController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.searchObj={};
    $scope.orderBy = 'addDateTime';
    $scope.orderDir = 'desc';
    $scope.controllerName = 'mySuggestion';
    $scope.myParams ={"searchObj[author][id]":$scope.loginUser.id};
    $scope.url = "getInforTextList";
    // 需要将返回的数据挂载的model名称
    $scope.requestListName = 'suggestionList';
    // 每页几条数据,目前只支持 5跟10
    //$scope.pageSize = 10;
    $scope.initPagination($scope);
};
angular.module("MetronicApp").controller('suggestionAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
    '$stateParams', '$q','$state', suggestionAddController]);
function suggestionAddController($scope, $http, $compile, $location, $filter, $timeout, $stateParams, $q, $state) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function () {
        // 更新数据
        //$scope.addLoading();
        $scope.optName = "保存";
        $scope.url = "saveInforTextFromWeChat";
        $scope.data.author = {"id":$scope.loginUser.id};
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $scope.stateNewPage = false;
        $q.all([$scope.postApi($scope)]).then(function () {
            $state.go("mySuggestionList");
            $scope.initPagination($scope);
        });
    };
};
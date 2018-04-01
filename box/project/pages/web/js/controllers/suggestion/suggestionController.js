angular.module("MetronicApp").controller('suggestionController', ['$scope', '$http', '$compile', '$location', '$filter', suggestionController]);
function suggestionController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.controllerName = 'suggestion';
    $scope.url = "getInforTextList";
    // 需要将返回的数据挂载的model名称
    $scope.orderBy = 'addDateTime';
    $scope.orderDir = 'desc';
    $scope.myParams = {'searchObj[approvalStatus]':1};
    $scope.requestListName = 'suggestionList';
    // 每页几条数据,目前只支持 5跟10
    //$scope.pageSize = 10;
    $scope.initPagination($scope);
};

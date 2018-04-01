angular.module("MetronicApp").controller('serviceController', ['$scope', '$http', '$compile', '$location', '$filter', serviceController]);
function serviceController($scope, $http, $compile, $location, $filter) {
    $scope.url = "getConvenientServiceInfo";
    $scope.params={};
    $scope.getLinkList = function () {
        $http({
            url: $scope.httpDomain + $scope.url,
            method: 'POST',
            data: $scope.params
        }).success(function (data) {
            $scope.serviceList=data.data;
        })
    };
    $scope.getLinkList();
};

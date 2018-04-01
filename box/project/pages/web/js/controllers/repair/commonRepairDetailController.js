angular.module("MetronicApp").controller('commonRepairDetailController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$stateParams', commonRepairDetailController]);
function commonRepairDetailController($scope, $http, $compile, $location, $filter, $q, $stateParams) {
    // 传来的数据为空(页面刷新情况)
    var id;
    if(!$stateParams.id) {
        //id = $scope.getControllerPageId('commonRepairId');
    }
    else {
        id = $stateParams.id;
        //$scope.setControllerPageId('commonRepairId', id);
    }
    $http({
        url: $scope.httpDomain + "getMaintenanceRecordById",
        method: 'POST',
        data: {id:id},
        headers: {
        'logistics-session-token': $scope.getToken()
    }
    }).success(function (data) {
        $scope.data = data.data;
    });

};
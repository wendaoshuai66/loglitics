angular.module("MetronicApp").controller('specialRepairController', ['$scope', '$http', '$compile', '$location', '$filter', specialRepairController]);
function specialRepairController($scope, $http, $compile, $location, $filter) {
    $scope.data = {};
    $scope.controllerName = 'specialRepair';
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "maintenanceNumber"
    }, {
        "data": "maintenanceSpecial.department.campus.name"
    }, {
        "data": "maintenanceAreaName"
    }, {
        "data": "address"
    }, {
        "data": "maintenanceItemName"
    }, {
        "data": "maintenanceContent"
    }, {
        "data": "maintenanceStartDateTime"
    }, {
        "data": "maintenanceEndDateTime"
    }, {
        "data": "maintenanceSpecial.department.name"
    }, {
        "data": "maintenanceStaff.name"
    }, {
        "data": "maintenanceStaff.tel"
    }, {
        "data": "maintenanceTime"
    //}, {
    //    "data": "maintenanceSpecial.ifDone"
    //}, {
    //    "data": "maintenanceSpecial.progressDescription"
    }];
    $scope.orderableAry = [1,2,5,8,9,10,11,12];
    $scope.viewSpecialRepairAry = [1];
    $scope.order = [[7, "desc"]];
    $scope.wrapAry = [2,5,9];
    $scope.wrapShortAry = [10];
    $scope.dateFormatAry = [7, 8];
    //$scope.targetsOpt = 13;
    //$scope.optHtmlAry = ["detail"];
    var url = "getSpecialMaintenance";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName='specialRepairDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 查询按钮响应
    $scope.search = function () {
        $scope.searchInfo($scope);
    };
    $scope.reset = function () {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
};

angular.module("MetronicApp").controller('specialRepairViewController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
    '$stateParams', '$q', '$sce','$state', specialRepairViewController]);
function specialRepairViewController($scope, $http, $compile, $location, $filter,
                            $timeout, $stateParams, $q, $sce,$state) {
    // 传来的数据为空(页面刷新情况)
    var id;
    if(!$stateParams.id) {
        //id = $scope.getControllerPageId('specialRecordId');
    }
    else {
        id = $stateParams.id;
        //$scope.setControllerPageId('specialRecordId', id);
    }
    $scope.selectUrl = 'getSpecialMaintenanceById';
    $scope.selectParams = {"id":id};
    $scope.selectPara = 'data';
    $q.all([ $scope.getSelectInfoApi($scope)]).then(function () {
    	$scope.initDataTable();
    });
    $scope.controllerName = 'specialRepairView';
    $scope.initDataTable = function () {
        // 列表数据初始化
        $scope.columns = [{
            "data": "id"
        }, {
            "data": "material.name"
        }, {
            "data": "material.specificationsModel"
        }, {
            "data": "material.materialCategory.name"
        }, {
            "data": "warrantyNumber.maintenanceNumber"
        }, {
            "data": "stockRemovalCount"
        }, {
            "data": "material.materialUnit.name"
        }, {
            "data": "stockRemovalDate"
        }, {
            "data": "warrantyNumber.maintenanceStaff.name"
        }, {
            "data": "addDateTime"
        }];
        $scope.orderableAry = [0, 1, 2, 3, 5, 6];
        $scope.wrapAry = [1, 2, 3, 4];
        $scope.wrapShortAry = [6];
        //$scope.targetsOpt = 10;
        $scope.nullStr = [8];
        $scope.dateFormatAry = [7, 9];
        $scope.order = [[7, "desc"]];
        var url = "getStockRemovalList";
        $scope.url = url;
        $scope.reloadUrl = url;
        // 默认只查询该单号下的出库记录
        $scope.searchObj = {
            warrantyNumber: {
                maintenanceNumber: $scope.data.maintenanceNumber
            }
        };
        dataTables.init($scope, $http, $compile, $location, $filter);
    };
};

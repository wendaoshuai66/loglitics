angular.module("MetronicApp").controller('stockRemovalController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$state',
    stockRemovalController]);
function stockRemovalController($scope, $http, $compile, $location, $filter, $q, $state) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'stockRemoval';
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2'];
    // 下拉框数据初始化
    $q.all([getMaterialCategorySelectData($scope, $http, $compile, $location, $filter)]).then(function () {
        return getMaterialSelectData($scope, $http, $compile, $location, $filter);
    }).then(function () {
        return getWarrantyNumberIsDoneSelectData($scope, $http, $compile, $location, $filter);
    });
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
        "data": "material.materialUnit.name"
    }, {
        "data": "warrantyNumber.maintenanceNumber"
    }, {
        "data": "stockRemovalCount"
    }, {
        "data": "stockRemovalDate"
    }, {
        "data": "warrantyNumber.maintenanceStaff.name"
    }, {
        "data": "addDateTime"
    }];
    $scope.newState = $state;
    $scope.orderableAry = [0];
    $scope.wrapAry = [1, 2, 3];
    $scope.wrapShortAry = [5, 8];
    $scope.targetsOpt = 10;
    //$scope.nullStr = [8];
    $scope.dateFormatAry = 7;
    $scope.order = [[7, "desc"]];
    $scope.optHtmlAry = ["detail", "remove"];//, "print"
    var url = "getStockRemovalList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'stockRemovalDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.searchInit = true;
    $scope.datetimepickerId = ['stockRemovalDate'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    //$scope.resetInputList = ['positiveInteger'];
    $scope.resetInputList = ['stockRemovalCount'];
    // 添加页面
    $scope.addModal = function () {
        $("#stockRemovalCount").attr("disabled", "disabled");
        $scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加出库信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function (data) {
        $scope.data = data;
        $scope.modalTitle = '修改出库信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function () {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteStockRemoval";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 查询按钮响应
    $scope.search = function () {
        $scope.searchInfo($scope);
    };
    $scope.reset = function () {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('stockRemovalDateEnd', 'stockRemovalDateStart');
    };
    // 监听物料下拉框修改
    $scope.selectMaterial = function () {
        // 深复制一个对象
        var materialList = angular.copy($scope.materialSelectData);
        angular.forEach(materialList, function (val) {
            if (val.id == $scope.data.material.id) {
                $scope.data.material = val;
                $scope.maxCount = $scope.data.material.inventoryQuantity;
                $scope.maxLength = $scope.maxCount + "".length;
                // 限制最大出库个数
                $("#stockRemovalCount").attr("max", $scope.maxCount);
                // $("#stockRemovalCount").attr("maxlength", $scope.maxLength);
                $("#stockRemovalCount").removeAttr("disabled");
            }
            if ($scope.data.material.id == null) {
                $scope.data.material = null;
                $("#stockRemovalCount").attr("disabled", "disabled");
            }
        });
    };
    // 监听维修单号下拉框修改
    $scope.selectWarrantyNumber = function () {
        // 深复制一个对象
        var warrantyNumberList = angular.copy($scope.warrantyNumberSelectData);
        angular.forEach(warrantyNumberList, function (val) {
            if (val.id == $scope.data.warrantyNumber.id) {
                $scope.data.warrantyNumber = val;
            }
            if ($scope.data.warrantyNumber.id == null) {
                $scope.data.warrantyNumber = null;
            }
        });
    };
    // 检验输入
    $scope.checkMaxCount = function () {
        if ($scope.data.stockRemovalCount > $scope.maxCount) {
            sweetAlert("警告", "最大可出库数量为:" + $scope.maxCount + "个", "error");
            $scope.maxCountError = true;
        } else {
            $scope.maxCountError = false;
        }
    };
};
angular.module("MetronicApp").controller('stockRemovalAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
    stockRemovalAddController]);
function stockRemovalAddController($scope, $http, $compile, $location, $filter, $q) {
    $scope.searchInit = false;
    $scope.option = {
        format: "yyyy-mm-dd",
        minView: 2,
        endDate: new Date()
    };
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 保存按钮响应
    $scope.save = function () {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveStockRemoval";
        // 修改
        if ($scope.data.id !== undefined) {
            $scope.optName = "修改";
        }
        // 添加
        else {
            $scope.dataRefresh = true;
            $scope.optName = "添加";
        }
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $q.all([$scope.postApi($scope)]).then(function () {
            return $scope.getMaterialLessAlarmInfo()
        }).then(function(){
            getMaterialSelectData($scope.getScope('stockRemoval'), $http, $compile, $location, $filter);
        });
    };
};


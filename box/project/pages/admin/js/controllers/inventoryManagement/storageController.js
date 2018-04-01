angular.module("MetronicApp").controller('storageController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$state', storageController]);
function storageController($scope, $http, $compile, $location, $filter, $q, $state) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'storage';
    // 下拉框id初始化
    $scope.selectIdList = ['select'];
    // 下拉框数据初始化
    $q.all([getMaterialCategorySelectData($scope, $http, $compile, $location, $filter)]).then(function () {
        return getMaterialSelectData($scope, $http, $compile, $location, $filter);
    });
    $scope.newState = $state;
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
        "data": "storageDocuments"
    }, {
        "data": "storageCount"
    }, {
        "data": "price"
    }, {
        "data": "totalPrice"
    }, {
        "data": "storageDate"
    }, {
        "data": "storagePerson"
    }, {
        "data": "addDateTime"
    }];
    $scope.orderableAry = [0];
    $scope.wrapAry = [1, 2, 3];
    $scope.wrapShortAry = [5];
    $scope.targetsOpt = 12;
    $scope.dateFormatAry = 9;
    $scope.order = [[9, "desc"]];
    $scope.optHtmlAry = ["detail", "remove"];//, "print"
    var url = "getStorageList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'storageDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.searchInit = true;
    $scope.datetimepickerId = ['storageDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    //$scope.resetInputList = ['documents', 'personName', 'positiveInteger', 'doubleNumber', 'twoDecimal'];
    $scope.resetInputList = ['storageDocuments', 'storagePerson', 'storageCount'];
    // 添加页面
    $scope.addModal = function () {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加入库信息';
        $("#price2").val('1.00');
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function (data) {
        //$scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.data = data;
        $scope.modalTitle = '修改入库信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function () {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteStorage";
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
        $scope.resetDateTimePicker('storageDateTimeEnd', 'storageDateTimeStart');
    };
    // 监听下拉框修改
    $scope.selectMaterial = function () {
        // 深复制一个对象
        var materialList = angular.copy($scope.materialSelectData);
        angular.forEach(materialList, function (val) {
            if (val.id == $scope.data.material.id) {
                $scope.data.material = val;
            }
            if ($scope.data.material.id == null) {
                $scope.data.material = null;
            }
        });
    };
    // 出库个数监听
    $scope.checkCountNum = function () {
        if (!$scope.data.storageCount.match(/^[0-9]*[1-9][0-9]*$/)) {
            sweetAlert("警告", "只能输入正整数！", "error");
            $scope.data.storageCount = null;
            $scope.countError = true;
        } else {
            $scope.countError = false;
        }
    };
};
angular.module("MetronicApp").controller('storageAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
    storageAddController]);
function storageAddController($scope, $http, $compile, $location, $filter, $q) {
    priceConfig();
    // 将子scope修改为false，防止父datePicker初始化配置影响子配置
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
        $scope.url = "saveStorage";
        $scope.data.price = $('#price2').val();
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
        }).then(function () {
            getMaterialSelectData($scope.getScope('storage'), $http, $compile, $location, $filter);
        });
    };
    // 监听需要检查是否重复项
    $scope.checkRepeat = function () {
        $scope.repeatName = "物料名称";
        $scope.repeatUrl = "checkRepeatStorage";
        $scope.checkRepeatName = "documents";
        $scope.checkRepeatApi($scope);
    };
    // 监听单价,生产总价
    $("#price2").on("change", function () {
        if ($(this).val() == "") {
            $(this).attr("value", "1.00");
        }
        var price = $(this).val();
        $scope.$apply(function () {
            var num = 0;
            if ($scope.data.storageCount) {
                num = $scope.data.storageCount;
            }
            $scope.data.totalPrice = $scope.exactMul(price, num);
        });
    });
    $scope.$watch('data.storageCount', function (newValue) {
        if (!newValue) {
            newValue = 0;
        }
        $scope.data.totalPrice = $scope.exactMul($("#price2").val(), newValue);
    });
};


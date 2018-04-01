angular.module("MetronicApp").controller('materialController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', materialController]);
function materialController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'material';
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2'];
    // 下拉框数据初始化
    // 防止多次发送Ajax请求，数据绑定错误或者第二次请求冲掉第一次数据($scope上绑定的$scope.selectPara会使用最后一次的值),
    // 使用AngularJS内置的promise实现$q，链式调用即可，执行完MaterialCategory再去执行MaterialUnit
    $q.all([getMaterialCategorySelectData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getMaterialUnitSelectData($scope, $http, $compile, $location, $filter)
    });
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "name"
    }, {
        "data": "specificationsModel"
    }, {
        "data": "materialCategory.name"
    }, {
        "data": "inventoryQuantity"
    }, {
        "data": "materialUnit.name"
    }, {
        "data": "alarmValue"
    }, {
        "data": "custodian"
    }, {
        "data": "storageLocation"
    }, {
        "data": "remarks"
    }, {
        "data": "status"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }];
    $scope.orderableAry = [0, 5];
    $scope.wrapAry = [1, 2];
    $scope.wrapShortAry = [3, 5];
    $scope.htmlType = [9];
    //$scope.dateFormatMonthDay = [11];
    $scope.switchStatus = 10;
    $scope.targetsOpt = 13;
    $scope.order = [[11, "desc"]];
    $scope.optHtmlAry = ["detail", "edit"];//, "print", "remove"
    var url = "getMaterialList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'materialDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    //$scope.resetInputList = ['name', 'modelName', 'personName', 'positiveInteger', 'address'];
    $scope.resetInputList = ['name', 'specificationsModel', 'custodian', 'alarmValue', 'storageLocation'];
    // 添加页面
    $scope.addModal = function() {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加物料信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
        $scope.data = data;
        $scope.modalTitle = '修改物料信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteMaterial";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $q.all([$scope.postApi($scope)]).then(function() {
            return $scope.getMaterialLessAlarmInfo();
        });
    };
    // 修改状态确认按钮响应
    $scope.changeStatus = function() {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeMaterialStatus";
        $scope.optName = "修改物料状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $q.all([$scope.postApi($scope)]).then(function() {
            return $scope.getMaterialLessAlarmInfo();
        });
    };
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter)
    };
}
angular.module("MetronicApp").controller('materialAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
        materialAddController]);
function materialAddController($scope, $http, $compile, $location, $filter, $q) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveMaterial";
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
        $q.all([$scope.postApi($scope)]).then(function() {
            return $scope.getMaterialLessAlarmInfo();
        });
    };
    // 监听需要检查是否重复项
    $scope.checkRepeat = function() {
        $scope.repeatName = "物料名称";
        $scope.repeatUrl = "checkRepeatMaterial";
        $scope.checkRepeatName = "name";
        $scope.checkRepeatApi($scope);
    };
    // 监听阈值输入
    $scope.getAlarmValue = function() {
        if ($scope.data.alarmValue > $scope.maxAlarmValue) {
            sweetAlert("警告", "最大可设置的阈值为:" + $scope.maxAlarmValue, "error");
            $scope.alarmValueError = true;
        } else {
            $scope.alarmValueError = false;
        }
    }
}

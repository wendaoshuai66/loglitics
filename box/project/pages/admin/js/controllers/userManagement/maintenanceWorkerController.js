angular.module("MetronicApp").controller('maintenanceWorkerController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$rootScope',
        maintenanceWorkerController]);
function maintenanceWorkerController($scope, $http, $compile, $location, $filter, $q, $rootScope) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch', 'selectSearch2', 'selectSearch3'];
    // controller名称初始化
    $scope.controllerName = 'maintenanceWorker';
    $rootScope.select2InitCountolerName = 'maintenanceWorker';
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2', 'select3'];
    // 下拉框数据初始化
    $q.all([getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getSexTypeData($scope, $http, $compile, $location, $filter);
    }).then(function() {
        return getPositionStatusData($scope, $http, $compile, $location, $filter);
    }).then(function () {
        return getCampusSelectData($scope, $http, $compile, $location, $filter);
    });
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "account"
    }, {
        "data": "name"
    }, {
        "data": "weChatOpenId"
    }, {
        "data": "sex"
    }, {
        "data": "maintenanceWorker.department.campus.name"
    }, {
        "data": "maintenanceWorker.department.name"
    }, {
        "data": "maintenanceWorker.maintenanceType.name"
    }, {
        "data": "tel"
    }, {
        "data": "status"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }, {
        "data": "lastLoginDateTime"
    }, {
        "data": "idCardNum"
    }, {
        "data": "approvalStatus"
    }, {
        "data": "approvalDateTime"
    }];
    $scope.orderableAry = [0];
    $scope.targetsOpt = 16;
    $scope.wrapShortAry = [2, 5,6, 7];
    $scope.sexType = 4;
    $scope.switchStatus = 9;
    $scope.approvalStatus = 14;
    $scope.order = [[10, "desc"]];
    $scope.optHtmlAry = ["detail", "edit", "remove", "resetPsw"];
    var url = "getMaintenanceWorkerList";
    $scope.url = url;
    $scope.reloadUrl = url;
    // 解决 dataTables 自己生成的分页id重复导致 点击维修人员table实际分页切换教师
    $scope.initDataTablesName = 'maintenanceWorkerDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    //$scope.resetInputList = ['registerName', 'personName', 'idCardNum', 'phoneNum'];
    $scope.resetInputList = ['account', 'name', 'tel', 'idCardNum'];
    // 添加页面
    $scope.addModal = function() {
    	$scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加维修人员信息';
        $scope.data.status = "1";
        $scope.data.approvalStatus = "1";
        $scope.data.sex = "1";
        $scope.data.password = "123456";
        $scope.data.confirmPassword = "123456";
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $scope.addInfo = true;
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
        $scope.data = data;
        $scope.departmentId = data.maintenanceWorker.department.id;
        $scope.getDepartmentList(function () {
            $.extend(true, $scope.data.maintenanceWorker.department, {
                id: $scope.departmentId
            });
        });
        $scope.modalTitle = '修改维修人员信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $scope.addInfo = false;
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteMaintenanceWorker";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    // 修改状态确认按钮响应
    $scope.changeStatus = function() {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeMaintenanceWorkerStatus";
        $scope.optName = "修改维修人员状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
    // 重置密码确认按钮响应
    $scope.resetPsw = function() {
        $('#resetPswModal').modal('hide');
        $scope.addLoading();
        $scope.url = "resetPswMaintenance";
        $scope.optName = "重置用户密码";
        $scope.params = {
            "id": $scope.resetPswId
        };
        $scope.postApiNoReload($scope);
    };
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter)
    };
    // 获取部门列表信息(维修部门全部部门)
    $scope.getDepartmentList = function (callback, campusId) {
        $scope.selectParams = {
            "getAll":false,
            "ifLogistics": 1,
            "campusId": !campusId ? $scope.data.maintenanceWorker.department.campus.id : $scope.searchObj.maintenanceWorker.department.campus.id
        };
        $q.all([getDepartmentSelectData($scope, $http, $compile, $location, $filter)])
            .then(function () {
                $rootScope.getLevelListFromDepartment($scope);
                if(callback) callback();
            });
    };
    // 监听校区下拉框修改
    $scope.selectCampus = function () {
        $scope.getDepartmentList();
    };
    // 监听部门下拉框修改
    $scope.selectDepartment = function() {
        // 深复制一个对象
        var departmentList = angular.copy($scope.departmentSelectData);
        var campusId = $scope.data.maintenanceWorker.department.campus.id;
        angular.forEach(departmentList, function(val) {
            if (val.id == $scope.data.maintenanceWorker.department.id) {
                $scope.data.maintenanceWorker.department = val;
            }
            if ($scope.data.maintenanceWorker.department.id == null) {
                $scope.data.maintenanceWorker.department = {};
            }
        });
        $.extend(true, $scope.data.maintenanceWorker.department, {
            'campus': {
                'id': campusId
            }
        });
    };
    // 监听工种下拉框修改
    $scope.selectMaintenanceType = function() {
        // 深复制一个对象
        var maintenanceTypeList = angular.copy($scope.maintenanceTypeSelectData);
        angular.forEach(maintenanceTypeList, function(val) {
            if (val.id == $scope.data.maintenanceWorker.maintenanceType.id) {
                $scope.data.maintenanceWorker.maintenanceType = val;
            }
            if ($scope.data.maintenanceWorker.maintenanceType.id == null) {
                $scope.data.maintenanceWorker.maintenanceType = {};
            }
        });
    };
};
angular.module("MetronicApp").controller('maintenanceWorkerAddController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceWorkerAddController]);
function maintenanceWorkerAddController($scope, $http, $compile, $location, $filter) {
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveMaintenanceWorker";
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
        $scope.postApi($scope);
    };
    // 监听需要检查是否重复项
    $scope.checkRepeat = function() {
        $scope.repeatName = "工号";
        $scope.repeatUrl = "checkRepeatAccount";
        $scope.checkRepeatName = "account";
        $scope.checkRepeatApi($scope);
    };
};


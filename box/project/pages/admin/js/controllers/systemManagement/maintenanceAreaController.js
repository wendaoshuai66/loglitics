angular.module("MetronicApp").controller('maintenanceAreaController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$rootScope',
        maintenanceAreaController]);
function maintenanceAreaController($scope, $http, $compile, $location, $filter, $q, $rootScope) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.data.maintenanceType = [];
    // 未保存工种 以及 多人关系时使用,如果使用工种与人员多选 注释掉
    $scope.selectIdList = ['select', 'select2'];
    // controller名称初始化
    $scope.controllerName = 'maintenanceArea';
    $rootScope.select2InitCountolerName = 'maintenanceArea';
    // 单选框初始化
    $q.all([getStatusUseTypeData($scope, $http, $compile, $location, $filter)]).then(function() {
        //return getWorkerSelectData($scope, $http, $compile, $location, $filter);
    //}).then(function() {
        return getCampusSelectData($scope, $http, $compile, $location, $filter);
    });

    $scope.getMultipleSelect = function() {
        if ($scope.ifOpenApi) {
            var deferred = $q.defer();
            $scope.selectIdList = ['select', 'select2'];
            $http({
                url: $scope.httpDomain + "getMaintenanceTypeSelectList",
                method: 'POST'
            }).success(function(data) {
                if (data.data != null) {
                    // 动态拼接多选框的表单name
                    $scope.maintenanceTypeSelectData = data.data;
                    angular.forEach(data.data, function(value) {
                        $scope.maintenanceTypeList = data.data;
                        var multipleSelectTemp = "multipleSelect" + value["id"];
                        $scope.selectIdList.push(multipleSelectTemp);
                    });
                } else {
                    sweetAlert("警告", $scope.selectOptName + "失败！", "error");
                }
                // 首次进入把手动添加的错误提示边框去除
                angular.forEach($scope.selectIdList, function(value) {
                    var select = $('#' + value).next().children().children();
                    select.removeClass("errorSelect");
                });
                // 取出工种列表
                var maintenanceTypes = angular.copy($scope.maintenanceTypeSelectData);
                // 取出维修人员列表
                var workers = angular.copy($scope.workerSelectData);
                angular.forEach(maintenanceTypes, function(maintenanceType) {
                    $scope['workerSelectData' + maintenanceType.id] = [];
                    angular.forEach(workers, function(worker) {
                        if (worker.maintenanceWorker.maintenanceType.id == maintenanceType.id) {
                            $scope['workerSelectData' + maintenanceType.id].push(worker);
                        }
                    });
                });
                $scope.triggerSelect($scope, $http, $compile, $location, $filter);
                $scope.resetForm($scope, $http, $compile, $location, $filter);
            }).error(function() {
                sweetAlert("警告", $scope.selectOptName + "异常！", "error");
            })
            return deferred.promise;
        }
    };

    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "name"
    }, {
        "data": "campus.name"
    }, {
        "data": "description"
    }, {
        "data": "department.name"
    }, {
        "data": "status"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }];
    $scope.orderableAry = [0];
    $scope.wrapAry = [1, 2,4];
    $scope.htmlType = [3];
    $scope.switchStatus = 5;
    $scope.targetsOpt = 8;
    $scope.order = [[6, "desc"]];
    $scope.optHtmlAry = ["detail", "edit", "remove"];
    var url = "getMaintenanceAreaList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'maintenanceAreaDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.resetInputList = ['name'];
    // 添加页面
    $scope.addModal = function() {
        $scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加维修区域信息';
        $scope.data.status = "1";
        // $scope.getMultipleSelect();
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function(data) {
        var department = data.department;
        // $scope.getMultipleSelect();
        $scope.data = data;
        $scope.modalTitle = '修改维修区域信息';
        $scope.changeCampus(function () {
            $scope.data.department = department;
            $scope.triggerSelect($scope, $http, $compile, $location, $filter);
            $scope.resetForm($scope, $http, $compile, $location, $filter);
        });
        $('#addModal').modal();
    };
    // 树结构页面
    $scope.treeModal = function() {
        $scope.treeUrl = 'getCampusAreaTreeList';
        getTrees($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '维修区域结构树';
        $('#treeModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteMaintenanceArea";
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
        $scope.url = "changeMaintenanceAreaStatus";
        $scope.optName = "修改区域状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
    // 修改校区下拉框动态修改部门下拉框信息（且只能选择维修部门）
    $scope.changeCampus = function (callback) {
        // 获取到子scope
        var childScope = $scope.getScope('maintenanceAreaAdd');
        var campusId = childScope.data.campus.id;
        $scope.selectParams = {
            "campusId": campusId,
            "ifLogistics": 1
        };
        $q.all([getDepartmentSelectData($scope, $http, $compile, $location, $filter)])
            .then(function () {
                $rootScope.getLevelListFromDepartment($scope);
                if(callback) callback();
                    // 重新校验部门名称是否重复
                    childScope.checkRepeat();
                }
            );
    }
};
angular.module("MetronicApp").controller('maintenanceAreaAddController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceAreaAddController]);
function maintenanceAreaAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 针对动态生成的多选框增加删除红色边框样式
    $scope.multipleSelectChange = function(t) {
        var select = $('#' + t).next().children().children();
        if (!$scope.myForm[t].$valid) {
            select.addClass("errorSelect");
        } else {
            select.removeClass("errorSelect");
        }
    };
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveMaintenanceArea";
        // 修改
        if ($scope.data.id !== undefined) {
            // 删除掉后端model生成的set对象
            delete $scope.data.maintenanceAreaWorkers;
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
        $scope.repeatName = "区域名称";
        $scope.repeatUrl = "checkRepeatMaintenanceArea";
        $scope.checkRepeatName = "name";
        delete $scope.params;
        $scope.checkRepeatApi($scope);
    };
};
angular.module("MetronicApp").controller('maintenanceAreaTreeController', ['$scope', '$http', '$compile', '$location', '$filter',
        maintenanceAreaTreeController]);
function maintenanceAreaTreeController($scope, $http, $compile, $location, $filter) {

};
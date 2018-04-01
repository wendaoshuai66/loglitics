angular.module("MetronicApp").controller('departmentController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$rootScope',
    departmentController]);

function departmentController($scope, $http, $compile, $location, $filter, $q, $rootScope) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'department';
    $rootScope.select2InitCountolerName = 'department';
    // 单选框初始化
    $q.all([getCampusSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
        return getStatusUseTypeData($scope, $http, $compile, $location, $filter);
    }).then(function () {
        return getShowStatusData($scope, $http, $compile, $location, $filter);
    });
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2'];
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "name"
    }, {
        "data": "campus.name"
    }, {
        "data": "parent.name"
    }, {
        "data": "ifLogistics"
    }, {
        "data": "description"
    }, {
        "data": "status"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }];
    $scope.orderableAry = [0, 3];
    $scope.trueOrFalse = [4];
    $scope.htmlType = [5];
    $scope.switchStatus = 6;
    $scope.wrapAry = [1, 2, 3];
    $scope.targetsOpt = 9;
    $scope.order = [[7, "desc"]];
    $scope.optHtmlAry = ["detail", "edit", "remove"];
    var url = "getDepartmentList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'departmentDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // 添加页面
    $scope.resetInputList = ['name'];
    // 针对addModel与editModel会触发父级部门下拉框从而进入到修改ifLogistics
    // 增加一项判断，如果为模态框打开model值改变修改了父部门下拉框，跳出即可
    $scope.changeIfLogistics = false;
    $scope.addModal = function () {
        $scope.isEdit = false;
        $scope.changeIfLogistics = true;
        $scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加部门信息';
        $scope.data.status = "1";
        $scope.data.ifLogistics = "1";
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改页面
    $scope.editModal = function (data) {
        $scope.isEdit = true;
        $scope.changeIfLogistics = true;
        $scope.parentId = data.parent.id;
        $scope.data = data;
        $scope.changeCampus(function () {
            // 全部的部门下拉框，因为是上下级关系，所以按照正常逻辑是不能将上级部门修改成自己的。所以需要将自己去掉
            var departmentSelectDataAll = $scope.departmentSelectData;
            angular.forEach(departmentSelectDataAll, function (value) {
                if (value.name == $scope.data.name) {
                    departmentSelectDataAll.splice($.inArray(value, departmentSelectDataAll), 1);
                }
            });
            $scope.data.parent.id = $scope.parentId;
        });
        $scope.modalTitle = '修改部门信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 树结构页面
    $scope.treeModal = function () {
        // 树结构页面数据初始化
        $scope.treeUrl = 'getDepartmentTreeList';
        getTrees($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '部门结构树';
        $('#treeModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function () {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteDepartment";
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
    // 修改状态确认按钮响应
    $scope.changeStatus = function () {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.selectUrl = 'getDepartmentParentStatusFromId';
        $scope.selectParams = {
            id: $scope.changeStatusNowId
        };
        $scope.selectPara = 'parentStatus';
        $q.all([($scope.getSelectInfoApi($scope))]).then(function () {
            if($scope['parentStatus'] == 0) {
                sweetAlert("警告", "请先将该部门的父部门启用再执行后续操作!", "warning");
                $scope.removeLoading();
                return;
            }
            $scope.url = "changeDepartmentStatus";
            $scope.optName = "修改部门状态";
            $scope.params = {
                "statusType": $scope.changeStatusType,
                "id": $scope.changeStatusId
            };
            $scope.postApi($scope);
        });
    };
    $scope.reset = function () {
        $scope.resetSearch($scope, $http, $compile, $location, $filter)
    };
    // 监听部门状态的修改
    // 主要针对部门从禁用设置到启用查看其父部门的状态(父部门为启用即可启用,否则提示)
    $scope.changeDepartmentStatus = function () {
        var status = $scope.data.status;
        if(status == 1) {
            if($scope.data.parent.status == 0) {
                sweetAlert("警告", "请先将该部门的父部门启用再执行后续操作!", "warning");
                $scope.data.status = 0;
            }
        }
    };
    $scope.IfParentIsLogistics = "";
    // 修改上级部门状态，通过上级部门的部门类型，决定是否后勤部门单选框的显示状态
    $scope.changeParentDepartment = function () {
        if($scope.changeIfLogistics) {
            $scope.changeIfLogistics = false;
            return;
        }
        // 如果不为空，是否后勤部门单选框状态改变
        if ($scope.data.parent.id != null) {
            $scope.getIfLogisticsFromId($scope.data.parent.id);
            // 是后勤部门
            if ($scope.parent.ifLogistics == 1) {
                $scope.data.ifLogistics = "1";
                $scope.IfParentIsLogistics = "1";
            } else {
                $scope.data.ifLogistics = "0";
                $scope.IfParentIsLogistics = "0";
            }
        }
        // 是否后勤部门单选框状态还原
        else {
            $scope.data.ifLogistics = "1";
        }
    };

    $scope.getIfLogisticsFromId = function (id) {
        angular.forEach($scope.departmentSelectData, function (value) {
            if (value.id == id) {
                $scope.parent = value;
            }
        });
    };
    // 修改校区下拉框动态修改部门下拉框信息
    $scope.changeCampus = function (callback) {
        // 获取到子scope
        var childScope = $scope.getScope('departmentAdd');
        var campusId = childScope.data.campus.id;
        $scope.selectParams = {
            "campusId": campusId
        };
        $q.all([getDepartmentSelectData($scope, $http, $compile, $location, $filter)])
            .then(function () {
                $rootScope.getLevelListFromDepartment($scope);
                    if (callback) callback();
                // 重新校验部门名称是否重复
                childScope.checkRepeat();
                }
            );
    }
}

angular.module("MetronicApp").controller('departmentAddController', ['$scope', '$http', '$compile', '$location', '$filter',
    departmentAddController]);

function departmentAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 保存按钮响应
    $scope.save = function () {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveDepartment";
        // 修改
        if ($scope.data.id !== undefined) {
            $scope.optName = "修改";
            // 将parent对象只保留其中的id映射
            var parentId = $scope.data.parent.id;
            delete $scope.data.parent;
            $scope.data.parent = {
                id: parentId
            }
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
    $scope.checkRepeat = function () {
        $scope.repeatName = "部门名称";
        $scope.repeatUrl = "checkRepeatDepartment";
        $scope.checkRepeatName = "name";
        delete $scope.params;
        $scope.checkRepeatApi($scope);
    };

}

angular.module("MetronicApp").controller('departmentTreeController', ['$scope', '$http', '$compile', '$location', '$filter',
    departmentTreeController]);

function departmentTreeController($scope, $http, $compile, $location, $filter) {

}
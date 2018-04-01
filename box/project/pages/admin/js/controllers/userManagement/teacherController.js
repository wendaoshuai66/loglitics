angular.module("MetronicApp").controller('teacherController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$rootScope', teacherController]);

function teacherController($scope, $http, $compile, $location, $filter, $q, $rootScope) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch', 'selectSearch2', 'selectSearch3'];
    // controller名称初始化
    $scope.controllerName = 'teacher';
    // 配置树形下拉框定位
    $rootScope.select2InitCountolerName = 'teacher';
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2', 'select3'];
    // 下拉框数据初始化
    $q.all([getPositionStatusData($scope, $http, $compile, $location, $filter)]).then(function () {
        return getPositionSelectData($scope, $http, $compile, $location, $filter);
    }).then(function () {
        return getSexTypeData($scope, $http, $compile, $location, $filter);
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
        "data": "teacher.department.campus.name"
    }, {
        "data": "teacher.department.name"
    }, {
        "data": "teacher.position.name"
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
    var url = "getTeacherList";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'teacherDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    // $scope.resetInputList = ['registerName', 'personName', 'idCardNum', 'phoneNum'];
    $scope.resetInputList = ['account', 'name', 'tel', 'idCardNum'];
    // 添加页面
    $scope.addModal = function () {
        $scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加教职人员信息';
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
    $scope.editModal = function (data) {
        $scope.data = data;
        $scope.departmentId = data.teacher.department.id;
        $scope.getDepartmentList(function () {
            $.extend(true, $scope.data.teacher.department, {
                id: $scope.departmentId
            });
        });
        $scope.modalTitle = '修改教职人员信息';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $scope.addInfo = false;
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function () {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteTeacher";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 重置密码确认按钮响应
    $scope.resetPsw = function () {
        $('#resetPswModal').modal('hide');
        $scope.addLoading();
        $scope.url = "resetPswTeacher";
        $scope.optName = "重置用户密码";
        $scope.params = {
            "id": $scope.resetPswId
        };
        $scope.postApiNoReload($scope);
    };
    // 查询按钮响应
    $scope.search = function () {
        $scope.searchInfo($scope);
    };
    // 修改状态确认按钮响应
    $scope.changeStatus = function () {
        $('#changeStatusModal').modal('hide');
        $scope.addLoading();
        $scope.url = "changeTeacherStatus";
        $scope.optName = "修改教职人员状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope);
    };
    $scope.reset = function () {
        $scope.resetSearch($scope, $http, $compile, $location, $filter)
    };
    // 获取部门列表信息(非维修部门全部部门)
    $scope.getDepartmentList = function (callback, campusId) {
        $scope.selectParams = {
            "getAll": false,
            "ifLogistics": 0,
            // 列表查询框与添加修改模态框下拉框公用，第二个参数为列表查询框传入校区id
            "campusId": !campusId ? $scope.data.teacher.department.campus.id : $scope.searchObj.teacher.department.campus.id
        };
        $q.all([getDepartmentSelectData($scope, $http, $compile, $location, $filter)])
            .then(function () {
                $rootScope.getLevelListFromDepartment($scope);
                if (callback) callback();
            });
    };
    // 监听校区下拉框修改
    $scope.selectCampus = function () {
        $scope.getDepartmentList();
    };
    // 监听部门下拉框修改
    $scope.selectDepartment = function () {
        // 深复制一个对象
        var departmentList = angular.copy($scope.departmentSelectData);
        // 取出已经选中的校区id
        var campusId = $scope.data.teacher.department.campus.id;
        angular.forEach(departmentList, function (val) {
            if (val.id == $scope.data.teacher.department.id) {
                $scope.data.teacher.department = val;
            }
            if ($scope.data.teacher.department.id == null) {
                $scope.data.teacher.department = {};
            }
        });
        $.extend(true, $scope.data.teacher.department, {
            'campus': {
                'id': campusId
            }
        });
    };
    // 监听职务下拉框修改
    $scope.selectPosition = function () {
        // 深复制一个对象
        var positionList = angular.copy($scope.positionSelectData);
        angular.forEach(positionList, function (val) {
            if (val.id == $scope.data.teacher.position.id) {
                $scope.data.teacher.position = val;
            }
            if ($scope.data.teacher.position.id == null) {
                $scope.data.teacher.position = {};
            }
        });
    };
};
angular.module("MetronicApp").controller('teacherAddController', ['$scope', '$http', '$compile', '$location', '$filter', teacherAddController]);

function teacherAddController($scope, $http, $compile, $location, $filter) {
    // 保存按钮响应
    $scope.save = function () {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveTeacher";
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
    $scope.checkRepeat = function () {
        $scope.repeatName = "工号";
        $scope.repeatUrl = "checkRepeatAccount";
        $scope.checkRepeatName = "account";
        $scope.checkRepeatApi($scope);
    };
};


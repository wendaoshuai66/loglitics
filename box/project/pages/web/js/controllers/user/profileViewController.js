angular.module("MetronicApp").controller('personalController', ['$scope', '$http', '$stateParams', '$compile', '$location', '$filter', '$timeout', '$q', '$state', personalController]);

function personalController($scope, $http, $stateParams, $compile, $location, $filter, $timeout, $q, $state) {
    var info = localStorage.getItem("com.logistics.user.info");
    var user = JSON.parse(info);
    $scope.url = "getUserById";
    $scope.params = {"id": user.id};
    $http({
        method: 'POST',
        url: $scope.httpDomain + $scope.url,
        params: $scope.params,
        headers: {
            'logistics-session-token': localStorage.getItem("com.logistics.user.token")
        }
    }).success(function (data) {
        getSexTypeData($scope, $http, $compile, $location, $filter);
        $scope.info = data.data;
        $scope.getSelectInfo();
    });
    // 监听校区下拉框修改
    $scope.selectCampus = function () {
        // 教师校区触发
        if (($scope.info.role === 2 || $scope.info.role === 0) && $scope.info.teacher) {
            $scope.getDepartmentList($scope.info.teacher.department.campus.id, 0);
        }
        else if (($scope.info.role === 1 || $scope.info.role === 0) && $scope.info.maintenanceWorker) {
            $scope.getDepartmentList($scope.info.maintenanceWorker.department.campus.id, 1);
        }
    };
    // 获取部门列表信息(非维修部门全部部门)
    $scope.getDepartmentList = function (campusId, ifLogistics, callback) {
        $scope.selectParams = {
            "getAll": false,
            "ifLogistics": ifLogistics,  // 0 非后勤部门,1 后勤部门
            "campusId": campusId
        };
        $q.all([getDepartmentSelectData($scope, $http, $compile, $location, $filter)])
            .then(function () {
                $scope.getLevelListFromDepartment($scope);
                if (callback) callback();
            });
    };
    // 获取表单提交以及回显中的下拉框内容
    $scope.getSelectInfo = function () {
        if ($scope.info.role === 0) {
            $q.all([getCampusSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
                return getPositionSelectData($scope, $http, $compile, $location, $filter);
            }).then(function () {
                return getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter);
            }).then(function () {
                $scope.selectCampus();
            });
        }
        // 教师 需要校区下拉框,部门下拉框,职务下拉框
        else if ($scope.info.role === 2) {
            $q.all([getCampusSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
                return getPositionSelectData($scope, $http, $compile, $location, $filter);
            }).then(function () {
                $scope.selectCampus();
            });
        }
        // 工人 需要校区下拉框,部门下拉框,工种下拉框
        else if ($scope.info.role === 1) {
            $q.all([getCampusSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
                return getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter);
            }).then(function () {
                $scope.selectCampus();
            });
        }
        // 学生以及其他未知类别
        else {
            return;
        }
    };
    $scope.changeOldPassword = function () {
        $scope.oldPasswordValid = true;
    };
    // 校验原始密码
    $scope.currentPassword = function () {
        if ($scope.setPsdForm.setPsw.$invalid) {
            return;
        }
        var postUrl = 'findUserPassword';
        $http({
            url: $scope.httpDomain + postUrl,
            method: 'POST',
            data: {
                data: JSON.stringify(
                    {
                        account: $scope.info.account,
                        password: $scope.setPsw,
                        id: $scope.info.id
                    }
                )
            },
            headers: {
                'logistics-session-token': localStorage.getItem("com.logistics.user.token")
            }
        }).success(function (data) {
            if (data.status === 'SUCCESS') {
                $scope.oldPasswordValid = true;
            }
            else {
                sweetAlert("警告", "原密码错误!", "error");
                $scope.oldPasswordValid = false;
            }
        }).error(function () {
            sweetAlert("警告", "验证异常,请稍后重试!", "error");
            $scope.oldPasswordValid = false;
        });
    };
    // 校验新密码与旧密码不能一致
    $scope.checkNewPasswordValidOld = function () {
        if ($scope.setPsw === $('#newPassword').val()) {
            $scope.newPasswordValidOld = false;
            sweetAlert("警告", "新密码不能与原密码一致!", "error");
        }
        else {
            $scope.newPasswordValidOld = true;
        }
    };
    // 修改密码提交
    $scope.passwordSmt = function () {
        var postUrl = 'updateUserPassword';
        $http({
            url: $scope.httpDomain + postUrl,
            method: 'POST',
            data: {
                id: $scope.info.id,
                password: $('#newPassword').val()
            },
            headers: {
                'logistics-session-token': localStorage.getItem("com.logistics.user.token")
            }
        }).success(function (data) {
            if (data.status === 'SUCCESS') {
                $state.reload();
                sweetAlert("提示", "已成功修改", "success");
            }
            else {
                sweetAlert("警告", "提交失败,请稍后再试！", "error");
            }
        }).error(function () {
            sweetAlert("警告", "提交异常！", "error");
        });
    };
    //修改资料
    $scope.modifiedData = function () {
        var userInfo = localStorage.getItem('com.logistics.user.info');
        userInfo = eval("(" + userInfo + ")");
        var postUrl;
        var user = $scope.info;
        // 维修工人
        if (userInfo.role == 1 || userInfo.role == 0) {
            postUrl = 'saveMaintenanceWorker';
        }
        // 教职人员
        else if (userInfo.role == 2) {
            postUrl = 'saveTeacher';
        }
        // 学生
        else if (userInfo.role == 3) {
            postUrl = 'saveStudent';
        }
        else {
            return;
        }
        $http({
            url: $scope.httpDomain + postUrl,
            method: 'POST',
            data: {
                "data": JSON.stringify(user)
            }
        }).success(function (data) {
            userInfo.name = $scope.info.name;
            if (userInfo.headPicture === 'images/user/male.jpg' || userInfo.headPicture === 'images/user/female.jpg') {
                if ($scope.info.sex === 1) {
                    userInfo.headPicture = 'images/user/male.jpg';
                } else {
                    userInfo.headPicture = 'images/user/female.jpg';
                }
            }
            if (($scope.info.role === 2 || $scope.info.role === 0) && $scope.info.teacher) {
            	userInfo.departmentId = $scope.info.teacher.department.id;
                userInfo.departmentName = $scope.info.teacher.department.name;
            }
            else if (($scope.info.role === 1 || $scope.info.role === 0) && $scope.info.maintenanceWorker) {
            	userInfo.maintenanceTypeID = $scope.info.maintenanceWorker.maintenanceType.id;
            	userInfo.departmentId = $scope.info.maintenanceWorker.department.id;
                userInfo.departmentName = $scope.info.maintenanceWorker.department.name;
            }
            // 将新更新的缓存内容写入
            localStorage.setItem('com.logistics.user.info', JSON.stringify(userInfo));
            $scope.loginUser.headPicture = userInfo.headPicture;
            $scope.getLoginUser();
            // 修改引用到旧名称的controller,进行修改
            var userProfileScope = $scope.getScope('UserProfile');
            userProfileScope.user.name = $scope.info.name;
            var AppScope = $scope.getScope('App');
            AppScope.loginUser.name = $scope.info.name;
            $state.reload();
            if (data.status === 'SUCCESS') {
                sweetAlert("提示", "已成功修改", "success");
            }
            else {
                sweetAlert("警告", "提交失败,请稍后再试！", "error");
            }
        }).error(function () {
            sweetAlert("警告", "提交异常！", "error");
        });
    }
};
	
   
  



   
   
   
   
		 
   
   
   
   
   




	

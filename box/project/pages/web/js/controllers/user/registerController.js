var app = angular.module("RegisterApp", ["ui.select2"]);
app.config(['$httpProvider', function ($httpProvider) {
    // $httpProvider.interceptors.push('sessionInjector');
    $httpProvider.defaults.transformRequest = function (data) {
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    };
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
}]);
//第一步
angular.module("RegisterApp").controller('registerController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout', '$q', registerController]);

function registerController($scope, $http, $compile, $location, $filter, $timeout, $q) {
    $scope.select2Options = {
        language: "zh-CN"
    };
    $scope.schoolName = schoolName;
    $scope.ifOpenApi = ifOpenApi;
    // select下拉框通过$q改造后可进行异步链式调用
    $scope.getSelectInfoApi = function ($scope) {
        if ($scope == null)
            return;
        var deferred = $q.defer();
        if ($scope.ifOpenApi) {
            $http({
                url: httpDomain + $scope.selectUrl,
                method: 'POST',
                data: $scope.selectParams,
                headers: {
                    'logistics-session-token': null
                }
            }).success(function (data) {
                if (data.data != null) {
                    $scope[$scope.selectPara] = data.data;
                    deferred.resolve();
                } else {
                    sweetAlert("警告", $scope.selectOptName + "失败！", "error");
                    deferred.reject();
                }
            }).error(function () {
                sweetAlert("警告", $scope.selectOptName + "异常！", "error");
                deferred.reject();
            });
        }
        return deferred.promise;
    };
    getRegisterTypesData($scope, $http, $compile, $location, $filter);
    getSexTypeData($scope, $http, $compile, $location, $filter);
    $q.all([getCampusSelectData($scope, $http, $compile, $location, $filter)]);
    $scope.data = {};
    // 注册流程第一步
    $scope.registerStep = 1;
    // 默认选中学生
    $scope.data.role = 3;
    // 默认选中男性
    $scope.data.sex = 1;
    // 手机验证默认不通过
    $scope.phone = false;
    // 手机正则
    $scope.phoneRegex = /^1(3|4|5|7|8)\d{9}$/;
    // 账号正则 英文数字,且不能为纯英文或数字
    $scope.accountRegex = /^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/;
    // 人名校验 纯中文
    $scope.userNameRegex = /^[\u4e00-\u9fa5a-zA-Z]+$/;
    // 身份证号验证
    $scope.idCardNum = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    // 验证手机号码
    $scope.getThisPhoneValid = function () {
        var phone = $('#phone').val();
        $scope.phoneNum = phone;
        if ($scope.phoneRegex.test(phone)) {
            $scope.phone = true;
        }
        else {
            $scope.phone = false;
        }
    };
    // 跳转到注册第二步
    $scope.registerStepToTwo = function () {
        $scope.registerStep = 2;
    };
    // 跳转回第一步
    $scope.registerStepToOne = function () {
        $('#phone').val($scope.phoneNum);
        $scope.registerStep = 1;
    };
    $scope.sengMsgStr = '发送验证码';
    $scope.sendMsgLoading = false;
    $scope.sendMsgStyle = {
        'width': '97px',
        'line-height': '32px'
    };
    // 短信重发秒数
    var countdownSecond = 20;
    // 发送短信验证码
    $scope.sendMsgCode = function () {
        if($scope.sendMsgLoading === true) return;
        // 发送验证码请求获取
        $http({
            url: httpDomain + 'sendMessageCode',
            method: 'POST',
            data: {
                mobile: $scope.phoneNum,
                count: 4
            }
        }).success(function (data) {
            if (data.status !== 'SUCCESS') {
                sweetAlert("警告", "验证码获取失败！", "error");
            }
        }).error(function () {
            sweetAlert("警告", "验证码获取异常！", "error");
        });
        timedCount();
    };
    // 短信重发倒计时
    function timedCount() {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.sengMsgStr = countdownSecond + '秒后可再次发送';
                $scope.sendMsgLoading = true;
                $scope.sendMsgStyle = {
                    'width': '127px',
                    'line-height': '32px'
                };
            });
        }, 0);
        countdownSecond--;
        if(countdownSecond > 0) {
            setTimeout(function () {
                timedCount();
            }, 1000)
        }
        else {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.sengMsgStr = '发送验证码';
                    $scope.sendMsgLoading = false;
                });
            }, 0);
            countdownSecond = 10;
        }
    }
    // 校验短信验证码
    $scope.checkMsgCodeValid = function () {
        if($('#verifyNo').val().length!=4) return;
        $http({
            url: httpDomain + 'checkMessageCode',
            method: 'POST',
            data: {
                mobile: $scope.phoneNum,
                msgCode: $('#verifyNo').val()
            }
        }).success(function (data) {
            if (data.status === 'SUCCESS') {
                // 跳转到第三步
                $scope.registerStep = 3;
                // 后勤人员
                if($scope.data.role == 1) {
                    getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter);
                }
                // 教师
                else if($scope.data.role == 2) {
                    getPositionSelectData($scope, $http, $compile, $location, $filter);
                }
            } else {
                sweetAlert("警告", "验证码不正确！", "error");
            }
        }).error(function () {
            sweetAlert("警告", "验证码获校验异常！", "error");
        });
    };
    // 针对部门下拉框拼接levelList
    $scope.getLevelListFromDepartment = function (_scope) {
        var departmentSelectDataAll = _scope.departmentSelectData;
        var levelList = [];
        angular.forEach(departmentSelectDataAll, function (value) {
            levelList.push({
                "id":value.id,
                "level":value.treeLevel
            });
        });
        _scope.levelList = levelList;
    };
    $scope.formatState = function (state) {
        if (!state.id) {
            return state.text;
        }
        var levelList = $scope.levelList;
        var nbsp = '';
        var split = (state.id).split('number:');
        var id = split[split.length - 1];
        for (var p = 0; p < levelList.length; p++) {
            if (levelList[p].id == id) {
                for (var i = 0; i < levelList[p].level; i++) {
                    nbsp += '&nbsp;&nbsp;&nbsp;&nbsp;';
                }
            }
        }
        var $state = $(
            '<span>' + nbsp + state.text + '</span>'
        );
        return $state;
    };
    $scope.select2FormatOptions = {
        language: "zh-CN",
        templateResult: $scope.formatState
    };
    // 修改校区的时候触发获取新的部门(区分维修部门以及非维修部门)
    $scope.getDepartmentInfoFromCampusId = function () {
        if($scope.data.role == 3) return;
        var ifLogistics;
        // 是否取只后勤部门标志
        ifLogistics = $scope.data.role == 1 ? 1 : 0;
        $scope.selectParams = {
            campusId: $scope.data.campusId,
            ifLogistics: ifLogistics
        };
        $q.all([getDepartmentSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
            if(ifLogistics === 1) {
                return getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter);
            }
            else {
                return getPositionSelectData($scope, $http, $compile, $location, $filter);
            }
        }).then(function () {
            $scope.getLevelListFromDepartment($scope);
        });
    };
    // 校验账号是否重复
    $scope.checkRepeatAccount = function () {
        $http({
            url: httpDomain + 'checkRepeatAccount',
            method: 'POST',
            data: {
                "data": JSON.stringify($scope.data)
            }
        }).success(function (data) {
            if (data.status === 'REPEAT') {
                sweetAlert("警告", "账号重复,请更换再试！", "warning");
                $scope.data.account = '';
            }
        }).error(function () {
            sweetAlert("警告", "账号获校验异常！", "error");
            $scope.data.account = '';
        });
    };
    // 校验是否为一个正确的身份证号码,出错提示
    $scope.checkIdCardNum = function () {
        var thisCardNum = $scope.data.idCardNum;
        if(thisCardNum == null || thisCardNum == '') return;
        if(!$scope.idCardNum.test(thisCardNum)) {
            sweetAlert("警告", "您输入的不是一个正确格式的身份证号！", "error");
            $scope.data.idCardNum = '';
        }
        else {
            $scope.idCardCheck = true;
        }
    };
    $scope.saveUserInfo = function () {
        if($('#btn_part3').attr('disabled')) return;
        var thisCardNum = $scope.data.idCardNum;
        if(thisCardNum != null && thisCardNum != '') {
            if(!$scope.idCardNum.test(thisCardNum)) {
                return;
            }
        }
        // 得到注册的路径
        var postUrl;
        // 保存的User对象
        var user = {
            name: $scope.data.name,
            sex: $scope.data.sex,
            account: $scope.data.account,
            password: $scope.data.password,
            tel: $scope.phoneNum,
            role: $scope.data.role,
        };
        // 维修工人
        if($scope.data.role == 1) {
            postUrl = 'saveMaintenanceWorker';
            user.maintenanceWorker = {
                department: {
                    id: $scope.data.departmentId
                },
                maintenanceType: {
                    id: $scope.data.maintenanceTypeId
                }
            }
        }
        // 教职人员
        else if($scope.data.role == 2) {
            postUrl = 'saveTeacher';
            user.teacher = {
                department: {
                    id: $scope.data.departmentId
                },
                position: {
                    id: $scope.data.positionId
                }
            }
        }
        // 学生
        else if($scope.data.role == 3) {
            postUrl = 'saveStudent';
            user.approvalStatus = 0;
        }
        else {
            return;
        }
        $http({
            url: httpDomain + postUrl,
            method: 'POST',
            data: {
                "data": JSON.stringify(user),
                "mobile": $scope.phoneNum
            }
        }).success(function (data) {
            if (data.status === 'SUCCESS') {
                sweetAlert("提示", "已成功注册", "success");
                $scope.registerStep = 4;
                $scope.countdownJumpSecond = 5;
                jumpLoginCount();
            }
            else {
                sweetAlert("警告", "注册失败,请稍后再试！", "error");
            }
        }).error(function () {
            sweetAlert("警告", "注册异常！", "error");
            $scope.data.account = '';
        });
    };

    function jumpLoginCount() {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.countdownJumpSecond = $scope.countdownJumpSecond - 1;
            });
        }, 0);
        if($scope.countdownJumpSecond > 1) {
            setTimeout(function () {
                jumpLoginCount();
            },1000)
        }
        else {
            var homeUrl = portType + '://' + window.location.host + webLoginSuffix;
            window.location =homeUrl;
        }
    }
};
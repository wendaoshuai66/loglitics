/***********************************************************************************************************************
 * Metronic AngularJS App Main Script
 **********************************************************************************************************************/
/* Metronic App */
var app = angular.module("MetronicApp", ["ui.router", "ui.bootstrap", "oc.lazyLoad", "ngSanitize", "ui.select2",
    "w5c.validator", "frapontillo.bootstrap-switch", "ngProgress"]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
app.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

// AngularJS v1.3.x workaround for old style controller declarition in HTML
app.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

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

// w5cValidatorProvider配置
app.config(["w5cValidatorProvider", function (w5cValidatorProvider) {
    // 全局配置
    w5cValidatorProvider.config({
        // 光标移出元素后是否验证并显示错误提示信息
        blurTrig: false,
        // 可以是bool和function，每个元素验证不通过后调用该方法显示错误信息
        // 默认true，显示错误信息在元素的后面(此处修改为div上方的 .validateErrorInfo span中)
        showError: true,
        // 可以是bool和function，每个元素验证通过后调用该方法移除错误信息
        // 默认true，验证通过后在元素的后面移除错误信息
        removeError: true
    });
    // 设置替换提示错误信息
    w5cValidatorProvider.setRules({
        email: {
            required: "邮箱不能为空",
            email: "邮箱格式不正确"
        },
        userName: {
            required: "用户名不能为空",
            pattern: "用户名必须输入字母、数字、下划线,以字母开头"
        },
        password: {
            required: "密码不能为空",
            minlength: "密码长度不能小于{minlength}",
            maxlength: "密码长度不能大于{maxlength}"
        },
        number: {
            required: "数字不能为空"
        },
        positiveInteger: {
            required: "数字不能为空",
            pattern: "数字只能为正整数"
        },
        doubleNumber: {
            required: "数字不能为空",
            pattern: "只能为正数，且最多两位小数"
        },
        modelName: {
            required: "型号名称不能为空",
            pattern: "型号名称不符合规范",
            minlength: "型号名称长度不能小于{minlength}",
            maxlength: "型号名称长度不能大于{maxlength}"
        },
        moduleName: {
            required: "模块名称不能为空",
            pattern: "模块名称不符合规范",
            minlength: "模块名称长度不能小于{minlength}",
            maxlength: "模块名称长度不能大于{maxlength}"
        },
        reply: {
            required: "回复内容不能为空"
        },
        personName: {
            required: "人员名称不能为空",
            pattern: "人员名称不符合规范",
            minlength: "人员名称长度不能小于{minlength}",
            maxlength: "人员名称长度不能大于{maxlength}"
        },
        personName2: {
            required: "人员名称不能为空",
            pattern: "人员名称不符合规范",
            minlength: "人员名称长度不能小于{minlength}",
            maxlength: "人员名称长度不能大于{maxlength}"
        },
        documents: {
            required: "单号名称不能为空",
            pattern: "单号名称不符合规范",
            minlength: "单号名称长度不能小于{minlength}",
            maxlength: "单号名称长度不能大于{maxlength}"
        },
        address: {
            required: "地点名称不能为空",
            pattern: "地点名称不符合规范",
            minlength: "地点名称长度不能小于{minlength}",
            maxlength: "地点名称长度不能大于{maxlength}"
        },
        name: {
            required: "名称不能为空",
            pattern: "名称不符合规范",
            minlength: "名称长度不能小于{minlength}",
            maxlength: "名称长度不能大于{maxlength}"
        },
        // 页面中如果有两个输入框name不能相同，但验证规则一样
        name2: {
            required: "输入不能为空",
            pattern: "输入不符合规范",
            minlength: "输入长度不能小于{minlength}",
            maxlength: "输入长度不能大于{maxlength}"
        },
        name3: {
            required: "输入不能为空",
            pattern: "输入不符合规范",
            minlength: "输入长度不能小于{minlength}",
            maxlength: "输入长度不能大于{maxlength}"
        },
        name4: {
            required: "输入不能为空",
            pattern: "输入不符合规范",
            minlength: "输入长度不能小于{minlength}",
            maxlength: "输入长度不能大于{maxlength}"
        },
        name5: {
            required: "输入不能为空",
            pattern: "输入不符合规范",
            minlength: "输入长度不能小于{minlength}",
            maxlength: "输入长度不能大于{maxlength}"
        },
        title: {
            required: "标题不能为空",
            pattern: "标题不符合规范",
            minlength: "标题长度不能小于{minlength}",
            maxlength: "标题长度不能大于{maxlength}"
        },
        url: {
            required: "链接不能为空",
            pattern: "链接不符合规范",
            minlength: "链接长度不能小于{minlength}",
            maxlength: "链接长度不能大于{maxlength}"
        },
        select: {
            required: "下拉框内容不能为空"
        },
        select2: {
            required: "下拉框内容不能为空"
        },
        select3: {
            required: "下拉框内容不能为空"
        },
        multipleSelect: {
            required: "多选下拉框内容不能为空"
        },
        multipleSelect2: {
            required: "多选下拉框内容不能为空"
        },
        multipleSelect3: {
            required: "多选下拉框内容不能为空"
        },
        multipleSelect4: {
            required: "多选下拉框内容不能为空"
        },
        // 身份证号
        idCardNum: {
            required: "身份证号不能为空",
            pattern: "身份证号格式不正确"
        },
        phoneNum: {
            required: "手机号不能为空",
            pattern: "手机号格式不正确"
        },
        date: {
            required: "日期不能为空"
        },
        description: {
            required: "内容不能为空",
            minlength: "内容长度不能小于{minlength}",
            maxlength: "内容长度不能大于{maxlength}"
        },
        registerName: {
            required: "账号不能为空",
            pattern: "只能为字母、数字,不能为纯数字或字母",
            minlength: "账号只能为8位",
            maxlength: "账号只能为8位"
        }
    });
}]);

/***********************************************************************************************************************
 * END: BREAKING CHANGE in AngularJS v1.3.x:
 **********************************************************************************************************************/

/* Setup global settings */
app.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000
            // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/**
 * $rootScope全局变量以及全局工具函数
 */
app
    .controller(
        'AppController',
        [
            '$scope',
            '$rootScope',
            '$location',
            '$timeout',
            '$http',
            '$q',
            'ngProgressFactory',
            '$window',
            '$state',
            '$compile',
            function ($scope, $rootScope, $location, $timeout, $http, $q, ngProgressFactory, $window, $state, $compile) {
                $rootScope.getToken = function () {
                    return localStorage.getItem("com.logistics.user.token");
                };
                $rootScope.getLoginUser = function () {
                	$rootScope.loginUser = JSON.parse(localStorage.getItem("com.logistics.user.info"));
                };
                $scope.getLoginUser();
                // app.js中的配置init工作
                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });
                // 页面上方进度条初始化及配置
                $rootScope.progressbar = ngProgressFactory.createInstance();
                $rootScope.progressbar.setHeight('4px');
                $rootScope.progressbar.setColor('#36D7B7');
                // 地址改变开始显示进度条
                $rootScope.$on('$locationChangeStart', function () {
                    // 针对快速切换路由引起的进度条显示问题优化
                    var flag = $rootScope.progressbar.status() !== 100;
                    if (flag) {
                        $rootScope.progressbar.set(100);
                    } else {
                        $rootScope.progressbar.start();
                        $timeout(function () {
                            if (flag) {
                                $rootScope.progressbar.complete();
                            }
                        }, 3000);
                    }
                });
                // 每个页面DOM加载完成进度条
                $rootScope.$on('$viewContentLoaded', function () {
                    $rootScope.progressbar.complete();
                });
                // 全局路由监听事件
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                    // 从值班注册页跳出,清空所有关于值班的缓存
                    if(fromState.name === 'dutyRegister') {
                        // 跳转之前把所有以 com.logistics.duty 开头的缓存全部清空
                        for(var key in localStorage) {
                            if (key.indexOf('com.logistics.duty') !== -1) {
                                localStorage.removeItem(key);
                            }
                        }
                    }
                    var token = localStorage.getItem("com.logistics.user.token");
                    var loginStatus = localStorage.getItem("com.logistics.user.login");
                    // 跳转到登录页
                    var redirectToLogin = function (callback) {
                        localStorage.setItem("com.logistics.user.token", null);
                        localStorage.setItem("com.logistics.user.login", false);
                        localStorage.setItem("com.logistics.user.expired", true);
                        localStorage.setItem("com.logistics.user.info", null);
                        // 跳转到登录页面提示过期
                        if(callback) callback();
                        $rootScope.userLogin();
                    };
                    // 登录成功的情况
                    if(loginStatus == true || loginStatus == 'true') {
                        // 校验token是否过期
                        $http({
                            url: httpDomain + 'checkAuthority',
                            method: 'POST',
                            // 超管验证
                            data: {
                                'administrator' :true
                            },
                            headers: {
                                'logistics-session-token': token
                            }
                        }).success(function (data) {
                            if (data == null || data == '') {
                                redirectToLogin();
                            }
                            else if(data.status !== 'SUCCESS') {
                                if(data.status === 'EXPIRED') {
                                    redirectToLogin();
                                }
                                else if(data.status === 'NOADMINISTRATOR') {
                                    redirectToLogin(function () {
                                        // 并非为账号过期引起，而是没有管理员权限
                                        localStorage.setItem("com.logistics.user.expired", 'NOADMINISTRATOR');
                                    });
                                }
                            }
                        }).error(function () {
                            redirectToLogin();
                        });
                    }
                    // 没有登录成功
                    else {
                        // 直接跳转到登录页
                        $rootScope.userLogin();
                    }
                });
                // 网站域名
                // $rootScope.webName = "logistics";
                // $rootScope.httpDomain = $location.protocol() + "://" +
                // $location.host() + ":" + $location.port() + "/" +
                // $rootScope.webName+ "/";
                $rootScope.httpDomain = httpDomain;
                $rootScope.schoolName = schoolName;
                //$rootScope.slideImageWidth = slideImageWidth;
                //$rootScope.slideImageHeight = slideImageHeight;
                $rootScope.ifOpenApi = ifOpenApi;
                $rootScope.maxAlarmValue = maxAlarmValue;
                $rootScope.formatState = function (state) {
                    if (!state.id) {
                        return state.text;
                    }
                    var _scope = $rootScope.getScope([$rootScope.select2InitCountolerName]);
                    var levelList = _scope.levelList;
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
                // ui-select2单选特殊(部门使用)
                $rootScope.select2FormatOptions = {
                    // 中文提示
                    language: "zh-CN",
                    templateResult: $rootScope.formatState
                };
                $rootScope.select2Options = {
                    // 中文提示
                    language: "zh-CN"
                };
                // ui-select2多选配置
                $rootScope.multipleSelect2 = {
                    closeOnSelect: false,
                    language: "zh-CN"
                };
                // 不带搜索框的单选
                $rootScope.select2NoSearch = {
                    minimumResultsForSearch: -1,
                    language: "zh-CN"
                };

                // 验证配置
                $rootScope.validateOptions = {
                    blurTrig: true
                };

                // 全局函数

                // 验证正则表达式配置
                $rootScope.regex = {
                    // 名称(中英文名称、数字、下划线)
                    name: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                    // 手机号
                    telNum: /^1(3|4|5|7|8)\d{9}$/,
                    // 身份证号
                    idCardNum: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                    // IP地址
                    ip: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
                    // 仅英文、数字、下划线
                    enName: /^[a-zA-Z0-9]+$/,
                    // 正整数
                    positiveInteger: /^[0-9]*[1-9][0-9]*$/,
                    // 正数，小数点不超过两位
                    twoDecimal: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                    // url
                    url: /^((ht|f)tps?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/,
                    // 中文和字母名称
                    personName: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                    // 纯中文
                    chineseName: /^[\u4e00-\u9fa5]+$/,
                    // 注册工号
                    registerAccount: /^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/
                };

                // 验证输入长度配置
                $rootScope.length = {
                    // 工号学号长度
                    accountMin: 8,
                    accountMax: 8,
                    // 名称(短)长度
                    shortNameMin: 1,
                    shortNameMax: 5,
                    // 名称(普通)长度
                    simpleNameMin: 1,
                    simpleNameMax: 10,
                    // 名称(长)长度
                    langNameMin: 1,
                    langNameMax: 20,
                    // 地址长度
                    addressMin: 1,
                    addressMax: 50,
                    // 内容长度
                    contentMin: 25,
                    contentMax: 150,
                    // 型号名称长度
                    modelMin: 1,
                    modelMax: 30,
                    // 密码长度
                    passwordMin: 6,
                    passwordMax: 20,
                    // 人员姓名
                    personMin: 2,
                    personMax: 10,
                    //便民服务和友情链接
                    linkNameMin: 2,
                    linkNameMax: 15,
                    //入库数量
                    storageCountMin: 1,
                    storageCountMax: 15,
                    //内容，差评评价等
                    commentMin:5,
                    commentMax: 200
                };

                $rootScope.loadingConfig = {
                    loadingWidth: 120,
                    title: '',
                    name: 'test',
                    discription: '',
                    direction: 'column',
                    type: 'origin',
                    // originBg:'#71EA71',
                    originDivWidth: 40,
                    originDivHeight: 40,
                    originWidth: 6,
                    originHeight: 6,
                    smallLoading: false,
                    loadingMaskBg: 'rgba(0,0,0,0.2)'
                };

                // 打开遮罩层以及加载效果
                $rootScope.addLoading = function () {
                    $('body').loading($rootScope.loadingConfig);
                };
                // 关闭遮罩层与加载效果
                $rootScope.removeLoading = function () {
                    removeLoading('test');
                };

                // 跳转到新页面，需要跨域传递参数
                $rootScope.toNewPage = function ($scope, data) {
                    var pageState = data.pageState;
                    // 传递的id参数信息，统一在main中配置叫messageData,需要修改先修改main.js的路由配置
                    $scope.$state.go(pageState, {
                        messageData: data
                    });
                };

                // 删除信息提醒显示模态框
                $rootScope.removeModal = function (id) {
                    $rootScope.removeId = id;
                    // 显示删除提示模态框
                    $('#removeModal').modal();
                };

                // 重置密码信息提醒显示模态框
                $rootScope.resetPswModal = function (id) {
                    $rootScope.resetPswId = id;
                    // 显示删除提示模态框
                    $('#resetPswModal').modal();
                };

                // 查询功能
                $rootScope.searchInfo = function ($scope) {
                    $rootScope.addLoading();
                    var tableStr = 'dataTable';
                    if($scope.initDataTablesName) {
                        tableStr = $scope.initDataTablesName;
                    }
                    $('#' + tableStr).DataTable().ajax.reload(function () {
                        $rootScope.removeLoading();
                    }, true);
                };

                // 清空图片上传队列
                $rootScope.clearQueue = function () {
                    var uploaderScope = $scope.getScope('slideUpload');
                    // 清空上传队列
                    uploaderScope.uploader.clearQueue();
                    // 除了将队列清空之外，还需要将file文件的值修改为空，不然再次上传相同的文件，change不会触发
                    $('#myUpload').val('');
                };

                // 封装后台发送请求
                $rootScope.postApi = function ($scope, callBack) {
                    var deferred = $q.defer();
                    if ($rootScope.ifOpenApi) {
                        $http({
                            url: $scope.httpDomain + $scope.url,
                            method: 'POST',
                            data: $scope.params,
                            headers: {
                                'logistics-session-token': $rootScope.getToken()
                            }
                        }).success(function (data, status, headers, config) {
                            if (data.status === 'SUCCESS') {
                            	if($scope.optName && $scope.optName!=""){
                            		sweetAlert("提示", $scope.optName + "成功！", "success");
                            	}
                                deferred.resolve();
                            } else {
                                if($scope.controllerName === 'storage' && data.status === 'NOSTORAGE') {
                                    sweetAlert("警告", "不允许删除,该删除入库数量大于当前物料库存数量!", "warning");
                                }
                                else {
                                    sweetAlert("警告", $scope.optName + "失败！", "error");
                                }
                                deferred.reject();
                            }
                            // 跳转到新add页面，并非模态框情况
                            if ($scope.stateNewPage) {
                                $scope.removeLoading();
                                $scope.$state.go($scope.returnControllerName, {
                                    messageData: null
                                });
                            }
                            // 普通模态框情况
                            else {
                                $scope.url = $scope.reloadUrl;
                                var tableStr = 'dataTable';
                                if($scope.initDataTablesName) {
                                    tableStr = $scope.initDataTablesName;
                                }
                                // 不刷新pages,当前页码,排序等内容保留
                                var refresh = false;
                                // 修改状态
                                if($scope.data.id === undefined && $scope.dataRefresh == true) {
                                    refresh = true;
                                    $scope.dataRefresh = false;
                                }
                                $('#' + tableStr).DataTable().ajax.reload(function () {
                                    $scope.removeLoading();
                                    if (callBack != null) {
                                        callBack();
                                    }
                                }, refresh);
                            }
                        }).error(function (data, status, headers, config) {
                            sweetAlert("警告", $scope.optName + "异常！", "error");
                            $scope.removeLoading();
                            deferred.reject();
                        });
                    }
                    if (!$scope.ifOpenApi) {
                        if ($scope.changeStatusType && $scope.changeStatusId) {
                            $scope[$scope.changeStatusType + $scope.changeStatusId] = !$scope[$scope.changeStatusType
                            + $scope.changeStatusId];
                        }
                    }
                    $scope.removeLoading();
                    return deferred.promise;
                };

                // 封装后台发送请求
                $rootScope.postApiNoReload = function ($scope) {
                    var deferred = $q.defer();
                    if ($rootScope.ifOpenApi) {
                        $http({
                            url: $scope.httpDomain + $scope.url,
                            method: 'POST',
                            data: $scope.params,
                            headers: {
                                'logistics-session-token': $rootScope.getToken()
                            }
                        }).success(function (data, status, headers, config) {
                            if (data.status === 'SUCCESS') {
                                sweetAlert("提示", $scope.optName + "成功！", "success");
                                deferred.resolve();
                            } else {
                                sweetAlert("警告", $scope.optName + "失败！", "error");
                                deferred.reject();
                            }
                            $scope.url = $scope.reloadUrl;
                            $scope.removeLoading();
                        }).error(function (data, status, headers, config) {
                            sweetAlert("警告", $scope.optName + "异常！", "error");
                            $scope.removeLoading();
                            deferred.reject();
                        });
                    }
                    if (!$scope.ifOpenApi) {
                        $scope.removeLoading();
                    }
                    return deferred.promise;
                };

                // select下拉框通过$q改造后可进行异步链式调用
                $rootScope.getSelectInfoApi = function ($scope) {
                    if ($scope == null)
                        return;
                    var deferred = $q.defer();
                    if ($rootScope.ifOpenApi) {
                        $http({
                            url: $scope.httpDomain + $scope.selectUrl,
                            method: 'POST',
                            data: $scope.selectParams,
                            headers: {
                                'logistics-session-token': $rootScope.getToken()
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
                $scope.materialLessAlarmCount = 0;
                // 获取物料不足的信息
                $scope.getMaterialLessAlarmInfo = function () {
                    if ($rootScope.ifOpenApi) {
                        $http({
                            url: $scope.httpDomain + "checkMaterialLessAlarmValue",
                            method: 'POST',
                            headers: {
                                'logistics-session-token': $rootScope.getToken()
                            }
                        }).success(function (data) {
                            if (data.data != null) {
                                $scope.materialLessAlarmInfo = data.data;
                                $scope.materialLessAlarmCount = data.count
                            }
                        });
                    }
                };
                // 第一次自执行
                $scope.getMaterialLessAlarmInfo();
                // 用于延时校验
                var timeout; // 写到scope内部，会造成每次请求生成的time定时都是新的，每一次连续输入的校验都会在800ms后触发
                // AngularJS 1.3之后可以绑定一个 ng-model-options='{ debounce: 800 }'
                // 所有的事件都只会在两次改变大于800ms情况下触发，
                // 这里之所以没有使用 debounce 是因为在新输入后需要立即把 验证不通过标志 挂成true，提交按钮就能立即禁用
                $rootScope.checkRepeatApi = function ($scope) {
                    $scope.params = {
                        "data": ""
                    };
                    if ($scope.data[$scope.checkRepeatName]) {
                        // 每一次改变先将状态改为不通过
                        $scope.ifRepeat = true;
                        if (timeout) {
                            $timeout.cancel(timeout);
                        }
                        $scope.params = {
                            "data": JSON.stringify($scope.data)
                        };
                    }
                    if ($rootScope.ifOpenApi) {
                        timeout = $timeout(function () {
                            $http({
                                url: $scope.httpDomain + $scope.repeatUrl,
                                method: 'POST',
                                data: $scope.params,
                                headers: {
                                    'logistics-session-token': $rootScope.getToken()
                                }
                            }).success(function (data, status, headers, config) {
                                if (data.status === 'REPEAT') {
                                    sweetAlert("警告", $scope.repeatName + "重复！请更换再试！", "warning");
                                } else {
                                    // 判重验证通过
                                    $scope.ifRepeat = false;
                                }
                            }).error(function (data, status, headers, config) {
                                sweetAlert("警告", $scope.repeatName + "校验异常！", "error");
                            });
                            timeout = null;
                        }, 800);
                    }
                };

                // 获取状态列显示信息
                $rootScope.getStatusHtml = function ($scope, id, type, value) {
                    // 审核状态与是否幻灯特殊情况需要根据状态启用禁用标签
                    var disabledHtml = "";
                    if ($scope.controllerName == 'inforPicture') {
                        if (type === 'slideShow') {//type === 'approvalStatus' ||
                            if (value) {
                                disabledHtml = "myDisabled";
                            }
                        }
                        if (type === 'slideShow') {
                            if (!$scope['approvalStatus' + id]) {
                                disabledHtml = "myDisabled";
                            }
                        }
                    }
                    // 跳蚤市场，失物招领，建言献策页面通过审核后不能修改状态
                    else if ($scope.controllerName == 'fleaMarket' || $scope.controllerName=='lostFound' || $scope.controllerName == 'inforText') {
                        if (type === 'approvalStatus') {
                            if(value){
                                disabledHtml = "myDisabled";
                            }
                        }
                        if (type === 'dealStatus') {
                            disabledHtml = "myDisabled";
                        }
                    }
                    // 教职人员、维修人员、学生页面通过审核后不能修改状态
                    else if ($scope.controllerName=='maintenanceWorker' || $scope.controllerName == 'teacher' || $scope.controllerName == "student") {
                        if (type === 'approvalStatus') {
                            if(value){
                                disabledHtml = "myDisabled";
                            } else if(!$scope['status' + id]) {
                                disabledHtml = "myDisabled";
                            }
                        }
                    }
                    // 维修评价通过审核后不能操作
                    else if ($scope.controllerName == 'maintenanceEvaluation') {
                        if (type === 'approvalStatus') {
                            if (value) {
                                disabledHtml = "myDisabled";
                            }
                        }
                    }
                    var html = '<div class="mySwitch ' + disabledHtml + '" ng-init="' + type + id + '='
                        + value + '" ng-model="' + type + id + '" ng-click="changeStatusModal(' + id
                        + ',\'' + type + '\',' + value + ')">' + '<div ng-class="' + type + id
                        + '==1?\'switchBody1 switchOpen1\':\'switchBody1 switchClose1\'">'
                        + '<div ng-class="' + type + id
                        + '==1?\'switchBody2 switchOpen2\':\'switchBody2 switchClose2\'">'
                        + '<i ng-class="' + type + id + '==1?\'fa fa-check\':\'fa fa-times\'"></i>'
                        + '</div></div></div>';
                    return html;
                };

                // 获取内容较长列显示样式
                $rootScope.getWrapHtml = function (data, value, maxWidth) {
                    var html = '<div data-microtip="' + data
                        + '" data-microtip-position="right">'
                        + '<div class="wrap-ellipsis" style="max-width:' + maxWidth + 'px !important;">' + value
                        + '</div></div>';
                    return html;
                };

                $rootScope.toLogin = function () {
                    $rootScope.$state.go('login');
                };

                // 获取内容较长列显示样式
                $rootScope.getUrlHtml = function (value, url) {
                    var html = '<a href="' + url + '" data-microtip="' + value
                        + '" data-microtip-position="right" target="_blank">' + value + '</a>';
                    return html;
                };

                // 状态改变提醒显示模态框
                $rootScope.changeStatusModal = function (id, type, value) {
                    $rootScope.changeStatusNowId = id;
                    // 清空上传队列
                    if(type === 'slideShow') {
                        $scope.clearQueue();
                    }
                    // 需要对修改审核状态以及是否幻灯进行特殊处理
                    if (type === 'approvalStatus' || type === 'slideShow') {
                        // 被禁用的审核状态以及是否幻灯开关按钮，不能再次修改
                        var flag = $('[ng-model=' + type + id + ']').hasClass('myDisabled');
                        if (flag) {
                            return;
                        }
                    }
                    // 交易完成情况，拦截不能触发
                    else if (type === 'dealStatus') {
                        return;
                    }
                    $rootScope.changeStatusType = type;
                    $rootScope.changeStatusId = id;
                    // 除过幻灯显示修改状态，其他的都先跳出模态框
                    // 修改幻灯直接跳出上传模态框
                    if (type === 'slideShow') {
                        var status = $scope[type + id];
                        // 未通过状态
                        if (!status) {
                            var pictureScope = $rootScope.getScope("inforPicture");
                            // 将列id传递过去
                            pictureScope.resultSaveId = id;
                            // 打开上传图片的模态框
                            $('#pictureUpload').modal();
                            return;
                        } else {
                            return;
                        }
                    }
                    // 设置为首页显示状态的不能超过10个
                    if(type ==='homeShow' && $rootScope.getScope('slide')) {
                        var slideCountScope= $rootScope.getScope('slide');
                        var callback = function () {
                            if(slideCountScope.countFlag) {
                                $('#changeStatusModal').modal();
                            }
                        };
                        slideCountScope.homeShowCount(value,callback);
                    }
                    else {
                        $('#changeStatusModal').modal();
                    }
                };

                /**
                 * 重置表单
                 * @param name
                 *        list页面controller名称
                 * @param selectList
                 *        =================需要取消首次进入页面中，清除掉select的name==================================
                 *        1.只有一个formName时，只重置表单 2.再有一个selectList参数时，将select的第一次验证提示去除
                 */
                $rootScope.resetForm = function ($scope, $http, $compile, $location, $filter) {
                    var $formScope = $rootScope.getScope($scope.controllerName + 'Add');
                    // 定位到form的controller，调用reset
                    // 注意，$scope会自己脏检查，手动去修改$valid等angularJS自己管理的参数第一次会失效
                    // $scope认为$digest已经运行了，此时我们就要手动停止$digest。$timeout可以达到此目的
                    $timeout(function () {
                        $formScope.myForm.reset();
                        // $formScope.myForm.$setPristine();
                        // $formScope.myForm.$setUntouched();
                        // $formScope.myForm.$error = {};
                        if ($scope.selectIdList) {
                            angular.forEach($scope.selectIdList, function (value, key) {
                                var selectValid_ = eval('$formScope.myForm.' + value);
                                // 第一次进入页面，将select2控件的默认错误提示取消(因为下拉框默认选中了空，验证就不通过)
                                // 点击select2控件的父容器时，又会根据当前选中是否有值，将valid改回，不会影响判断逻辑
                                selectValid_.$valid = true;
                            });
                        }
                    }, 0);
                };

                $rootScope.resetErrorInput = function ($scope, $http, $compile, $location, $filter) {
                    var $formScope = $rootScope.getScope($scope.controllerName + 'Add');
                    // 这里对于angularJS验证未通过的对象是不会添加到model中的，需要手动定位并重置
                    // angularJS对于表单验证失败的input之类会自动移出model，reset表单会遗漏
                    // modelValue 会变成 undefined 而真实记录DOM值的是 viewValue
                    // 但采用setViewValue来同步modelValue一样不起作用 最后使用jQuery DOM操作
                    // $formScope.$apply(function () {
                    if ($scope.resetInputList) {
	                    angular.forEach($scope.resetInputList, function (value) {
	                        //$('[name=' + value + ']').val(undefined);
	                    	$scope.data[value] = '';
	                    });
                    }
                    // });
                };

                /**
                 * 查询条件重置
                 * @param $scope
                 * @param $http
                 * @param $compile
                 * @param $location
                 * @param $filter
                 */
                $rootScope.resetSearch = function ($scope, $http, $compile, $location, $filter) {
                    var thisScope = $scope;
                    thisScope.searchObj = {};
                    if (thisScope.selectSearchIdList != null) {
                        thisScope.triggerSelectSearch(thisScope, $http, $compile, $location, $filter);
                    }
                };

                $rootScope.resetDateTimePicker = function () {
                    var ids = [].slice.call(arguments);
                    angular.forEach(ids, function (id) {
                        $("#" + id).datetimepicker('setEndDate', null);
                        $("#" + id).datetimepicker('setStartDate', null);
                    });
                };

                // 数组去重
                $rootScope.uniqueList = function (list) {
                    var new_arr = [];
                    for (var i = 0; i < list.length; i++) {
                        var items = list[i];
                        if ($.inArray(items, new_arr) == -1) {
                            new_arr.push(items);
                        }
                    }
                    return new_arr
                };

                /**
                 * @param name
                 *        list页面controller名称
                 * @param selectName
                 *        add页面中select上的name =================处理细节:=================
                 *        这里的处理是在select2的父容器上加上click的处理 选中的select节点的值为空(!select_.$viewValue)时，
                 *        将之前验证通过修改为验证未通过(select_.$valid = false) 再进行该select的验证，这时就会直接加上验证提示。
                 */
                $rootScope.focus = function (name, selectName) {
                    var $formScope = $rootScope.getScope(name + 'Form');
                    // 获取到当前表单中name为'selectName'的select对象
                    $timeout(function () {
                        var select_ = eval('$formScope.myForm.' + selectName);
                        // 如果选中没有值
                        if (!select_.$viewValue) {
                            // 重新将验证改为不通过
                            select_.$valid = false;
                            // 重新进行验证
                            $formScope.myForm.validateElement(selectName);
                        }
                    }, 0);
                };

                /**
                 * select2动态修改值后需要调用trigger进行刷新 将Id数组传入
                 * @param idList
                 */
                $rootScope.triggerSelect = function ($scope, $http, $compile, $location, $filter) {
                    if ($scope.selectIdList) {
                        $scope.selectIdList.forEach(function (value) {
                            $timeout(function () {
                                angular.element('[name=' + value + ']').triggerHandler('change');
                            }, 0);
                        });
                    }
                };

                /**
                 * select2 查询框中的刷新
                 * @param idList
                 */
                $rootScope.triggerSelectSearch = function ($scope, $http, $compile, $location, $filter) {
                    if ($scope.selectSearchIdList) {
                        $scope.selectSearchIdList.forEach(function (value) {
                            $timeout(function () {
                                angular.element('[name=' + value + ']').triggerHandler('change');
                            }, 0);
                        });
                    }
                };

                // ui.bootstrap.pagination配置
                $rootScope.initPagination = function ($scope) {
                    // 注意不要将分页属性直接挂载在$scope上
                    // 说明：https://stackoverflow.com/questions/31963454/angularjs-pagination-not-reading-current-page-number
                    $scope.vm = {};
                    // 每页条数
                    $scope.vm.pageSize = $scope.pageSize ? $scope.pageSize : 10;
                    // 大量数据时,位于中间的分页按钮最多显示几个
                    $scope.vm.maxSize = 5;
                    // 总条数
                    $scope.vm.totalItems = 0;
                    // 选中页数
                    $scope.vm.currentPageItem = 1;
                    // 修改每页显示条数
                    $scope.changePageSize = function (newValue) {
                        $scope.vm.currentPageItem = 1;
                        $scope.vm.pageSize = newValue << 0;
                        $scope.getPaginationList();
                    };
                    // 获取列表信息
                    $scope.getPaginationList = function () {
                        $scope.params = {
                            "pageSize": $scope.vm.pageSize,
                            "start": ($scope.vm.currentPageItem - 1) * $scope.vm.pageSize,
                            "pageNumber": $scope.vm.currentPageItem,
                            "order":{
                            	"name":$scope.orderBy,
                            	"dir":$scope.orderDir
                            }
                        };
                        $http({
                            url: $scope.httpDomain + $scope.url,
                            method: 'POST',
                            data: $.extend($scope.params, $scope.myParams),
                            headers: {
                                'logistics-session-token': $scope.getToken()
                            }
                        }).success(function (data) {
                            $scope[$scope.requestListName] = data.data;
                            $scope.vm.totalItems = data.total;
                            $scope.vm.untilSize = Math.min($scope.vm.currentPageItem * $scope.vm.pageSize, $scope.vm.totalItems);
                        })
                    };
                    $scope.changePagination = function () {
                        $scope.getPaginationList();
                    };
                    // // 第一次自执行
                    $scope.getPaginationList();
                };
                
                /**
                 * 针对敏感词进行校验 绑定在 ng-blur
                 * @param thisEvent $event
                 */
                $rootScope.checkValidateWithSensitive = function (thisEvent, model) {
                    var _val =thisEvent.target.value;
                    if(_val) {
                        var sensitiveList = allSensitiveName;
                        sensitiveList.forEach(function (value) {
                           if(_val.toLowerCase() == value.toLowerCase()) {
                               sweetAlert("警告", "不允许输入敏感字符,请重新输入", "warning");
                               // 将敏感词删除
                               var splits = model.split('.');
                               var thisScope = angular.element($(thisEvent.target)).scope();
                               $timeout(function () {
                                   thisScope.$apply(function () {
                                       thisScope[splits[0]][splits[1]] = '';
                                   });
                               }, 0)
                           }
                        });
                    }
                };

                // 传入的今日日期(yyyy-MM-dd)字符串 获取到明日日期字符串
                // 第二个参数不为空即为,与今日相隔指定天数的处理
                $rootScope.getNextDayStr = function (todayStr, delta) {
                    var day = 1;
                    if(delta != null) {
                        day = delta<<0;
                    }
                    var second = new Date(todayStr).getTime();
                    var add = 1000 * 60 * 60 * 24 * day;
                    var nextDay = new Date(second + add);
                    return nextDay.Format('yyyy-MM-dd');
                };

                $rootScope.getDutyInfo = function (_scope) {
                    $http({
                        url: _scope.httpDomain + 'getDutiesFromDepartmentTypeAndDate',
                        method: 'POST',
                        data: {
                            departmentId: _scope.departmentId,
                            typeId: _scope.typeId,
                            date: _scope.date
                        },
                        headers: {
                            'logistics-session-token': _scope.getToken()
                        }
                    }).success(function (data, status, headers, config) {
                        if (data.status === 'SUCCESS') {
                            var tableListData = [];
                            angular.forEach(data.data, function (value) {
                                var obj = {};
                                obj.time =  value.time + ' (' + dateUtil.getWeekStr(value.time) + ')';
                                obj.dayPerson = value.dayPerson;
                                obj.nightPerson = value.nightPerson;
                                obj.holidayName = value.holidayName;
                                tableListData.push(obj);
                            });
                            _scope.tableListDataNew = tableListData;
                        } else {
                            sweetAlert("警告", "查询失败,请重试!", "error");
                        }
                        _scope.removeLoading();
                    }).error(function (data, status, headers, config) {
                        sweetAlert("警告", "查询异常！", "error");
                        _scope.removeLoading();
                    });
                };
                // 精确乘法
                $rootScope.exactMul = function (a1, a2) {
                    var m = 0, s1 = a1.toString(), s2 = a2.toString();
                    try {
                        m += s1.split(".")[1].length
                    } catch (e) {
                    }
                    try {
                        m += s2.split(".")[1].length
                    } catch (e) {
                    }
                    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
                };
                // 根据controllerName获取到对应的$scope对象
                $rootScope.getScope = function (controllerName) {
                    var appElement = document.querySelector('[ng-controller=' + controllerName
                        + 'Controller]');
                    var thisScope = angular.element(appElement).scope();
                    return thisScope;
                };

                // 针对部门下拉框拼接levelList
                $rootScope.getLevelListFromDepartment = function (departmentScope) {
                    var departmentSelectDataAll = departmentScope.departmentSelectData;
                    var levelList = [];
                    angular.forEach(departmentSelectDataAll, function (value) {
                        levelList.push({
                            "id":value.id,
                            "level":value.treeLevel
                        });
                    });
                    departmentScope.levelList = levelList;
                };
                // 保存图片
                $rootScope.saveImage = function (data, filename, canvas) {
                    //IE9+浏览器
                    if (canvas.msToBlob) {
                        var blob = canvas.msToBlob();
                        window.navigator.msSaveBlob(blob, filename + '.png');
                    }
                    //firefox,chrome
                    else {
                        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                        save_link.href = data;
                        save_link.download = filename;
                        var event = document.createEvent('MouseEvents');
                        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        save_link.dispatchEvent(event);
                    }
                };
                // 登录跳转到登录页面
                $rootScope.userLogin = function () {
                    var homeUrl = portType + '://' + window.location.host + adminLogionSuffix;
                    window.location =homeUrl;
                };
                $scope.$on('$viewContentLoaded', function () {
                    // App.initComponents();
                    // init core components
                    // Layout.init();
                    // Init entire layout(header, footer, sidebar, etc)
                    // on page load if the partials included in server side
                    // instead of loading with ng-include directive
                });
            }]);

/***********************************************************************************************************************
 * Layout Partials. By default the partials are loaded through AngularJS ng-include directive. In case they loaded in
 * server side(e.g: PHP include function) then below partial initialization can be disabled and Layout.init() should be
 * called on page load complete as explained above.
 **********************************************************************************************************************/

/* Setup Layout Part - Header */
app.controller('HeaderController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
    $scope.userSignOut = function () {
        $('#signoutModal').modal();
    };
    $scope.confirmSignOut = function () {
        // 发送后台请求将redis缓存的token清除
        $http({
            url: $scope.httpDomain + "cleanToken",
            method: 'POST',
            data: {
                'token': $rootScope.getToken()
            },
            headers: {
                'logistics-session-token': $rootScope.getToken()
            }
        }).success(function (data, status, headers, config) {
            if (data.status === 'SUCCESS') {
                // sweetAlert("提示", "已成功注销", "success");
                // 清空记录的缓存
                localStorage.setItem("com.logistics.user.token", null);
                localStorage.setItem("com.logistics.user.login", false);
                localStorage.setItem("com.logistics.user.info", null);
                $scope.loginStatus = false;
                $rootScope.userLogin();
            } else {
                // 注销错误
                sweetAlert("警告", "注销失败请重试！", "error");
            }
        }).error(function (data, status, headers, config) {
            sweetAlert("警告", $scope.repeatName + "校验异常！", "error");
        });
    }
}]);

/* Setup Layout Part - Sidebar */
app.controller('SidebarController', ['$state', '$scope', function ($state, $scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
app.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
app.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
app.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
app
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            // Redirect any unmatched url
            $urlRouterProvider.otherwise("/dashboard.html");

            $stateProvider

            // Dashboard
                .state('dashboard', {
                    url: "/dashboard.html",
                    templateUrl: "views/dashboard.html",
                    data: {
                        pageTitle: '首页'
                    },
                    //controller: "DashboardController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                // load the above css files before
                                // '#ng_load_plugins_before'
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/DashboardController.js',
                                ]
                            });
                        }]
                    }
                })

                // ***********************库存管理开始***********************

                // 物料类别
                .state('materialCategory', {
                    url: "/inventory/materialCategory",
                    templateUrl: "views/inventoryManagement/materialCategory/list.html",
                    data: {
                        pageTitle: '物料类别'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/inventoryManagement/materialCategoryController.js']
                            });
                        }]
                    }
                })

                // 物料单位
                .state('materialUnit', {
                    url: "/inventory/materialUnit",
                    templateUrl: "views/inventoryManagement/materialUnit/list.html",
                    data: {
                        pageTitle: '物料单位'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/inventoryManagement/materialUnitController.js']
                            });
                        }]
                    }
                })

                // 物料管理
                .state('material', {
                    url: "/inventory/material",
                    templateUrl: "views/inventoryManagement/material/list.html",
                    data: {
                        pageTitle: '物料管理'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/inventoryManagement/materialController.js']
                            });
                        }]
                    }
                })

                // 入库管理
                .state('storage', {
                    url: "/inventory/storage",
                    templateUrl: "views/inventoryManagement/storage/list.html",
                    data: {
                        pageTitle: '入库管理'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/inventoryManagement/storageController.js']
                            });
                        }]
                    }
                })

                // 出库管理
                .state('stockRemoval', {
                    url: "/inventory/stockRemoval",
                    templateUrl: "views/inventoryManagement/stockRemoval/list.html",
                    data: {
                        pageTitle: '出库管理'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/inventoryManagement/stockRemovalController.js']
                            });
                        }]
                    }
                })

                // ***********************库存管理结束***********************

                // ***********************系统管理开始***********************

                // 校区管理
                .state('campus', {
                    url: "/system/campus",
                    templateUrl: "views/systemManagement/campus/list.html",
                    data: {
                        pageTitle: '校区管理'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/campusController.js']
                            });
                        }]
                    }
                })

                // 部门管理
                .state('department', {
                    url: "/system/department",
                    templateUrl: "views/systemManagement/department/list.html",
                    data: {
                        pageTitle: '部门管理'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/departmentController.js']
                            });
                        }]
                    }
                })

                // 职务管理
                .state('position', {
                    url: "/system/position",
                    templateUrl: "views/systemManagement/position/list.html",
                    data: {
                        pageTitle: '职务管理'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/positionController.js']
                            });
                        }]
                    }
                })

                // 维修工种
                .state('maintenanceType', {
                    url: "/system/maintenanceType",
                    templateUrl: "views/systemManagement/maintenanceType/list.html",
                    data: {
                        pageTitle: '维修工种'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/maintenanceTypeController.js']
                            });
                        }]
                    }
                })

                // 维修类别
                .state('maintenanceCategory', {
                    url: "/system/maintenanceCategory",
                    templateUrl: "views/systemManagement/maintenanceCategory/list.html",
                    data: {
                        pageTitle: '维修类别'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/maintenanceCategoryController.js']
                            });
                        }]
                    }
                })

                // 维修区域
                .state('maintenanceArea', {
                    url: "/system/maintenanceArea",
                    templateUrl: "views/systemManagement/maintenanceArea/list.html",
                    data: {
                        pageTitle: '维修区域'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/maintenanceAreaController.js']
                            });
                        }]
                    }
                })

                // 维修状态
                .state('maintenanceStatus', {
                    url: "/system/maintenanceStatus",
                    templateUrl: "views/systemManagement/maintenanceStatus/list.html",
                    data: {
                        pageTitle: '维修状态'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/maintenanceStatusController.js']
                            });
                        }]
                    }
                })

                // 信息模块
                .state('inforModule', {
                    url: "/system/inforModule",
                    templateUrl: "views/systemManagement/inforModule/list.html",
                    data: {
                        pageTitle: '信息模块'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/inforModuleController.js']
                            });
                        }]
                    }
                })
                // 友情链接
                .state('friendlyLink', {
                    url: "/system/friendlyLink",
                    templateUrl: "views/systemManagement/friendlyLink/list.html",
                    data: {
                        pageTitle: '友请链接'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/friendlyLinkController.js']
                            });
                        }]
                    }
                })
                // 便民服务
                .state('service', {
                    url: "/system/service",
                    templateUrl: "views/systemManagement/service/list.html",
                    data: {
                        pageTitle: '便民服务'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/systemManagement/serviceController.js']
                            });
                        }]
                    }
                })
                // ***********************系统管理结束***********************

                // ***********************用户管理开始***********************

                // 教职人员
                .state('teacher', {
                    url: "/user/teacher",
                    templateUrl: "views/userManagement/teacher/list.html",
                    data: {
                        pageTitle: '教职人员'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/userManagement/teacherController.js']
                            });
                        }]
                    }
                })

                // 维修人员
                .state('maintenanceWorker', {
                    url: "/user/maintenanceWorker",
                    templateUrl: "views/userManagement/maintenanceWorker/list.html",
                    data: {
                        pageTitle: '维修人员'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/userManagement/maintenanceWorkerController.js']
                            });
                        }]
                    }
                })

                // 注册学生
                .state('student', {
                    url: "/user/student",
                    templateUrl: "views/userManagement/student/list.html",
                    data: {
                        pageTitle: '注册学生'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/userManagement/studentController.js']
                            });
                        }]
                    }
                })

                // 用户登录日志
                .state('userLoginLog', {
                    url: "/user/userLoginLog",
                    templateUrl: "views/userManagement/userLoginLog/list.html",
                    data: {
                        pageTitle: '用户登录日志'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/userManagement/userLoginLogController.js']
                            });
                        }]
                    }
                })

                // ***********************用户管理结束***********************

                // ***********************信息管理开始***********************

                // 图文类型模块信息
                .state(
                    'inforPicture',
                    {
                        url: "/information/inforPicture",
                        templateUrl: "views/informationManagement/inforPicture/list.html",
                        data: {
                            pageTitle: '模块信息'
                        },
                        params: {
                            "messageData": null
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        {
                                            name: 'angularFileUpload',
                                            files: ['../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.js']
                                        },
                                        {
                                            name: 'app',
                                            insertBefore: '#ng_load_plugins_before',
                                            files: [
                                                'js/controllers/informationManagement/inforPictureController.js',
                                                'js/controllers/informationManagement/slideUploadController.js']
                                        }]);
                                }]
                        }
                    })

                // 幻灯管理
                .state(
                    'slide',
                    {
                        url: "/information/slide",
                        templateUrl: "views/informationManagement/slide/list.html",
                        data: {
                            pageTitle: '幻灯管理'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        {
                                            name: 'angularFileUpload',
                                            files: ['../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.js']
                                        },
                                        {
                                            name: 'app',
                                            insertBefore: '#ng_load_plugins_before',
                                            files: [
                                                'js/controllers/informationManagement/slideController.js',
                                                'js/controllers/informationManagement/slideUploadController.js']
                                        }]);
                                }]
                        }
                    })

                // 建言献策文本类型
                .state('inforText', {
                    url: "/information/inforText",
                    templateUrl: "views/informationManagement/inforText/list.html",
                    data: {
                        pageTitle: '建言献策'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/informationManagement/inforTextController.js']
                            });
                        }]
                    }
                })

                // 跳蚤市场
                .state('fleaMarket', {
                    url: "/information/fleaMarket",
                    templateUrl: "views/informationManagement/fleaMarket/list.html",
                    data: {
                        pageTitle: '跳蚤市场'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/informationManagement/fleaMarketController.js']
                            });
                        }]
                    }
                })

                // 失物招领
                .state('lostFound', {
                    url: "/information/lostFound",
                    templateUrl: "views/informationManagement/lostFound/list.html",
                    data: {
                        pageTitle: '失物招领'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/informationManagement/lostFoundController.js']
                            });
                        }]
                    }
                })

                // ***********************信息管理结束***********************

                // ***********************值班管理开始***********************

                // 工作日志
                .state('workLog', {
                    url: "/duty/workLog",
                    templateUrl: "views/dutyManagement/workLog/list.html",
                    data: {
                        pageTitle: '工作日志'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/dutyManagement/workLogController.js']
                            });
                        }]
                    }
                })

                // 值班注册流程
                .state('dutyRegister', {
                    url: "/duty/register",
                    templateUrl: "views/dutyManagement/duty/register.html",
                    data: {
                        pageTitle: '值班设置'
                    },
                    // 传参，不为空代表从值班部门跳转至值班管理，带上了区域Id
                    params: {
                        "messageData": null
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/dutyManagement/dutyController.js']
                            });
                        }]
                    }
                })

                // 值班管理
                .state('duty', {
                    url: "/duty/list",
                    templateUrl: "views/dutyManagement/duty/list.html",
                    data: {
                        pageTitle: '值班管理'
                    },
                    // 传参，不为空代表从值班部门跳转至值班管理，带上了区域Id
                    params: {
                        "messageData": null
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/dutyManagement/dutyController.js']
                            });
                        }]
                    }
                })

                // 值班表内容查看
                .state('dutyShow', {
                    url: "/duty/show",
                    templateUrl: "views/dutyManagement/duty/dutyShowList.html",
                    data: {
                        pageTitle: '值班表'
                    },
                    // 传参，不为空代表从值班部门跳转至值班管理，带上了区域Id
                    params: {
                        "id": null
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/dutyManagement/dutyController.js']
                            });
                        }]
                    }
                })
                
                /*
                // 部门,工种值班表是否配置详情
                .state('dutyList', {
                    url: "/duty/detail",
                    templateUrl: "views/dutyManagement/duty/dutyDetailList.html",
                    data: {
                        pageTitle: '值班表'
                    },
                    // 传参，不为空代表从值班部门跳转至值班管理，带上了区域Id
                    params: {
                        "id": null
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/dutyManagement/dutyController.js']
                            });
                        }]
                    }
                })
                */

                // ***********************值班管理结束***********************

                // ***********************维修管理开始***********************

                // 维修管理
                .state(
                    'maintenanceRecords',
                    {
                        url: "/maintenance/maintenanceRecords",
                        templateUrl: "views/maintenanceManagement/maintenanceRecords/list.html",
                        data: {
                            pageTitle: '维修管理'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad
                                        .load({
                                            name: 'app',
                                            insertBefore: '#ng_load_plugins_before',
                                            files: ['js/controllers/maintenanceManagement/maintenanceRecordsController.js']
                                        });
                                }]
                        }
                    })

                // 专项管理
                .state(
                    'specialMaintenance',
                    {
                        url: "/maintenance/specialMaintenance",
                        templateUrl: "views/maintenanceManagement/specialMaintenance/list.html",
                        data: {
                            pageTitle: '专项管理'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad
                                        .load({
                                            name: 'app',
                                            insertBefore: '#ng_load_plugins_before',
                                            files: ['js/controllers/maintenanceManagement/specialMaintenanceController.js']
                                        });
                                }]
                        }
                    })

                // 维修评价
                .state(
                    'maintenanceEvaluation',
                    {
                        url: "/maintenance/maintenanceEvaluation",
                        templateUrl: "views/maintenanceManagement/maintenanceEvaluation/list.html",
                        data: {
                            pageTitle: '维修评价'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad
                                        .load({
                                            name: 'app',
                                            insertBefore: '#ng_load_plugins_before',
                                            files: ['js/controllers/maintenanceManagement/maintenanceEvaluationController.js']
                                        });
                                }]
                        }
                    })

            // ***********************维修管理结束***********************

        }]);

/* Init global settings and run the app */
app.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);
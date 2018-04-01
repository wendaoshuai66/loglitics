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
// 为所有的请求头添加token
app.factory('sessionInjector', ['$rootScope', function ($rootScope) {
    var token = localStorage.getItem("com.logistics.user.token");
    var sessionInjector = {
        request: function (config) {
            config.headers['logistics-session-token'] = token;
            return config;
        }
    };
    return sessionInjector;
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
// app.config(function ($httpProvider) {
//
// });
/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/
/**
 `$controller` will no longer look for controllers on `window`.
 The old behavior of looking on `window` for controllers was originally intended
 for use in examples, demos, and toy apps. We found that allowing global controller
 functions encouraged poor practices, so we resolved to disable this behavior by
 default.

 To migrate, register your controllers with modules rather than exposing them
 as globals:

 Before:

 ```javascript
 function MyController() {
  // ...
}
 ```

 After:

 ```javascript
 angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

 Although it's not recommended, you can re-enable the old behavior like this:

 ```javascript
 angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
 **/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
app.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

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
        select4: {
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
        layoutPath: '../assets/layouts/layout3',
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
            	var loginStatus = localStorage.getItem("com.logistics.user.login");
                // 缓存中记录已经登录成功
                if (loginStatus === 'true') {
                    $scope.loginStatus = true;
                }
                else {
                    $scope.loginStatus = false;
                }
                // 使用jQuery控制的原因是，AngularJS在主App中使用ng-if控制，会有控件闪动
                // ng-if指令未生效时,quick-nav就已经渲染
                if ($scope.loginStatus) {
                    // 尽量使用prop不要使用removeAttr(在IE中会有问题)
                    // $('.quick-nav').prop("hidden", false);
                }
                // $('#myLogin').removeAttr("hidden");
                // app.js中的配置init工作
                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });
                // 页面上方进度条初始化及配置
                $rootScope.progressbar = ngProgressFactory.createInstance();
                $rootScope.progressbar.setHeight('4px');
                $rootScope.progressbar.setColor('#36D7B7');
                // 地址改变开始显示进度条
                $rootScope.$on('$locationChangeStart', function (event, toState, toParams, fromState, fromParams) {
                	$rootScope.checkStateChange(event, toState, toParams, fromState, fromParams);
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
                $rootScope.$on('$readystatechange', function (event, toState, toParams, fromState, fromParams) {
                	$rootScope.checkStateChange(event, toState, toParams, fromState, fromParams);
                });
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                	$rootScope.checkStateChange(event, toState, toParams, fromState, fromParams);
                });
                // 全局路由监听事件
            	$rootScope.checkStateChange =  function(event, toState, toParams, fromState, fromParams) {
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
                            data: {},
                            headers: {
                                'logistics-session-token': token
                            }
                        }).success(function (data) {
                            if (data == null || data == '' || data.status === 'EXPIRED') {
                                redirectToLogin();
                            }
                        }).error(function () {
                            redirectToLogin();
                        });
                    }
                    // 没有登录成功
                    else {
                        // 获取到具有权限的目录
                        var states = getAuthorityState;
                        states.forEach(function (state) {
                            if (toState.name == state) {
                                $location.path();//获取路由地址
                                $location.path('/dashboard.html').replace();
                                // 可以阻止模板解析
                                // event.preventDefault();
                                // 跳转到登录页面
                                $rootScope.userLogin();
                            }
                        });
                    }
                }
                $rootScope.formatState = function (state) {
                    if (!state.id) {
                        return state.text;
                    }
                    var levelList = JSON.parse(localStorage.getItem("departmentScope.levelList"));
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

                $rootScope.toBack = function () {
                	window.history.back(-1);
                }
                
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
                                sweetAlert("提示", $scope.optName + "成功！", "success");
                                deferred.resolve();
                            } else {
                                sweetAlert("警告", $scope.optName + "失败！", "error");
                                deferred.reject();
                            }
                            // 跳转到新add页面，并非模态框情况
                            if ($scope.stateNewPage) {
                            	if($scope.returnControllerName){
	                                $scope.removeLoading();
	                                $scope.$state.go($scope.returnControllerName, {
	                                    messageData: null
	                                });
                            	}
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
                    if (callBack != null) {
                        callBack();
                    }
                    // $scope.removeLoading();
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
                    var deferred = $q.defer();
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
                            deferred.resolve();
                        });
                    }
                    return deferred.promise;
                };
                // 第一次自执行
                // $scope.getMaterialLessAlarmInfo();
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
                    // 跳蚤市场与失物招领不能操作
                    if ($scope.controllerName == 'fleaMarket' || $scope.controllerName == 'lostFound') {
                        if (type === 'dealStatus') {
                            disabledHtml = "myDisabled";
                        }
                    }
                    else if ($scope.controllerName == 'myFleaMarket' || $scope.controllerName == 'myLostFound') {
                        if (type === 'dealStatus') {
                            var approvalStatus = $rootScope['approvalStatus'+id];
                            if(approvalStatus) {
                            	if(value==1) {
                                    disabledHtml = "myDisabled";
                                }
                                else {
                                    disabledHtml = "";
                                }
                            }
                            else {
                            	disabledHtml = "myDisabled";
                            }
                        }
                        if (type === 'approvalStatus') {
                            $rootScope['approvalStatus'+id] = value;
                            disabledHtml = "myDisabled";
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

                $rootScope.getWrapHtmlWithSpecified = function (data, value, position, maxWidth) {
                    var html = '<div data-microtip="' + data
                        + '" data-microtip-position="' + position + '">'
                        + '<div class="wrap-ellipsis" style="max-width:'+ maxWidth +'px !important;">' + value
                        + '</div></div>';
                    return html;
                };

                $rootScope.toLogin = function () {
                    $rootScope.userLogin();
                };

                // 获取内容较长列显示样式
                $rootScope.getUrlHtml = function (value, url) {
                    var html = '<a href="' + url + '" data-microtip="' + value
                        + '" data-microtip-position="right" target="_blank">' + value + '</a>';
                    return html;
                };

                // 状态改变提醒显示模态框
                $rootScope.changeStatusModal = function (id, type, value) {
                    // 需要对修改审核状态以及是交易是否完成进行特殊处理
                    if (type === 'dealStatus') {
                        // 被禁用的审核状态以及是否完成交易开关按钮，不能再次修改
                        var flag = $('[ng-model=' + type + id + ']').hasClass('myDisabled');
                        if (flag) {
                            return;
                        }
                    }
                    if (type === 'approvalStatus') {
                        return;
                    }
                    // 需要对修改审核状态以及是否幻灯进行特殊处理
                    $rootScope.changeStatusType = type;
                    $rootScope.changeStatusId = id;
                    $('#changeStatusModal').modal();
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

                $rootScope.unEmptyList = function (list) {
                    var tempUrl = [];
                    list.forEach(function (url) {
                        if(url && url != 'null') {
                            tempUrl.push(url);
                        }
                    });
                    return tempUrl;
                };
		
                $rootScope.getToken = function () {
                    return localStorage.getItem("com.logistics.user.token");
                };
                
                $rootScope.toService = function (){
                	//console.log($$scope.loginStatus);
                	if(!$scope.loginStatus) {
                		$scope.userLogin();
                	}
                }
                $rootScope.toMaterialList = function (){
                    // 登录成功的情况
               	// console.log($scope.loginStatus);
           		 if($scope.loginStatus) {
           			 //console.log($scope.isWorker);
           			 if($scope.isWorker) {
           				 $state.go('materialList');
           			 }else{
           				 sweetAlert("警告", "非维修人员没有访问权限！", "warning");
           			 }
           		 }else{
           	    		$scope.userLogin();
           	    	}
               }
                $rootScope.toDutyList = function (){
               	//console.log($scope.loginStatus);
               	if($scope.loginStatus) {
               		 //console.log($scope.isWorker);
               		if($scope.isWorker) {
               			$state.go('dutyList');
               		}else{
           				 sweetAlert("警告", "非维修人员没有访问权限！", "warning");
           			 }
               	}else{
               		$scope.userLogin();
               	}
               }
               
                $rootScope.getLoginUser = function () {
                    $rootScope.loginUser = JSON.parse(localStorage.getItem("com.logistics.user.info"));
                    $rootScope.isWorker = false;
                	if($rootScope.loginUser && ($rootScope.loginUser.role ===0 || $rootScope.loginUser.role===1)) {
                		$rootScope.isWorker = true;
                	}
                };
                $scope.getLoginUser();

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
                // 根据controllerName获取到对应的$scope对象
                $rootScope.getScope = function (controllerName) {
                    var appElement = document.querySelector('[ng-controller=' + controllerName
                        + 'Controller]');
                    var thisScope = angular.element(appElement).scope();
                    return thisScope;
                };
                // 返回 labelauty 控件所需要的html字符串,以便使用的页面进行渲染
                $rootScope.getLabelautyHtmlStr = function (scope) {
                    var timeTitles = ['全部', '本年', '本月', '本周', '昨天', '今天'];
                    var timeHtml = '';
                    // 不使用固定的标题
                    if (scope.timeTitles) {
                        timeTitles = scope.timeTitles;
                    }
                    timeTitles.forEach(function (value, index) {
                        var timeStr = '<input type="checkbox" data-labelauty="' + value + '" ng-model="time._' + index + '" ng-click="changeTime(\'_' + index + '\')"/>\n';
                        timeHtml += timeStr;
                    });
                    return timeHtml;
                };
                // 获取该年需要的日期记录
                $rootScope.getThisYearUseDateInfo = function (scope) {
                    var date = new Date();
                    var year = date.Format('yyyy');
                    var month = date.Format('MM');
                    var _time = date.getDay(); // 本周的第几天
                    _time = (_time === 0) ? 7 : _time; // 周天为第0天
                    var curMonthDays = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
                    var weekStartDate = $rootScope.getNextDayStr(date.Format('yyyy-MM-dd'), -_time + 1);
                    var weekEndDate = $rootScope.getNextDayStr(weekStartDate, 6);
                    var yesterday_milliseconds = date.getTime() - 1000 * 60 * 60 * 24;
                    var yesterday = new Date();
                    yesterday.setTime(yesterday_milliseconds);
                    scope.thisYearUseDateInfo = {};
                    scope.thisYearUseDateInfo = {
                        thisYear: {
                            start: year + '-01-01',
                            end: year + '-12-31',
                            type: 1
                        },
                        thisMonth: {
                            start: year + '-' + month + '-01',
                            end: year + '-' + month + '-' + curMonthDays,
                            type: 2
                        },
                        thisWeek: {
                            start: weekStartDate,
                            end: weekEndDate,
                            type: 3
                        },
                        yesterday: {
                            start: yesterday.Format('yyyy-MM-dd'),
                            end: yesterday.Format('yyyy-MM-dd'),
                            type: 4
                        },
                        today: {
                            start: date.Format('yyyy-MM-dd'),
                            end: date.Format('yyyy-MM-dd'),
                            type: 5
                        }
                    };
                };
                $rootScope.getSearchData = function (scope ,state) {
                    angular.forEach(scope.params ,function (value) {
                        $.extend(value, {
                            startTime:scope.addDateTimeStart,
                            endTime:scope.addDateTimeEnd
                        });
                    });
                    commonECharts.init(scope, state);
                };
                // 通过 时间范围 key 将日期框起始终止时间进行修改
                $rootScope.changeDateTimeWithBtnType = function (scope, key) {
                    var key = key.split('_')[1];
                    var dateInfo = scope.thisYearUseDateInfo;
                    var dateStrList = ['thisYear', 'thisMonth', 'thisWeek', 'yesterday', 'today'];
                    var dateStr;
                    var timeObj = $('#dateTimeRange').data('daterangepicker');
                    if (key == 0) {
                        $('#dateTimeRange').val('');
                        scope.addDateTimeStart = null;
                        scope.addDateTimeEnd = null;
                        $('#dateTimeRange').parent().addClass('hide');
                        // timeObj.setStartDate(null);
                        // timeObj.setEndDate(null);
                        return;
                    }
                    else {
                        $('#dateTimeRange').parent().removeClass('hide');
                    }
                    dateStr = dateStrList[key - 1];
                    var obj = dateInfo[dateStr];
                    var start = obj.start;
                    var end = obj.end;
                    scope.addDateTimeStart = start;
                    scope.addDateTimeEnd = end;
                    timeObj.setStartDate(start);
                    timeObj.setEndDate(end);
                };
                // 选中按钮修改日期框中的值
                $rootScope.checkBtnFromDateRange = function (scope, startTime, endTime) {
                    // 先取消所有的按钮选择
                    for (var i = 0; i < 6; i++) {
                        scope.$apply(function () {
                            scope['time']['_' + i] = false;
                        });
                    }
                    var dateObj = scope.thisYearUseDateInfo;
                    for (var i in dateObj) {
                        var obj = dateObj[i];
                        // 对应上 将该按钮选上
                        if (obj.start == startTime && obj.end == endTime) {
                            var _type = obj.type << 0;
                            scope.$apply(function () {
                                scope['time']['_' + _type] = true;
                            });
                        }
                    }
                };
                
                // 初始化 dateTimeRange
                $rootScope.initDateTimeRange = function (scope) {
                    $('#dateTimeRange').daterangepicker(
                        {
                            applyClass: 'btn-sm btn-success',
                            cancelClass: 'btn-sm btn-default',
                            locale: {
                                applyLabel: '确认',
                                cancelLabel: '取消',
                                fromLabel: '起始时间',
                                toLabel: '结束时间',
                                customRangeLabel: '自定义',
                                firstDay: 1,
                                format: scope.dateTimeRange.format || 'YYYY-MM-DD',
                                separator: '   至   ',
                                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                                monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                                    '七月', '八月', '九月', '十月', '十一月', '十二月' ],
                            },
                            timePicker: false,
                            ranges: scope.dateTimeRange.ranges || {
                                '今日': [moment().startOf('day'), moment()],
                                '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
                                '最近7日': [moment().subtract('days', 6), moment()],
                                '最近30日': [moment().subtract('days', 29), moment()],
                                '本月': [moment().startOf("month"), moment().endOf("month")],
                                '上个月': [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
                            },
                            // 时间跨度 默认一天
                            timePickerIncrement: scope.dateTimeRange.increment || 60 * 24 * 1,
                            startDate: scope.dateTimeRange.myStartDate || scope.thisYearUseDateInfo.thisWeek.start,
                            endDate: scope.dateTimeRange.myEndDate || scope.thisYearUseDateInfo.thisWeek.end,
                            opens: 'left',    // 日期选择框的弹出位置
                        },  // 监听日期变化
                        function (start, end, label) {
                            var _start = start.format(scope.dateTimeRange.format || 'YYYY-MM-DD');
                            var _end = end.format(scope.dateTimeRange.format || 'YYYY-MM-DD');
                            scope.addDateTimeStart = _start;
                            scope.addDateTimeEnd = _end;
                            scope.checkBtnFromDateRange(scope, _start, _end);
                            scope.getSearchData(scope ,$state);
                        }
                    );
                };
                // 日期框以及Labelauty按钮组统一初始化入口
                $rootScope.initDateRangeAndLabelauty = function (scope) {
                    scope.data = [];
                    scope['time'] = [];
                    // 按钮默认选中 本周
                    var num = scope.dateTimeRange.myCheckedTime || 3;
                    scope['time']['_' + num] = true;
                    // 根据当前日期获取到需要的各类信息
                    scope.getThisYearUseDateInfo(scope);
                    // 默认选中时间为 本周
                    scope.addDateTimeStart = scope.dateTimeRange.myStartDate || scope.thisYearUseDateInfo.thisWeek.start;
                    scope.addDateTimeEnd = scope.dateTimeRange.myEndDate || scope.thisYearUseDateInfo.thisWeek.end;
                    // 初始化labelauty控件以及渲染到DOM
                    var timeHtml = scope.getLabelautyHtmlStr(scope);
                    $compile($('#time').html(timeHtml))(scope);
                    // 渲染控件
                    $(':checkbox').labelauty({minimum_width: "65px"});
                    // 初始化dateTimeRange
                    scope.initDateTimeRange(scope);
                };

                // 日期时间左补一位零处理
                $rootScope.timeLeftAddZero = function(time){
                    return time > 9 ? time : '0' + (time);
                };

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
                // 将可能恶意注入的字符串进行关键字符转译
                $rootScope.specialCharChange = function (str) {
                    return str.replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
                        .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
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
					localStorage.setItem("departmentScope.levelList", JSON.stringify(levelList));
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
                // 重新加载我的报修以及维修订单的提示数据
                $rootScope.reloadMyRecordAndRepairState = function () {
                    var scope = $rootScope.getScope('header');
                    var parent = scope.$parent;
                    parent.initData(parent);
                };
                $scope.$on('$viewContentLoaded', function () {
                    // App.initComponents();
                    // init core components
                    // Layout.init();
                    // Init entire layout(header, footer, sidebar, etc)
                    // on page load if the partials included in server side
                    // instead of loading with ng-include directive
                });
                // 用于存储页面 controller名称 与对应的id 的关系
                $rootScope.getControllerPageId = function (key) {
                    return localStorage.getItem(key);
                };
                $rootScope.setControllerPageId = function (key, value) {
                    localStorage.setItem(key, value);
                };
                // 登录跳转到登录页面
                $rootScope.userLogin = function () {
                    var homeUrl = portType + '://' + window.location.host + webLoginSuffix;
                    window.location =homeUrl;
                };
                // 退出登录
                $rootScope.userSignOut = function () {
                    $('#signoutModal').modal();
                };
                // 确认注销
                $rootScope.confirmSignOut = function () {
                    $('#signoutModal').modal('hide');
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
                          /*  sweetAlert("提示", "已成功注销", "success");*/
                             // 清空记录的缓存
                             //登录成功退出登录的状态
                             localStorage.setItem("com.logistics.user.exit", "0");
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

/***********************************************************************************************************************
 * Layout Partials. By default the partials are loaded through AngularJS ng-include directive. In case they loaded in
 * server side(e.g: PHP include function) then below partial initialization can be disabled and Layout.init() should be
 * called on page load complete as explained above.
 **********************************************************************************************************************/

/* Setup Layout Part - Header */


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

/* Setup Layout Part - Sidebar */
app.controller('PageHeadController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Theme Panel */
app.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
app.controller('Footer2Controller', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);
app.controller('FooterController', ['$scope', '$http', '$compile', '$location', '$filter', function ($scope, $http, $compile, $location, $filter) {
    $scope.url = "getFriendLinkInfo";
    $scope.params = {};
    $scope.getLinkList = function () {
        $http({
            url: $scope.httpDomain + $scope.url,
            method: 'POST',
            data: $scope.params
        }).success(function (data) {
            $scope.linkList = data.data;
        })
    };
    $scope.getLinkList();
}]);

/* Setup Rounting For All Pages */
app
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            // Redirect any unmatched url
            $urlRouterProvider.otherwise("/dashboard");

            $stateProvider

            // Dashboard
                .state('dashboard', {
                    url: "/dashboard",
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
                                files: ['js/controllers/DashboardController.js']
                            });
                        }]
                    }
                })

                // Blank Page
                .state('blank', {
                    url: "/blank",
                    templateUrl: "views/blank.html",
                    data: {pageTitle: '参考模板空白内容页'},
                    //controller: "BlankController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/BlankController.js'
                                ]
                            });
                        }]
                    }
                })

                // User Profile
                .state("profile", {
                    url: "/profile",
                    templateUrl: "views/profile/main.html",
                    data: {pageTitle: 'User Profile'},
                    //controller: "UserProfileController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                    '../assets/pages/css/profile.css',

                                    '../assets/global/plugins/jquery.sparkline.min.js',
                                    '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                                    '../assets/pages/scripts/profile.min.js',

                                    'js/controllers/UserProfileController.js'
                                ]
                            });
                        }]
                    }
                })

                // 我的工作日志
                .state("myWorkLogList", {
                    url: "/myWorkLogList",
                    templateUrl: "views/workLog/myList.html",
                    data: {pageTitle: '我的工作日志记录'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/workLog/myWorkLogController.js'
                                ]
                            });
                        }]
                    }
                })
                //我的个人资料
                .state("profile.view", {
                    params: {"id": null},
                    url: "/profile",
                    templateUrl: "views/profile/view.html",
                    data: {pageTitle: '我的个人资料'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/user/profileViewController.js'
                                ]
                            });
                        }]
                    }
                })
                //我的报修记录
                .state("myRecordsList", {
                    url: "/myRecordsList",
                    templateUrl: "views/repair/repairRecords/list.html",
                    data: {pageTitle: '我的报修记录'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/repair/myRecordsController.js'
                                ]
                            });
                        }]
                    }
                })
                //维修单打印
                .state('viewMyRecord', {
                    params: {"id": null},
                    url: "/viewMyRecord?id",
                    templateUrl: "views/repair/repairRecords/view.html",
                    data: {
                        pageTitle: '维修单打印'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/repair/myRecordsController.js']
                            });
                        }]
                    }
                })
                //我的维修记录
                .state("myRepairList", {
                    url: "/myRepairList",
                    templateUrl: "views/repair/myRepair/list.html",
                    data: {pageTitle: '我的维修记录'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/repair/myRepairController.js'
                                ]
                            });
                        }]
                    }
                })
                //我的维修详情及本维修的物料使用情况
                .state("viewMyRepair", {
                    url: "/viewMyRepair?id",
                    params: {"id": null},
                    templateUrl: "views/repair/myRepair/viewMyRepair.html",
                    data: {pageTitle: '我的维修详情'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
	                            files: ['js/controllers/repair/viewMyRepairController.js',
	                                '../assets/global/plugins/echarts/4.0.2/echarts.min.js'
	                            ]
                            });
                        }]
                    }
                })
                //物料使用情况
                .state("materialUse", {
                    url: "/materialUse",
                    templateUrl: "views/repair/myRepair/materialUse.html",
                    data: {pageTitle: '物料使用情况'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/material/materialUseController.js'
                                ]
                            });
                        }]
                    }
                })
                //我的失物招领
                .state('myLostList', {
                    params: {"type": 1},
                    url: "/myLostList",
                    templateUrl: "views/lostFound/myList.html",
                    data: {
                        pageTitle: '我的失物记录'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/lostFound/myLostFoundController.js']
                            });
                        }]
                    }
                })
                //我的失物招领
                .state('myFoundList', {
                    params: {"type": 0},
                    url: "/myFoundList",
                    templateUrl: "views/lostFound/myList.html",
                    data: {
                        pageTitle: '我的招领记录'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/lostFound/myLostFoundController.js']
                            });
                        }]
                    }
                })
                //我的跳蚤市场
                .state('myFleaMarketListSale', {
                	params: {"type": 1},
                    url: "/myFleaMarketListSale",
                    templateUrl: "views/fleaMarket/myList.html",
                    data: {
                        pageTitle: '我的出售记录'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/fleaMarket/myFleaMarketController.js']
                            });
                        }]
                    }
                })
                //我的跳蚤市场
                .state('myFleaMarketListPurchase', {
                	params: {"type": 0},
                    url: "/myFleaMarketListPurchase",
                    templateUrl: "views/fleaMarket/myList.html",
                    data: {
                        pageTitle: '我的求购记录'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/fleaMarket/myFleaMarketController.js']
                            });
                        }]
                    }
                })
                //我的建言献策
                .state('mySuggestionList', {
                    url: "/mySuggestionList",
                    templateUrl: "views/suggestion/myList.html",
                    data: {
                        pageTitle: '我的建言献策'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['' +
                                'js/controllers/suggestion/mySuggestionController.js']
                            });
                        }]
                    }
                })
                // User Profile Dashboard
                .state("profile.dashboard", {
                    url: "/dashboard",
                    templateUrl: "views/profile/dashboard.html",
                    data: {pageTitle: 'User Profile'}
                })

                // User Profile Account
                .state("profile.account", {
                    url: "/account",
                    templateUrl: "views/profile/account.html",
                    data: {pageTitle: 'User Account'}
                })

                // User Profile Help
                .state("profile.help", {
                    url: "/help",
                    templateUrl: "views/profile/help.html",
                    data: {pageTitle: 'User Help'}
                })

                /*********** 自定义controller开始 **********************/
                // 新闻资讯列表
                .state('newsList', {
                    url: "/newsList",
                    templateUrl: "views/news/list.html",
                    data: {
                        pageTitle: '新闻资讯'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/news/newsController.js']
                            });
                        }]
                    }
                })

                // 新闻资讯详情
                .state('viewNews', {
                    params: {"id": null},
                    url: "/viewNews?id",
                    templateUrl: "views/news/view.html",
                    data: {
                        pageTitle: '新闻资讯详情'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/news/newsController.js']
                            });
                        }]
                    }
                })

                // 建言献策列表
                .state('suggestionList', {
                    url: "/suggestionList",
                    templateUrl: "views/suggestion/list.html",
                    data: {pageTitle: '建言献策'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/suggestion/suggestionController.js'
                                ]
                            });
                        }]
                    }
                })

                // 建言献策新增
                .state('suggestionAdd', {
                    url: "/suggestionAdd",
                    templateUrl: "views/suggestion/add.html",
                    data: {
                        pageTitle: '建言献策新增'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/suggestion/mySuggestionController.js']
                            });
                        }]
                    }
                })
                // 建言献策详情
                .state('viewSuggestion', {
                    params: {"id": null},
                    url: "/viewSuggestion?id",
                    templateUrl: "views/suggestion/view.html",
                    data: {
                        pageTitle: '建言献策详情'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/suggestion/suggestionController.js']
                            });
                        }]
                    }
                })
                // 普通维修
                .state('commonRepair', {
                    url: "/commonRepair",
                    templateUrl: "views/repair/commonRepair/list.html",
                    data: {
                        pageTitle: '普通维修'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/repair/commonRepairController.js']
                            });
                        }]
                    }
                })
                /*
                // 普通维修详情
                .state('commonRepairDetail', {
                    url: "/commonRepairDetail?id",
                    params: {"id": null},
                    templateUrl: "views/repair/commonRepair/view.html",
                    data: {
                        pageTitle: '普通维修详情页面'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/repair/commonRepairDetailController.js']
                            });
                        }]
                    }
                })
                */
                //专项维修列表
                .state('specialRepairList', {
                    url: "/specialRepairList",
                    templateUrl: "views/repair/specialRepair/list.html",
                    data: {pageTitle: '专项维修'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/repair/specialRepairController.js'
                                ]
                            });
                        }]
                    }
                })
                //专项报修记录详情
                .state('specialRepairView', {
                    params: {"id": null},
                    url: "/specialRepairView?id",
                    templateUrl: "views/repair/specialRepair/view.html",
                    data: {
                        pageTitle: '专项维修记录详情'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/repair/specialRepairController.js']
                            });
                        }]
                    }
                })
                //物料库存详情
                .state('materialView', {
                    params: {"id": null},
                    url: "/materialView?id",
                    templateUrl: "views/material/view.html",
                    data: {
                        pageTitle: '物料库存详情'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/material/materialController.js']
                            });
                        }]
                    }
                })
                //便民服务
                .state('serviceList', {
                    url: '/serviceList',
                    templateUrl: "views/service/list.html",
                    data: {pageTitle: '便民服务'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'js/controllers/service/serviceController.js'
                                ]
                            });
                        }]
                    }
                })
                // 我要报修
                .state('repairRecordsAdd', {
                    url: "/repairRecordsAdd",
                    templateUrl: "views/repair/repairRecords/add.html",
                    data: {
                        pageTitle: '我要报修'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/repair/myRecordsController.js']
                            });
                        }]
                    }
                })
                // 失物招领列表
                .state('lostList', {
                	params: {"type": 1},
                    url: "/lostList",
                    templateUrl: "views/lostFound/list.html",
                    data: {
                        pageTitle: '失物信息'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/lostFound/lostFoundController.js']
                            });
                        }]
                    }
                })
                // 失物招领列表
                .state('foundList', {
                    params: {"type": 0},
                    url: "/foundList",
                    templateUrl: "views/lostFound/list.html",
                    data: {
                        pageTitle: '招领信息'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/lostFound/lostFoundController.js']
                            });
                        }]
                    }
                })
                // 失物招领详情
                .state('viewLostFound', {
                    params: {"id": null},
                    url: "/viewLostFound?id",
                    templateUrl: "views/lostFound/view.html",
                    data: {
                        pageTitle: '失物招领详情'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/lostFound/myLostFoundController.js']
                            });
                        }]
                    }
                })
                // 失物新增
                .state('lostAdd', {
                    params: {"type": 1,"id": null},
                    url: "/lostAdd",
                    templateUrl: "views/lostFound/add.html",
                    data: {
                        pageTitle: '失物信息新增'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/lostFound/myLostFoundController.js']
                            });
                        }]
                    }
                })
                // 招领新增
                .state('foundAdd', {
                    params: {"type": 0,"id": null},
                    url: "/foundAdd",
                    templateUrl: "views/lostFound/add.html",
                    data: {
                        pageTitle: '招领信息新增'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/lostFound/myLostFoundController.js']
                            });
                        }]
                    }
                })
                //跳蚤市场列表
                .state('fleaMarketListSale', {
                	params: {"type": 1},
                    url: '/fleaMarketListSale',
                    templateUrl: "views/fleaMarket/list.html",
                    data: {pageTitle: '出售信息'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/fleaMarket/fleaMarketController.js']
                            });
                        }]
                    }
                })
                //跳蚤市场列表
                .state('fleaMarketListPurchase', {
                	params: {"type": 0},
                    url: '/fleaMarketListPurchase',
                    templateUrl: "views/fleaMarket/list.html",
                    data: {pageTitle: '求购信息'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/fleaMarket/fleaMarketController.js']
                            });
                        }]
                    }
                })
                // 出售求购详情
                .state('viewFleaMarket', {
                    params: {"id": null},
                    url: "/viewFleaMarket?id",
                    templateUrl: "views/fleaMarket/view.html",
                    data: {
                        pageTitle: '出售求购详情'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/fleaMarket/myFleaMarketController.js']
                            });
                        }]
                    }
                })
                // 跳蚤市场_我要发布
                .state('fleaMarketAddSale', {
                    params: {"type": 1,"id": null},
                    url: "/fleaMarketAddSale",
                    templateUrl: "views/fleaMarket/add.html",
                    data: {
                        pageTitle: '出售新增'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/fleaMarket/myFleaMarketController.js']
                            });
                        }]
                    }
                })
                // 跳蚤市场_我要发布
                .state('fleaMarketAddPurchase', {
                    params: {"type": 0,"id": null},
                    url: "/fleaMarketAddPurchase",
                    templateUrl: "views/fleaMarket/add.html",
                    data: {
                        pageTitle: '求购新增'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/fleaMarket/myFleaMarketController.js']
                            });
                        }]
                    }
                })

                //工作日志列表
                .state('workLogList', {
                    url: '/workLogList',
                    templateUrl: "views/workLog/list.html",
                    data: {pageTitle: '工作日志'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/workLog/workLogController.js']
                            });
                        }]
                    }
                })
                //工作日志发布
                .state('workLogAdd', {
                    url: '/workLogAdd',
                    templateUrl: "views/workLog/add.html",
                    data: {pageTitle: '添加工作日志'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/workLog/myWorkLogController.js']
                            });
                        }]
                    }
                })
                //工作日志详情
                .state('workLogView', {
                    params: {"id": null},
                    url: '/workLogView?id',
                    templateUrl: "views/workLog/view.html",
                    data: {pageTitle: '工作日志详情'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/workLog/myWorkLogController.js']
                            });
                        }]
                    }
                })
                //物料库存信息
                .state('materialList', {
                    url: '/materialList',
                    templateUrl: "views/material/list.html",
                    data: {pageTitle: '物流库存信息'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/material/materialController.js']
                            });
                        }]
                    }
                })
                // 24小时分时统计
                .state('hourStatistics', {
                    url: '/hourStatistics',
                    templateUrl: "views/charts/maintenanceStatisticWithTime/hourStatistics.html",
                    data: {pageTitle: '24小时分时统计'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/maintenanceStatistic/maintenanceStatisticWithTime/hourStatisticsController.js',
                                    '../assets/global/plugins/echarts/4.0.2/echarts.min.js'
                                ]
                            });
                        }]
                    }
                })
                // 周期分时统计
                .state('weekStatistics', {
                    url: '/weekStatistics',
                    templateUrl: "views/charts/maintenanceStatisticWithTime/weekStatistics.html",
                    data: {pageTitle: '周期分时统计'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/maintenanceStatistic/maintenanceStatisticWithTime/weekStatisticsController.js',
                                    '../assets/global/plugins/echarts/4.0.2/echarts.min.js'
                                ]
                            });
                        }]
                    }
                })
                // 月度分时统计
                .state('monthStatistics', {
                    url: '/monthStatistics',
                    templateUrl: "views/charts/maintenanceStatisticWithTime/monthStatistics.html",
                    data: {pageTitle: '月度分时统计'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/maintenanceStatistic/maintenanceStatisticWithTime/monthStatisticsController.js',
                                    '../assets/global/plugins/echarts/4.0.2/echarts.min.js'
                                ]
                            });
                        }]
                    }
                })
                // 报修来源分类统计
                .state('repairOriginStatistics', {
                    url: '/repairOriginStatistics',
                    templateUrl: "views/charts/maintenanceStatisticWithType/repairOriginStatistics.html",
                    data: {pageTitle: '报修来源分类统计'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/maintenanceStatistic/maintenanceStatisticWithType/repairOriginStatisticsController.js',
                                    '../assets/global/plugins/echarts/4.0.2/echarts.min.js']
                            });
                        }]
                    }
                })
                // 维修项目分类统计
                .state('maintenanceTypeStatistics', {
                    url: '/maintenanceTypeStatistics',
                    templateUrl: "views/charts/maintenanceStatisticWithType/maintenanceTypeStatistics.html",
                    data: {pageTitle: '维修项目分类统计'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/maintenanceStatistic/maintenanceStatisticWithType/maintenanceTypeStatisticsController.js',
                                    '../assets/global/plugins/echarts/4.0.2/echarts.min.js']
                            });
                        }]
                    }
                })
                // 维修区域分类统计
                .state('maintenanceAreaStatistics', {
                    url: '/maintenanceAreaStatistics',
                    templateUrl: "views/charts/maintenanceStatisticWithType/maintenanceAreaStatistics.html",
                    data: {pageTitle: '维修区域分类统计'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/maintenanceStatistic/maintenanceStatisticWithType/maintenanceAreaStatisticsController.js',
                                    '../assets/global/plugins/echarts/4.0.2/echarts.min.js']
                            });
                        }]
                    }
                })
                // 维修用时分类统计
                .state('timeCostStatistics', {
                    url: '/timeCostStatistics',
                    templateUrl: "views/charts/maintenanceStatisticWithQuality/timeCostStatistics.html",
                    data: {pageTitle: '维修用时分类统计'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/maintenanceStatistic/maintenanceStatisticWithQuality/timeCostStatisticsController.js',
                                    '../assets/global/plugins/echarts/4.0.2/echarts.min.js']
                            });
                        }]
                    }
                })
                // 维修评价分类统计
                .state('maintenanceStatusStatistics', {
                    url: '/maintenanceStatusStatistics',
                    templateUrl: "views/charts/maintenanceStatisticWithQuality/maintenanceStatusStatistics.html",
                    data: {pageTitle: '维修评价分类统计'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/maintenanceStatistic/maintenanceStatisticWithQuality/maintenanceStatusStatisticsController.js',
                                    '../assets/global/plugins/echarts/4.0.2/echarts.min.js']
                            });
                        }]
                    }
                })
                // 维修状态分类统计
                .state('evaluationStatistics', {
                    url: '/evaluationStatistics',
                    templateUrl: "views/charts/maintenanceStatisticWithQuality/evaluationStatistics.html",
                    data: {pageTitle: '维修状态分类统计'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/maintenanceStatistic/maintenanceStatisticWithQuality/evaluationStatisticsController.js',
                                    '../assets/global/plugins/echarts/4.0.2/echarts.min.js']
                            });
                        }]
                    }
                })

                // 值班安排信息
                .state('dutyList', {
                    url: "/duty/dutyList",
                    templateUrl: "views/duty/list.html",
                    data: {
                        pageTitle: '值班安排信息'
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
                                files: ['js/controllers/duty/dutyController.js']
                            });
                        }]
                    }
                })

                // 值班安排详情(选择工种以及年月展示排班列表)
                .state('dutyDetail', {
                    url: "/duty/dutyDetail?id&type",
                    templateUrl: "views/duty/detail.html",
                    data: {
                        pageTitle: '值班表'
                    },
                    // 传参，不为空代表从值班部门跳转至值班管理，带上了区域Id
                    params: {
                        "id": null,
                        "type": null
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'app',
                                insertBefore: '#ng_load_plugins_before',
                                files: ['js/controllers/duty/dutyController.js']
                            });
                        }]
                    }
                })
        }]);

/* Init global settings and run the app */
app.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);

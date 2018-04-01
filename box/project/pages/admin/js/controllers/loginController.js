var app = angular.module("LoginApp", []);
app.controller('loginController', ['$scope', '$http', loginController]);
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
function loginController($scope, $http) {
	$.backstretch([
			        "../assets/pages/media/bg/1.jpg",
			        "../assets/pages/media/bg/2.jpg",
			        "../assets/pages/media/bg/3.jpg",
			        "../assets/pages/media/bg/4.jpg"
			        ], {
			          fade: 1000,
			          duration: 8000
			    	}
	        	);
    $scope.loadingConfig = {
        loadingWidth: 120,
        title: '正在登录...',
        name: 'test',
        discription: '',
        direction: 'column',
        type: 'pic',
        imgSrc: './../assets/global/img/loading.gif',
        // originBg:'#71EA71',
        originDivWidth: 40,
        originDivHeight: 40,
        originWidth: 6,
        originHeight: 6,
        smallLoading: false,
        loadingMaskBg: 'rgba(0,0,0,0.2)'
    };

    // 打开遮罩层以及加载效果
    $scope.addLoading = function () {
        $('body').loading($scope.loadingConfig);
    };
    // 关闭遮罩层与加载效果
    $scope.removeLoading = function () {
        removeLoading('test');
    };
    $scope.getToken = function () {
        return localStorage.getItem("com.logistics.user.token");
    };
    // 从浏览器缓存取出上一次 记录用户名
    var _rememberme = localStorage.getItem("com.logistics.user.rememberme");
    var _username = localStorage.getItem("com.logistics.user.username");
    var _expired = localStorage.getItem("com.logistics.user.expired");
    // 过期跳转至登录页
    if(_expired === 'true') {
        sweetAlert({
            title: "登录信息已过期！",
            text: "请重新登录",
            type: "warning",
            timer: 2000,
            showConfirmButton: false
        });
        // 重新改回过期信息
        localStorage.setItem("com.logistics.user.expired", 'false');
    }
    // 没有管理员权限
    else if(_expired === 'NOADMINISTRATOR') {
        sweetAlert({
            title: "您没有权限访问！",
            text: "请使用管理员账号登录",
            type: "error",
            timer: 2000,
            showConfirmButton: false
        });
        localStorage.setItem("com.logistics.user.expired", 'false');
    }
    $scope.data = {};
    // 第一次登录没有记录 写入不记录用户名
    if (_rememberme == null) {
        localStorage.setItem("com.logistics.user.rememberme", false);
    }
    // 获取到是否记住用户名，如果为不记录用户名，需记录状态发送给后台，不记录cookie以及token 默认不记录用户名
    else {
        $scope.data.rememberme = (_rememberme == 'true') ? true : false;
    }
    if($scope.data.rememberme) {
        // 将缓存中记录的用户名取出
        if (_username != null && _username != 'undefined') {
            $scope.data.username = _username;
        }
    }
    $scope.login = function () {
        $scope.addLoading();
        // 点击登录按钮后将该用户名记录至缓存
        if($scope.data.rememberme) {
            localStorage.setItem("com.logistics.user.username", $scope.data.username);
        }
        // 包装成参数
        $scope.url = "login";
        $scope.params = {
            "rememberme": $scope.data.rememberme,
            "account": $scope.data.username,
            "password": $scope.data.password,
            // 管理员登录
            "administrator": true
        };
        $http({
            url:  httpDomain + $scope.url,
            method: 'POST',
            data: $scope.params,
            headers: {
                'logistics-session-token': $scope.getToken()
            }
        }).success(function (data, status, headers, config) {
            var clearErrorLogin = function () {
                delete $scope.data.password;
                localStorage.setItem("com.logistics.user.token", null);
                localStorage.setItem("com.logistics.user.login", false);
            };
            // 没有访问权限或者cookie过期，提示需要重新输入密码
            if (data.status === 'NOADMINISTRATOR') {
                sweetAlert("警告", "请使用管理员账号登录", "warning");
                clearErrorLogin();
            }
            // 没有访问权限或者cookie过期，提示需要重新输入密码
            if (data == null || data.status === 'NOTLOGIN') {
                sweetAlert("警告", "密码已过期,请重新输入", "warning");
                clearErrorLogin();
            }
            // 成功登录
            if (data.status === 'SUCCESS') {
                localStorage.setItem("com.logistics.user.login", true);
                localStorage.setItem("com.logistics.user.token", data.token);
                // 写入登录用户信息
                localStorage.setItem("com.logistics.user.info", JSON.stringify(data.user));
                // 成功隐藏登录页面,展示前端页面
                $scope.loginCallback();
            }
            // 用户名或密码错误
            else if (data.status === 'ERROR') {
                sweetAlert("警告", "用户名、密码错误！", "error");
                localStorage.setItem("com.logistics.user.login", false);
            }
            $scope.removeLoading();
        }).error(function (data, status, headers, config) {
            localStorage.setItem("com.logistics.user.login", false);
            sweetAlert("警告", "登录异常,请重试!", "error");
            $scope.removeLoading();
        });
    };
    // 登录回调
    $scope.loginCallback = function (data) {
        // 重新跳转到后勤页面
        var homeUrl = portType + '://' + window.location.host + webLocationSuffix;
        window.location =homeUrl;
    };
    // 针对是否记住密码状态修改触发
    $scope.changeRemember = function () {
        localStorage.setItem("com.logistics.user.rememberme", $scope.data.rememberme);
    };
};


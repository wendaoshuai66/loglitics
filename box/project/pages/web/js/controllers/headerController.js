angular.module("MetronicApp").controller('headerController', ['$scope', '$q','$stateParams', '$state', headerController]);

function headerController($scope, $q, $stateParams, $state) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
    $scope['myState'] = $state;
    // 发送请求获取正在维修中的订单
    $scope.getIsServiceInfo = function () {
        $scope.selectUrl = 'getWarrantyNumberIsServiceListByUserId';
        $scope.selectParams = {
            userId: $scope.user.id,
            type: 'isService'
        };
        $scope.selectOptName = '获取正在维修订单';
        $scope.selectPara = 'isServiceOrders';
        return $scope.getSelectInfoApi($scope);
    };
    // 设置正在维修订单的样式
    $scope.setIsServiceStyle = function () {
        var deferred = $q.defer();
        // 计算维修进行中的订单css高度
        var liHeight = $scope.isServiceOrders.length * 55 + 'px';
        if ($scope.isServiceOrders.length >= 3) {
            liHeight = '165px';
        }
        $scope.isServiceLiStyle = {
            "height": liHeight
        };
        deferred.resolve();
        return deferred.promise;
    };
    
    // 获取所有未完成的订单
    $scope.getIncompleteOrders = function () {
        $scope.selectUrl = 'getWarrantyNumberIsServiceListByUserId';
        $scope.selectParams = {
            userId: $scope.user.id,
            type: 'incompleteOrders'
        };
        $scope.selectOptName = '获取正在进行的订单';
        $scope.selectPara = 'incompleteOrders';
        return $scope.getSelectInfoApi($scope);
    };
    // 设置未完成订单的列表样式
    $scope.setIncompleteOrdersStyle = function () {
        var deferred = $q.defer();
        // 计算维修进行中的订单css高度
        var liHeight = $scope.incompleteOrders.length * 75 + 5 + 'px';
        if ($scope.incompleteOrders.length >= 3) {
            liHeight = '225px';
        }
        $scope.incompleteLiStyle = {
            height: liHeight
        };
        angular.forEach($scope.incompleteOrders, function (incompleteOrder) {
            $scope['incompleteStyle' + incompleteOrder.id] = {
                thisIncompleteStyle: {
                    width: incompleteOrder.maintenanceRecord.maintenanceStatus.percent.toString()
                }
            };
        });
        deferred.resolve();
        return deferred.promise;
    };
    $scope.initData = function (scope) {
        var userInfoStr = localStorage.getItem('com.logistics.user.info');
        var userInfo = JSON.parse(userInfoStr);
        scope.user = {
            id: userInfo.id,
            role: userInfo.role
        };
        $q.all([scope.getIncompleteOrders()]).then(function () {
            return scope.setIncompleteOrdersStyle();
        }).then(function () {
            return scope.getIsServiceInfo();
        }).then(function () {
            scope.setIsServiceStyle();
        });
    };
    // 1.获取该维修人员下的所有维修中的记录
    // 2.设置正在维修记录的样式
    // 3.获取除过已完成的所有订单记录
    // 4.设置未完成订单的样式
    if ($scope.loginStatus) {
        $scope.initData($scope);
    }
    $scope.dutyList = function (id, name, type) {
        localStorage.setItem('com.logistics.duty.departmentSelectedId', id);
        localStorage.setItem('com.logistics.duty.dutyShowDepartmentName', name);
        var maintenanceTypeID = '';
        if(type){
        	maintenanceTypeID = $scope.loginUser.maintenanceTypeID;
        }
        localStorage.setItem('com.logistics.duty.dutyShowMaintenanceTypeID', maintenanceTypeID);
        $state.go('dutyDetail', {'id': id,'type':type});
    };
}

//轮播图片
angular.module("MetronicApp").controller('carouselNewsController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
    '$stateParams', '$q', '$sce', carouselNewsController]);

function carouselNewsController($scope, $http, $compile, $location, $filter, $timeout, $stateParams, $q, $sce) {
    $scope.width = slideImageWidth;
    $scope.height = slideImageHeight;
    $scope.url = "getInforSlideList";
    $scope.params = {
        "searchObj[homeShow]": 1,
        "pageSize": 10,
        "start": 0,
        "pageNumber": 1,
        "order[name]": 'addDateTime',
        "order[dir]": 'desc'
    };
    $http({
        method: 'POST',
        url: $scope.httpDomain + $scope.url,
        params: $scope.params
    }).success(function (data) {
        $scope.carouselPic = data.data;
        $scope.firstCarouseurl = [];
        angular.forEach($scope.carouselPic, function (value) {
            $scope.firstCarouseurl.push(value.url);
        });
        if ($scope.carouselPic) {
            // 幻灯不足两张,拼接两张固定图片
            if($scope.carouselPic.length < 2) {
                $scope.carouselPic.push({
                    slidePicture: './images/carousel/news1.jpg',
                    title: '服务后勤'
                },{
                    slidePicture: './images/carousel/news2.jpg',
                    title: '数字后勤文化后勤'
                });
            }
            $scope.firstTitle = $scope.carouselPic[0].title;
            $scope.showCarouse = true;
        }
        else {
            $scope.showCarouse = false;
        }
    });

    $scope.shutterInit = function () {
        var parent = $('#carouselDom');
        var width = parent.width();
        $('#shutter1').shutter({
            shutterW: width, // 容器宽度
            shutterH: 270, // 容器高度
            isAutoPlay: true, // 是否自动播放
            playInterval: 3000, // 自动播放时间
            curDisplay: 0, // 当前显示页
            fullPage: false // 是否全屏展示
        });
    };

    $scope.dealWithCarouseHref = function () {
        var shutter = $('#shutter1 a');
        shutter.each(function (index, dom) {
            $(dom).attr('href', $scope.firstCarouseurl[index]);
        });
    };

    // ng-repeat 结束句柄
    $scope.renderFinish = function () {
        $scope.shutterInit();
        $scope.dealWithCarouseHref();
    };

};
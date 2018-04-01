angular.module("MetronicApp").controller('DashboardController', ['$rootScope', '$scope', '$http', '$timeout', DashboardController]);
function DashboardController($rootScope, $scope, $http, $timeout) {
    var requestUrl;
    if ($rootScope.ifOpenApi) {
        requestUrl = $scope.httpDomain + 'getHomePageClassifyCount';
    } else {
        requestUrl = 'demo/homePageClassifyCount.json';
    }
    $.ajax({
        type: "POST",
        url: requestUrl,
        cache: false, // 禁用缓存
        data: {}, // 传入组装的参数
        dataType: "json",
        success: function (data) {
            $scope.countNameList = ['maintenanceRecord', 'teacher', 'maintenanceWorker', 'student'];
            angular.forEach($scope.countNameList, function (value) {
                $('#' + value).attr("data-value", data.data[value + 'Count']);
            });
            $scope.startCounterUp();
        }
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    // 开始counterUp动画
    $scope.startCounterUp = function () {
        $("[data-counter='counterup']").counterUp({
            delay: 10,
            time: 1000
        });
    };
    // webSocket对象
    var webSocket;
    $scope.addSocket = function () {
        webSocket = new WebSocket(socketDomain + 'websocketTest');
    };
    // $scope.addSocket();

    // 收到推送消息
    // webSocket.onmessage = function(event) {
    //     var data = event.data;
    //     var pushVO = JSON.parse(data);
    //     // 推送添加校区内容
    //     if(pushVO.key === 1001) {
    //         UIToastr.show('系统消息', '添加校区:' + pushVO.msg, 'success');
    //     }
    // };
}
angular.module("MetronicApp").controller('viewMyRepairController', ['$scope', '$http', '$compile', '$location', '$filter', '$stateParams', '$q', '$state', viewMyRepairController]);

function viewMyRepairController($scope, $http, $compile, $location, $filter, $stateParams, $q, $state) {
    //获取评价结果3种状态
    $scope.isSaveMsg = false;
    getRepairStatusData($scope, $http, $compile, $location, $filter);
    $scope.getPageData = function () {
        var id;
        if ($stateParams.id === null) {
            //id = $scope.getControllerPageId('viewMyRepairId');
        }
        else {
            id = $stateParams.id;
            //$scope.setControllerPageId('viewMyRepairId', id);
        }
        $scope.controllerName = 'viewMyRepair';
        $scope.selectIdList = ['select'];
        // 获取订单详情结束后获取该订单下的出库记录
        //$scope.addLoading();
        $http({
            url: $scope.httpDomain + "getMaintenanceRecordById",
            method: 'POST',
            data: {"id": id},
            headers: {
                'logistics-session-token': $scope.getToken()
            }
        }).success(function (data) {
            $scope.data = data.data;
            if (data.imgUrls && data.imgUrls.uploadFileUrl) {
                $scope.hasImg = true;
                var imgUrls = data.imgUrls.uploadFileUrl;
                var urls = imgUrls.split(',');
                $scope.image = {
                    urls: urls
                }
            }
            else {
                $scope.hasImg = false;
            }
            $scope.initSly();
            var method = data.data.repairMethod;
            if (method == 1) {
                $scope.data.repairMethod = "微信报修";
            } else {
                $scope.data.repairMethod = "网页报修";
            }
            //$scope.data.maintenanceRecord.evaluationGrade = 1;
            //先获取data数据后再执行
            $q.all([getMaterialSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
                return getMaintenanceStatusData($scope, $http, $compile, $location, $filter);
            }).then(function () {
                $scope.dealStatusAndBindTimeLine();
                $scope.initPiePercent();
                $scope.initDataTable();
                $scope.calculateTime();
                $scope.removeLoading();
                ComponentsBootstrapMaxlength.init(['maxlength_textarea2']);
            });
            $scope.initDataTable = function () {
                // 列表数据初始化
                $scope.columns = [{
                    "data": "id"
                }, {
                    "data": "material.name"
                }, {
                    "data": "material.specificationsModel"
                }, {
                    "data": "material.materialCategory.name"
                }, {
                    "data": "warrantyNumber.maintenanceNumber"
                }, {
                    "data": "stockRemovalCount"
                }, {
                    "data": "material.materialUnit.name"
                }, {
                    "data": "stockRemovalDate"
                }, {
                    "data": "warrantyNumber.maintenanceStaff.name"
                }, {
                    "data": "addDateTime"
                }];
                $scope.orderableAry = [0, 1, 2, 3, 5, 6];
                $scope.wrapAry = [1, 2, 3, 4];
                $scope.wrapShortAry = [6];
                $scope.targetsOpt = 10;
                $scope.nullStr = [8];
                $scope.dateFormatAry = [7, 9];
                $scope.order = [[7, "desc"]];
                $scope.optHtmlAry = ["remove"];//, "print"
                var url = "getStockRemovalList";
                $scope.url = url;
                $scope.reloadUrl = url;
                $scope.initDataTablesName = 'myMaterialUseDataTable';
                // 默认只查询该单号下的出库记录
                $scope.searchObj = {
                    warrantyNumber: {
                        maintenanceNumber: $scope.data.maintenanceNumber
                    }
                };
                dataTables.init($scope, $http, $compile, $location, $filter);
            };
        });
    };
    $scope.getPageData();
    // 手动设置完成状态(已完成,重复报修,无法维修)
    $scope.setMaintenanceDoneStatus = function () {
        var updateMaintenanceStatusScope = $scope.getScope('updateMaintenanceStatus');
        updateMaintenanceStatusScope.data = {
            maintenanceStatus: {
                id: 5
            }
        };
        updateMaintenanceStatusScope.modalTitle = '手动设置完成状态';
        $('#updateMaintenanceStatusModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function () {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteStockRemoval";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $q.all([($scope.postApi($scope))]).then(function () {
            $state.reload();
        });
    };
    //$scope.resetInputList = ['positiveInteger'];
    $scope.resetInputList = ['stockRemovalCount'];
    $scope.addModal = function () {
        var addScope = $scope.getScope('myMaterialUseAdd');
        addScope.data = {};
        $("#stockRemovalCount").attr("disabled", "disabled");
        $scope.resetErrorInput(addScope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加出库信息';
        addScope.controllerName = 'myMaterialUse';
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm(addScope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 处理TimeLine 初始化数据等内容(根据当前维修进度筛选出之前的进度,并将其列表写入)
    $scope.dealStatusAndBindTimeLine = function () {
        // 取出所有的状态
        var allStatus = angular.copy($scope.maintenanceStatusData);
        var _weight = ($scope.data.maintenanceRecord.maintenanceStatus.weight << 0);
        // 判断是否已到完成状态
        if (_weight >= 6) {
            $scope.statusAllDown = true;
        }
        else {
            $scope.statusAllDown = false;
        }
        var beforeStatusObj = [];
        angular.forEach(allStatus, function (status) {
            // 正常维修流程
            if (_weight <= 6) {
                // 取出权重小于当前状态的 status 对象
                if ((status.weight << 0) < _weight) {
                    beforeStatusObj.push(status);
                }
            }
            // 无法正常维修
            else {
                var thisId = $scope.data.maintenanceRecord.maintenanceStatus.id;
                // 重复报修或无法维修
                if (thisId > 6) {
                    if ((status.weight << 0) < 3) {
                        beforeStatusObj.push(status);
                    }
                }
            }
        });
        beforeStatusObj.sort(function (a, b) {
            return (a.weight << 0) - (b.weight << 0);
        });
        $scope.beforeStatusObj = beforeStatusObj;
    };
    // 渲染百分比环形图
    $scope.initPiePercent = function () {
        var value = $scope.data.maintenanceRecord.maintenanceStatus.percent.split('%')[0];
        var option1 = {
            value: value,
            name: '当前进度',//必填
            backgroundColor: null,
            color: [$scope.data.maintenanceRecord.maintenanceStatus.percentRGB, '#cccccc'],
            fontSize: 15,
            domEle: document.getElementById("pieDiagram")//必填
        };
        var percentPie1 = new PercentPie(option1);
        percentPie1.init($state);
    };
    // 计算维修用时
    $scope.calculateTime = function () {
        var dbTime = $scope.data.maintenanceTime;
        if (dbTime && dbTime != 'null') {
            $scope.timeCost = dbTime + '小时';
            $scope.timeDown = true;
        }
        else {
            $scope.timeCost = '维修未结束';
            $scope.timeDown = false;
        }

    };
    //发表评价
    $scope.saveComment = function () {
        $scope.url = "saveMaintenanceRecord";
        $scope.optName = "评价";
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $q.all([$scope.postApi($scope)]).then(function () {
            //$scope.isSaveMsg = true;
            //$scope.data.maintenanceRecord.evaluationGrade = 1;
            //$scope.data.maintenanceRecord.evaluationContent = '';
            //$state.go("viewMyRepair", {id: id},{reload:true});
            //location.reload();
            $scope.reloadMyRecordAndRepairState();
            $scope.getPageData();
        });
    };

    // 初始化轮播控件
    $scope.initSly = function () {
        var appendSlideHtml = '';
        if ($scope.image && $scope.image.urls) {
            angular.forEach($scope.image.urls, function (value) {
                appendSlideHtml +=
                    '<li class="carouselShadow">\n' +
                    '\t\t<div class="pic"><a href="' + value + '" target="_blank"><img src="' + value + '" /></a></div>\n' +
                    '</li>';
            });
            $('.picList').append(appendSlideHtml);
            $(".picScroll-left").slide({
                titCell: ".hd ul",
                mainCell: ".bd ul",
                autoPage: true,
                effect: "left",
                autoPlay: true,
                vis: 2,
                trigger: "click"
            });
        }
        else {
            $('.picScroll-left').addClass('hide');
        }

    };
};
angular.module("MetronicApp").controller('myMaterialUseAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$state',
    myMaterialUseAddController]);

function myMaterialUseAddController($scope, $http, $compile, $location, $filter, $q, $state) {
    $scope.searchInit = false;
    $scope.option = {
        format: "yyyy-mm-dd",
        minView: 2,
        endDate: new Date()
    };
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 监听物料下拉框修改
    $scope.selectMaterial = function () {
        $scope.data.stockRemovalCount = '';
        // 深复制一个对象
        var materialList = angular.copy($scope.materialSelectData);
        angular.forEach(materialList, function (val) {
            if (val.id == $scope.data.material.id) {
                $scope.data.material = val;
                $scope.maxCount = $scope.data.material.inventoryQuantity;
                $scope.maxLength = $scope.maxCount + "".length;
                // 限制最大出库个数
                $("#stockRemovalCount").attr("max", $scope.maxCount);
                // $("#stockRemovalCount").attr("maxlength", $scope.maxLength);
                $("#stockRemovalCount").removeAttr("disabled");
            }
            if ($scope.data.material.id == null) {
                $scope.data.material = null;
                $("#stockRemovalCount").attr("disabled", "disabled");
            }
        });
    };
    // 检验输入
    $scope.checkMaxCount = function () {
        if ($scope.data.stockRemovalCount > $scope.maxCount) {
            sweetAlert("警告", "最大可出库数量为:" + $scope.maxCount + "个", "error");
            $scope.maxCountError = true;
        } else {
            $scope.maxCountError = false;
        }
    };
    // 保存按钮响应
    $scope.save = function () {
        // 更新数据
        $('#addModal').modal('hide');
        //$scope.addLoading();
        $scope.url = "saveStockRemoval";
        // 修改
        if ($scope.data.id !== undefined) {
            $scope.optName = "修改";
        }
        // 添加
        else {
            $scope.dataRefresh = true;
            $scope.optName = "添加";
        }
        $scope.data.warrantyNumber = {
            id: $scope.$parent.data.id
        };
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $q.all([($scope.postApi($scope))]).then(function () {
            $state.reload();
        });
    };
};
angular.module("MetronicApp").controller('updateMaintenanceStatusController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$state',
    updateMaintenanceStatusController]);

function updateMaintenanceStatusController($scope, $http, $compile, $location, $filter, $q, $state) {
    ComponentsBootstrapMaxlength.init(['maxlength_textarea']);
    $scope.statusTypeData = [{
        "id": 5,
        "name": "维修完成",
        "value": "5"
    }, {
        "id": 7,
        "name": "重复报修",
        "value": "7"
    }, {
        "id": 8,
        "name": "无法维修",
        "value": "8"
    }];
    $scope.data = {
        maintenanceStatus: {
            id: 5
        }
    };
    // 手动指定维修状态
    $scope.save = function () {
        $('#updateMaintenanceStatusModal').modal('hide');
        var statusId = $scope.data.maintenanceStatus.id;
        var reason = $scope.data.unableRepairReason;
        $scope.url = 'completionMaintenanceRecordForWorker';
        var viewMyRepairScope = $scope.getScope('viewMyRepair');
        var id = viewMyRepairScope.data.id;
        $scope.params = {
            // 维修状态id
            maintenanceStatusId: statusId,
            // 不能维修原因
            unableRepairReason: reason,
            // 维修订单id
            id: id
        };
        $scope.optName = '手动设置完成状态';
        $q.all([($scope.postApi($scope))]).then(function () {
            $scope.reloadMyRecordAndRepairState();
            $state.reload();
        });
    }
};
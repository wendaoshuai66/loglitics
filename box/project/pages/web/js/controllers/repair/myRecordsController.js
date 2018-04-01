angular.module("MetronicApp").controller('myRecordsController', ['$scope', '$http', '$compile', '$location', '$filter','$state',
    myRecordsController]);
function myRecordsController($scope, $http, $compile, $location, $filter,$state) {
    $scope.data={};
    $scope.searchObj = {};
    // controller名称初始化
    $scope.controllerName = 'myRecords';
    // 下拉框id初始化
    $scope.searchInit = true;
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "maintenanceNumber"
    }, {
        "data": "maintenanceItemName"
    }, {
        "data": "maintenanceRecord.maintenanceCategory.maintenanceType.name"
    }, {
        "data": "maintenanceRecord.maintenanceCategory.name"
    }, {
        "data": "addDateTime"
    }, {
        "data": "maintenanceStaff.name"
    }, {
        "data": "maintenanceRecord.maintenanceStatus.name"
    }, {
        "data": "maintenanceTime"
    }];
    $scope.orderableAry = [0,1,2,3,4,6,7,8];
    $scope.order = [[5, "desc"]];
    $scope.wrapAry = [2, 3, 4];
    $scope.nullStr = [6];
    $scope.dateFormatMonthDay = [5];
    //$scope.targetsOpt = 9;
    $scope.viewCommonRepairAry = [1];
    //$scope.optHtmlAry = ["comment"];
    $scope.url = "getMaintenanceRecord";
    $scope.searchObj={};
    $scope.searchObj.repairStaff={"id":$scope.loginUser.id};
    $scope.initDataTablesName='myRecordsDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchObj.repairStaff={"id":$scope.loginUser.id};
        $scope.searchInfo($scope);
    };
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
    //评价
    $scope.commentModal = function(id) {
        $scope.data.id = id;
        $scope.modalTitle = '维修服务评价';
        $('#commentModal').modal();
    };
}
//添加
angular.module("MetronicApp").controller('myRecordsAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$q', '$state', '$timeout', myRecordsAddController]);

function myRecordsAddController($scope, $http, $compile, $location, $filter, $q, $state, $timeout) {
	ComponentsBootstrapMaxlength.init(['maxlength_textarea2','maxlength_textarea1']);
	// 存放上传图片路径集合
    $scope.uploadSuccessImgUrl = [];
    // 用于记录表单中添加的图片个数
    $scope.thisPageAddImgCount = 0;
    $scope.uploadTypeOnlyImg = true; // 只能上传图片
    $scope.maxImg = uploadImgMaxCount; // 最多上传10张
    // 上传图片配置
    Upload.init($scope, $timeout);
    // 单选框初始化
    getStatusUseTypeData($scope, $http, $compile, $location, $filter);
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2', 'select3', 'select4'];
    // 下拉框数据初始化
    $q.all([getCampusSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
        return getMaintenanceAreaData($scope, $http, $compile, $location, $filter);
    }).then(function () {
        return getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter);
    }).then(function(){
        return getMaintenanceCategorySelectData($scope, $http, $compile, $location, $filter);
    });
    $scope.searchInit = true;
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 监听校区下拉框修改
    $scope.$watch("data.maintenanceRecord.maintenanceArea.campus.id", function (newValue) {
        var campusId = newValue;
        var maintenanceAreaList = angular.copy($scope.maintenanceAreaData);
        var maintenanceAreaNewList = [];
        if (campusId != null) {
            angular.forEach(maintenanceAreaList, function (val) {
                if (val.campus.id == campusId) {
                    maintenanceAreaNewList.push(val);
                }
            });
        }
        $scope.maintenanceAreaDataFromCampus = maintenanceAreaNewList;
    }, true);
    // 监听维修工种下拉框修改
    $scope.$watch("data.maintenanceRecord.maintenanceCategory.maintenanceType.id", function (newValue) {
        var typeId = newValue;
        var maintenanceTypeList = angular.copy($scope.maintenanceCategorySelectData);
        var maintenanceTypeNewList = [];
        if (typeId != null) {
            angular.forEach(maintenanceTypeList, function (val) {
                if (val.maintenanceType.id == typeId) {
                    maintenanceTypeNewList.push(val);
                }
            });
        }
        $scope.maintenanceCategoryDataFromType = maintenanceTypeNewList;
    }, true);
    // 保存按钮
    $scope.save = function () {
        $scope.addLoading();
        $scope.url = "saveMaintenanceRecord";
        $scope.data.repairStaff = {"id": $scope.loginUser.id};
        $scope.optName = "添加";
        // 保存上传图片的路径 用逗号隔开
        var tempUrl = $scope.unEmptyList($scope.uploadSuccessImgUrl);
        $scope.data.fileUrls = tempUrl.join(',');
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $scope.stateNewPage = false;
        $scope.initDataTablesName = 'myRecordsDataTable';
        $q.all([$scope.postApi($scope)]).then(function () {
            // var headerScope = $scope.getScope('header');
            // var state = headerScope.$state;
            $scope.reloadMyRecordAndRepairState();
            $state.go("myRecordsList");
        });
    };

};
// 打印
angular.module("MetronicApp").controller('myRecordsViewController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
    '$stateParams', '$q', '$sce','$state', myRecordsViewController]);
function myRecordsViewController($scope, $http, $compile, $location, $filter,
                            $timeout, $stateParams, $q, $sce,$state) {
    // 传来的数据为空(页面刷新情况)
    var id;
    if(!$stateParams.id) {
        //id = $scope.getControllerPageId('myRecordsId');
    }
    else {
        id = $stateParams.id;
        //$scope.setControllerPageId('myRecordsId', id);
    }
    $http({
        url: $scope.httpDomain + "getMaintenanceRecordById",
        method: 'POST',
        data: {"id":id},
        headers: {
            'logistics-session-token': $scope.getToken()
        }
    }).success(function (data) {
        $scope.data= data.data;
        var method=data.data.repairMethod;
        if(method==1) {
            $scope.data.repairMethod="微信报修";
        }else{
            $scope.data.repairMethod="网页报修";
        }
        //
        $scope.url = "getStockRemovalListByWarrantyNumber";
        $scope.params = {"id":id};
        $http({
            url: $scope.httpDomain + $scope.url,
            method: 'POST',
            data: $scope.params
        }).success(function (data1) {
            $scope.materialList = data1.data;
        })
    });
    $scope.pageDate = new Date().Format('yyyy 年 MM 月 dd 日');
    // 打开预览模态框
    $scope.openPrint = function () {
        $scope.modalTitle = '维修表预览及打印';
        var weight = $scope.data.maintenanceRecord.maintenanceStatus.weight;
        // 无法维修
        if(weight == 8) {
            $scope.data.maintenanceRecord.unableRepairReason = '原因说明 : [ ' + $scope.data.maintenanceRecord.unableRepairReason + ' ]';
        }
        $scope.selectUrl = 'getStockRemovalMaterialNameFromWarrantyNumberId';
        $scope.selectParams = {
            id: $scope.data.id
        };
        $scope.selectPara = 'materialListStr';
        $scope.selectOptName = '获取用料信息';
        $q.all([$scope.getSelectInfoApi($scope)]).then(function () {
            if($scope.materialListStr === 'noData') {
                $scope.materialListStr = '无领用记录'
            }
            $('#printingModal').modal()
        })

    };
    // 打印操作
    $scope.printThisPage = function () {
        $("#printPage").print();
    };
};
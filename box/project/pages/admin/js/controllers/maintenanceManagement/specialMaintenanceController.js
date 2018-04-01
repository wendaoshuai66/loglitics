angular.module("MetronicApp").controller('specialMaintenanceController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
    specialMaintenanceController]);
function specialMaintenanceController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch'];
    // controller名称初始化
    $scope.controllerName = 'specialMaintenance';
    // 单选框初始化
    getStatusUseTypeData($scope, $http, $compile, $location, $filter);
    // 下拉框id初始化
    $scope.selectIdList = ['select', 'select2', 'select3', 'select4'];
    $scope.searchInit = true;
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "maintenanceNumber"
    }, {
        "data": "maintenanceSpecial.department.campus.name"
    }, {
        "data": "maintenanceAreaName"
    }, {
        "data": "address"
    }, {
        "data": "maintenanceItemName"
    }, {
        "data": "maintenanceContent"
    }, {
        "data": "maintenanceStartDateTime"
    }, {
        "data": "maintenanceEndDateTime"
    }, {
        "data": "maintenanceSpecial.department.name"
    }, {
        "data": "maintenanceStaff.name"
    }, {
        "data": "maintenanceStaff.tel"
    }, {
        "data": "maintenanceTime"
    //}, {
    //    "data": "maintenanceSpecial.ifDone"
    //}, {
    //    "data": "maintenanceSpecial.progressDescription"
    }];
    $scope.orderableAry = [0];
    $scope.htmlType = [6];
    $scope.dateFormatAry = [7, 8];
    //$scope.ifDoneType = 13;
    $scope.targetsOpt = 13;
    $scope.wrapAry = [1, 5, 9];
    $scope.wrapShortAry = [10];
    $scope.order = [[7, "desc"]];
    $scope.optHtmlAry = ["detail", "edit", "remove"];//, "print"
    var url = "getSpecialMaintenance";
    $scope.url = url;
    $scope.reloadUrl = url;
    $scope.initDataTablesName = 'specialMaintenanceDataTable';
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    //$scope.resetInputList = ['name', 'text2', 'description'];
    $scope.resetInputList = ['name', 'address', 'maintenanceContent'];
    //
    $q.all([getCampusSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
    	return getMaintenanceAreaData($scope, $http, $compile, $location, $filter);
//    }).then(function () {
//         return getDepartmentSelectData($scope, $http, $compile, $location, $filter);
    }).then(function () {
        return getWorkerSelectData($scope, $http, $compile, $location, $filter);
    });
    // 页面跳转到添加
    $scope.addModal = function () {
        $scope.addLoading();
        $('select').removeProp('disabled');
        $('#addModal').modal();
        // 取出全部的维修部门
        $scope.selectParams = {
            "getAll": true,
            "ifLogistics": 1,
            "ignoreDeleteAndStatus": false
        };
        // 下拉框数据初始化
//        $q.all([getCampusSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
//            return getMaintenanceAreaData($scope, $http, $compile, $location, $filter);
//        }).then(function () {
//            return getWorkerSelectData($scope, $http, $compile, $location, $filter);
//        }).then(function () {
        	$scope.data = {};
            $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
            // 除过校区下拉框信息,其余的全部清除
            delete $scope.maintenanceAreaDataFromCampus;
            delete $scope.departmentDataFromArea;
            delete $scope.workerDataFromDepartment;
            $scope.data.maintenanceNumber = getMaintenanceNumber();
            $scope.modalTitle = '添加专项维修项目';
            $scope.data.status = "1";
            $scope.triggerSelect($scope, $http, $compile, $location, $filter);
            $scope.resetForm($scope, $http, $compile, $location, $filter);
            $scope.removeLoading();
       // });
    };
    // 修改页面
    $scope.editModal = function (data) {
        $scope.addLoading();
        $('#addModal').modal();
        $scope.selectParams = {
            "getAll": true,
            "ifLogistics": 1,
            "ignoreDeleteAndStatus": true
        };
        $('select').prop('disabled', 'true');
        // 下拉框数据初始化
//        $q.all([getCampusSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
//            return getDepartmentSelectData($scope, $http, $compile, $location, $filter);
//        }).then(function () {
//            return getMaintenanceAreaData($scope, $http, $compile, $location, $filter);
//        }).then(function () {
//            return getWorkerSelectData($scope, $http, $compile, $location, $filter);
//        }).then(function () {
        $q.all([getDepartmentSelectData($scope, $http, $compile, $location, $filter)]).then(function () {
            $scope.selectParams["ignoreDeleteAndStatus"] = false;
            $scope.data = data;
            $scope.data.maintenanceStartDateTime = subDateStr($scope.data.maintenanceStartDateTime);
            $scope.data.maintenanceEndDateTime = subDateStr($scope.data.maintenanceEndDateTime);
            $scope.modalTitle = '修改专项维修项目';
            $scope.maintenanceAreaDataFromCampus = $scope.maintenanceAreaData;
            $scope.departmentDataFromArea = $scope.departmentSelectData;
            $scope.workerDataFromDepartment = $scope.workerSelectData;
            $scope.triggerSelect($scope, $http, $compile, $location, $filter);
            $scope.resetForm($scope, $http, $compile, $location, $filter);
            $scope.removeLoading();
        });
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function () {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteSpecialMaintenance";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 查询按钮响应
    $scope.search = function () {
        $scope.searchInfo($scope);
    };
    $scope.reset = function () {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
    // 监听校区下拉框修改
    $scope.changeCampus =  function (callback) {
        if($scope.data.id) return;
        var newValue = $scope.data.maintenanceSpecial.department.campus.id;
        if (newValue != null) {
            $scope.selectParams = {
                "getAll": false,
                "ifLogistics": 1,
                "campusId": newValue
            };
            // 根据校区id重新刷新校区下拉框
            $q.all([getDepartmentSelectData($scope, $http, $compile, $location, $filter)]).then(
                function () {
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
                    $scope.data.maintenanceSpecial.department.campus.id = campusId;
                    if(callback) callback();
                }
            );
        }
    };
    // 监听维修区域多选框修改
    $scope.changeMaintenanceArea = function () {
        if($scope.data.id) return;
        var newValue = $scope.data.maintenanceArea.id;
        // 取出的为区域数组 eq:[1,2,3]
        var _area = angular.copy($scope.maintenanceAreaData);
        var areaIds = newValue;
        var departmentList = angular.copy($scope.departmentSelectData);
        var departmentNewList = [];
        if (areaIds != null) {
            angular.forEach(departmentList, function (val) {
                var _departments = [];
                _area.forEach(function (_value) {
                    if ($.inArray(_value.id, areaIds) >= 0) {
                        _departments.push(_value.department.id);
                    }
                });

                if ($.inArray(val.id, _departments) != -1) {
                    departmentNewList.push(val);
                }
            });
        }
        $scope.departmentDataFromArea = departmentNewList;
    };
    // 监听部门下拉框修改
    $scope.changeDepartment = function () {
        if($scope.data.id) return;
        var departmentId = $scope.data.maintenanceSpecial.department.id;
        var workerList = angular.copy($scope.workerSelectData);
        var workerNewList = [];
        if (departmentId != null) {
            angular.forEach(workerList, function (val) {
                if (val.maintenanceWorker.department.id == departmentId) {
                    workerNewList.push(val);
                }
            });
        }
        $scope.workerDataFromDepartment = workerNewList;
    };
    // 计算维修用时(天)
    $scope.maintenanceDateChange = function () {
        var start = $scope.data.maintenanceStartDateTime;
        var end = $scope.data.maintenanceEndDateTime;
        if (start != null && end != null) {
            $scope.data.maintenanceTime = parseInt(Math.abs(new Date(Date.parse(end)) - new Date(Date.parse(start)))
                    / 1000 / 60 / 60 / 24) + 1;
        } else {
            delete $scope.data.maintenanceTime;
        }
    };
}
angular.module("MetronicApp").controller('specialMaintenanceAddController', ['$scope', '$http', '$compile', '$location', '$filter',
    specialMaintenanceAddController]);
function specialMaintenanceAddController($scope, $http, $compile, $location, $filter) {
    ComponentsBootstrapMaxlength.init();
    // 单独用于表单中联动的起始时间与结束时间日期框
    $scope.searchInit = false;
    $scope.formInit = true;
    $scope.option = {
        format: "yyyy-mm-dd",
        minView: 2
    };
    $scope.datetimepickerId = ['maintenance'];
    datePickers.init($scope, $http, $compile, $location, $filter);
    // 保存按钮响应
    $scope.save = function () {
        // 更新数据
        $('#addModal').modal('hide');
        $scope.addLoading();
        $scope.url = "saveSpecialMaintenance";
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
        $scope.data.name = $scope.data.maintenanceItemName;
        $scope.repeatName = "专项维修名称";
        $scope.repeatUrl = "checkRepeatSpecialMaintenance";
        $scope.checkRepeatName = "name";
        $scope.checkRepeatApi($scope);
    };
};
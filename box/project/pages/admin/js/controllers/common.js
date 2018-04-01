// 显示&隐藏
function getStatusTypeData($scope, $http, $compile, $location, $filter) {
    $scope.statusTypeData = [{
        "id": 1,
        "name": "显示",
        "value": "1"
    }, {
        "id": 2,
        "name": "隐藏",
        "value": "0"
    }];
};
// 启用&禁用
function getStatusUseTypeData($scope, $http, $compile, $location, $filter) {
    $scope.statusUseTypeData = [{
        "id": 1,
        "name": "启用",
        "value": "1"
    }, {
        "id": 2,
        "name": "禁用",
        "value": "0"
    }];
}
// 男&女
function getSexTypeData($scope, $http, $compile, $location, $filter) {
    $scope.sexTypeData = [{
        "id": 1,
        "name": "男",
        "value": "1"
    }, {
        "id": 2,
        "name": "女",
        "value": "0"
    }];
};
// 在职&离职
function getPositionStatusData($scope, $http, $compile, $location, $filter) {
    $scope.positionStatusData = [{
        "id": 1,
        "name": "在职",
        "value": "1"
    }, {
        "id": 2,
        "name": "离职",
        "value": "0"
    }];
};
// 在校&离校
function getStudentStatusData($scope, $http, $compile, $location, $filter) {
    $scope.studentStatusData = [{
        "id": 1,
        "name": "在校",
        "value": "1"
    }, {
        "id": 2,
        "name": "离校",
        "value": "0"
    }];
};
// 失物&招领
function getLostFoundStatusData($scope, $http, $compile, $location, $filter) {
    $scope.lostFoundStatusData = [{
        "id": 1,
        "name": "失物",
        "value": "1"
    }, {
        "id": 2,
        "name": "招领",
        "value": "0"
    }];
};
// 出售&求购
function getFleaMarketStatusData($scope, $http, $compile, $location, $filter) {
    $scope.fleaMarketStatusData = [{
        "id": 1,
        "name": "出售",
        "value": "1"
    }, {
        "id": 2,
        "name": "求购",
        "value": "0"
    }];
};
// // 审核状态(通过审核&未通过审核)
function getApprovalStatusData($scope, $http, $compile, $location, $filter) {
    return $scope.approvalStatusData = [{
        "id": 1,
        "name": "通过审核",
        "value": "1"
    }, {
        "id": 2,
        "name": "未通过审核",
        "value": "0"
    }];
};
// 是&否
function getShowStatusData($scope, $http, $compile, $location, $filter) {
    $scope.showStatusData = [{
        "id": 1,
        "name": "是",
        "value": "1"
    }, {
        "id": 2,
        "name": "否",
        "value": "0"
    }];
};
// 文本类型&图文类型
function getInforTypesData($scope, $http, $compile, $location, $filter) {
    $scope.inforTypeData = [{
        "id": 1,
        "name": "文本类型",
        "value": "0"
    }, {
        "id": 2,
        "name": "图文类型",
        "value": "1"
    }];
};
// 校区下拉框数据初始化
function getCampusSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getCampusSelectList";
        $scope.selectOptName = "获取校区信息";
        $scope.selectPara = "campusSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.campusSelectData = [{
            name: '校区1',
            id: 1
        }, {
            name: '校区2',
            id: 2
        }, {
            name: '校区3',
            id: 3
        }, {
            name: '校区4',
            id: 4
        }];
    }
};
// 部门下拉框数据初始化
function getDepartmentSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getDepartmentSelectList";
        $scope.selectOptName = "获取部门信息";
        $scope.selectPara = "departmentSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.departmentSelectData = [{
            name: '部门1',
            id: 0
        }, {
            name: '部门2',
            id: 1
        }, {
            name: '部门3',
            id: 2
        }, {
            name: '部门4',
            id: 3
        }];
    }
};
// 维修工种下拉框数据初始化
function getMaintenanceTypeSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getMaintenanceTypeSelectList";
        $scope.selectOptName = "获取维修工种信息";
        $scope.selectPara = "maintenanceTypeSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.maintenanceTypeSelectData = [{
            name: '水',
            id: 12
        }, {
            name: '电',
            id: 23
        }, {
            name: '木',
            id: 34
        }];
    }
};
// 维修人员下拉框数据初始化
function getWorkerSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getMaintenanceWorkerSelectList";
        $scope.selectOptName = "获取维修人员信息";
        $scope.selectPara = "workerSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.workerSelectData = [{
            name: '张三',
            id: 1,
            maintenanceType: {
                name: '水',
                id: 1
            }
        }, {
            name: '李四',
            id: 2,
            maintenanceType: {
                name: '水',
                id: 1
            }
        }, {
            name: '王五',
            id: 3,
            maintenanceType: {
                name: '电',
                id: 2
            }
        }];
    }
};
// 职务下拉框数据初始化
function getPositionSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getPositionSelectList";
        $scope.selectOptName = "获取职务信息";
        $scope.selectPara = "positionSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.positionSelectData = [{
            name: '校长',
            id: 1
        }, {
            name: '院长',
            id: 2
        }, {
            name: '系主任',
            id: 3
        }, {
            name: '部长',
            id: 4
        }];
    }
};
// 物料单位数据初始化
function getMaterialUnitSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getMaterialUnitSelectList";
        $scope.selectOptName = "获取物料单位信息";
        $scope.selectPara = "materialUnitSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.materialUnitSelectData = [{
            name: '物料单位1',
            id: 1
        }, {
            name: '物料单位2',
            id: 2
        }, {
            name: '物料单位3',
            id: 3
        }, {
            name: '物料单位4',
            id: 4
        }];
    }
};
// 物料类别数据初始化
function getMaterialCategorySelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getMaterialCategorySelectList";
        $scope.selectOptName = "获取物料类别信息";
        $scope.selectPara = "materialCategorySelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.materialCategorySelectData = [{
            name: '物料类别1',
            id: 1
        }, {
            name: '物料类别2',
            id: 2
        }, {
            name: '物料类别3',
            id: 3
        }, {
            name: '物料类别4',
            id: 4
        }, {
            name: '物料类别5',
            id: 5
        }];
    }
};
// 物料名称数据初始化
function getMaterialSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getMaterialSelectList";
        $scope.selectOptName = "获取物料信息";
        $scope.selectPara = "materialSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.materialSelectData = [{
            name: '物料1',
            id: 1
        }, {
            name: '物料2',
            id: 2
        }, {
            name: '物料3',
            id: 3
        }, {
            name: '物料4',
            id: 4
        }];
    }
};
// 维修单号数据初始化
function getWarrantyNumberSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getWarrantyNumberSelectList";
        $scope.selectOptName = "获取维修单号信息";
        $scope.selectPara = "warrantyNumberSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.warrantyNumberSelectData = [{
            maintenanceNumber: '维修单号1',
            id: 1
        }, {
            maintenanceNumber: '维修单号2',
            id: 2
        }, {
            maintenanceNumber: '维修单号3',
            id: 3
        }, {
            maintenanceNumber: '维修单号4',
            id: 4
        }];
    }
};
// 过滤只接单维修单号数据初始化
function getWarrantyNumberIsDoneSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getWarrantyNumberSelectListForStockRemoval";
        $scope.selectOptName = "获取维修单号信息";
        $scope.selectPara = "warrantyNumberSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.warrantyNumberSelectData = [{
            maintenanceNumber: '维修单号1',
            id: 1
        }, {
            maintenanceNumber: '维修单号2',
            id: 2
        }, {
            maintenanceNumber: '维修单号3',
            id: 3
        }, {
            maintenanceNumber: '维修单号4',
            id: 4
        }];
    }
};
// 模块名称数据初始化
function getInforModuleSelectData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getInforModuleSelectList";
        $scope.selectOptName = "获取模块信息信息";
        $scope.selectPara = "inforModulelSelectData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.inforModulelSelectData = [{
            name: '模块名称1',
            id: 7
        }, {
            name: '模块名称2',
            id: 8
        }, {
            name: '模块名称3',
            id: 9
        }, {
            name: '模块名称4',
            id: 10
        }];
    }

};
// 模块完成状态初始化
function getFinishedSelectData($scope, $http, $compile, $location, $filter) {
    $scope.finishedlSelectData = [{
        name: '已完成',
        id: 1
    }, {
        name: '未完成',
        id: 2
    }, ];
};
// 维修区域数据初始化
function getMaintenanceAreaData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getMaintenanceAreaSelectList";
        $scope.selectOptName = "获取维修区域信息";
        $scope.selectPara = "maintenanceAreaData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.maintenanceAreaData = [{
            name: '维修区域1',
            id: 1
        }, {
            name: '维修区域2',
            id: 2
        }, {
            name: '维修区域3',
            id: 3
        }, {
            name: '维修区域4',
            id: 4
        }];
    }
};
// 值班范围数据初始化(全天，白班，夜班)
function getDutyTimeData($scope, $http, $compile, $location, $filter) {
    $scope.dutyTimeData = [{
        name: '全天',
        id: 1,
        "value": "0"
    }, {
        name: '白班',
        id: 2,
        "value": "1"
    }, {
        name: '夜班',
        id: 3,
        "value": "2"
    }];
};
//
function getMaintenanceNumber() {
    var today = new Date().Format('yyyyMMdd');
    return today + 'XXXX';
};
//好评、中评、差评状态修改
function getRepairStatusData($scope, $http, $compile, $location, $filter) {
    $scope.repairStatusData = [{
        name: '好评',
        id: 1,
        "value": "1"
    }, {
        name: '中评',
        id: 2,
        "value": "2"
    }, {
        name: '差评',
        id: 0,
        "value": "0"
    }];
};
// 维修状态获取
function getMaintenanceStatusData($scope, $http, $compile, $location, $filter) {
    if ($scope.ifOpenApi) {
        $scope.selectUrl = "getAllMaintenanceStatus";
        $scope.selectOptName = "获取维修状态信息";
        $scope.selectPara = "maintenanceStatusData";
        return $scope.getSelectInfoApi($scope);
    } else {
        $scope.maintenanceAreaData = [{
            name: '待审核',
            id: 1
        }, {
            name: '待受理',
            id: 2
        }, {
            name: '待派工',
            id: 3
        }, {
            name: '待完工',
            id: 4
        }, {
            name: '维修中',
            id: 5
        }, {
            name: '已完工',
            id: 6
        }, {
            name: '已回访',
            id: 7
        }, {
            name: '已维修',
            id: 8
        }, {
            name: '未验收',
            id: 9
        }, {
            name: '锁定',
            id: 10
        }];
    }
}
// 将日期截取成 'yyyy-MM-dd'
function subDateStr(dateStr) {
    return dateStr.substring(0, 10);
}
// 将日期截取成 'hh:mm'
function subHourStr(dateStr) {
    return dateStr.substring(10, 16);
}
//价格配置
function priceConfig() {
    $("#price").TouchSpin({
        min: 0,
        max: 10000,
        step: 1,//增量
        decimals: 0,//小数点
        postfix: '¥'
    });
    $("#price2").TouchSpin({
        min: 0,
        max: 10000,
        step: 0.01,//增量
        decimals: 2,//小数点
        postfix: '¥'
    });
};
// 注册类型
function getRegisterTypesData($scope, $http, $compile, $location, $filter) {
    $scope.registerTypesData = [{
        name: '教值人员',
        value: 2
    }, {
        name: '在校学生',
        value: 3
    }, {
        name: '维修工人',
        value: 1
    }];
};


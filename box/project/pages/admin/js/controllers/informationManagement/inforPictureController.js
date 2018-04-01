angular.module("MetronicApp").controller('inforPictureController', ['$scope', '$http', '$compile', '$location', '$filter', '$q',
        inforPictureController]);
function inforPictureController($scope, $http, $compile, $location, $filter, $q) {
    $scope.data = {};
    // 是否点击审核通过的状态
    $scope.data.approvalStatusType = false;
    $scope.searchObj = {};
    $scope.selectSearchIdList = ['selectSearch', 'selectSearch2', 'selectSearch3'];
    $scope.selectIdList = ['select'];
    // controller名称初始化
    $scope.controllerName = 'inforPicture';
    $q.all([getApprovalStatusData($scope, $http, $compile, $location, $filter)]).then(function() {
        return getInforModuleSelectData($scope, $http, $compile, $location, $filter)
    }).then(function() {
        return getShowStatusData($scope, $http, $compile, $location, $filter)
    });
    // 列表数据初始化
    $scope.columns = [{
        "data": "id"
    }, {
        "data": "title"
    }, {
        "data": "inforModule.name"
    }, {
        "data": "author"
    }, {
        "data": "pictureProvider"
    }, {
        "data": "addDateTime"
    }, {
        "data": "updateDateTime"
    }, {
        "data": "viewTimes"
    }, {
        "data": "keyword"
    }, {
        "data": "approvalStatus"
    }, {
        "data": "approvalDateTime"
    }, {
        "data": "slideShow"
    }];
    $scope.orderableAry = [0];
    $scope.approvalStatus = 9;
    $scope.switchSlideShow = 11;
    $scope.targetsOpt = 12;
    $scope.order = [[5, "desc"]];
    $scope.wrapAry = [1, 2];
    $scope.wrapShortAry = [3];
    $scope.optHtmlAry = ["detail", "edit", "remove", "preview"];
    var url = "getInforPictureList";
    $scope.url = url;
    $scope.reloadUrl = url;
    // 说明是列表页面需要查询的日期框初始化，需要添加结束日期与起始日期的数值校验
    $scope.searchInit = true;
    $scope.datetimepickerId = ['addDateTime'];
    $scope.initDataTablesName = 'inforPictureDataTable';
    datePickers.init($scope, $http, $compile, $location, $filter);
    dataTables.init($scope, $http, $compile, $location, $filter);
    $scope.uploadUrl = "/summernote/fileupload";
    //$scope.resetInputList = ['name', 'name2', 'personName', 'personName2'];
    $scope.resetInputList = ['title', 'keyword', 'author', 'pictureProvider'];
    // 添加
    $scope.addModal = function() {
    	$(".modal-scrollable").on("click",function  () {
    		$(this).hide();
    	});
        $scope.data = {};
        $scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.modalTitle = '添加图文内容';
        $scope.data.approvalStatus = "1";
        editors.init($scope);
        $('#summernote').summernote('code', ''); // 内容置空
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 修改
    $scope.editModal = function(data) {
    	//$scope.resetErrorInput($scope, $http, $compile, $location, $filter);
        $scope.data = data;
        if(data.approvalStatus==1) {
            $scope.data.approvalStatusType = true;
        }
        $scope.modalTitle = '修改图文内容';
        // 文章内容回显
        editors.init($scope);
        $('#summernote').summernote('code', $scope.data.article);
        $scope.triggerSelect($scope, $http, $compile, $location, $filter);
        $scope.resetForm($scope, $http, $compile, $location, $filter);
        $('#addModal').modal();
    };
    // 删除后弹出提示信息,刷新一次列表
    $scope.remove = function() {
        // 删除后弹出提示信息,刷新一次列表
        $('#removeModal').modal('hide');
        $scope.addLoading();
        $scope.url = "deleteInforPicture";
        $scope.optName = "删除";
        $scope.params = {
            // 删除Id
            "id": $scope.removeId
        };
        $scope.postApi($scope);
    };
    // 查询按钮响应
    $scope.search = function() {
        $scope.searchInfo($scope);
    };
    // 修改状态确认按钮响应
    $scope.changeStatus = function() {
        // 清空上传队列
        $scope.clearQueue();
        $('#changeStatusModal').modal('hide');
        function callBack() {
            // 修改的状态为审核修改
            // if ($scope.changeStatusType === 'approvalStatus') {
            //     // 当前状态，如果当前状态为未通过允许修改为审核通过，样式修改为disable
            //     var status = $scope[$scope.changeStatusType + $scope.changeStatusId];
            //     if (status != 0) {
            //         // 通过
            //         $('[ng-model=' + $scope.changeStatusType + $scope.changeStatusId + ']').addClass("myDisabled");
            //         var slideShow = $('[ng-model=slideShow' + $scope.changeStatusId + ']');
            //         var slideShowHasClass = slideShow.hasClass('myDisabled');
            //         var slideShowValue = $scope['slideShow' + $scope.changeStatusId];
            //         if (slideShowHasClass && (!slideShowValue)) {
            //             slideShow.removeClass('myDisabled');
            //         }
            //     } else {
            //         return;
            //     }
            // }
        }

        $scope.addLoading();
        $scope.url = "changePictureStatus";
        $scope.optName = "修改模块信息状态";
        $scope.params = {
            "statusType": $scope.changeStatusType,
            "id": $scope.changeStatusId
        };
        $scope.postApi($scope, callBack);
    };
    // 查询条件重置
    $scope.reset = function() {
        $scope.resetSearch($scope, $http, $compile, $location, $filter);
        $scope.resetDateTimePicker('addDateTimeEnd', 'addDateTimeStart');
    };
    // 预览跳转
    $scope.preview = function(id) {
        var url = portType + '://' + window.location.host + previewLocationSuffix + "#/viewNews";
        window.open(url + "?id=" + id);
    };
    $scope.changeSlideShow = function() {
        $('#pictureUpload').modal('hide');
        $scope.addLoading();
        // 添加一条幻灯记录
        $scope.url = "saveInforSlide";
        $scope.optName = "幻灯设置";
        // 后端需要的参数数据
        var uploadScope = $scope.getScope('slideUpload');
        var result = {
            "slideType": 0,// 文章来源
            "inforPicture": {
                "id": $scope.resultSaveId
            // 将这一行的id取出
            },
            "slidePicture": uploadScope.uploadDown.url
        };
        $scope.params = {
            "data": JSON.stringify(result)
        };
        $scope.postApi($scope, function() {
            $scope.url = "changePictureStatus";
            $scope.params = {
                "statusType": $scope.changeStatusType,
                "id": $scope.changeStatusId
            };
            $scope.postApi($scope, function() {
                $('[ng-model=' + $scope.changeStatusType + $scope.changeStatusId + ']').addClass("myDisabled");
                $scope.clearQueue();
            });
        });
    };
};
angular.module("MetronicApp").controller('inforPictureAddController', ['$scope', '$http', '$compile', '$location', '$filter', '$timeout',
        '$stateParams', '$q', inforPictureAddController]);
function inforPictureAddController($scope, $http, $compile, $location, $filter, $timeout, $stateParams, $q) {
    // 保存按钮响应
    $scope.save = function() {
        // 更新数据
        $('#addModal').modal('hide');
        // $scope.addLoading();
        $scope.url = "saveInforPicture";
        // 修改
        if ($scope.data.id !== undefined) {
            $scope.optName = "修改";
        }
        // 添加
        else {
            $scope.dataRefresh = true;
            $scope.optName = "添加";
        }
        // 获取当前文本编辑器中的html字符串,需转译防止html注入
        $scope.data.article = $('<div>').text($('#summernote').summernote('code')).html();
        $scope.params = {
            "data": JSON.stringify($scope.data)
        };
        $scope.postApi($scope);
    };
    // 供图人员默认使用作者
    $scope.defaultAssignment = function(thisEvent, model) {
        var _val =thisEvent.target.value;
        if(_val) {
            var sensitiveList = allSensitiveName;
            var num = sensitiveList.length;
            var count= 0;
            sensitiveList.forEach(function (value) {
                if(_val.toLowerCase() == value.toLowerCase()) {
                    sweetAlert("警告", "不允许输入敏感字符,请重新输入", "warning");
                    // 将敏感词删除
                    var splits = model.split('.');
                    $scope[splits[0]][splits[1]] = '';
                    return;
                }
                else{
                    count++;
                }
            });
            if(num === count) {
                $scope.data.pictureProvider = $scope.data.author;
            }
        }
    };
    // 监听需要检查是否重复项
    $scope.checkRepeat = function() {
        $scope.repeatName = "标题";
        $scope.repeatUrl = "checkRepeatInforPictureTitle";
        $scope.checkRepeatName = "title";
        $scope.checkRepeatApi($scope);
    };
};
angular.module("MetronicApp").controller('pictureUploadController', ['$scope', '$http', '$compile', '$location', '$filter',
        pictureUploadController]);
function pictureUploadController($scope, $http, $compile, $location, $filter) {
    $scope.uploadAll = function() {
        var uploaderScope = $scope.getScope('slideUpload');
        // 上传全部
        uploaderScope.uploader.uploadAll();
    };
};

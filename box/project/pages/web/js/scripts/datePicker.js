var datePickers = function () {
    var initDatePicker = function ($scope, $http, $compile, $location, $filter) {
        var commonOptions = {
            autoclose: true,
            isRTL: App.isRTL(),
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
            todayBtn: true,
            language: 'zh-CN',
            todayHighlight: true
        };
        var option = $.extend(commonOptions, $scope.option);
        $(".form_datetime").datetimepicker(option);
        $('body').removeClass("modal-open");
    };
    // 表单中两个日期框联动
    var initFormDatePicker = function ($scope, $http, $compile, $location, $filter) {
        var commonOptions = {
            autoclose: true,
            isRTL: App.isRTL(),
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
            todayBtn: true,
            language: 'zh-CN',
            todayHighlight: true
        }
        var option = $.extend(commonOptions, $scope.option);
        angular.forEach($scope.datetimepickerId, function (id) {
            $("#" + id + "StartDateTime").datetimepicker(option).on('changeDate', function (ev) {
                $("#" + id + "EndDateTime").datetimepicker('setStartDate', $scope.data[id + "StartDateTime"]);
                $("#" + id + "StartDateTime").datetimepicker('hide');
            });
            $("#" + id + "EndDateTime").datetimepicker(option).on('changeDate', function (ev) {
                $("#" + id + "StartDateTime").datetimepicker('setEndDate', $scope.data[id + "EndDateTime"]);
                $("#" + id + "EndDateTime").datetimepicker('hide');
            });
        });
        $('body').removeClass("modal-open");
    };
    // search框中的日期控件初始化，其中绑定了起始日期与结束日期的判断关系(起始日期不能大于结束日期，结束日期不能小于起始日期)
    var initSearchDatePicker = function ($scope, $http, $compile, $location, $filter) {
        var option = {
            isRTL: App.isRTL(),
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
            format: "yyyy-mm-dd",
            todayHighlight: true,
            //todayBtn: true,
            language: "zh-CN",
            autoclose: true,
            minView: 2
        };
        angular.forEach($scope.datetimepickerId, function (id) {
            $("#" + id + "Start").datetimepicker(option).on('changeDate', function (ev) {
                $("#" + id + "End").datetimepicker('setStartDate', $scope.searchObj[id + "Start"]);
                $("#" + id + "Start").datetimepicker('hide');
            });
            $("#" + id + "End").datetimepicker(option).on('changeDate', function (ev) {
                $("#" + id + "Start").datetimepicker('setEndDate', $scope.searchObj[id + "End"]);
                $("#" + id + "End").datetimepicker('hide');
            });
        });
        $('body').removeClass("modal-open");
    };
    return {
        // main function to initiate the module
        init: function ($scope, $http, $compile, $location, $filter) {
            if ($scope.searchInit == true) {
                initSearchDatePicker($scope, $http, $compile, $location, $filter);
            }
            else if ($scope.formInit == true) {
                initFormDatePicker($scope, $http, $compile, $location, $filter);
            }
            else {
                initDatePicker($scope, $http, $compile, $location, $filter);
            }
        }
    };
}();

//（时分秒）
var timePickers = function () {
    //表单中两个日历框联动
    var initFormTimePicker = function ($scope, $http, $compile, $location, $filter) {
        var commonOptions = {
            autoclose: true,
            language: "zh-CN",
            format: 'hh:ii',
            startView: 1,
            minView: 0,
            maxView: 0,
            keyboardNavigation: false,
            showMeridian: true,
            initialDate: new Date(),
            maxDate: '23:55',
            minDate: '00:00'
        };
        var option = $.extend(commonOptions, $scope.option);
        angular.forEach($scope.timepickerId, function (id) {
            $("#" + id + "Start").datetimepicker(option);
            $("#" + id + "End").datetimepicker(option);
        });
        $('body').removeClass("modal-open");
    };
    return {
        // main function to initiate the module
        init: function ($scope, $http, $compile, $location, $filter) {
            if ($scope.formInitTime == true) {
                initFormTimePicker($scope, $http, $compile, $location, $filter);
            }
        }
    }
}();



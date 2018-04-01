var datePickers = function () {
    var initDatePicker = function ($scope, $http, $compile, $location, $filter) {
        var commonOptions = {
            autoclose: true,
            isRTL: App.isRTL(),
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
            todayBtn: true,
            language: 'zh-CN',
            todayHighlight: true
        }
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
    var initTimePicker = function($scope, $http, $compile, $location, $filter) {
        var commonOptions = {
            autoclose: !0,
            showSeconds: !0,
            minuteStep: 1,
            defaultTime: !1,
            format: 'HH:mm:ss'
        }
        var option = $.extend(commonOptions, $scope.option);
        $(".timepicker").timepicker(option);
        $('body').removeClass("model-open");
        /*
         Query().timepicker && ($(".timepicker-default").timepicker({
         autoclose: !0,
         showSeconds: !0,
         minuteStep: 1
         }), $(".timepicker-no-seconds").timepicker({
         autoclose: !0,
         minuteStep: 5,
         defaultTime: !1
         }), $(".timepicker-24").timepicker({
         autoclose: !0,
         minuteStep: 5,
         showSeconds: !1,
         showMeridian: !1
         }), $(".timepicker").parent(".input-group").on("click", ".input-group-btn", function(t) {
         t.preventDefault(), $(this).parent(".input-group").find(".timepicker").timepicker("showWidget")
         }), $(document).scroll(function() {
         $("#form_modal4 .timepicker-default, #form_modal4 .timepicker-no-seconds, #form_modal4 .timepicker-24").timepicker("place")
         }))
         };*/
    };
    //表单中两个日历框联动
    var initFormTimePicker = function($scope, $http, $compile, $location, $filter) {
        var commonOptions = {
            format: "HH:mm:ss",
            trigger: "manual"
        }
        var option = $.extend(commonOptions, $scope.option);
        angular.forEach($scope.timepickerId, function (id) {
            $("#" + id + "Start").timepicker(option).on('changeDate', function (ev) {
                $("#" + id + "End").timepicker('setStartDate', $scope.searchObj[id + "Start"]);
                $("#" + id + "Start").timepicker('hide');
            });
            $("#" + id + "End").timepicker(option).on('changeDate', function (ev) {
                $("#" + id + "Start").timepicker('setEndDate', $scope.searchObj[id + "End"]);
                $("#" + id + "End").timepicker('hide');
            });
        });
        $('body').removeClass("modal-open");

        /*jQuery().clockface && ($(".clockface_1").clockface(), $("#clockface_2").clockface({
         format: "HH:mm",
         trigger: "manual"
         }), $("#clockface_2_toggle").click(function(t) {
         t.stopPropagation(), $("#clockface_2").clockface("toggle")
         }), $("#clockface_2_modal").clockface({
         format: "HH:mm",
         trigger: "manual"
         }), $("#clockface_2_modal_toggle").click(function(t) {
         t.stopPropagation(), $("#clockface_2_modal").clockface("toggle")
         }), $(".clockface_3").clockface({
         format: "H:mm"
         }).clockface("show", "14:30"), $(document).scroll(function() {
         $("#form_modal5 .clockface_1, #form_modal5 #clockface_2_modal").clockface("place")
         }))*/
    };
    return{
        // main function to initiate the module
        init: function ($scope, $http, $compile, $location, $filter) {
            if ($scope.formInitTime == true) {
                initFormTimePicker($scope, $http, $compile, $location, $filter);
            }
            else {
                initTimePicker($scope, $http, $compile, $location, $filter);
            }
        }
    }
}();



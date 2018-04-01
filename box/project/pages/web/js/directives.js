/***************************************************************************************************
 * GLobal Directives
 **************************************************************************************************/

// Route State Load Spinner(used on page or content load)
angular.module("MetronicApp").directive('ngSpinnerBar', ['$rootScope', '$state', function($rootScope, $state) {
    return {
        link: function(scope, element, attrs) {
            // by defult hide the spinner bar
            element.addClass('hide'); // hide spinner bar by default

            // display the spinner bar whenever the route changes(the content part started loading)
            $rootScope.$on('$stateChangeStart', function() {
                element.removeClass('hide'); // show spinner bar
                //Layout.closeMainMenu();
            });

            // hide the spinner bar on rounte change success(after the content loaded)
            $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
                element.addClass('hide'); // hide spinner bar
                $('body').removeClass('page-on-load'); // remove page loading indicator
                // activate selected link in the sidebar menu
                Layout.setAngularJsMainMenuActiveLink('match', null, $state);
                // auto scorll to page top
                setTimeout(function() {
                    App.scrollTop(); // scroll to the top on content load
                }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                //获取当前路由，判断是否首页，绝对首页固定轮播图是否显示
                $rootScope.previousState = from; //from为前一个页面的路由信息：url,cache,views,name
                $rootScope.previousParams = fromParams; //fromParams为前一个页面的ID信息
                $rootScope.nowState = to; //to为当前页面的路由信息：url,cache,views,name，同样，toParams为当前页面的ID信息
                $rootScope.ifDashboard = false;
                if($rootScope.nowState.url === '/dashboard'){
                	$rootScope.ifDashboard = true;
                }
            });

            // handle errors
            $rootScope.$on('$stateNotFound', function() {
                element.addClass('hide'); // hide spinner bar
            });

            // handle errors
            $rootScope.$on('$stateChangeError', function() {
                element.addClass('hide'); // hide spinner bar
            });
        }
    };
}]);

// Handle global LINK click
angular.module("MetronicApp").directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
angular.module("MetronicApp").directive('dropdownMenuHover', function() {
    return {
        link: function(scope, elem) {
            elem.dropdownHover();
        }
    };
});

// DateRangeAndLabelauty
angular.module("MetronicApp").directive('dateRangeAndLabelauty', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: false,
        template:
        '<div class="col-md-12" style="padding: 10px;">\n' +
        '    <div class="col-md-2 checkBoxLabel">\n' +
        '        <p class="text-center">时间范围选择</p>\n' +
        '    </div>\n' +
        '    <div class="col-md-10 vertical-center">\n' +
        '        <!-- 时间拼接入口 -->\n' +
        '        <div class="col-md-8" id="time" style="padding-left: 0px!important;"></div>\n' +
        '        <!-- 自定义时间范围 -->\n' +
        '        <div class="col-md-4 input-group" style="right: 15px">\n' +
        '            <input type="text" readonly class="form-control date-picker" id="dateTimeRange" value="" />\n' +
        '            <span class="input-group-addon">\n' +
        '                <i class="fa fa-calendar"></i>\n' +
        '            </span>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>'
    };
});
// ng-repeat 渲染结束句柄
angular.module("MetronicApp").directive('repeatFinish', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last == true) {
                scope.$eval(attr.repeatFinish)
            }
        }
    }
});
// 树结构数据初始化
function getTrees($scope, $http, $compile, $location, $filter) {
    $('#' + $scope.controllerName + 'Tree').jstree({'core': {data: null}});
    trees.init($scope, $http, $compile, $location, $filter);
};
var trees = function () {
    var initTree = function ($scope, $http, $compile, $location, $filter) {
        var _url;
        if ($scope.ifOpenApi) {
            _url = $scope.httpDomain + $scope.treeUrl;
        }
        else {
            _url = '../admin/demo/' + $scope.controllerName + 'Tree.json';
        }
        $.ajax({
            type: "POST",
            url: _url,
            dataType: "json",
            success: function (data) {
                var tree = $('#' + $scope.controllerName + 'Tree').jstree(true);
                tree.settings = {
                    'plugins': ["types"],
                    'types': {
                        "default": {
                            "icon": "fa fa-folder icon-state-warning icon-lg"  // 删除默认图标
                        },
                    },
                    'core': {
                        "themes": {
                            "responsive": false
                        },
                        'data': data
                    }
                };
                tree.refresh();
            }
        });

    };
    return {
        init: function ($scope, $http, $compile, $location, $filter) {
            initTree($scope, $http, $compile, $location, $filter);
        }
    };
}();
angular.module("MetronicApp").controller('summernoteController', ['$scope', '$http', '$compile', '$location', '$filter', summernoteController]);
function summernoteController($scope, $http, $compile, $location, $filter) {
    editors.init($scope);
};

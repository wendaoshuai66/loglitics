// 幻灯上传
angular.module("MetronicApp").controller('slideUploadController', ['$scope', 'FileUploader', '$http', '$compile', '$location', '$filter',
        slideUploadController]);
function slideUploadController($scope, FileUploader, $http, $compile, $location, $filter) {
    // 图片上传允许的最大宽高(像素)
    $scope.width = slideImageWidth;
    $scope.height = slideImageHeight;
    // 文件上传自定义过滤器过滤器
    $scope.filters = ['imageFilter'];
    // 上传服务器
    $scope.uploadUrl = "/summernote/fileupload";
    // $scope.url = '../assets/global/plugins/angularjs/plugins/angular-file-upload/upload.php';
    $scope.url = $scope.httpDomain + $scope.uploadUrl;
    // 只能够上传一张
    $scope.queueLimit = 1;
    // 阻止上传规定图片数量
    $('.btn-file').on('click', function(e) {
        if ($scope.uploader.queue.length >= $scope.queueLimit) {
            e.preventDefault();
        }
    });
};


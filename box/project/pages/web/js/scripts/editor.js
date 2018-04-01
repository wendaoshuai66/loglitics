var editors = function() {
    var handleSummernote = function($scope) {
        $('#summernote').summernote(
                {
                    height: 400,
                    lang: 'zh-CN',
                    focus: true,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture']]//,
                        //['view', ['fullscreen']]//codeview
                    ],
                    callbacks: {
                        onImageUpload: function(files, editor, $editable) {
                            sendFile(files);
                        }
                    }
                });
        // API:
        // var sHTML = $('#summernote').code(); // get code
        // $('#summernote').destroy(); // destroy
        function sendFile(files, editor, $editable) {
            $scope.addLoading();
            var data = new FormData();
            data.append("ajaxTaskFile", files[0]);
            $.ajax({
                data: data,
                type: "POST",
                // 图片上传出来的url，返回的是图片上传后的路径，http格式
                url: $scope.httpDomain + $scope.uploadUrl,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function(data) {// data是返回的hash,key之类的值，key是定义的文件名
                    if (data.message === 'SUCCESS') {
                        // 调用内部api——insertImage以路径的形式插入图片到文本编辑区
                        $("#summernote").summernote('insertImage', data.url);
                        sweetAlert("提示", "图片添加成功！", "success");
                    } else {
                        sweetAlert("警告", "图片添加失败！", "error");
                    }
                    $scope.removeLoading();
                },
                error: function() {
                    sweetAlert("警告", "图片添加失败！", "error");
                    $scope.removeLoading();
                }
            });
        }
    };

    return {
        // main function to initiate the module
        init: function($scope) {
            handleSummernote($scope);
        }
    };

}();
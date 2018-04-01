var Upload = function () {
    var init = function (scope, timeout) {
        $("#uploadImg").zyUpload({
            width            :   "100%",                  // 宽度
            height           :   "100%",                  // 宽度
            itemWidth        :   "118px",                 // 文件项的宽度
            itemHeight       :   "100px",                 // 文件项的高度
            url              :   scope.httpDomain + "summernote/fileupload",  // 上传文件的路径
            multiple         :   true,                    // 是否可以多个文件上传
            dragDrop         :   true,                    // 是否可以拖动上传文件
            del              :   true,                    // 是否可以删除文件
            finishDel        :   false,  				  // 是否在上传文件完成后删除预览
        }, null, scope, timeout);
    };
    return {
        init: function (scope, timeout) {
            init(scope, timeout);
        }
    }
}();
var UIToastr = function () {
    return {
        show: function (title, msg, type) {
            $.Toast(title || "系统消息", msg || "新消息!", type || "success", {
                stack: true,
                has_icon:false,
                has_close_btn:true,
                fullscreen:false,
                timeout:3000,
                sticky:false,
                has_progress:true,
                rtl:false,
                position_class:'toast-top-right'
            });
            // 播放提示音乐
            document.getElementById('tipMusic').play();
        }
    };
}();
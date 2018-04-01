var gulp = require('gulp');
var order = require('gulp-order');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var ngAnnotate = require('gulp-ng-annotate');
var ngmin = require('gulp-ngmin');
var gulpSequence = require('gulp-sequence');

// clean
gulp.task('clean', function () {
    return gulp.src(['dist/js/**/*.js', 'dist/css/**/*.css'], {read: false})
        .pipe(clean());
});

// admin 压缩 开始
// IE9兼容JS
gulp.task('concat-IE9-respond', function () {
    return gulp.src([
        'assets/global/plugins/respond.min.js',
        'assets/global/plugins/excanvas.min.js'
    ])
        .pipe(concat('IE9Respond.min.js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest('dist/js/admin'))
});

// 压缩引用(thirdPart)JS thirdPart.min.js
gulp.task('minThirdPartJS', function () {
    return gulp.src([
        'assets/global/plugins/jquery.min.js',
        'assets/global/plugins/jquery-migrate.min.js',
        'assets/global/plugins/bootstrap/js/bootstrap.min.js',
        'assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
        'assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js',
        'assets/global/plugins/jquery.blockui.min.js',
        'assets/global/plugins/jquery.sparkline.min.js',
        'assets/global/plugins/js.cookie.min.js',
        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
        'assets/global/plugins/counterup/jquery.waypoints.min.js',
        'assets/global/plugins/counterup/jquery.counterup.min.js',
        'assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.min.js',
        'assets/global/plugins/bootstrap-modal/js/bootstrap-modal.min.js',
        'assets/pages/scripts/ui-extended-modals.min.js',
        'assets/global/plugins/jquery-ui/jquery-ui.min.js',
        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
        'assets/pages/scripts/components-bootstrap-maxlength.min.js',
        'assets/global/plugins/bootstrap-summernote/summernote.min.js',
        'assets/global/plugins/bootstrap-summernote/lang/summernote-zh-CN.min.js',
        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
        'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js',
        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.min.js',
        'assets/global/plugins/moment.min.js',
        'assets/global/plugins/fullcalendar/fullcalendar.min.js',
        'assets/global/plugins/fullcalendar/lang/zh-cn.js',
        'assets/global/plugins/angularjs/angular.min.js',
        'assets/global/plugins/angularjs/angular-sanitize.min.js',
        'assets/global/plugins/angularjs/angular-touch.min.js',
        'assets/global/plugins/angularjs/plugins/angular-ui-router.min.js',
        'assets/global/plugins/angularjs/plugins/ocLazyLoad.min.js',
        'assets/global/plugins/angularjs/plugins/ui-bootstrap-tpls.min.js',
        'assets/global/plugins/select2/js/select2.min.js',
        'assets/global/plugins/select2/js/i18n/zh-CN.js',
        'assets/global/plugins/angularjs/plugins/ui-select/select2.min.js',
        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
        'assets/global/plugins/fancybox/source/jquery.fancybox.pack.min.js',
        'assets/global/plugins/jquery-file-upload/js/vendor/jquery.ui.widget.min.js',
        'assets/global/plugins/jquery-file-upload/js/vendor/tmpl.min.js',
        'assets/global/plugins/jquery-file-upload/js/vendor/load-image.min.js',
        'assets/global/plugins/jquery-file-upload/js/vendor/canvas-to-blob.min.js',
        'assets/global/plugins/jquery-file-upload/blueimp-gallery/jquery.blueimp-gallery.min.js',
        'assets/global/plugins/jquery-file-upload/js/jquery.iframe-transport.min.js',
        'assets/global/plugins/jquery-file-upload/js/jquery.fileupload.min.js',
        'assets/global/plugins/jquery-file-upload/js/jquery.fileupload-process.min.js',
        'assets/global/plugins/jquery-file-upload/js/jquery.fileupload-image.min.js',
        'assets/global/plugins/jquery-file-upload/js/jquery.fileupload-audio.min.js',
        'assets/global/plugins/jquery-file-upload/js/jquery.fileupload-video.min.js',
        'assets/global/plugins/jquery-file-upload/js/jquery.fileupload-validate.min.js',
        'assets/global/plugins/jquery-file-upload/js/jquery.fileupload-ui.min.js',
        'assets/global/plugins/angularjs/plugins/angular-w5c-validator/w5cValidator.min.js',
        'assets/global/plugins/jstree/dist/jstree.min.js',
        'assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
        'assets/pages/scripts/ui-sweetalert.min.js',
        'assets/global/plugins/angularjs/plugins/angular-boostrap-switch/angular-bootstrap-switch.min.js',
        'assets/global/plugins/morris/morris.min.js',
        'assets/global/plugins/morris/raphael-min.js',
        'assets/global/plugins/html2canvas2png/html2canvas.min.js',
        'assets/global/plugins/html2canvas2png/canvas2image.js',
        'assets/global/plugins/html2canvas2png/base64.js',
        'assets/global/plugins/jquery.print.js',
        'assets/global/plugins/shutter/js/velocity.min.js',
        'assets/global/plugins/shutter/js/shutter.js',
        'assets/global/plugins/loading/js/loading.min.js',
        'assets/global/plugins/ngProgress/ngProgress.min.js',
        'assets/global/plugins/toast/js/toast.script.js',
        'assets/global/scripts/datatable.min.js',
        'assets/global/plugins/datatables/datatables.all.min.js',
        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.min.js',
        'assets/global/scripts/app.min.js',
        'assets/layouts/layout/scripts/layout.min.js',
        'assets/layouts/global/scripts/quick-sidebar.min.js',
        'assets/layouts/global/scripts/quick-nav.min.js',
        'assets/layouts/layout/scripts/demo.min.js',
        'assets/pages/scripts/dashboard.min.js'
    ])
        .pipe(order([
            'jquery.min.js',
            'jquery-migrate.min.js',
            'bootstrap.min.js',
            'bootstrap-hover-dropdown.min.js',
            'jquery.slimscroll.min.js',
            'jquery.blockui.min.js',
            'jquery.sparkline.min.js',
            'js.cookie.min.js',
            'bootstrap-switch.min.js',
            'jquery.waypoints.min.js',
            'jquery.counterup.min.js',
            'bootstrap-modalmanager.min.js',
            'bootstrap-modal.min.js',
            'ui-extended-modals.min.js',
            'jquery-ui.min.js',
            'bootstrap-maxlength.min.js',
            'components-bootstrap-maxlength.min.js',
            'summernote.min.js',
            'summernote-zh-CN.min.js',
            'bootstrap-datetimepicker.min.js',
            'bootstrap-datetimepicker.zh-CN.js',
            'bootstrap-fileinput.min.js',
            'moment.min.js',
            'fullcalendar.min.js',
            'zh-cn.js',
            'angular.min.js',
            'angular-sanitize.min.js',
            'angular-touch.min.js',
            'angular-ui-router.min.js',
            'ocLazyLoad.min.js',
            'ui-bootstrap-tpls.min.js',
            'select2.min.js',
            'zh-CN.js',
            'select2.min.js',
            'jquery.fancybox.pack.min.js',
            'jquery.ui.widget.min.js',
            'tmpl.min.js',
            'load-image.min.js',
            'canvas-to-blob.min.js',
            'jquery.blueimp-gallery.min.js',
            'jquery.iframe-transport.min.js',
            'jquery.fileupload.min.js',
            'jquery.fileupload-process.min.js',
            'jquery.fileupload-image.min.js',
            'jquery.fileupload-audio.min.js',
            'jquery.fileupload-video.min.js',
            'jquery.fileupload-validate.min.js',
            'jquery.fileupload-ui.min.js',
            'w5cValidator.min.js',
            'jstree.min.js',
            'sweetalert.min.js',
            'ui-sweetalert.min.js',
            'angular-bootstrap-switch.min.js',
            'morris.min.js',
            'raphael-min.js',
            'html2canvas.min.js',
            'canvas2image.js',
            'base64.js',
            'jquery.print.js',
            'velocity.min.js',
            'shutter.js',
            'loading.min.js',
            'ngProgress.min.js',
            'toast.script.js',
            'datatable.min.js',
            'datatables.all.min.js',
            'dataTables.bootstrap.min.js',
            'app.min.js',
            'layout.min.js',
            'quick-sidebar.min.js',
            'quick-nav.min.js',
            'demo.min.js',
            'dashboard.min.js'
        ]))
        // .pipe(ngmin({dynamic: true}))
        .pipe(concat('thirdPart.min.js'))//合并后的文件名
        .pipe(uglify({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest('dist/js/admin'));
});

// 压缩混淆核心JS core.js
gulp.task('minCoreJS', function () {
    return gulp.src([
        'admin/js/main_min.js',
        'admin/js/directives.js',
        'admin/js/controllers/GeneralPageController.js',
        'admin/js/controllers/common.js',
        'admin/js/scripts/table-ajax.js',
        'admin/js/scripts/datePicker.js',
        'admin/js/scripts/tree.js',
        'admin/js/scripts/editor.js',
        'admin/js/scripts/date.js',
        'admin/js/scripts/calendar.js',
        'admin/js/scripts/toastr.js',
    ])
        .pipe(order([
            'main_min.js',
            'directives.js',
            'GeneralPageController.js',
            'common.js',
            'table-ajax.js',
            'datePicker.js',
            'tree.js',
            'editor.js',
            'date.js',
            'calendar.js',
            'toastr.js',
        ]))
        .pipe(uglify({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(concat('core.js'))
        .pipe(gulp.dest('dist/js/admin'))
});

// 单独压缩uploadJS(其中scope自动注入,混淆会报错) upload.js
gulp.task('minUploadJS', function () {
    return gulp.src([
        'admin/js/directivesUpload.js'
    ])
        .pipe(concat('upload.js'))//合并后的文件名
        .pipe(uglify({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest('dist/js/admin'));
});

// 将分离的JS压缩 core.min.js
gulp.task('minMyJS', function () {
    return gulp.src([
        'dist/js/admin/core.js',
        'dist/js/admin/upload.js'
    ])
        .pipe(order([
            'core.js',
            'upload.js',
        ]))
        .pipe(concat('core.min.js'))
        .pipe(gulp.dest('dist/js/admin'))
});

// 将controllerJS压缩混淆
gulp.task('minControllerJS', function () {
    return gulp.src([
        'admin/js/controllers/DashboardController.js',
        'admin/js/controllers/loginController.js',
        'admin/js/controllers/inventoryManagement/materialCategoryController.js',
        'admin/js/controllers/inventoryManagement/materialUnitController.js',
        'admin/js/controllers/inventoryManagement/materialController.js',
        'admin/js/controllers/inventoryManagement/storageController.js',
        'admin/js/controllers/inventoryManagement/stockRemovalController.js',
        'admin/js/controllers/systemManagement/campusController.js',
        'admin/js/controllers/systemManagement/departmentController.js',
        'admin/js/controllers/systemManagement/positionController.js',
        'admin/js/controllers/systemManagement/maintenanceTypeController.js',
        'admin/js/controllers/systemManagement/maintenanceCategoryController.js',
        'admin/js/controllers/systemManagement/maintenanceAreaController.js',
        'admin/js/controllers/systemManagement/maintenanceStatusController.js',
        'admin/js/controllers/systemManagement/inforModuleController.js',
        'admin/js/controllers/systemManagement/friendlyLinkController.js',
        'admin/js/controllers/systemManagement/serviceController.js',
        'admin/js/controllers/userManagement/teacherController.js',
        'admin/js/controllers/userManagement/maintenanceWorkerController.js',
        'admin/js/controllers/userManagement/studentController.js',
        'admin/js/controllers/informationManagement/inforPictureController.js',
        'admin/js/controllers/informationManagement/slideUploadController.js',
        'admin/js/controllers/informationManagement/slideController.js',
        'admin/js/controllers/informationManagement/inforTextController.js',
        'admin/js/controllers/informationManagement/fleaMarketController.js',
        'admin/js/controllers/informationManagement/lostFoundController.js',
        'admin/js/controllers/dutyManagement/workLogController.js',
        'admin/js/controllers/dutyManagement/dutyController.js',
        'admin/js/controllers/dutyManagement/summernoteController.js',
        'admin/js/controllers/maintenanceManagement/maintenanceRecordsController.js',
        'admin/js/controllers/maintenanceManagement/specialMaintenanceController.js',
        'admin/js/controllers/maintenanceManagement/maintenanceEvaluationController.js',
    ])
        .pipe(ngAnnotate({single_quotes: true}))
        .pipe(ngmin({dynamic: true}))
        .pipe(uglify({
            mangle: true,
            compress: true,
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js/admin/controller'))
});

// 将AngularJS-upload.min.js单独放置到部署目录
gulp.task('minNgUploadJS', function () {
    return gulp.src([
        'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js'
    ])
        .pipe(gulp.dest('dist/js/admin/controller'))
});

// 压缩第三方CSS ng_load_plugins_before 之前 thirdPart.min.css
gulp.task('minThirdPartCSS', function () {
    return gulp.src([
        'assets/global/plugins/bootstrap/css/bootstrap.min.css',
        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
        'assets/global/plugins/select2/css/select2.min.css',
        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
        'assets/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.min.css',
        'assets/global/plugins/bootstrap-modal/css/bootstrap-modal.min.css',
        'assets/global/plugins/bootstrap-summernote/summernote.min.css',
        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.min.css',
        'assets/global/plugins/fancybox/source/jquery.fancybox.min.css',
        'assets/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css',
        'assets/global/plugins/jquery-file-upload/css/jquery.fileupload.min.css',
        'assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.min.css',
        'assets/global/plugins/shutter/css/shutter.min.css',
        'assets/global/plugins/fullcalendar/fullcalendar.min.css',
        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.css',
        'assets/global/plugins/angularjs/plugins/angular-w5c-validator/w5cValidator.min.css',
        'assets/global/plugins/jstree/dist/themes/default/style.min.css',
        'assets/global/plugins/bootstrap-sweetalert/sweetalert.min.css',
        'assets/global/plugins/datatables/datatables.min.css',
        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.min.css',
        'assets/global/plugins/microtip/microtip.min.css',
        'assets/global/plugins/morris/morris.min.css',
        'assets/global/plugins/loading/css/global.min.css',
        'assets/global/plugins/loading/css/loading.min.css',
        'assets/global/plugins/ngProgress/ngProgress.min.css',
        'assets/global/plugins/toast/css/toast.style.css',
    ])
        .pipe(order([
            'bootstrap.min.css',
            'bootstrap-switch.min.css',
            'select2.min.css',
            'select2-bootstrap.min.css',
            'bootstrap-modal-bs3patch.min.css',
            'bootstrap-modal.min.css',
            'summernote.min.css',
            'bootstrap-datetimepicker.min.css',
            'bootstrap-fileinput.min.css',
            'jquery.fancybox.min.css',
            'blueimp-gallery/blueimp-gallery.min.css',
            'jquery.fileupload.min.css',
            'jquery.fileupload-ui.min.css',
            'shutter.min.css',
            'fullcalendar.min.css',
            'bootstrap.touchspin.css',
            'w5cValidator.min.css',
            'style.min.css',
            'sweetalert.min.css',
            'datatables.min.css',
            'datatables.bootstrap.min.css',
            'microtip.min.css',
            'morris.min.css',
            'global.min.css',
            'loading.min.css',
            'ngProgress.min.css',
            'toast.style.css',
        ]))
        .pipe(concat('thirdPart.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css/admin'));
});

// 压缩第三方CSS 布局 layout.min.css
gulp.task('minLayoutCSS', function () {
    return gulp.src([
        'assets/global/css/components-rounded.min.css',
        'assets/global/css/plugins.min.css',
        'assets/layouts/layout/css/layout.min.css',
        'assets/layouts/layout/css/themes/darkblue.min.css',
        'admin/css/style.css',
        'admin/css/tableResponsive.css'
    ])
        .pipe(order([
            'components-rounded.min.css',
            'plugins.min.css',
            'layout.min.css',
            'darkblue.min.css',
            'style.css',
            'tableResponsive.css'
        ]))
        .pipe(concat('layout.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css/admin'));
});

// admin结束

// web开始

// 压缩引用(thirdPart)JS thirdPart.min.js
gulp.task('minWebThirdPartJS', function () {
    return gulp.src([
        'assets/global/plugins/jquery.min.js',
        'assets/global/plugins/jquery-migrate.min.js',
        'assets/global/plugins/bootstrap/js/bootstrap.min.js',
        'assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
        'assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js',
        'assets/global/plugins/jquery.blockui.min.js',
        'assets/global/plugins/jquery.sparkline.min.js',
        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
        'assets/global/plugins/counterup/jquery.waypoints.min.js',
        'assets/global/plugins/counterup/jquery.counterup.min.js',
        'assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.min.js',
        'assets/global/plugins/bootstrap-modal/js/bootstrap-modal.min.js',
        'assets/pages/scripts/ui-extended-modals.min.js',
        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
        'assets/pages/scripts/components-bootstrap-maxlength.min.js',
        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
        'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js',
        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.min.js',
        'assets/global/plugins/moment.min.js',
        'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.js',
        'assets/global/plugins/angularjs/angular.min.js',
        'assets/global/plugins/angularjs/angular-sanitize.min.js',
        'assets/global/plugins/angularjs/angular-touch.min.js',
        'assets/global/plugins/angularjs/plugins/angular-ui-router.min.js',
        'assets/global/plugins/angularjs/plugins/ocLazyLoad.min.js',
        'assets/global/plugins/angularjs/plugins/ui-bootstrap-tpls.min.js',
        'assets/global/plugins/select2/js/select2.min.js',
        'assets/global/plugins/select2/js/i18n/zh-CN.js',
        'assets/global/plugins/angularjs/plugins/ui-select/select2.min.js',
        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
        'assets/global/plugins/bootstrap-tabdrop/js/bootstrap-tabdrop.js',
        'assets/global/plugins/angularjs/plugins/angular-w5c-validator/w5cValidator.min.js',
        'assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
        'assets/pages/scripts/ui-sweetalert.min.js',
        'assets/global/plugins/angularjs/plugins/angular-boostrap-switch/angular-bootstrap-switch.min.js',
        'assets/global/plugins/morris/morris.min.js',
        'assets/global/plugins/morris/raphael-min.js',
        'assets/global/plugins/html2canvas2png/html2canvas.min.js',
        'assets/global/plugins/html2canvas2png/canvas2image.js',
        'assets/global/plugins/html2canvas2png/base64.js',
        'assets/global/plugins/shutter/js/velocity.min.js',
        'assets/global/plugins/shutter/js/shutter.js',
        'assets/global/plugins/loading/js/loading.min.js',
        'assets/global/plugins/ngProgress/ngProgress.min.js',
        'assets/global/scripts/datatable.min.js',
        'assets/global/plugins/datatables/datatables.all.min.js',
        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.min.js',
        'assets/global/plugins/labelauty/jquery-labelauty.js',
        'assets/global/plugins/html5FileUpLoad/core/zyFile.js',
        'assets/global/plugins/html5FileUpLoad/control/js/zyUpload.js',
        'assets/global/plugins/jquery.print.js',
        'assets/global/scripts/app.min.js',
        'assets/layouts/layout3/scripts/layout.min.js',
        'assets/layouts/global/scripts/quick-sidebar.min.js',
        'assets/layouts/global/scripts/quick-nav.min.js',
        'assets/layouts/layout3/scripts/demo.min.js',
        'assets/pages/scripts/dashboard.min.js',
        'assets/global/plugins/superSlide/js/superSlide.js',
    ])
        .pipe(order([
            'jquery.min.js',
            'jquery-migrate.min.js',
            'bootstrap.min.js',
            'bootstrap-hover-dropdown.min.js',
            'jquery.slimscroll.min.js',
            'jquery.blockui.min.js',
            'jquery.sparkline.min.js',
            'bootstrap-switch.min.js',
            'jquery.waypoints.min.js',
            'jquery.counterup.min.js',
            'bootstrap-modalmanager.min.js',
            'bootstrap-modal.min.js',
            'ui-extended-modals.min.js',
            'bootstrap-maxlength.min.js',
            'components-bootstrap-maxlength.min.js',
            'bootstrap-datetimepicker.min.js',
            'bootstrap-datetimepicker.zh-CN.js',
            'bootstrap-timepicker.min.js',
            'bootstrap-fileinput.min.js',
            'moment.min.js',
            'daterangepicker.min.js',
            'angular.min.js',
            'angular-sanitize.min.js',
            'angular-touch.min.js',
            'angular-ui-router.min.js',
            'ocLazyLoad.min.js',
            'ui-bootstrap-tpls.min.js',
            'select2.min.js',
            'zh-CN.js',
            'select2.min.js',
            'bootstrap.touchspin.js',
            'bootstrap-tabdrop.js',
            'w5cValidator.min.js',
            'sweetalert.min.js',
            'ui-sweetalert.min.js',
            'angular-bootstrap-switch.min.js',
            'morris.min.js',
            'raphael-min.js',
            'html2canvas.min.js',
            'canvas2image.js',
            'base64.js',
            'velocity.min.js',
            'shutter.js',
            'loading.min.js',
            'ngProgress.min.js',
            'datatable.min.js',
            'datatables.all.min.js',
            'dataTables.bootstrap.min.js',
            'jquery-labelauty.js',
            'zyFile.js',
            'zyUpload.js',
            'jquery.print.js',
            'app.min.js',
            'layout.min.js',
            'quick-sidebar.min.js',
            'quick-nav.min.js',
            'demo.min.js',
            'dashboard.min.js',
            'superSlide.js'
        ]))
        // .pipe(ngmin({dynamic: true}))
        .pipe(concat('thirdPart.min.js'))//合并后的文件名
        .pipe(uglify({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest('dist/js/web'));
});

// 压缩混淆核心JS core.js
gulp.task('minWebCoreJS', function () {
    return gulp.src([
        'web/js/browserVersion.js',
        'web/js/main_min.js',
        'web/js/directives.js',
        'web/js/controllers/GeneralPageController.js',
        'web/js/controllers/pageHeadController.js',
        'web/js/controllers/headerController.js',
        'web/js/controllers/common.js',
        'web/js/scripts/table-ajax.js',
        'web/js/scripts/datePicker.js',
        'web/js/scripts/upload.js',
        'web/js/scripts/editor.js',
        'web/js/scripts/date.js',
        'web/js/scripts/calendar.js',
        'web/js/scripts/commonECharts.js',
        'web/js/scripts/eChatsPiePercent.js'
    ])
        .pipe(order([
            'browserVersion.js',
            'main_min.js',
            'directives.js',
            'GeneralPageController.js',
            'pageHeadController.js',
            'headerController.js',
            'common.js',
            'table-ajax.js',
            'datePicker.js',
            'upload.js',
            'editor.js',
            'date.js',
            'calendar.js',
            'commonECharts.js',
            'eChatsPiePercent.js'
        ]))
        .pipe(uglify({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(concat('core.min.js'))
        .pipe(gulp.dest('dist/js/web'))
});

// 将controllerJS压缩混淆
gulp.task('minWebControllerJS', function () {
    return gulp.src([
        'web/js/controllers/DashboardController.js',
        'web/js/controllers/loginController.js',
        'web/js/controllers/duty/dutyController.js',
        'web/js/controllers/fleaMarket/fleaMarketController.js',
        'web/js/controllers/fleaMarket/myFleaMarketController.js',
        'web/js/controllers/lostFound/lostFoundController.js',
        'web/js/controllers/lostFound/myLostFoundController.js',
        'web/js/controllers/maintenanceStatistic/maintenanceStatisticWithQuality/evaluationStatisticsController.js',
        'web/js/controllers/maintenanceStatistic/maintenanceStatisticWithQuality/maintenanceStatusStatisticsController.js',
        'web/js/controllers/maintenanceStatistic/maintenanceStatisticWithQuality/timeCostStatisticsController.js',
        'web/js/controllers/maintenanceStatistic/maintenanceStatisticWithTime/hourStatisticsController.js',
        'web/js/controllers/maintenanceStatistic/maintenanceStatisticWithTime/monthStatisticsController.js',
        'web/js/controllers/maintenanceStatistic/maintenanceStatisticWithTime/weekStatisticsController.js',
        'web/js/controllers/maintenanceStatistic/maintenanceStatisticWithType/maintenanceAreaStatisticsController.js',
        'web/js/controllers/maintenanceStatistic/maintenanceStatisticWithType/maintenanceTypeStatisticsController.js',
        'web/js/controllers/maintenanceStatistic/maintenanceStatisticWithType/repairOriginStatisticsController.js',
        'web/js/controllers/material/materialController.js',
        'web/js/controllers/material/materialUseController.js',
        'web/js/controllers/news/newsController.js',
        'web/js/controllers/repair/commonRepairController.js',
        'web/js/controllers/repair/commonRepairDetailController.js',
        'web/js/controllers/repair/myRecordsController.js',
        'web/js/controllers/repair/myRepairController.js',
        'web/js/controllers/repair/specialRepairController.js',
        'web/js/controllers/repair/viewMyRepairController.js',
        'web/js/controllers/service/serviceController.js',
        'web/js/controllers/suggestion/mySuggestionController.js',
        'web/js/controllers/suggestion/suggestionController.js',
        'web/js/controllers/user/profileViewController.js',
        'web/js/controllers/user/registerController.js',
        'web/js/controllers/workLog/myWorkLogController.js',
        'web/js/controllers/workLog/workLogController.js'
    ])
        .pipe(ngAnnotate({single_quotes: true}))
        .pipe(ngmin({dynamic: true}))
        .pipe(uglify({
            mangle: true,
            compress: true,
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js/web/controller'))
});

// 压缩第三方CSS ng_load_plugins_before 之前 thirdPart.min.css
gulp.task('minWebThirdPartCSS', function () {
    return gulp.src([
        'assets/global/plugins/bootstrap/css/bootstrap.min.css',
        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
        'assets/global/plugins/select2/css/select2.min.css',
        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
        'assets/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.min.css',
        'assets/global/plugins/bootstrap-modal/css/bootstrap-modal.min.css',
        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.min.css',
        'assets/global/plugins/fancybox/source/jquery.fancybox.min.css',
        'assets/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css',
        'assets/global/plugins/angularjs/plugins/angular-w5c-validator/w5cValidator.min.css',
        'assets/global/plugins/jstree/dist/themes/default/style.min.css',
        'assets/global/plugins/bootstrap-sweetalert/sweetalert.min.css',
        'assets/global/plugins/datatables/datatables.min.css',
        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.min.css',
        'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css',
        'assets/global/plugins/microtip/microtip.min.css',
        'assets/global/plugins/morris/morris.min.css',
        'assets/global/plugins/loading/css/global.min.css',
        'assets/global/plugins/loading/css/loading.min.css',
        'assets/global/plugins/ngProgress/ngProgress.min.css',
        'assets/global/plugins/shutter/css/shutter.min.css',
        'assets/global/plugins/labelauty/jquery-labelauty.css',
        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.css',
        'assets/global/plugins/html5FileUpLoad/control/css/zyUpload.css',
        'assets/global/plugins/superSlide/css/superSlide.css',
    ])
        .pipe(order([
            'bootstrap.min.css',
            'bootstrap-switch.min.css',
            'select2.min.css',
            'select2-bootstrap.min.css',
            'bootstrap-modal-bs3patch.min.css',
            'bootstrap-modal.min.css',
            'bootstrap-datetimepicker.min.css',
            'bootstrap-fileinput.min.css',
            'jquery.fancybox.min.css',
            'blueimp-gallery/blueimp-gallery.min.css',
            'w5cValidator.min.css',
            'style.min.css',
            'sweetalert.min.css',
            'datatables.min.css',
            'datatables.bootstrap.min.css',
            'daterangepicker.min.css',
            'microtip.min.css',
            'morris.min.css',
            'global.min.css',
            'loading.min.css',
            'ngProgress.min.css',
            'shutter.min.css',
            'jquery-labelauty.css',
            'bootstrap.touchspin.css',
            'zyUpload.css',
            'superSlide.css'
        ]))
        .pipe(concat('thirdPart.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css/web'));
});

// 压缩第三方CSS 布局 layout.min.css
gulp.task('minWebLayoutCSS', function () {
    return gulp.src([
        'assets/layouts/layout3/css/themes/default.min.css',
        'assets/global/css/components-rounded.min.css',
        'assets/global/css/plugins.min.css',
        'assets/layouts/layout/css/layout.min.css',
        'web/css/tooltip-classic.css',
        'web/css/common.css',
        'web/css/tableResponsive.css',
        'assets/pages/css/about.min.css',
        'assets/pages/css/pricing.min.css'
    ])
        .pipe(order([
            'default.min.css',
            'components-rounded.min.css',
            'plugins.min.css',
            'layout.min.css',
            'tooltip-classic.css',
            'common.css',
            'tableResponsive.css',
            'about.min.css',
            'pricing.min.css'
        ]))
        .pipe(concat('layout.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css/web'));
});

// 压缩register.js
gulp.task('minWebRegisterJS', function () {
    return gulp.src([
        'web/js/scripts/register.js'
    ])
        .pipe(concat('register.min.js'))//合并后的文件名
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest('dist/js/web'));
});

// 压缩register.css
gulp.task('minWebRegisterCSS', function () {
    return gulp.src([
        'web/css/register.css',
    ])
        .pipe(concat('register.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css/web'));
});

// web结束

// 总执行入口
gulp.task('start', gulpSequence('clean', 'concat-IE9-respond', 'minThirdPartJS', 'minCoreJS', 'minUploadJS', 'minControllerJS',
    'minNgUploadJS', 'minThirdPartCSS', 'minLayoutCSS', 'minMyJS', 'minWebThirdPartJS', 'minWebCoreJS', 'minWebControllerJS',
    'minWebThirdPartCSS', 'minWebLayoutCSS', 'minWebRegisterJS', 'minWebRegisterCSS'));


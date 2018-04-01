/*
 上传插件
 */
angular.module("MetronicApp")
    .directive(
        'myUpload',
        [
            'FileUploader',
            '$timeout',
            function (FileUploader, $timeout) {
                var helper = {
                    getType: function (name) {
                        return '|' + name.slice(name.lastIndexOf('.') + 1) + '|';
                    },
                    /*
                     * type 类型 closeMsg true 关闭提示
                     */
                    isImage: function (type, closeMsg) {
                        if ('|jpg|png|jpeg|bmp|gif|'.indexOf(type.toLowerCase()) !== -1) {
                            return true;
                        } else {
                            if (!closeMsg) {
                                sweetAlert("警告", "请确定文件格式为|jpg|png|jpeg|bmp|gif|", "error");
                                return false;
                            }
                        }
                    },
                    isDoc: function (type, closeMsg) {
                        if ('|doc|docx|txt|'.indexOf(type.toLowerCase()) !== -1) {
                            return true;
                        } else {
                            if (!closeMsg) {
                                sweetAlert("警告", "请确定文件格式为|doc|docx|txt|", "error");
                                return false;
                            }
                        }
                    },
                    isVideo: function (type, closeMsg) {
                        if ('|rm|rmvb|avi|mp4|3gp|'.indexOf(type.toLowerCase()) !== -1) {
                            return true;
                        } else {
                            if (!closeMsg) {
                                sweetAlert("警告", "请确定文件格式为|rm|rmvb|avi|mp4|3gp|", "error");
                                return false;
                            }
                        }
                    },
                    isMp3: function (type, closeMsg) {
                        if ('|mp3|'.indexOf(type.toLowerCase()) !== -1) {
                            return true;
                        } else {
                            if (!closeMsg) {
                                sweetAlert("警告", "请确定文件格式为|mp3|", "error");
                                return false;
                            }
                        }
                    },
                    isZip: function (type, closeMsg) {
                        if ('|zip|rar|'.indexOf(type.toLowerCase()) !== -1) {
                            return true;
                        } else {
                            if (!closeMsg) {
                                sweetAlert("警告", "请确定文件格式为|zip|rar|", "error");
                                return false;
                            }
                        }
                    },
                    // 检查图片尺寸是否符合规范
                    uploadImgCheckedPx: function (f, w, h, msg, callback) {
                        // 限定了宽高，再对其校验
                        if (w && h) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                // 加载图片获取图片真实宽度和高度
                                var image = new Image();
                                image.onload = function () {
                                    var width = image.width;
                                    var height = image.height;
                                    // 宽或高不满足提示，并回调队列进行删除
                                    if (width > w || height > h) {
                                        callback && callback(false);
                                    } else {
                                        callback && callback(true);
                                    }
                                };
                                image.src = data;
                            };
                            if (f)
                                reader.readAsDataURL(f);
                        } else {
                            callback && callback(true);
                        }
                    }
                };
                return {
                    restrict: 'E',// 标签
                    replace: true,
                    scope: false,// 使用父scope
                    template: '<input class="fileUpLoad" type="file" nv-file-select="" uploader="uploader" filters="{{filters}}"/>',// 多选模式下，input返回的files就为空，目前未能解决，暂时只能使用单选默认
                    link: function (scope, element, attributes) {
                        $timeout(function () {
                            element.bind("change", function (changeEvent) {
                                scope.$apply(function () {
                                    var fileList = changeEvent.target.files;
                                    angular.forEach(fileList, function (selectedFile, key) {
                                        var type = helper.getType(selectedFile.name);
                                        if (helper.isImage(type, true)) {
                                            helper.uploadImgCheckedPx(selectedFile, scope.width,
                                                scope.height, scope.msg, function (state) {
                                                    if (!state) {
                                                        sweetAlert("警告", "所选图片尺寸不满足！", "error");
                                                        scope.uploader.clearQueue();
                                                        scope.$apply();
                                                    }
                                                });
                                        }
                                    });

                                });
                            });
                        }, 0);
                    },
                    controller: function ($scope) {
                        var uploader = $scope.uploader = new FileUploader({
                            url: $scope.url,
                            autoUpload: false,// 自动上传
                            removeAfterUpload: true,// 文件上传成功之后从队列移除，默认是false
                            queueLimit: ($scope.queueLimit) ? $scope.queueLimit : 10
                            // 队列最大上传文件数量
                        });
                        // 文件限制提示语
                        var showMsg = function (itemSize, maxSize) {
                            if (itemSize / 1024 >= maxSize) {
                                return false;
                            }
                            $scope.size = itemSize;
                            return true;
                        }
                        // FILTERS
                        uploader.filters.push({
                            name: 'imageFilter',
                            fn: function (item, options) {
                                if (!showMsg(item.size, 4096)) {
                                    return false;
                                }
                                var type = helper.getType(item.name);
                                return helper.isImage(type) && this.queue.length < 5;
                            }
                        }, {
                            name: 'docFilter',
                            fn: function (item, options) {
                                if (!showMsg(item.size, 3072)) {
                                    return false;
                                }
                                var type = helper.getType(item.name);
                                return helper.isDoc(type);
                            }
                        }, {
                            name: 'videoFilter',
                            fn: function (item, options) {
                                if (!showMsg(item.size, 204800)) {
                                    return false;
                                }
                                var type = helper.getType(item.name);
                                return helper.isVideo(type);
                            }
                        }, {
                            name: 'mp3Filter',
                            fn: function (item, options) {
                                if (!showMsg(item.size, 20480)) {
                                    return false;
                                }
                                var type = helper.getType(item.name);
                                return helper.isMp3(type);
                            }
                        }, {
                            name: 'zipFilter',
                            fn: function (item, options) {
                                if (!showMsg(item.size, 20480)) {
                                    return false;
                                }
                                var type = helper.getType(item.name);
                                return helper.isZip(type);
                            }
                        });
                        // CALLBACKS

                        uploader.onWhenAddingFileFailed = function (item, filter, options) {
                            // console.info('onWhenAddingFileFailed', item, filter,
                            // options);
                        };
                        uploader.onAfterAddingFile = function (fileItem) {
                            // console.info('onAfterAddingFile', fileItem);
                        };
                        uploader.onAfterAddingAll = function (addedFileItems) {
                            // console.info('onAfterAddingAll', addedFileItems);
                        };
                        uploader.onBeforeUploadItem = function (item) {
                            // console.info('onBeforeUploadItem', item);
                        };
                        uploader.onProgressItem = function (fileItem, progress) {
                            // console.info('onProgressItem', fileItem, progress);
                        };
                        uploader.onProgressAll = function (progress) {
                            // sweetAlert("警告", "所选图片尺寸不满足！","error");
                        };
                        uploader.onSuccessItem = function (fileItem, response, status, headers) {
                            $scope.uploadDown = {};
                            if (response.message == 'SUCCESS') {
                                // 取出上传成功后的图片路径以及图片名称
                                $scope.uploadDown.url = response.url;
                            }
                            // 将是否幻灯按钮状态改为禁用
                            if ($scope.changeStatusType === 'slideShow') {
                                if ($scope.changeSlideShow != null) {
                                    $scope.changeSlideShow();
                                }
                            } else if ($scope.controllerName == 'slide') {
                                if ($scope.save != null) {
                                    $scope.save();
                                }
                            }
                            $scope.clearQueue();
                        };
                        uploader.onErrorItem = function (fileItem, response, status, headers) {
                            // console.info('onErrorItem', fileItem, response, status, headers);
                        };
                        uploader.onCancelItem = function (fileItem, response, status, headers) {
                            // console.info('onCancelItem', fileItem, response, status, headers);
                        };
                        uploader.onCompleteItem = function (fileItem, response, status, headers) {
                            // console.info('onCompleteItem', fileItem, response, status, headers);
                        };
                        uploader.onCompleteAll = function (fileItem, response, status, headers) {

                        };
                    }
                };
            }]);
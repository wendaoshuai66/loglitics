var dataTables = function () {
    var initTable = function ($scope, $http, $compile, $location, $filter) {
        var table;
        if ($scope.initDataTablesName) {
            table = $('#' + $scope.initDataTablesName);
        }
        else {
            table = $('#dataTable');
        }
        table.dataTable(
            $.extend(
                {
                    "language": {
                        "aria": {
                            "sortAscending": ": 以升序排列此列",
                            "sortDescending": ": 以降序排列此列"
                        },
                        "emptyTable": "没有查询出数据",
                        "info": "显示 _START_ 至 _END_ 项结果 , 总共 _TOTAL_ 条数据",
                        "infoEmpty": "",//没有匹配结果
                        "infoFiltered": "(由 _MAX_ 项结果过滤)",
                        "lengthMenu": "选择分页 : _MENU_",
                        "search": "查询 :",
                        "zeroRecords": "没有匹配结果",
                        "paginate": {
                            "previous": "上一页",
                            "next": "下一页",
                            "last": "末页",
                            "first": "首页"
                        }
                    },
                    // 启动服务器分页
                    serverSide: true,
                    // retrieve: false,
                    // paging: true,
                    // 数据请求,后端分页
                    ajax: function (data, callback, settings) {
                        $scope.addLoading();
                        // 封装请求参数
                        try {
                            var param = {};
                            // 页面显示记录条数，在页面显示每页显示多少项的时候
                            param.pageSize = data.length;
                            // 开始的记录序号
                            param.start = data.start;
                            // 当前页码
                            param.pageNumber = (data.start / data.length) + 1;
                            param.order = {};
                            // 排序规则
                            var orderObj = data.order[0];
                            param.order.dir = orderObj.dir;
                            // 取出排序的字段
                            param.order.name = data.columns[orderObj.column].data;
                            // 查询条件
                            param.searchObj = ($scope.searchObj == undefined) ? '' : $scope.searchObj;
                            // ajax请求数据
                            $.ajax({
                                type: "POST",
                                url: ($scope.url == undefined || !$scope.ifOpenApi) ? "demo/"
                                    + $scope.controllerName + ".json" : $scope.httpDomain + $scope.url,
                                cache: false, // 禁用缓存
                                data: param, // 传入组装的参数
                                dataType: "json",
                                headers: {
                                    'logistics-session-token': $scope.getToken()
                                },
                                success: function (result) {
                                    // 封装返回数据
                                    var returnData = {};
                                    // 这里直接自行返回了draw计数器,应该由后台返回
                                    returnData.draw = data.draw;
                                    // 返回的数据列表
                                    returnData.data = result.data;
                                    // 返回数据全部记录
                                    returnData.recordsTotal = result.total;
                                    // 后台不实现过滤功能，每次查询均视作全部结果
                                    returnData.recordsFiltered = returnData.recordsTotal;
                                    // console.log(returnData);
                                    // 调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                                    // 此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                                    if(returnData.data) {
                                        callback(returnData);
                                    }
                                    $scope.removeLoading();
                                },
                                error: function () {
                                    $scope.removeLoading();
                                }
                            });
                        } catch (e) {
                            $scope.removeLoading();
                        }
                    },
                    "columns": $scope.columns,
                    // 分页条数修改是否可见
                    "bLengthChange": false,
                    // 换页是否可见(全部分页)
                    "bPaginate": true,
                    // cookies是否保存设置
                    // save datatable state(pagination,sort, etc) in cookie.
                    "bStateSave": false,
                    // 自带查询是否可见
                    "searching": false,
                    // change per page values here
                    "lengthMenu": [[10, 20, -1], [10, 20, "全部"]],
                    // 设置初始一页显示记录数
                    "pageLength": 10,
                    "pagingType": "bootstrap_full_number",
                    "columnDefs": [
                    {
                        // 设置不可进行排序的列
                        'orderable': false,
                        'targets': $scope.orderableAry
                    },
                    {
                        // 整列点击 重定向路由配置
                        "targets": $scope.redirectionNewPage,
                        "data": null,
                        "render": function(data, display, row) {
                            data = translateSingleQuotes(data);
                            var viewOptHtml = "<a ui-sref="+$scope.redirectUrl+"({id:"
                                + row.id
                                + "})>" + data + "</a>";
                            var html = $scope.getWrapHtml(data, viewOptHtml);
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {
                        // 设置文章列表查看详情链接
                        "targets": $scope.viewNewsAry,
                        "data": null,
                        "render": function(data, display, row) {
                            data = translateSingleQuotes(data);
                        	var viewOptHtml = "<a ui-sref='viewNews({id:"
                                    + row.id
                                    + "})'>" + data + "</a>";
                            var html = $scope.getWrapHtmlWithSpecified(data, viewOptHtml, "top", "550");
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {   // 设置普通维修列表查看详情链接
                        "targets": $scope.viewCommonRepairAry,
                        "data": null,
                        "render": function(data, display, row) {
                            data = translateSingleQuotes(data);
                            var viewOptHtml = "<a ui-sref='viewMyRepair({id:"
                                + row.id
                                + "})'>" + data + "</a>";
                            var html = $scope.getWrapHtml(data, viewOptHtml, "350");
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {   // 设置普通维修列表查看详情链接 --- 维修工查看
                        "targets": $scope.viewMyRepairAry,
                        "data": null,
                        "render": function(data, display, row) {
                        	if(row.warrantyNumber.maintenanceRecord){
                            data = translateSingleQuotes(data);
                            var viewOptHtml = "<a ui-sref='viewMyRepair({id:"
                                + row.warrantyNumber.id
                                + "})'>" + data + "</a>";
                        	}else{
                        		data = translateSingleQuotes(data);
                                var viewOptHtml = "<a ui-sref='specialRepairView({id:"
                                    + row.warrantyNumber.id
                                    + "})'>" + data + "</a>";
                        	}
                            var html = $scope.getWrapHtml(data, viewOptHtml, "350");
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {   // 设置普通维修列表查看详情链接 --- 维修工查看
                        "targets": $scope.viewSpecialRepairAry,
                        "data": null,
                        "render": function(data, display, row) {
                            data = translateSingleQuotes(data);
                            var viewOptHtml = "<a ui-sref='specialRepairView({id:"
                                + row.id
                                + "})'>" + data + "</a>";
                            var html = $scope.getWrapHtml(data, viewOptHtml, "150");
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {   // 设置普通维修列表查看详情链接 --- 物料库存查看
                        "targets": $scope.viewMaterialAry,
                        "data": null,
                        "render": function(data, display, row) {
                            data = translateSingleQuotes(data);
                            var viewOptHtml = "<a ui-sref='materialView({id:"
                                + row.id
                                + "})'>" + data + "</a>";
                            var html = $scope.getWrapHtml(data, viewOptHtml, "250");
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {
                        // 设置物流库存列表查看详情链接
                        "targets": $scope.viewMyMaterialAry,
                        "data": null,
                        "render": function(data, display, row) {
                            data = translateSingleQuotes(data);
                            var viewOptHtml = "<a ui-sref='materialView({id:"
                                + row.material.id
                                + "})'>" + data + "</a>";
                            var html = $scope.getWrapHtml(data, viewOptHtml, "250");
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {   // 设置跳蚤市场列表查看详情链接
                        "targets": $scope.viewFleaMarketAry,
                        "data": null,
                        "render": function(data, display, row) {
                            data = translateSingleQuotes(data);
                            var viewOptHtml = "<a ui-sref='viewFleaMarket({id:"
                                + row.id
                                + "})'>" + data + "</a>";
                            var html = $scope.getWrapHtml(data, viewOptHtml, "380");
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {   // 设置失物招领列表查看详情链接
                        "targets": $scope.viewLostFoundAry,
                        "data": null,
                        "render": function(data, display, row) {
                            data = translateSingleQuotes(data);
                            var viewOptHtml = "<a ui-sref='viewLostFound({id:"
                                + row.id
                                + "})'>" + data + "</a>";
                            var html = $scope.getWrapHtml(data, viewOptHtml, "500");
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {   // 设置工作日志列表查看详情链接
                        "targets": $scope.viewWorkLogAry,
                        "data": null,
                        "render": function(data, display, row) {
                            data = translateSingleQuotes(data);
                            var viewOptHtml = "<a ui-sref='workLogView({id:"
                                + row.id
                                + "})'>" + data + "</a>";
                            var html = $scope.getWrapHtml(data, viewOptHtml, "500");
                            return html;
                        },
                        "fnCreatedCell": function(nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {
                            // 设置 1 , 0 对应是否情况
                            "targets": $scope.trueOrFalse,
                            "data": null,
                            "render": function (data) {
                                return data == '1' ? '是' : '否';
                            }
                        },
                        {
                            // 设置可能有html注入的情况
                            "targets": $scope.htmlType,
                            "data": null,
                            "render": function (data) {
                                return $('<span/>').text(data).html();
                            }
                        },
                        {
                            // 设置文章类型目标列
                            "targets": $scope.inforType,
                            "data": null,
                            "render": function (data) {
                                return data == '1' ? '图文类型' : '文本类型';
                            }
                        },
                        {
                            // 设置男女文本
                            "targets": $scope.sexType,
                            "data": null,
                            "render": function (data) {
                                return data == '1' ? '男' : '女';
                            }
                        },
                        {
                            // 设置维修状态
                            "targets": $scope.ifDoneType,
                            "data": null,
                            "render": function (data) {
                                return data == '1' ? '已完成' : '未完成';
                            }
                        },
                        {
                            // 设置报修方式
                            "targets": $scope.repairType,
                            "data": null,
                            "render": function (data) {
                                return data == '1' ? '微信报修' : '网页报修';
                            }
                        },
                        {
                            // 设置Date格式化 'yyyy-MM-dd'
                            "targets": $scope.dateFormatAry,
                            "data": null,
                            "render": function (data) {
                                    //var newData = $filter('date')(data+'','yyyy-MM-dd');
	                            //return new Date(data).Format('yyyy-MM-dd');
	                            return subDateStr(data);
	                        }
	                    },
	                    {
	                        // 设置Date格式化 'MM-dd hh:mm'
	                        "targets": $scope.dateFormatMonthDay,
	                        "data": null,
	                        "render": function(data) {
	                        	//return new Date(data).Format('MM-dd hh:mm');
                                return subDateStr(data);
                            }
                        },
                        {
                            // 设置Date格式化 'hh:mm'
                            "targets": $scope.dateFormatHourDay,
                            "data": null,
                            "render": function(data) {
                                //return new Date(data).Format('MM-dd hh:mm');
                                return subHourStr(data);
                            }
                        },
                        {
                            // 设置发布文本(待发布，已发布)
                            "targets": $scope.releaseType,
                            "data": null,
                            "render": function (data) {
                                return data == '1' ? '已发布' : '待发布';
                            }
                        },
                        {
                            // 设置出售、求购
                            "targets": $scope.fleaMarketType,
                            "data": null,
                            "render": function (data) {
                                return data == '1' ? '出售' : '求购';
                            }
                        },
                        {
                            // 设置失物、招领
                            "targets": $scope.lostFoundType,
                            "data": null,
                            "render": function (data) {
                                return data == '1' ? '失物' : '招领';
                            }
                        },
                        {
                            // 设置null对象的下属字段显示
                            "targets": $scope.nullStr,
                            "data": null,
                            "render": function (data) {
                                return data == null ? '' : data;
                            }
                        },
                        {
                            // 设置wrapAry目标列
                            "targets": $scope.wrapAry,
                            "data": null,
                            "render": function (data) {
                                var html = $scope.getWrapHtml(data, data, "200");
                                return html;
                            },
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        },
                        {
                            // 设置wrapShortAry目标列
                            "targets": $scope.wrapShortAry,
                            "data": null,
                            "render": function (data) {
                                var html = $scope.getWrapHtml(data, data, "100");
                                return html;
                            },
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        },
                        {
                            // 设置urlAry目标列
                            "targets": $scope.urlAry,
                            "data": null,
                            "render": function (data) {
                                var html = $scope.getUrlHtml(data,data);
                                return html;
                            },
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        },
                        {
                            // 设置交易状态目标列
                            "targets": $scope.dealStatus,
                            "data": null,
                            "render": function (data, display, row) {
                                var type = "dealStatus";
                                var html = $scope.getStatusHtml($scope, row.id, type, data);
                                return html;
                            },
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        },
                        {
                            // 设置switchStatus目标列
                            "targets": $scope.switchStatus,
                            "data": null,
                            "render": function (data, display, row) {
                                var type = "status";
                                var html = $scope.getStatusHtml($scope, row.id, type, data);
                                return html;
                            },
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        },
                        {
                            // 设置switchSlideShow目标列
                            "targets": $scope.switchSlideShow,
                            "data": null,
                            "render": function (data, display, row) {
                                var type = "slideShow";
                                var html = $scope.getStatusHtml($scope, row.id, type, data);
                                return html;
                            },
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        },
                        {
                            // 设置switchHomeShow目标列
                            "targets": $scope.switchHomeShow,
                            "data": null,
                            "render": function (data, display, row) {
                                var type = "homeShow";
                                var html = $scope.getStatusHtml($scope, row.id, type, data);
                                return html;
                            },
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        },
                        {
                            // 设置switchWorkStatus目标列
                            "targets": $scope.switchWorkStatus,
                            "data": null,
                            "render": function (data, display, row) {
                                var type = "workStatus";
                                var html = $scope.getStatusHtml($scope, row.id, type, data);
                                return html;
                            },
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        },
                        {
                            // 设置approvalStatus目标列
                            "targets": $scope.approvalStatus,
                            "data": null,
                            "render": function (data, display, row) {
                                var type = "approvalStatus";
                                var html = $scope.getStatusHtml($scope, row.id, type, data);
                                return html;
                            },
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        },
                        {
                            // 设置操作按钮目标列
                            "targets": $scope.targetsOpt,
                            "data": null,
                            "render": function (data,dispaly,row) {
                                // 将单引号转译
                                var params = JSON.stringify(data).replace(/\'/g, "&apos;");
                                var editName = $scope.editName == undefined ? '修改'
                                    : $scope.editName;
                                // 定义操作html内容
                                var detailOptHtml = "<a data-microtip='详情' data-microtip-position='top' class='btn btn-xs green-haze showDetailOpt' data-toggle='modal'><i class='fa fa-file-o'></i></a>";
	                            //点击详情跳转到其他页面
	                            /*
                                var editOptHtml = "<a data-microtip='修改' data-microtip-position='top' ng-click='editModal("
                                    + params
                                    + ")' class='btn btn-xs blue' data-toggle='modal'><i class='fa fa-edit'></i></a>";
	                            */
                                // 根据审核状态决定是否可修改
                                if (row.approvalStatus) {
                                	//跳蚤市场的修改
                        			var editFleaMarketOptHtml = "<a ng-disabled='true' data-microtip='修改' data-microtip-position='top' class='btn btn-xs blue' data-toggle='modal'><i class='fa fa-edit'></i></a>";
     	                            //失物招领的修改
                                    var editLostFoundOptHtml = "<a ng-disabled='true' data-microtip='修改' data-microtip-position='top' class='btn btn-xs blue' data-toggle='modal'><i class='fa fa-edit'></i></a>";
                                }else{
                                	if (row.type) {
	                                	var editFleaMarketOptHtml = "<a data-microtip='修改' data-microtip-position='top' ui-sref='fleaMarketAddSale({id:"
	                                         + row.id
	                                         + ",type:"
	                                         + row.type
	                                         + "})' class='btn btn-xs blue' data-toggle='modal'><i class='fa fa-edit'></i></a>";
	                                    var editLostFoundOptHtml = "<a data-microtip='修改' data-microtip-position='top' ui-sref='lostAdd({id:"
	                                         + row.id
	                                         + ",type:"
	                                         + row.type
	                                         + "})' class='btn btn-xs blue' data-toggle='modal'><i class='fa fa-edit'></i></a>";
                                	} else{
                                		var editFleaMarketOptHtml = "<a data-microtip='修改' data-microtip-position='top' ui-sref='fleaMarketAddPurchase({id:"
                                            + row.id
                                            + ",type:"
                                            + row.type
                                            + "})' class='btn btn-xs blue' data-toggle='modal'><i class='fa fa-edit'></i></a>";
                                       var editLostFoundOptHtml = "<a data-microtip='修改' data-microtip-position='top' ui-sref='foundAdd({id:"
                                            + row.id
                                            + ",type:"
                                            + row.type
                                            + "})' class='btn btn-xs blue' data-toggle='modal'><i class='fa fa-edit'></i></a>";
                                	}
                                }
                                /*
                                //工作日志的修改
                                var editWorkLogOptHtml = "<a ng-disabled='"
                                    + editFlag
                                    + "' data-microtip='修改' data-microtip-position='top' ui-sref='workLogAdd({id:"
                                    + row.id
                                    + "})' class='btn btn-xs blue' data-toggle='modal'><i class='fa fa-edit'></i></a>";
                                var editNewPageOptHtml = "<a data-microtip="
                                    + editName
                                    + " data-microtip-position='top' ng-click='editNewPage("
                                    + params
                                    + ")' class='btn btn-xs blue' data-toggle='modal'><i class='fa fa-edit'></i></a>";
                                */
                                var removeOptHtml = "<a data-microtip='删除' data-microtip-position='top' ng-click='removeModal("
                                    + data.id
                                    + ")' class='btn btn-xs red' data-toggle='modal'><i class='fa fa-times'></i></a>";
                                // 预览
                                var previewOptHtml = "<a data-microtip='预览' data-microtip-position='top' ng-click='preview("
                                    + data.id
                                    + ")' class='btn btn-xs purple-sharp' data-toggle='modal'><i class='fa fa-link'></i></a>";
	                            //根据维修状态是否为待评价决定是否可评价
                                if (row.maintenanceRecord && row.maintenanceRecord.maintenanceStatus.id === 5) {
                                	var commentOptHtml = "<a data-microtip='评价' data-microtip-position='top' ng-click='commentModal("
    	                                +data.id
    	                                +")' class='btn btn-xs red-haze' data-toggle='modal'><i class='fa fa-comments'></i></a>";
                                }else{
                                	var commentOptHtml = "<a ng-disabled='true' data-microtip='评价' data-microtip-position='top' class='btn btn-xs red-haze' data-toggle='modal'><i class='fa fa-comments'></i></a>";
                                }
	                            // 回复
	                            /*
                                var replyFlag = false; // 根据回复内容设置是否禁用标签的标志
                                var replyStr = '回复';
                                if (data.reply != null && data.reply != '') {
                                    replyFlag = true;
                                    replyStr = '已回复';
                                }
                                var replyOptHtml = "<a ng-disabled='"
                                    + replyFlag
                                    + "' data-microtip='"
                                    + replyStr
                                    + "' data-microtip-position='top' ng-click='replyModal("
                                    + data.id
                                    + ","
                                    + replyFlag
                                    + ")' class='btn btn-xs purple-sharp' data-toggle='modal'><i class='fa fa-reply'></i></a>";
                                */
                                // 打印预览
                                var printOptHtml = "<a data-microtip='打印预览' data-microtip-position='top' ng-click='print("
                                    + data.id
                                    + ")' class='btn btn-xs yellow' data-toggle='modal'><i class='fa fa-print'></i></a>";
                                // 重置密码
                                var resetPswOptHtml = "<a data-microtip='重置密码' data-microtip-position='top' ng-click='resetPswModal("
                                    + data.id
                                    + ")' class='btn btn-xs yellow' data-toggle='modal'><i class='fa fa-lock'></i></a>";
                                // 部门,工种值班表是否配置详情
                                var dutyListOptHtml = "<a data-microtip='值班安排' data-microtip-position='top' ng-click='dutyList("
                                    + data.id + "," + "\"" + data.name + "\""
                                    + ",0)' class='btn btn-xs green-haze' data-toggle='modal'><i class='fa fa-file-o'></i></a>";
                                // 根据需求拼接html
                                var html = "";
                                angular.forEach($scope.optHtmlAry, function (value, key) {
                                    html += eval(value + 'OptHtml');
                                });
                                return html;
                            },
                            // 生成单元格之前调用$compile方法，将动态拼接的ng-click绑定到DOM上
                            "fnCreatedCell": function (nTd) {
                                $compile(nTd)($scope);
                            }
                        }],
                    // 点击查看详情配置
                    "responsive": {
                        "details": {
                            // column 自定义列的配置,inline 默认整行
                            "type": "column",
                            // type为column时可定位到元素
                            "target": "td>.showDetailOpt"
                        }
                    },
                    // 解决重新加载表格内容问题
                    destroy: true,
                    // 设置默认排序：第6列倒序
                    "order": $scope.order,
                    // 序号列设置序号数
                    "fnDrawCallback": function () {
                        this.api().column(0).nodes().each(function (cell, i) {
                            cell.innerHTML = i + 1;
                        });
                        $(".make-switch").bootstrapSwitch();
                    }
                }, $scope.scroll));
    };
    var translateSingleQuotes = function (data) {
        return JSON.parse(JSON.stringify(data).replace(/\'/g, "&apos;"));
    };
    return {
        // main function to initiate the module
        init: function ($scope, $http, $compile, $location, $filter) {
            if (!jQuery().dataTable) {
                return;
            }
            // if ($.fn.dataTable.isDataTable('#dataTable')) {
            // return;
            // }
            initTable($scope, $http, $compile, $location, $filter);
        }
    };
}();

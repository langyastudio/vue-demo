import  {IsPC} from '@/config/utils'

var MessageTip;
if (IsPC()) {
    MessageTip = require('element-ui').Message
} else {
    MessageTip = require('mint-ui').Toast
}


export default{

    WebUploader: function (options) {

        if (!options || !options.server) {
            return null;
        }

        //1.0 检测WebUploader是否合法
        if ((typeof WebUploader) == "undefined") {
            WebUploderRegister();
            WebUploaderInit();
        }
        else {
            WebUploderRegister();
            return WebUploaderInit();
        }

        function WebUploaderInit() {

            if (!WebUploader.Uploader.support()) {
                var error = "上传控件不支持您的浏览器！请尝试升级flash版本或者使用Chrome引擎的浏览器。<a target='_blank' href='http://ie.sogou.com'>下载页面</a>";
                MessageTip.error(error)
                return null;
            }

            //2.0 配置上传参数
            //2.1 创建默认参数
            var defaults = {
                auto               : true,
                innerOptions       : {},
                server             : undefined,
                deleteServer       : undefined,
                fileNumLimit       : undefined,//验证文件总数量, 超出则不允许加入队列
                fileSizeLimit      : undefined,//验证文件总大小是否超出限制, 超出则不允许加入队列。
                fileSingleSizeLimit: undefined,//验证单个文件大小是否超出限制, 超出则不允许加入队列
                PostbackHold       : false,
                // 选择文件的按钮
                pick               : {
                    label   : '上传',
                    id      : undefined,
                    multiple: false
                }
            };
            if (options.accepttype != undefined) {
                if (options.accepttype == 1) {//Excel
                    options.accept = {
                        title     : 'Excels',
                        extensions: 'xls'
                    };
                }
                else if (options.accepttype == 2) {//图片
                    options.accept = {
                        title     : 'Images',
                        extensions: 'gif,jpg,jpeg,bmp,png,ico',
                        mimeTypes : 'image/jpeg,image/png,image/gif,image/bmp,image/x-icon'

                    };
                } else if (options.accepttype == 3) {//图片
                    options.accept = {
                        title     : 'Images',
                        extensions: 'gif,jpg,jpeg,png',
                        mimeTypes : 'image/jpeg,image/png,image/gif'

                    };
                } else if (options.accepttype == 4) {//图片
                    options.accept = {
                        title     : 'Srt',
                        extensions: 'srt',
                        mimeTypes : 'srt'

                    };
                }

            }

            //2.2 合并参数
            var opts               = $.extend(defaults, options);
            var webuploaderoptions = $.extend({
                    server             : opts.server,// 文件接收服务端
                    deleteServer       : opts.deleteServer,
                    PostbackHold       : opts.PostbackHold,
                    pick               : opts.pick,// 选择文件的按钮
                    auto               : opts.auto,
                    accept             : opts.accept,
                    fileNumLimit       : opts.fileNumLimit,
                    fileSizeLimit      : opts.fileSizeLimit,
                    fileSingleSizeLimit: opts.fileSingleSizeLimit,
                    resize             : false,  //不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                    disableGlobalDnd   : true,    // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开
                    compress           : false,//图片在上传前不进行压缩
                    duplicate          : true,
                    withCredentials    : true
                },
                opts.innerOptions);

            //3.0 创建
            var uploader = WebUploader.create(webuploaderoptions);

            uploader.tempdata = [];

            //Todo: 删除id 下的第一个div中的webuploader-pick样式
            if (opts.deletedefaultcss) {
                $(opts.pick.id + ' div:first').removeClass('webuploader-pick');
            }

            //4.0 执行相关事件
            if (options.fileQueued) {
                uploader.on('fileQueued', options.fileQueued);
            }

            if (options.fileDequeued) {
                uploader.on('fileDequeued', options.fileDequeued);
            }

            if (options.startUpload) {
                uploader.on('startUpload', options.startUpload);
            }

            if (options.uploadProgress) {
                uploader.on('uploadProgress', options.uploadProgress);
            }

            if (options.uploadSuccess) {
                uploader.on('uploadSuccess', options.uploadSuccess);
            }

            if (options.uploadComplete) {
                uploader.on('uploadComplete', options.uploadComplete);
            }

            if (options.uploadStart) {
                uploader.on('uploadStart', options.uploadStart);
            }

            if (options.filesQueued) {
                uploader.on('filesQueued', options.filesQueued);
            }

            if (options.uploadFinished) {
                uploader.on('uploadFinished', options.uploadFinished);
            }

            if (options.uploadBeforeSend) {
                uploader.on('uploadBeforeSend', options.uploadBeforeSend);
            }

            if (options.uploadError) {
                uploader.on('uploadError', options.uploadError);
            }

            if (options.uploadAccept) {
                uploader.on('uploadAccept', options.uploadAccept);
            } else {
                uploader.on('uploadAccept', function (obj, res) {
                    if (res.code == 481) {
                        MessageTip(res.msg);
                    }
                });
            }

            // 文件上传失败，显示上传出错
            uploader.on('error', function (msg, file) {

                var err = msg;
                switch (err) {
                    case 'Q_EXCEED_SIZE_LIMIT':
                        var size     = parseFloat((uploader.option("fileSizeLimit") / 1024 / 1024).toFixed(2));
                        var sizeType = " M";
                        if (size >= 1024) {
                            size     = parseFloat((size / 1024).toFixed(2));
                            sizeType = " G";
                        }
                        err = "所有文件的总大小不能超过 " + size + sizeType;
                        break;
                    case 'Q_TYPE_DENIED':
                        if (file.size <= 0 && !this.options.accept) {
                            err = '文件不能为空';
                        } else
                            err = "请上传指定的文件类型";
                        break;
                    case 'F_DUPLICATE':
                        err = "此文件已上传,编辑完文件信息,保存即可";
                        break;
                    case 'Q_EXCEED_NUM_LIMIT':
                        err = "每次最多传" + uploader.option("fileNumLimit") + "个文件，超出的文件会被忽略";
                        break;
                    case 'F_EXCEED_SIZE':
                        var size     = parseFloat((uploader.option("fileSingleSizeLimit") / 1024 / 1024).toFixed(2));
                        var sizeType = " M";
                        if (size >= 1024) {
                            size     = parseFloat((size / 1024).toFixed(2));
                            sizeType = " G";
                        }
                        err = "文件大小不能超过 " + size + sizeType;
                        break;

                }
                MessageTip.error(err);
            });

            return uploader;
        }


        function WebUploderRegister() {
            WebUploader.Uploader.register({
                'before-send': 'checkchunk'
            }, {
                checkchunk: function (block) {
                    var me = this, owner = this.owner;
                    if (owner.tempdata) {
                        var deferred = WebUploader.Deferred();
                        if (owner.tempdata.length > 0) {
                            var startpos;
                            $.each(owner.tempdata, function (i, v) {
                                if (block.file == v.file) {
                                    startpos = owner.tempdata[i].start;

                                    return;
                                }
                            })
                            if (typeof startpos != 'undefined') {
                                if (block.start < startpos) {
                                    //跳过分片
                                    owner.notrefreshprogress = true;
                                    deferred.reject();
                                } else {
                                    //上传
                                    owner.notrefreshprogress = false;
                                    deferred.resolve();
                                }
                            } else {
                                //上传
                                owner.notrefreshprogress = false;
                                deferred.resolve();
                            }
                        } else {
                            //上传
                            owner.notrefreshprogress = false;
                            deferred.resolve();
                        }
                        return deferred.promise();

                    }

                }
            });
        }


    },

}


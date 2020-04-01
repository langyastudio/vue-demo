<template>
    <div style="height:100%">
        <!--webupload-->
        <div class="hk-align-center create_File hk-pointer hk-mg-b-30">

        </div>


        <!--fineupload-->
        <div class="hk-mg-b-30">
            <div id="uploader">选择文件</div>
            <el-button type="primary" @click="stop">停止</el-button>
            <el-button type="primary" @click="resume">继续</el-button>
        </div>

        <!--simpleupload-->
        <uploader
            ref="uploader"
            :options="options"
            :autoStart="false"
            @change="change"
            @file-added="onFileAdded"
            @files-added="onFilesAdded"
            @file-success="onFileSuccess"
            @upload-start="onUploadStart"
            @file-progress="onFileProgress"
            @file-error="onFileError"
            class="uploader-app">
            <uploader-unsupport></uploader-unsupport>

            <uploader-btn :attrs="attrs" ref="uploadBtn" class="select-image-btn">选择图片</uploader-btn>
            <uploader-btn :attrs="videoattrs" ref="uploadBtn1" class="select-video-btn">选择视频</uploader-btn>
            <div class="upload-group">
                <uploader-btn>
                    <i class="el-icon-arrow-down" aria-hidden="true"></i>
                    上传
                    <i class="el-icon-arrow-down"></i>
                </uploader-btn>
                <ul class="menu_group">
                    <li>
                        <uploader-btn>上传文件</uploader-btn>
                    </li>
                    <li>
                        <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn" :directory="true">上传文件夹</uploader-btn>
                    </li>
                </ul>
            </div>


        </uploader>


        <div class="dialog-web-uploader" v-show="panelShow">
            <div class="dialog-header hk-pd-l-20 hk-border-bottom">
                <h4 class="pull-left">
					<span v-if="!upfinish" class="select-text">
						正在上传(<em class="upsuccessnum">0</em>/<em class="uptotalnum"></em>)
					</span>
                    <span v-if="upfinish" class="select-text">
						上传完成
					</span>
                </h4>
                <div class="dialog-control pull-right">
                      <span class="close dialog_minus" @click="is_up_min = !is_up_min">
					    <i v-if="!is_up_min" class="iconfont icon-minus" aria-hidden="true"></i>
                        <i v-else class="iconfont icon-window-maximize" aria-hidden="true"></i>
				      </span>
                    <span class="close dialog_close" @click="closeUpDialog">
                        <i class="iconfont icon-close" aria-hidden="true"></i>
                    </span>

                </div>
            </div>
            <div class="dialog-body" v-show="!is_up_min">
                <div class="uploader-list-wrapper">
                    <el-row class="uploader-list-hd">
                        <el-col :span="12">文件名</el-col>
                        <el-col :span="4">大小</el-col>
                        <el-col :span="6">状态</el-col>
                        <el-col :span="2">操作</el-col>
                    </el-row>
                    <div class="uploader-list-Con">
                        <el-row v-for="(item,index) in uploadFiles" :key="item.id" class="uploader-list-item" :data-fupl-id="item.id" :data-fid="item.f_id" data-upl-finish="0">
                            <el-col class="process" :span="22">
                                <div class="processbar">
                                </div>
                            </el-col>
                            <el-col class="hk-text-ellipsis hk-pd-r-15 uploadname" :span="12">
                                {{item.name}}
                            </el-col>
                            <el-col :span="4" class="uploadfilesize"> {{fileSize(item.size)}}</el-col>
                            <el-col :span="6" class="uploadstatus">等待上传</el-col>
                            <el-col class="uploadevent" :span="2">
                                <a  style="cursor:pointer;color:#2697eb" class="uplCancel" @click="uplCancel(item)">
                                    取消
                                </a>
                                <a  style="cursor:pointer;color:#2697eb" class="retry" @click="uplRetry(item)">
                                    重传
                                </a>
                            </el-col>
                        </el-row>
                    </div>

                </div>
            </div>
        </div>




    </div>

</template>

<script>
    import webUpload from '@/script/common/upload';
    import {getUpFileUrl,handCreatFile,getList,creatFolder} from '@/api/getdata';
    import {getuuid,fileMd5,IsWx,fileSize} from '@/config/utils'
    export default {
        data(){
            return {
                info    : '上传',
                imageUrl: '',
                fid:"",
                ffuploader:'',


                uploaded_template:[],

                options: {

                    target: getUpFileUrl(), // 目标上传 URL
                    chunkSize: 1024 * 1024 * 2,   //分块大小
                    forceChunkSize:true,
                    maxChunkRetries: 3,  //最大自动失败重试上传次数
                    testChunks: false,     //是否开启服务器分片校验
                    simultaneousUploads:1,
                    withCredentials:true,
                    // 服务器分片校验函数，秒传及断点续传基础
                    checkChunkUploadedByResponse: (chunk, retq) => {


                        let ret = JSON.parse(retq);
                        var fg = false
                        if (ret.code != 200) {

                            chunk.file.pause()

                            _hide("[data-fupl-id='" + chunk.file.id + "'] .uploadevent")
                            _html("[data-fupl-id='" + chunk.file.id + "'] .uploadstatus",'<i style="color:red" class="el-icon-error"></i>&nbsp;'+ret.msg+'')
                            _attr("[data-fupl-id='" + chunk.file.id + "'] .uploadstatus",'title',ret.msg)
                            _css("[data-fupl-id='" + chunk.file.id + "'] .uploadstatus",{color:'red',cursor:'default'});

                        }

                        if(chunk.offset == 0){

                            return true

                        }


                        //s1 判断是否是秒传
                        if (("result" in ret) && ("secpass" in ret.result)) {
                            if (ret.result.secpass == 1) { //可以秒传
                                fg = true
                                return fg

                            }
                        }
                        return fg
                    },
                    processParams:function(params,file,chunks,istest){
                        params.f_id = file.f_id;
                        params.auto_create = 2;
                        params.chunk = params.chunkNumber - 1
                        params.chunks = params.totalChunks;
                        params.size = params.totalSize;
                        params.md5 = params.identifier

                        delete params.chunkNumber;
                        delete params.totalChunks;
                        delete params.totalSize;
                        delete params.chunkSize;
                        delete params.currentChunkSize;
                        delete params.identifier;

                        return params



                    }
                },
                accept:'',

                videoExtension : IsWx() ? {
                    title     : 'Videos',
                    extensions:  'mov,mp4,mpe,mpeg,mpg,m4v,mkv,m4d,3gp,avi,flv,wmv,asf,rmvb,rm,ogv,mts,m2ts,ts,asx,dav,dv,mxf,vob,vp6,webm',
                    mimeTypes : 'video/*'

                } :{
                    title     : 'Videos',
                    extensions:  'mov,mp4,mpe,mpeg,mpg,m4v,mkv,m4d,3gp,avi,flv,wmv,asf,rmvb,rm,ogv,mts,m2ts,ts,asx,dav,dv,mxf,vob,vp6,webm',
                    mimeTypes : 'video/quicktime,video/mp4,video/mpeg,video/x-m4v,video/x-matroska,video/3gpp,video/x-msvideo,video/x-flv,video/x-ms-wmv,video/x-ms-asf,application/vnd.rn-realmedia-vbr,application/vnd.rn-realmedia,video/ogg,model/vnd.mts,video/x-ms-asf,application/mxf,video/x-ms-vob,video/webm'

                },
                audioExtension: IsWx() ? {
                    title     : 'Audios',
                    extensions: 'mp3,aac,aif,aiff,oga,ogg,wav,wma,m4a,flac,ac3,amr,ape,au,mmf,mp2,tak,tta,wv',
                    mimeTypes : 'audio/*'

                } :{
                    title     : 'Audios',
                    extensions: 'mp3,aac,aif,aiff,oga,ogg,wav,wma,m4a,flac,ac3,amr,ape,au,mmf,mp2,tak,tta,wv',
                    mimeTypes : 'audio/mpeg,audio/x-aac,audio/x-aiff,audio/ogg,audio/x-wav,audio/x-ms-wma,audio/mp4a-latm,audio/x-flac,audio/ac3,audio/amr,audio/basic,application/vnd.smaf,audio/mpeg,audio/x-tta,video/wavelet'

                },
                docExtension:  IsWx() ? {
                    title     : 'Docs',
                    extensions:  'doc,docx,ppt,pptx,xls,xlsx,csv,rtf,odt,ods,pdf,txt,wps',
                    mimeTypes : 'application/*'

                } :{
                    title     : 'Docs',
                    extensions:  'doc,docx,ppt,pptx,xls,xlsx,csv,rtf,odt,ods,pdf,txt,wps',
                    mimeTypes : 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,dio,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/rtf,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet,application/pdf,text/plain,application/vnd.ms-works'

                },
                picExtension:IsWx() ? {
                    title     : 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png,ico,tif,tga,pcx,exif,xpm',
                    mimeTypes : 'image/*'
                } :{
                    title     : 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png,ico,tif,tga,pcx,exif,xpm',
                    mimeTypes : 'image/jpeg,image/png,image/gif,image/bmp,image/x-icon,image/tiff,image/x-targa,image/x-pcx,image/x-xpixmap'
                },
                attrs: {
                    accept: 'image/*',
                },
                videoattrs:{
                    accept: 'video/*',
                },



                folder_upload:false,
                fold_init:0,
                fold_path_id:[],
                curUpFoldId:'',

                collapse: false,
                panelShow: false,   //选择文件后，展示上传panel
                is_up_min:false,
                uploadFiles:[],
                upfinish:false,

                uploadeStatus : 1,//1,未上传;2,正在上传;3,上传成功;4上传失败
                serverErrMsg  :"", //服务器返回的上传失败原因
                uplStasO      :[], //上一次的进度和时间
                fileSucCount  : 0, //上传成功的个数
                fileCreatId:[],//已将创建的文件
                curUpIndex:'',

            }
        },
        computed: {
            //Uploader实例
            uploader() {
                return this.$refs.uploader.uploader;
            }
        },
        mounted(){

            this.initWeb()
            this.initUpload()
            this.getList()


        },
        methods: {
            fileSize,
            initWeb(){
                var that = this;
                var uploader;
                uploader = webUpload.WebUploader({
                    server             : getUpFileUrl(),
                    pick               : {
                        label: '上传',
                        id   : '.create_File',
                    },
                    innerOptions       : {
                        chunked  : true, //开启分片
                        timeout  : 1000 * 3600 * 1, //上传请求超时时间
                        chunkSize: 1024 * 1024 * 2, //每片大小（受linux系统限制，单个上传的文件的体积得满足：filesize÷chunkSize<31998M）
                        duplicate: true,	//去重
                        threads  : 1,	//并发数(Todo：受api限制，暂时只能是1，不能超过10!!!!)
                    },
                    auto               : false, //开始上传 在 filesQueued事件 中触发上传
                    //			fileNumLimit       : 20, //一次做多上传的文件个数
                    fileSizeLimit      : 1024 * 1024 * 1024 * 100, //总大小不能超过
                    fileSingleSizeLimit: 1024 * 1024 * 1024 * 50, //单个文件不能超过
                    //当一批文件添加进队列以后触发
                    filesQueued        : function (files) {
                        files.forEach((file) => {

                            file.f_id = getuuid();
//                            file.title = file.name.replace("." + file.ext, ""); //去除扩展名
                            file.bcreate = 2;

                        })
                        uploader.upload();//防止在获得fid之前就上传
                    },

                    //当每个文件开始上传时触发。
                    uploadStart        : function (file) {

                        var formData = uploader.option('formData');

                        uploader.option('formData', formData);

                        uploader.option('formData', {
                            f_id: file.f_id,
                            auto_create: 2
                        });


                    },

                    //当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
                    uploadBeforeSend: function (object, data, headers) {
                        if (uploader.tempdata.length > 0) {
                            $.each(uploader.tempdata, function (i, v) {
                                if (v.file == object.file) {
                                    uploader.tempdata[i] = object;
                                    return;
                                } else {
                                    if (i == (uploader.tempdata.length - 1)) {
                                        uploader.tempdata.push(object)
                                    }
                                }
                            })
                        } else {
                            uploader.tempdata.push(object)
                        }
                        object.file.chunks = object.chunks;

                        data.md5 = object.file.md5; //尝试秒传

                        data.bcreate = object.file.bcreate;//尝试手动合成
                    },

                    //上传过程中触发，携带上传进度。每10ms左右触发一次
                    uploadProgress: function (file, percentage) {


                    },

                    //当文件上传成功时触发。
                    uploadSuccess: function (file, ret) {
                        that.handCreatFile(file,2)

                    },

                    //检验是否有效
                    uploadAccept: function (obj, ret) {

                    },

                    //当文件上传失败时触发。
                    uploadError: function (file, reason) {


                    },

                    //当所有文件上传结束时触发
                    uploadFinished: function () {

                    }
                });
            },
            initUpload(){
                var that = this;
                this.ffuploader = new qq.FineUploaderBasic({
                    button: document.getElementById("uploader"),
                    autoUpload:true,
                    request:{
                        endpoint: getUpFileUrl(),
                        filenameParam:'name',
                        totalFileSizeName:'size',
                        inputName:'file',
                        requireSuccessJson:false
                    },
                    resume:{
                        enabled:true
                    },
                    chunking: {
                        enabled: true,
                        partSize: 1024 * 1024 * 2,
                        paramNames: {
                            partIndex: 'chunk',
                            totalParts: 'chunks',
                        },


                    },
                    cors: {
                        expected: true,
                        sendCredentials: true,
                        allowXdr: true
                    },
                    callbacks: {
                        //文件开始上传
                        onSubmit: function(id, fileName,ff) {
                            var file = that.ffuploader.getFile(id)
                            file.source = {
                                name:fileName,
                                source:{
                                    name:fileName
                                }
                            }
                            that.fid = getuuid()
                            that.ffuploader.setParams({
                                f_id: that.fid,
                                auto_create:2,
                                d_id:0
                            });


                        },
                        onUpload: function(id, fileName) {

                        },
                        onComplete:function(id,name,responseJSON,maybeXhr,ddf){
                            var file = {
                                f_id:that.fid,
                                chunks:74
                            }
                            that.handCreatFile(file,2)

                        }
                    }
                })
            },
            getList(bload,issort){

                var data = {
                    offset:0,
                    page_size:100,
                    type:1
                }
                getList({
                    data:data,
                    callback:(res,count) => {



                    }
                })
            },

            stop(){
                this.ffuploader.pauseUpload(0);
            },
            resume(){
                this.ffuploader.continueUpload(0);
            },

            change(event){
                var extension;
                if(_getParentNode(event.target,'select-image-btn').length > 0){
                    extension = this.picExtension

                }else if(_getParentNode(event.target,'select-video-btn').length > 0){
                    extension = this.videoExtension
                }

                this.accept = extension

            },
            onFileAdded(file){

            },
            onFilesAdded(files, fileList, event){

                //先检测
                if(!this.checkUploadFiles(files)){
                    files.ignored = true
                    return
                }
                this.folder_upload = false;
                this.folder_upload = files.some((file) => {
                    return file.file.webkitRelativePath
                });

                files.sort(function(num1,num2){
                    var temp1 = parseInt(num1.size);
                    var temp2 = parseInt(num2.size);
                    if (temp1 < temp2) {
                        return -1;
                    } else if(temp1 == temp2) {
                        return 0;
                    } else {
                        return 1;
                    }
                });
                this.uploadFiles =   this.uploadFiles.concat(files)

                this.is_up_min = false;
                this.upfinish = false;
                this.panelShow = true;
                this.$nextTick(() => {
                    _html('.dialog-header .uptotalnum',this.uploadFiles.length);

                    var that = this;
                    var init = 0;
                    loop2Mmd5()
                    function loop2Mmd5(){
                        if(init == files.length){


                            if(that.folder_upload){
                                that.fold_init = 0;
                                that.loopCreatFold(files)
                            }else{
                                that.startUpload(files);
                            }
                            return;
                        }
                        files[init].f_id = getuuid()
                        if(that.$route.params.id && !that.folder_upload){
                            files[init].d_id = that.$route.params.id
                        }
                        fileMd5(files[init], function (val) {

                            files[init].uniqueIdentifier = val;
                            init++;
                            loop2Mmd5()
                        });
                    }
                })






            },
            creatFolder(path,callback){
                var d_name_arr = path.split('/');
                var d_name = d_name_arr[d_name_arr.length - 1]

                var data = {
                    path:path,
                    d_name:d_name
                }
                if(this.$route.params.id || this.curUpFoldId){
                    data.p_id = this.$route.params.id || this.curUpFoldId
                }else{
                    data.p_id = 0
                }
                var is_exsit_path = this.fold_path_id.some((sitem) => {
                    return sitem.path == path && sitem.p_id == data.p_id

                })
                if(is_exsit_path){
                    var resultObj = this.fold_path_id.filter((fitem) => {
                        return fitem.path == path && fitem.p_id == data.p_id

                    })
                    callback && callback(resultObj[0]);

                    return
                }

                creatFolder({
                    data:data,
                    callback:(res) => {
                        this.fold_path_id.push({
                            path:path,
                            d_id:res.d_id,
                            p_id:data.p_id
                        })
                        callback && callback(res);

                    }
                })


            },
            loopCreatFold(files){
                if(this.fold_init == files.length){
                    this.fold_path_id = [];
                    this.curUpFoldId = ''
                    this.startUpload(files);
                    return;
                }
                var fold_path_arr = files[this.fold_init].file.webkitRelativePath.split('/')
                fold_path_arr = fold_path_arr.slice(0,fold_path_arr.length -1);
                var fold_path = fold_path_arr.join('/')

                this.creatFolder(fold_path, (val)  => {
                    files[this.fold_init].d_id = val.d_id
                    this.fold_init++;
                    this.loopCreatFold(files)
                });



            },
            acceptReg(accept){

                if ( _isPlainObject( accept ) ) {
                    accept = [ accept ];
                }

                // accept中的中生成匹配正则。
                if ( accept ) {
                    var arr = [];

                    for ( var i = 0, len = accept.length; i < len; i++ ) {
                        var item = accept[ i ].extensions;
                        item && arr.push( item );
                    }

                    if ( arr.length ) {
                        accept = '\\.' + arr.join(',')
                            .replace( /,/g, '$|\\.' )
                            .replace( /\*/g, '.*' ) + '$';
                    }

                    accept = new RegExp( accept, 'i' );
                }



                return accept;

            },
            acceptFile: function( file ) {
                var rExt = /\.\w+$/;

                var accept = this.acceptReg(this.accept);

                var invalid = !file || !file.size || accept &&

                    // 如果名字中有后缀，才做后缀白名单处理。
                    rExt.exec( file.name ) && !accept.test( file.name );

                return !invalid;
            },
            checkUploadFiles(files){
                var is_empty_file = files.some((file) => {
                    return file.size <= 0
                })

                var is_type_error = files.some((file) => {
                    return !this.acceptFile(file)
                })
                var is_extend_single_file_size = files.some((file) => {
                    return file.size > 1024 * 1024 * 1024 * 50
                })

                var fileAllSize = files.reduce((cur,next) => {
                    return cur + next.size
                },0)
                var is_extend_all_size = fileAllSize > 1024 * 1024  * 1024 * 100;
                if(is_type_error){
                    this.$message.error('请上传指定的文件类型')
                }else if(is_empty_file){
                    this.$message.error('文件不能为空')
                }else if(is_extend_single_file_size){
                    this.$message.error('文件大小不能超过 50G')
                }else if(is_extend_all_size){
                    this.$message.error('所有文件的总大小不能超过 100G')
                }
                return !is_extend_single_file_size && !is_extend_all_size && !is_empty_file && !is_type_error

            },
            startUpload(files){
                files.forEach((file) => {
                    var uplStaO       = [];
                    uplStaO["p"]      = 0;
                    this.uplStasO[file.id] = uplStaO;
                })

                this.uploader.resume()
            },
            onUploadStart(){
                this.uploadeStatus = 2;

            },
            onFileProgress(rootFile, file, chunk) {
                if(!file.paused){
                    this.uplPgr(file,file.progress())

                    _css("[data-fupl-id='" + file.id + "'] .processbar",{"width" : parseFloat(file.progress() * 100) + "%"});

                }


            },
            onFileSuccess(rootFile, file, response, chunk) {
               var is_secpass = 2
                var objres = JSON.parse(response)
                if(objres.result.secpass == 1){
                    is_secpass = 1
                }
                this.handCreatFile(file,is_secpass)
            },
            onFileError(rootFile, file, response, chunk) {
                var objres = JSON.parse(response)
                var reason = objres.msg

                _hide("[data-fupl-id='" + file.id + "'] .uploadevent")
                _html("[data-fupl-id='" + file.id + "'] .uploadstatus",'<i style="color:red" class="el-icon-error"></i>&nbsp;'+reason+'')
                _attr("[data-fupl-id='" + file.id + "'] .uploadstatus",'title',reason)
                _css("[data-fupl-id='" + file.id + "'] .uploadstatus",{color:'red',cursor:'default'});

            },

            uplPgr(file, percentage) {



                if(percentage - this.uplStasO[file.id]["p"] >=0){
                    var ls  = (percentage - this.uplStasO[file.id]["p"]) * file.size / 1024; //KB
                    this.uplStasO[file.id]["p"] = percentage;
                    var v         = (ls / 0.5).toFixed(2);
                    var units     = "K/s";

                    if (v >= 1024) {
                        v         = (v / 1024).toFixed(2);
                        units     = "M/s";
                    } else if (v >= 1024 * 1024) {
                        v         = (v / 1024 / 1024).toFixed(2);
                        units     = "G/s";
                    }

                    var pst = (percentage * 100).toString().substr(0, 4);

                    if (pst == "100") {
                        pst == "99.9";
                    }
                    _html("[data-fupl-id='" + file.id + "'] .uploadstatus",pst + "% ("+(v + units).toString()+")");
                }
            },
            setFileSucCount() {
                this.fileSucCount++;
                if(this.fileSucCount == this.uploadFiles.length){
                    this.fileCreatId = [];
                    this.uploadeStatus = 3;
                    this.is_up_min = true;
                    this.upfinish = true;
                    this.getList()




                }
            },
            uplCancel(file) {
                if( _attr("[data-fupl-id='" + file.id + "']","data-upl-finish") == 1){
                    return
                }
                var upstatus = _attr("[data-fupl-id='" + file.id + "'] .uploadstatus",'data-upl-status');
                if(upstatus == 1){
                    this.$message.error('正在创建文件，不能暂停')
                    return;
                }
               file.pause()
                _html("[data-fupl-id='" + file.id + "'] .uploadstatus",'<i style="color:red" class="el-icon-warning"></i>&nbsp;暂停')

                _hide("[data-fupl-id='" + file.id + "'] .uplCancel");
                _show("[data-fupl-id='" + file.id+ "'] .retry");

            },
            uplRetry(file) {
                file.resume()
                _html("[data-fupl-id='" + file.id + "'] .uploadstatus",'等待上传');
                _show("[data-fupl-id='" + file.id + "'] .uplCancel");
                _hide("[data-fupl-id='" + file.id + "'] .retry");
            },

            handCreatFile(file,blsecpass){
                if(this.fileCreatId.indexOf(file.id)!=-1){
                    return;
                }
                this.fileCreatId.push(file.id);
                _html("[data-fupl-id='" + file.id + "'] .uploadstatus","99.9%(文件合成中...)")
                _attr("[data-fupl-id='" + file.id + "'] .uploadstatus",'data-upl-status','1');
                var data = {
                    f_id: file.f_id,
                    chunks:file.chunks.length,
                    secpass:blsecpass,
                }
                if(file.d_id){
                    data.d_id = file.d_id
                }
                handCreatFile({
                    data:data,
                    callback:(res) => {
                        var finishStrType;
                        if(blsecpass == 1){
                            finishStrType = '秒传'
                        }else if(blsecpass == 2){
                            finishStrType = '完成'
                        }
                        _attr("[data-fupl-id='" + file.id + "']","data-upl-finish", "1");
                        _css("[data-fupl-id='" + file.id + "'] .processbar",{"width": "100%",background:'#fff'});
                        _addClass("[data-fupl-id='" + file.id + "'] .uplCancel","hk-cursor-default hk-default")
                        _html("[data-fupl-id='" + file.id + "'] .uplCancel",'');
                        _html("[data-fupl-id='" + file.id + "'] .uploadstatus",'<i style="color:green" class="el-icon-success"></i>&nbsp;'+finishStrType)
                        _attr("[data-fupl-id='" + file.id + "'] .uploadstatus",'data-upl-status','2');
                        this.setFileSucCount();
                    }
                })
            },


            resetData(){
                this.panelShow = false;
                this.is_up_min=false;
                this.uploadFiles=[];
                this.upfinish=false;

                this.uploadeStatus = 3;
                this.fileCreatId = [];
                this.fileSucCount = 0;
                if(_dom('.dialog-header .upsuccessnum').length > 0)
                    _dom('.dialog-header .upsuccessnum')[0].innerText = ''; //修改上传成功数
            },
            closeUpDialog(){



                if(this.uploadeStatus == 2){
                    this.$confirm('列表中有未上传完成的文件，确认要放弃上传吗?', '提示', {
                        customClass:'right-pos-poper',
                        confirmButtonText: '确定',
                        cancelButtonText : '取消',
                        type             : 'warning'
                    }).then(() => {
                        if(this.uploader.isUploading()){
                            this.uploader.cancel()
                        }else{
                            if(this.$route.path != '/disk/share'){
                                this.getList()
                            }
                        }

                        this.resetData()

                    }).catch(() => {

                    });
                }else{
                    this.resetData()
                }



            },
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    #uploader{
        padding:10px;
        background:blue;
        color:#fff;
        float:left;
    }

    .upload-group{
        float:left;
        margin-right:10px;
        ul{
            font-size:14px;
            width: 93px;
            position: absolute;
            z-index: 10;
            background: #fff;
            height:0;
            overflow: hidden;
            li{
                height:32px;
                line-height: 32px;
                cursor:pointer;
                color:#3b8cff;
                text-align: center;
                font-size:12px;
                &:hover{
                    background: #f6faff;
                    border-radius: 2px;
                }

            }
        }
        &:hover{
            ul.menu_group{
                height:auto;
                border:1px solid #c0d9fe;
                border-top: none;
                border-bottom-right-radius: 4px;
                border-bottom-left-radius: 4px;
            }

        }
    }
    .dialog-web-uploader {
        position   : fixed;
        bottom     : 0;
        width      : 633px;
        top        : auto;
        left       : auto;
        right      : 10px;
        visibility : visible;
        z-index    : 42;
        box-shadow : 0 0 10px #ccc;
        background : #fff;


        .dialog-header {
            overflow    : hidden;
            background  : #2697eb;
            height      : 50px;
            line-height : 50px;
            font-size:18px;
            h4 {
                margin      : 0;
                line-height : 50px;
            }
            color       : #fff;
            .close {
                float:left;
                text-align: center;
                font-size:20px;
                cursor: pointer;
                .icon-window-maximize{
                    font-size:16px;
                }
            }
            .dialog_close{
                padding-right:20px;
                padding-left:8px;

            }
            .dialog_minus{
                padding-left:20px;
                padding-right:8px;
            }
        }

        .uploader-list-wrapper {
            overflow-x : hidden;
            overflow-y : auto;
            height     : 349px;
            .uploader-list-hd{
                background: #eee;
                line-height: 50px;
                height: 50px;
                border-bottom: 1px solid #ccc;
                padding-left:20px;
            }
            .uploader-list-item{
                line-height: 45px;
                position: relative;
                height: 45px;
                border-top: 1px solid #eceeef;
                font-size:14px;
                padding-left:20px;

                .process{
                    height: 45px;
                    position: absolute;
                    left:0;
                    z-index:-1;
                    .processbar{
                        height:100%;
                        background:#d1ecf9;
                        width:0%
                    }
                }
            }
            .uploader-list-item:first-child{
                border-top:none;
            }

            .retry{
                display:none;
            }


        }

    }
</style>

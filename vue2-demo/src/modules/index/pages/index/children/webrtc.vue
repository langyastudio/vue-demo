<template>
    <el-container>
        <el-main>
            <div id="videoContainer">
                <div class="custom-stream" v-for="(stream,index) in streamList" :key="index" :id="stream.id"></div>
            </div>
        </el-main>
        <el-footer>
            <el-card class="box-card">
                <div v-for="log in logList" class="text item">
                    {{log}}
                </div>
            </el-card>
        </el-footer>
    </el-container>
</template>

<script>
    import {createToken} from '@/api/getdata'

    export default {
        data() {
            return {
                room              : '',        //room 对象
                localStream       : '',        //本地流对象
                screen            : false,     //桌面分享
                roomId            : '20200402',//教室Id号
                roomType          : 'erizo',   //教室类型
                audioOnly         : false,     //仅仅音频
                mediaConfiguration: 'default', //媒体配置
                simulcast         : true,      //多流模式
                slideShowMode     : false,     //低帧率模式
                //在客户端一个连接上来后，无论发送多少次的Publishe请求，服务器这边只创建一个wbrtc ,就是一个底层连接，通过这种方式，licodce实现了单客户端多流
                //如果这个参数没有开启，同时客户端发送多次的publish请求，服务这边也会创建多个底层连接等着协商，但是客户端因为是单连接，不会进行协商，所以会连接不成功
                singlePC          : true,
                onlySubscribe     : false,     //仅订阅
                onlyPublish       : false,     //仅推流
                logList           : [],       //日志列表
                streamList        : [],
            }
        },
        computed  : {},
        components: {},
        mounted() {
            this.startRoom();
        },
        methods   : {
            startRoom() {
                const roomData = {
                    username          : 'user',
                    role              : 'presenter',
                    room              : this.roomId,
                    type              : this.roomType,
                    mediaConfiguration: this.mediaConfiguration
                };

                //1.1 请求Token
                createToken({
                    data    : roomData,
                    callback: (response) => {
                        const token = response.token;

                        //2.1 Room Connect
                        this.room = Erizo.Room({token});
                        if (this.onlySubscribe) {
                            var singlePC = this.singlePC;
                            this.room.connect({singlePC});
                        }
                        //2.2 本地流显示
                        else {
                            this.localStreamInit();
                        }

                        //3.1 room 初始化
                        this.roomInit();

                        //日志
                        Erizo.Logger.setLogLevel(3);
                    }
                })
            },
            localStreamInit() {
                const config = {
                    data          : true,
                    audio         : true,
                    video         : !this.audioOnly,
                    attributes    : {username: '用户名' + Math.random()},
                    videoSize     : [320, 240, 720, 576], //[minWidth, minHeight, maxWidth, maxHeight]
                    videoFrameRate: [10, 30],
                    screen        : this.screen,
                    //url:"rtsp://user:pass@the_server_url:port" //支持使用rtsp作为本地流
                };
                //need https protocol
                //The Stream API is currently using the MediaDevices.getDisplayMedia() method.
                //The MediaDevices.getUserMedia() method can be still used for sharing the screen by specifying an extensionId or desktopStreamId.
                //Additionally, in Chrome, you can use your own extension outside of Licode and directly pass the chromeMediaSourceId as a parameter
                if (this.screen) {
                    config.extensionId = 'okeephmleflklcdebijnponpabbmmgeo';
                    //config.desktopStreamId = 'ID_PROVIDED_BY_YOUR_EXTENSION';
                }
                this.localStream = Erizo.Stream(config);

                //本地流初始化 - 请求摄像头
                this.localStream.init();

                //indicates that the user has accepted to share his camera and microphone.
                this.localStream.addEventListener('access-accepted', (event) => {
                    var singlePC = this.singlePC;
                    this.room.connect({singlePC});

                    this.streamList.push({
                        id: 'myVideo'
                    })
                    this.$nextTick(() => {
                        //播放本地流
                        var options = {
                            speaker: false,//显示音频条
                            crop   : true //裁剪视频
                        };
                        this.localStream.play('myVideo', options);
                    })
                    //此时还无法获取流相关的信息，因为仅仅同意打开设备
                    this.logList.push('local stream Access to webcam and/or microphone accepted');
                });
                this.localStream.addEventListener('access-denied', (event) => {
                    this.logList.push('local stream Access to webcam and/or microphone rejected');
                });
            },
            roomInit() {
                //----------------------------------------------------------------------------------------------
                // Room Event
                // {type:"room-connected", streams:[stream1, stream2]}
                //----------------------------------------------------------------------------------------------
                //教室连接成功
                this.room.addEventListener('room-connected', (roomEvent) => {
                    this.logList.push('room-connected ' + this.room.roomID);

                    //链接成功后，本地推流
                    if (!this.onlySubscribe) {
                        this.localStreamPublish();
                    }

                    //订阅room中已有流
                    this.subscribeToStreams(roomEvent.streams);
                });
                this.room.addEventListener("room-error", (evt) => {

                });
                this.room.addEventListener("room-disconnected", (evt) => {

                });
                //this.room..disconnect();

                //----------------------------------------------------------------------------------------------
                // Stream Event
                //{type:"stream-added", stream:stream1, msg:xx}
                //----------------------------------------------------------------------------------------------
                //流添加成功
                //there is a new stream available in the room.
                this.room.addEventListener('stream-added', (streamEvent) => {
                    if (this.localStream.getID() === streamEvent.stream.getID()) {
                        this.logList.push('stream published ' + this.localStream.getID());
                    }

                    const streams = [];
                    streams.push(streamEvent.stream);
                    this.subscribeToStreams(streams);
                });

                //流移除
                // this.room.unpublish(this.localStream, (result, error)=>{
                //     if (result === undefined){
                //         this.logList.push("Error unpublishing " + error);
                //     } else {
                //         this.logList.push("Stream unpublished!");
                //     }
                // });
                //a previous available stream has been removed from the room.
                this.room.addEventListener('stream-removed', (streamEvent) => {
                    this.logList.push("stream-removed " + this.localStream.getID());

                    // Remove stream from DOM
                    const stream = streamEvent.stream;
                    if (stream.elementID !== undefined) {
                        this.streamList = this.streamList.filter((fitem) => {
                            return fitem.id != stream.elementID

                        })
                    }
                });

                //订阅流
                this.room.addEventListener('stream-subscribed', (streamEvent) => {
                    const stream = streamEvent.stream;

                    if (stream.getID() !== this.localStream.getID()) {
                        this.logList.push('stream-subscribed-' + stream.getID() +
                            ' hasAudio-' + stream.hasAudio() + ' hasVideo-' + stream.hasVideo() +
                            ' hasData-' + stream.hasData());

                        this.streamList.push({
                            id: `test${stream.getID()}`
                        })

                        this.$nextTick(() => {
                            stream.play(`test${stream.getID()}`);
                        })

                    }
                });

                //取消订阅
                this.room.addEventListener('stream-unsubscribed', (streamEvent) => {
                });

                //流失败
                //either in the connection establishment or during the communication.
                this.room.addEventListener('stream-failed', (streamEvent) => {
                    this.logList.push('Stream Failed, act accordingly');
                });
                //probably caused by an hardware disconnection. Emitted only once
                this.room.addEventListener('stream-ended', (streamEvent) => {
                    this.logList.push('stream-ended');
                });
            },
            subscribeToStreams(streams) {

                if (this.onlyPublish) {
                    return;
                }

                streams.forEach((stream) => {
                    if (this.localStream && this.localStream.getID() !== stream.getID()) {

                        //可以订阅流中的部分数据
                        var options = {
                            audio        : true,
                            video        : true,
                            //maxVideoBW: 300, //Kbps
                            //Simulcast
                            slideShowMode: this.slideShowMode,
                            //height: {max: 480}, width: {max: 640},
                            //frameRate: {max:20},
                            metadata     : {type: 'subscriber'}
                        };
                        this.room.subscribe(stream, options, (result, error) => {
                            if (result === undefined) {
                                this.logList.push("Error subscribing to stream " + error);
                            } else {
                                this.logList.push("Stream subscribed!");
                            }
                        });
                    }

                    //----------------------------------------------------------------------------------------------
                    // Stream Event
                    // access-accepted, access-denied, stream-data, stream-attributes-update and bandwidth-alert
                    //----------------------------------------------------------------------------------------------
                    // a subscriber stream is reporting less than the minVideoBW specified in the publisher
                    stream.addEventListener('bandwidth-alert', (evt) => {
                        //evt.stream is the problematic subscribe stream.
                        //evt.bandwidth is the available bandwidth reported by that stream.
                        //evt.msg the status of that stream, depends on the adaptation scheme.
                        this.logList.push('Bandwidth Alert ' + evt.msg + evt.bandwidth);
                    });

                    //流属性更新
                    //notifies when the owner of the given stream updates its attributes
                    stream.addEventListener("stream-attributes-update", (evt) => {
                        var stream = evt.stream;
                        this.logList.push('stream-attributes-update ' + stream.getID() + evt.msg);

                        //var attributes = stream.getAttributes();
                        //or var attributes = stream.setAttributes({name: 'myStreamUpdated', type: 'private'});
                    });
                });
            },
            localStreamPublish() {
                //开始推送本地流
                const options = {
                    metadata: {type: 'publisher'},
                    //minVideoBW: 300,
                    //scheme:"notify-break" //Same as notify-break but Licode will periodically try to recover the subscriber's video.

                    //maxVideoBW    : 1000, //Kbps
                    //startVideoBW  : 1000, //Configures Chrome to start sending video at the specified bitrate instead of the default one
                    //hardMinVideoBW: 500 //Configures a hard limit for the minimum video bitrate
                };
                if (this.simulcast) {
                    // 80 Kbps and the higher to 480 Kbps
                    options.simulcast = {numSpatialLayers: 2, spatialLayerBitrates: {0: 80000, 1: 480000}};
                }

                this.room.publish(this.localStream, options, (id, error) => {
                    if (id === undefined) {
                        this.logList.push("Error publishing stream " + error);
                    }
                });
            },
            //静音
            muteAudio(stream, isMuted = true) {
                //in the publisher's side, will stop sending audio/video data to all its subscribers
                stream.muteAudio(isMuted, function (result) {
                    if (result === 'error') {
                        this.logList.push("There was an error muting the steram")
                    }
                });
            },
            //停止本地流
            stopLocalStream() {
                if (this.localStream) {
                    this.localStream.stop();
                }
            },
            //关闭本地流
            closeLocalStream() {
                if (this.localStream) {
                    this.localStream.close();
                }
            },
            updateConfig(stream) {
                var config = {maxVideoBW: 300, maxAudioBW: 300};

                //本地流
                stream.updateConfiguration(config, function (result) {
                    console.log(result);
                });
                //limiting the lower layer to 80 Kbps and the higher to 480 Kbps.
                //localStream.updateSimulcastLayersBitrate({0: 80000, 1: 480000});
            },
            //设置低帧率模式
            //video 2秒获取一帧低分辨率图像
            toggleSlideShowMode() {
                const streams      = this.room.remoteStreams;
                this.slideShowMode = !this.slideShowMode;

                streams.forEach((stream) => {
                    //非本地的视频流采用该模式
                    if (this.localStream.getID() !== stream.getID()) {
                        var slideShowMode = this.slideShowMode;
                        stream.updateConfiguration({slideShowMode}, (evt) => {
                            this.logList.push('SlideShowMode changed ' + evt);
                        });
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped rel="stylesheet/scss">
    #videoContainer {
        &:after {
            content : "";
            display : block;
            clear   : both;
        }
        .custom-stream {
            width  : 300px;
            height : 220px;
            float  : left;
        }
    }

    .text {
        font-size : 14px;
    }

    .item {
        padding : 8px 0;
    }
</style>

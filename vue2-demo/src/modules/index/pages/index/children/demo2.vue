<template>
    <el-container>
        <el-main>
            <div id="videoContainer"></div>
        </el-main>
        <el-footer>
            <el-card class="box-card">
                <div v-for="log in logList"  class="text item">
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
                simulcast         : false,     //多流模式
                slideShowMode     : false,     //低帧率模式
                //在客户端一个连接上来后，无论发送多少次的Publishe请求，服务器这边只创建一个wbrtc ,就是一个底层连接，通过这种方式，licodce实现了单客户端多流
                //如果这个参数没有开启，同时客户端发送多次的publish请求，服务这边也会创建多个底层连接等着协商，但是客户端因为是单连接，不会进行协商，所以会连接不成功
                singlePC          : false,
                onlySubscribe     : false,     //仅订阅
                onlyPublish       : false,     //仅推流
                logList           : []
            }
        },
        computed  : {},
        components: {},
        mounted() {
            this.StartRoom();
        },
        methods   : {
            StartRoom() {
                //1.0 创建本地流
                const config = {
                    data          : true,
                    audio         : true,
                    video         : !this.audioOnly,
                    attributes    : {username:'用户名' + Math.random()},
                    videoSize     : [640, 480, 640, 480], //[minWidth, minHeight, maxWidth, maxHeight]
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

                //2.0 Room config
                const roomData = {
                    username          : 'user',
                    role              : 'presenter',
                    room              : this.roomId,
                    type              : this.roomType,
                    mediaConfiguration: this.mediaConfiguration
                };

                //2.1 请求Token
                createToken({
                    data    : roomData,
                    callback: (response) => {
                        //2.2 创建Room
                        const token = response.token;
                        this.room = Erizo.Room({token});

                        //2.3 Room Connect
                        if (this.onlySubscribe) {
                            var singlePC = this.singlePC;
                            this.room.connect({singlePC});
                        }
                        //1.1 本地流显示
                        else
                        {
                            //本地流初始化 - 请求摄像头
                            this.localStream.init();
                            this.localStream.addEventListener('access-accepted', (event) => {
                                var singlePC = this.singlePC;
                                this.room.connect({singlePC});

                                const div = document.createElement('div');
                                div.setAttribute('style', 'width: 320px; height: 240px; float:left');
                                div.setAttribute('id', 'myVideo');
                                document.getElementById('videoContainer').appendChild(div);

                                //播放本地流
                                var options = {
                                    speaker: false,//显示音频条
                                    crop   : true //裁剪视频
                                };
                                this.localStream.play('myVideo', options);

                                //此时还无法获取流相关的信息，因为仅仅同意打开设备
                                this.logList.push('local stream Access to webcam and/or microphone accepted' );
                            });
                            this.localStream.addEventListener('access-denied', (event) => {
                                this.logList.push('local stream Access to webcam and/or microphone rejected' );
                            });
                        }

                        //4.0 监听事件
                        const subscribeToStreams = (streams) => {
                            if (this.onlyPublish) {
                                return;
                            }

                            streams.forEach((stream) => {
                                if (this.localStream.getID() !== stream.getID()) {

                                    var slideShowMode = this.slideShowMode;

                                    //可以订阅流中的部分数据
                                    var options = {
                                        audio     : true,
                                        video     : true,
                                        //maxVideoBW: 300, //Kbps
                                        //Simulcast
                                        slideShowMode,
                                        //height: {max: 480}, width: {max: 640},
                                        //frameRate: {max:20},
                                        metadata  : {type: 'subscriber'}
                                    };
                                    this.room.subscribe(stream, options, (result, error) => {

                                        if (result === undefined){
                                            this.logList.push("Error subscribing to stream " + error);
                                        } else {
                                            this.logList.push("Stream subscribed!");
                                        }
                                    });

                                    stream.addEventListener('bandwidth-alert', (evt) => {
                                        this.logList.push('Bandwidth Alert ' + evt.msg + evt.bandwidth);
                                    });

                                    //流属性更新
                                    stream.addEventListener("stream-attributes-update", (evt) => {
                                        var stream = evt.stream;
                                        this.logList.push('stream-attributes-update ' +  stream.getID() +  evt.msg);

                                        //var attributes = stream.getAttributes();
                                        //or var attributes = stream.setAttributes({name: 'myStreamUpdated', type: 'private'});
                                    });
                                }
                            });
                        };

                        //4.1 教室连接成功
                        this.room.addEventListener('room-connected', (roomEvent) => {
                            this.logList.push('room-connected ' + this.room.roomID);

                            //链接成功后，本地推流
                            if (!this.onlySubscribe) {

                                //开始推送本地流
                                const options = {
                                    metadata      : {type: 'publisher'},
                                    //maxVideoBW    : 300, //Kbps
                                    //startVideoBW  : 1000, //Configures Chrome to start sending video at the specified bitrate instead of the default one
                                    //hardMinVideoBW: 500 //Configures a hard limit for the minimum video bitrate
                                };
                                if (this.simulcast) {
                                    // 80 Kbps and the higher to 430 Kbps
                                    options.simulcast = {numSpatialLayers: 2, spatialLayerBitrates: {0: 80000, 1: 430000}};
                                }

                                this.room.publish(this.localStream, options, (id, error) => {
                                    if (id === undefined){
                                        this.logList.push("Error publishing stream " + error);
                                    } else {
                                        this.logList.push("Published stream " + id);
                                    }
                                });
                            }

                            //订阅room中已有流
                            subscribeToStreams(roomEvent.streams);
                        });

                        //4.2 流添加成功
                        this.room.addEventListener('stream-added', (streamEvent) => {
                            if (this.localStream.getID() === streamEvent.stream.getID()) {
                                this.logList.push('stream published ' + this.localStream.getID());
                            }

                            const streams = [];
                            streams.push(streamEvent.stream);
                            subscribeToStreams(streams);
                        });

                        //4.3 流移除
                        // this.room.unpublish(this.localStream, (result, error)=>{
                        //     if (result === undefined){
                        //         this.logList.push("Error unpublishing " + error);
                        //     } else {
                        //         this.logList.push("Stream unpublished!");
                        //     }
                        // });
                        this.room.addEventListener('stream-removed', (streamEvent) => {
                            if (this.localStream.getID() === streamEvent.stream.getID()) {
                                this.logList.push("Unpublished " + this.localStream.getID() );
                            }

                            // Remove stream from DOM
                            const stream = streamEvent.stream;
                            if (stream.elementID !== undefined) {
                                const element = document.getElementById(stream.elementID);
                                document.getElementById('videoContainer').removeChild(element);
                            }
                        });

                        //4.4 流订阅成功
                        this.room.addEventListener('stream-subscribed', (streamEvent) => {
                            const stream = streamEvent.stream;

                            if(stream.getID() !== this.localStream.getID())
                            {
                                this.logList.push('stream-subscribed-' + stream.getID() +
                                    ' hasAudio-' + stream.hasAudio() + ' hasVideo-' + stream.hasVideo() +
                                    ' hasData-' + stream.hasData());

                                const div    = document.createElement('div');
                                div.setAttribute('style', 'width: 320px; height: 240px;float:left;');
                                div.setAttribute('id', `test${stream.getID()}`);

                                document.getElementById('videoContainer').appendChild(div);

                                stream.play(`test${stream.getID()}`);
                            }
                        });
                        this.room.addEventListener('stream-unsubscribed', (streamEvent) => {
                        });

                        //4.5 流失败
                        this.room.addEventListener('stream-failed', () => {
                            this.logList.push('Stream Failed, act accordingly');
                        });

                        //this.room..disconnect();
                    }
                })
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
                            this.logList.push('SlideShowMode changed ' +  evt);
                        });
                    }
                });
            },
            //停止本地流
            StopStream_local()
            {
                if(this.localStream)
                {
                    this.localStream.stop();
                }
            },
            //关闭本地流
            CloseStream_local()
            {
                if(this.localStream)
                {
                    this.localStream.close();
                }
            },
            //静音
            muteAudio(stream, isMuted=true)
            {
                //in the publisher's side, will stop sending audio/video data to all its subscribers
                stream.muteAudio(isMuted, function (result) {
                    if (result === 'error') {
                        this.logList.push("There was an error muting the steram")
                    }
                });
            },
            updateConfig(stream)
            {
                var config = {maxVideoBW: 300, maxAudioBW: 300};

                //本地流
                stream.updateConfiguration(config, function(result) {
                    console.log(result);
                });
                //limiting the lower layer to 80 Kbps and the higher to 430 Kbps.
                //localStream.updateSimulcastLayersBitrate({0: 80000, 1: 430000});
            }
        }
    }
</script>

<style lang="scss" scoped rel="stylesheet/scss">
    .container {
        width: 1170px;
        margin: 0 auto;
        min-height: 900px;
    }
    .text {
        font-size: 14px;
    }

    .item {
        padding: 8px 0;
    }
</style>

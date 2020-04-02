<template>
    <div id="videoContainer"></div>
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
                    audio         : true,
                    video         : !this.audioOnly,
                    data          : true,
                    screen        : this.screen,
                    attributes    : {},
                    videoSize     : [640, 480, 640, 480],
                    videoFrameRate: [10, 30]
                };
                // If we want screen sharing we have to put our Chrome extension id.
                // The default one only works in our Lynckia test servers.
                // If we are not using chrome, the creation of the stream will fail regardless.
                if (this.screen) {
                    config.extensionId = 'okeephmleflklcdebijnponpabbmmgeo';
                }
                this.localStream = Erizo.Stream(config);

                //1.1 本地流显示
                if (!this.onlySubscribe) {
                    const div = document.createElement('div');
                    div.setAttribute('style', 'width: 320px; height: 240px; float:left');
                    div.setAttribute('id', 'myVideo');
                    document.getElementById('videoContainer').appendChild(div);

                    //本地流初始化 - 请求摄像头
                    this.localStream.init();
                    this.localStream.addEventListener('access-accepted', () => {
                        this.localStream.show('myVideo');
                    });
                }

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
                        var singlePC = this.singlePC;
                        this.room.connect({singlePC});

                        //4.0 监听事件
                        const subscribeToStreams = (streams) => {
                            if (this.onlyPublish) {
                                return;
                            }

                            streams.forEach((stream) => {
                                if (this.localStream.getID() !== stream.getID()) {
                                    var slideShowMode = this.slideShowMode;

                                    this.room.subscribe(stream, {slideShowMode, metadata: {type: 'subscriber'}});
                                    stream.addEventListener('bandwidth-alert', (evt) => {
                                        console.log('Bandwidth Alert', evt.msg, evt.bandwidth);
                                    });
                                }
                            });
                        };

                        //4.1 教室连接成功
                        this.room.addEventListener('room-connected', (roomEvent) => {
                            const options         = {metadata: {type: 'publisher'}};
                            const enableSimulcast = this.simulcast;
                            if (enableSimulcast) options.simulcast = {numSpatialLayers: 2};

                            //链接成功后，本地推流
                            if (!this.onlySubscribe) {
                                this.room.publish(this.localStream, options);
                            }
                            //订阅已有流
                            subscribeToStreams(roomEvent.streams);
                        });

                        //4.2 流订阅成功
                        this.room.addEventListener('stream-subscribed', (streamEvent) => {
                            const stream = streamEvent.stream;

                            const div    = document.createElement('div');
                            div.setAttribute('style', 'width: 320px; height: 240px;float:left;');
                            div.setAttribute('id', `${stream.getID()}`);

                            document.getElementById('videoContainer').appendChild(div);

                            stream.show(`${stream.getID()}`);
                        });

                        //4.3 流添加
                        this.room.addEventListener('stream-added', (streamEvent) => {
                            if (this.localStream) {
                                this.localStream.setAttributes({type: 'publisher'});
                            }

                            const streams = [];
                            streams.push(streamEvent.stream);
                            subscribeToStreams(streams);
                        });

                        //4.4 流移除
                        this.room.addEventListener('stream-removed', (streamEvent) => {
                            // Remove stream from DOM
                            const stream = streamEvent.stream;
                            if (stream.elementID !== undefined) {
                                const element = document.getElementById(stream.elementID);
                                document.getElementById('videoContainer').removeChild(element);
                            }
                        });

                        //4.5 流失败
                        this.room.addEventListener('stream-failed', () => {
                            console.log('Stream Failed, act accordingly');
                        });
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
                            console.log('SlideShowMode changed', evt);
                        });
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped rel="stylesheet/scss">
    .container {
        width: 1170px;
        margin: 0 auto;
        min-height: 900px;
    }
</style>

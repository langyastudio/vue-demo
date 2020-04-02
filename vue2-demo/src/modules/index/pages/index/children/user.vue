<template>
    <div>
        <head-top></head-top>
        <el-row class="container">

            <button id="startButton" @click="startBasicExample" disabled>Start</button>
            <button id="testConnection" @click="testConnection">Test Connection</button>
            <button id="recordButton" @click="startRecording" disabled>Toggle Recording</button>
            <button id="slideShowMode" @click="toggleSlideShowMode" disabled>Toggle Slide Show Mode</button>
            <h1 id="startWarning">Press the start buttong to start receiving streams</h1>
            <div id="videoContainer"></div>

        </el-row>
        <foot-bootom></foot-bootom>
    </div>
</template>

<script>
    import headTop from 'index/components/header/header-top'
    import footBootom from 'index/components/footer/footer-bottom'
    import {getParameterByName} from '@/config/utils'
    export default {
        data(){
            return {
                serverUrl    : 'http://39.107.112.100:3001/',
                localStream  : '',
                room         : '',
                recording    : '',
                recordingId  : '',
                slideShowMode: false
            }
        },
        computed  : {
            defaultActive: function () {
                return this.$route.path;
            }
        },
        components: {
            headTop,
            footBootom,
        },
        mounted(){
            const onlySubscribe     = getParameterByName('onlySubscribe');
            const bypassStartButton = getParameterByName('noStart');
            if (!onlySubscribe || bypassStartButton) {
                this.startBasicExample();
            } else {
                document.getElementById('startButton').disabled = false;
            }

        },
        methods   : {
            startRecording() {
                if (this.room !== undefined) {
                    if (!this.recording) {
                        this.room.startRecording(this.localStream, (id) => {
                            this.recording   = true;
                            this.recordingId = id;
                        });
                    } else {
                        this.room.stopRecording(this.recordingId);
                        this.recording = false;
                    }
                }
            },
            toggleSlideShowMode() {
                const streams      = this.room.remoteStreams;
                const cb           = (evt) => {
                    console.log('SlideShowMode changed', evt);
                };
                this.slideShowMode = !this.slideShowMode;
                streams.forEach((stream) => {
                    if (this.localStream.getID() !== stream.getID()) {
                        console.log('Updating config');
                        var slideShowMode = this.slideShowMode
                        stream.updateConfiguration({slideShowMode}, cb);
                    }
                });
            },
            startBasicExample(){
                document.getElementById('startButton').disabled   = true;
                document.getElementById('slideShowMode').disabled = false;
                document.getElementById('startWarning').hidden    = true;
                document.getElementById('startButton').hidden     = true;
                this.recording                                         = false;
                const screen                                      = getParameterByName('screen');
                const roomName                                    = getParameterByName('room') || 'basicExampleRoom';
                const singlePC                                    = getParameterByName('singlePC') || false;
                const roomType                                    = getParameterByName('type') || 'erizo';
                const audioOnly                                   = getParameterByName('onlyAudio') || false;
                const mediaConfiguration                          = getParameterByName('mediaConfiguration') || 'default';
                const onlySubscribe                               = getParameterByName('onlySubscribe');
                const onlyPublish                                 = getParameterByName('onlyPublish');
                const autoSubscribe                               = getParameterByName('autoSubscribe');
                console.log('Selected Room', roomName, 'of type', roomType);
                const config = {
                    audio         : true,
                    video         : !audioOnly,
                    data          : true,
                    screen,
                    attributes    : {},
                    videoSize     : [640, 480, 640, 480],
                    videoFrameRate: [10, 30]
                };
                // If we want screen sharing we have to put our Chrome extension id.
                // The default one only works in our Lynckia test servers.
                // If we are not using chrome, the creation of the stream will fail regardless.
                if (screen) {
                    config.extensionId = 'okeephmleflklcdebijnponpabbmmgeo';
                }
                this.localStream       = Erizo.Stream(config);
                const createToken = (roomData, callback) => {
                    const req = new XMLHttpRequest();
                    const url = `${this.serverUrl}createToken/`;

                    req.onreadystatechange = () => {
                        if (req.readyState === 4) {
                            callback(req.responseText);
                        }
                    };

                    req.open('POST', url, true);
                    req.setRequestHeader('Content-Type', 'application/json');
                    req.send(JSON.stringify(roomData));
                };

                const roomData = {
                    username: 'user',
                    role    : 'presenter',
                    room    : roomName,
                    type    : roomType,
                    mediaConfiguration
                };

                createToken(roomData, (response) => {
                    var obj     = JSON.parse(response);
                    const token = obj.token;
                    console.log(token);
                    this.room = Erizo.Room({token});

                    const subscribeToStreams = (streams) => {
                        if (autoSubscribe) {
                            return;
                        }
                        if (onlyPublish) {
                            return;
                        }
                        const cb = (evt) => {
                            console.log('Bandwidth Alert', evt.msg, evt.bandwidth);
                        };




                        streams.forEach((stream) => {


                            if (this.localStream.getID() !== stream.getID()) {
                                var slideShowMode = this.slideShowMode

                                this.room.subscribe(stream, {slideShowMode, metadata: {type: 'subscriber'}});
                                stream.addEventListener('bandwidth-alert', cb);
                            }
                        });
                    };

                    this.room.addEventListener('room-connected', (roomEvent) => {
                        const options         = {metadata: {type: 'publisher'}};
                        const enableSimulcast = getParameterByName('simulcast');
                        if (enableSimulcast) options.simulcast = {numSpatialLayers: 2};

                        if (!onlySubscribe) {
                            this.room.publish(this.localStream, options);
                        }
                        if (autoSubscribe) {
                            this.room.autoSubscribe({'/attributes/type': 'publisher'}, {}, {
                                audio: true,
                                video: true,
                                data : false
                            }, () => {
                            });
                        }
                        subscribeToStreams(roomEvent.streams);
                    });

                    this.room.addEventListener('stream-subscribed', (streamEvent) => {
                        const stream = streamEvent.stream;
                        const div    = document.createElement('div');
                        div.setAttribute('style', 'width: 320px; height: 240px;float:left;');
                        div.setAttribute('id', `test${stream.getID()}`);

                        document.getElementById('videoContainer').appendChild(div);
                        stream.show(`test${stream.getID()}`);
                    });

                    this.room.addEventListener('stream-added', (streamEvent) => {
                        const streams = [];
                        streams.push(streamEvent.stream);
                        if (this.localStream) {
                            this.localStream.setAttributes({type: 'publisher'});
                        }
                        subscribeToStreams(streams);
                        document.getElementById('recordButton').disabled = false;
                    });

                    this.room.addEventListener('stream-removed', (streamEvent) => {
                        // Remove stream from DOM
                        const stream = streamEvent.stream;
                        if (stream.elementID !== undefined) {
                            const element = document.getElementById(stream.elementID);
                            document.getElementById('videoContainer').removeChild(element);
                        }
                    });

                    this.room.addEventListener('stream-failed', () => {
                        console.log('Stream Failed, act accordingly');
                    });

                    if (onlySubscribe) {
                        this.room.connect({singlePC});
                    } else {
                        const div = document.createElement('div');
                        div.setAttribute('style', 'width: 320px; height: 240px; float:left');
                        div.setAttribute('id', 'myVideo');
                        document.getElementById('videoContainer').appendChild(div);

                        this.localStream.addEventListener('access-accepted', () => {
                            this.room.connect({singlePC});
                            this.localStream.show('myVideo');
                        });
                        this.localStream.init();
                    }
                });
            },
            testConnection(){

            }
        }
    }
</script>


<style lang="scss" scoped rel="stylesheet/scss">
    .container {
        width      : 1170px;
        margin     : 0 auto;
        min-height : 900px;
    }


</style>

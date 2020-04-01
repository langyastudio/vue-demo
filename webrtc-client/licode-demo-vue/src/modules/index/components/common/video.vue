<template>
    <div class="video-player" v-if="reseted">
        <video class="video-js" ref="video"></video>
    </div>
</template>

<script>
    import {IsPC} from '@/config/utils'


    var DEFAULT_EVENTS = [
        'loadeddata',
        'canplay',
        'canplaythrough',
        'play',
        'pause',
        'waiting',
        'playing',
        'ended',
        'error'
    ]
    export default {
        props  : {
            videotype      : {
                type   : Number,
                default: 0
            },
            start          : {
                type   : Number,
                default: 0
            },
            playsinline    : {
                type   : Boolean,
                default: false
            },
            customEventName: {
                type   : String,
                default: 'statechanged'
            },
            options        : {
                type    : Object,
                required: true
            },
            events         : {
                type   : Array,
                default: () => []
            },
            globalOptions  : {
                type   : Object,
                default: () => ({
                    controls  : true,
                    controlBar: {
                        volumePanel: {
                            inline: false
                        }
                    },
                    plugins   : {},
                    autoplay  : false,
                    preload   : 'auto',
                    poster    : require('static/images/player.jpg'),
                })
            },
            globalEvents   : {
                type   : Array,
                default: () => []
            }
        },
        data   : function () {
            return {
                player : null,
                reseted: true

            }
        },
        mounted: function () {
            if (!this.player) {
                this.initialize()
            }

        },
        beforeDestroy() {
            if (this.player) {
                this.dispose()
            }
        },
        methods: {
            initialize(){

                this.initplay()

            },
            initplay(){
                // videojs options
                const videoOptions = Object.assign({}, this.globalOptions, this.options)


                // ios fullscreen
                if (this.playsinline) {
                    this.$refs.video.setAttribute('playsinline', this.playsinline)
                    this.$refs.video.setAttribute('webkit-playsinline', this.playsinline)
                    this.$refs.video.setAttribute('x5-playsinline', this.playsinline)
                    this.$refs.video.setAttribute('x5-video-player-type', 'h5')
                    this.$refs.video.setAttribute('x5-video-player-fullscreen', false)
                }

                // emit event
                const emitPlayerState = (event, value) => {
                    if (event) {
                        this.$emit(event, this.player)
                    }
                    if (value) {
                        this.$emit(this.customEventName, {[event]: value})
                    }
                }

                // player
                const self = this;

                this.player = videojs(this.$refs.video, videoOptions, function () {

                    // events
                    const events = DEFAULT_EVENTS.concat(self.events).concat(self.globalEvents)

                    // watch events
                    const onEdEvents = {}
                    for (let i = 0; i < events.length; i++) {
                        if (typeof events[i] === 'string' && onEdEvents[events[i]] === undefined) {
                            (event => {
                                onEdEvents[event] = null
                                this.on(event, () => {
                                    emitPlayerState(event, true)
                                })
                            })(events[i])
                        }
                    }

                    // watch timeupdate
                    this.on('timeupdate', function () {
                        emitPlayerState('timeupdate', this.currentTime())
                    })

                    // player readied
                    self.$emit('ready', this)
                })
            },
            dispose(callback) {
                if (this.player && this.player.dispose) {
                    if (this.player.techName_ !== 'Flash') {
                        this.player.pause && this.player.pause()
                    }
                    this.player.dispose()
                    this.player = null
                    this.$nextTick(() => {
                        this.reseted = false
                        this.$nextTick(() => {
                            this.reseted = true
                            this.$nextTick(() => {
                                callback && callback()
                            })
                        })
                    })
                }
            }

        },
        watch  : {
            options: {
                deep: true,
                handler(options, oldOptions) {
                    this.dispose(() => {
                        if (options && options.sources && options.sources.length) {
                            this.initialize()
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">

</style>






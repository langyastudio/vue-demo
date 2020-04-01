<template>
    <div>
        <vue-video class="vjs-custom-skin"
                   :videotype="1"
                   ref="videoPlayer"
                   :options="playerOptions"
                   :playsinline="true"
                   :events="events"
                   @play="onPlayerPlay($event)"
                   @pause="onPlayerPause($event)"
                   @ended="onPlayerEnded($event)"
                   @loadeddata="onPlayerLoadeddata($event)"
                   @waiting="onPlayerWaiting($event)"
                   @playing="onPlayerPlaying($event)"
                   @timeupdate="onPlayerTimeupdate($event)"
                   @canplay="onPlayerCanplay($event)"
                   @canplaythrough="onPlayerCanplaythrough($event)"
                   @ready="playerReadied"
                   @statechanged="playerStateChanged($event)"
                   @resolutionchange="playerResolutionChange($event)"
        >
        </vue-video>
    </div>


</template>

<script>
    import PlayVideo from '@/modules/index/components/common/video.vue'
    export default {
        data(){
            return {
                playerOptions: {
                    height : '360',
                    plugins: {
                        videoJsResolutionSwitcher: {
                            default     : 'high',
                            dynamicLabel: true
                        }
                    },

                },
                events       : ['resolutionchange']
            }
        },
        components: {
            'vue-video': PlayVideo
        },
        mounted(){


        },
        methods   : {
            // listen event
            onPlayerPlay(player) {
                //                 console.log('player play!', player)
            },
            onPlayerPause(player) {
                //                 console.log('player pause!', player)
            },
            onPlayerEnded(player) {
                // console.log('player ended!', player)
            },
            onPlayerLoadeddata(player) {
                // console.log('player Loadeddata!', player)
            },
            onPlayerWaiting(player) {
                // console.log('player Waiting!', player)
            },
            onPlayerPlaying(player) {
                // console.log('player Playing!', player)
            },
            onPlayerTimeupdate(player) {
                // console.log('player Timeupdate!', player.currentTime())
            },
            onPlayerCanplay(player) {
                // console.log('player Canplay!', player)
            },
            onPlayerCanplaythrough(player) {
                // console.log('player Canplaythrough!', player)
            },

            // or listen state event
            playerStateChanged(playerCurrentState) {
                //                 console.log('player current update state', playerCurrentState)
            },

            // player is ready
            playerReadied(player) {
                // seek to 10s
                console.log('example player 1 readied', player)
                //                player.currentTime(10)
                player.updateSrc([
                    {
                        src  : '/static/medias/01_avc_1104x622p25_aac_44100_2.mp4',
                        type : 'video/mp4',
                        label: 'HD'
                    },
                    {
                        src  : '/static/medias/01_avc_1104x622p25_aac_44100_2.mp4',
                        type : 'video/mp4',
                        label: 'SD'
                    }
                ])
                player.markers({
                    markerStyle: {
                        'width'           : '5px',
                        'background-color': '#ffffff',
                        'height'          : '.3em',
                        'bottom'          : 'auto',
                        'z-index'         : '10',
                        'top'             : '50%',
                        'transform'       : 'translateY(-50%)'
                    },
                    markers    : [
                        {time: 19, text: "thiskl"},
                        {time: 29, text: "is"},
                        {time: 39, text: "so"}
                    ],
                });
            },
            playerResolutionChange(player){
                console.info('Source changed to %s', player.src())

            }
        },
        watch     : {
            $route(){

                this.$destroy()
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>

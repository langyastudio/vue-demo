<template>
    <div>
        <vue-video class="vjs-custom-skin"
                   :videotype="2"
                   ref="videoPlayer"
                   :options="playerOptions"
                   :playsinline="true"
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
                    sources: [{
                        type: "rtmp/mp4",
                        src : "rtmp://media3.scctv.net/live/scctv_800"
                    }],
                    flash    : {
                        swf: '/static/assets/videojs-swf-5.4.2/dist/video-js.swf'
                    },
                    techOrder: ['flash'],
                    autoplay : false,
                    controls : true,
                    poster   : "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-9.jpg"
                }
            }
        },
        components: {
            'vue-video': PlayVideo
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

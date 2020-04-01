<template>
    <div>
        <vue-audio
            :songs="songs"
            width="500"
            initial-volume="30"
            loop auto-play
            repeat
            bg-color="#F7FAFF">
        </vue-audio>
    </div>
</template>


<script>
    import Audio from '@/modules/index/components/common/audio.vue'
    export default {
        components: {
            'vue-audio':Audio
        },
        data(){
            return {
                songs: [{
                    "url": "/static/medias/12_MPEG-Audio_8000_1.mp3",
                    "songname": "01_MPEG-Audio_44100_2"
                }, {
                    "url": "/static/medias/12_MPEG-Audio_8000_1.mp3",
                    "songname": "02_MPEG-Audio_44100_2"
                }]
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>

<template>
    <div class="player"
         :style="{'background-color': bgColor}">
        <div class="player-panel">
            <div class="player-panel-details">
                <div class="player-panel-title text-ellipsis" v-cloak :title="currentAudio.songname">
                    {{currentAudio.songname}}
                </div>

            </div>
        </div>
        <div class="player-controls">
            <div class="player-buttons">
                <div class="player-btn">
          <span class="player-loop" @click="toggleLoop()">
              <i class="fa" :class="{'fa-circle':!loop,'fa-random':loop}" aria-hidden="true"></i>
          </span>
                </div>
                <div class="player-btn">
          <span class="player-prev" @click="prev()">
            <i class="fa fa-circle-thin" aria-hidden="true"></i>

            <i class="fa fa-step-backward" aria-hidden="true"></i>

          </span>
                </div>
                <div class="player-btn">
          <span class="player-pause" @click="toggleStatus()">
            <i class="fa fa-play-circle" :class="{'fa-play-circle':isPause,'fa-pause-circle':!isPause}"
               aria-hidden="true"></i>
          </span>
                </div>
                <div class="player-btn">
          <span class="player-next" @click="next()">
             <i class="fa fa-circle-thin" aria-hidden="true"></i>

             <i class="fa fa-step-forward" aria-hidden="true"></i>
          </span>
                </div>
                <div class="player-panel-volume player-btn" ref="volume-control">
                    <div class="volume-button">
                        <i class="fa" :class="{'fa-volume-up':volume,'fa-volume-off':!volume}" @click="noVolume()"></i>
                    </div>
                    <div class="volume-range">
                        <el-slider :show-tooltip="false" v-model="volume" @input="volumeChange"></el-slider>
                    </div>


                </div>
            </div>
            <div style="clear: both"></div>
            <div class="player-range">
                <el-slider v-model="current" @change="change" @mousedown.native="mouseDown"
                           :format-tooltip="formatTooltip" :min="0" :max="duration"></el-slider>
                <div class="player-panel-time">
                    <span class="player-time-current pull-left">{{ current | time }}</span>
                    <span class="player-time-total pull-right">{{ duration | time }}</span>
                </div>

            </div>
        </div>
        <audio :src="currentAudio.url" id="player" :loop="loop" :autoPlay="autoPlay" @timeupdate="timeChange()"
               @loadeddata="getDuration()" @ended="next()"
               ref="player" @error="next()">
        </audio>
    </div>
</template>

<script>
    export default {
        props   : {
            autoPlay     : {
                type   : Boolean,
                default: true
            },
            repeat       : {
                type   : Boolean,
                default: true
            },
            loop         : {
                type   : Boolean,
                default: false
            },
            width        : {
                type   : String,
                default: '300'
            },
            initialVolume: {
                type   : String,
                default: '60'
            },
            bgColor      : {
                type   : String,
                default: '#000000'
            },
            songs        : {
                type: Array
            }
        },
        data    : function () {
            return {
                RANGE_WIDTH: 431,
                current    : 0,
                duration   : 0,
                oldVolume  : 0,
                audioIndex : 0,
                volume     : parseInt(this.initialVolume),
                isPause    : this.autoPlay == 'false',
            }
        },
        mounted : function () {
            this.$refs.player.volume = this.volume / 100;

            if (this.autoPlay == 'false')
                this.$refs.player.removeAttribute('autoplay')

        },
        computed: {
            currentAudio: function () {
                return this.songs[this.audioIndex];
            }
        },
        methods : {
            toggleStatus: function () {
                var player = this.$refs.player;
                this.isPause ? player.play() : player.pause();
                this.isPause = !this.isPause;
            },
            timeChange  : function () {

                this.current = this.$refs.player.currentTime;
            },
            getDuration : function () {
                this.duration = this.$refs.player.duration;
            },
            toggleLoop(){
                this.loop = !this.loop
            },
            formatTooltip(val){

                return this.$options.filters['time'](val)

            },
            change(val){

                this.$refs.player.currentTime = val
                this.$refs.player.play()
                this.isPause = false;

            },
            mouseDown   : function () {
                this.$refs.player.pause()
                this.isPause = true;
            },
            volumeChange: function (val) {
                this.volume              = val;
                this.$refs.player.volume = val / 100;
            },
            noVolume    : function () {

                if (this.volume) {
                    this.oldVolume = this.volume;
                    this.volume    = 0;
                } else {
                    this.volume = this.oldVolume;
                }
                this.$refs.player.volume = this.volume / 100;
            },
            prev        : function () {
                if (this.audioIndex == 0) {
                    if (this.repeat) {
                        this.audioIndex = this.songs.length - 1;
                    }
                } else {
                    this.audioIndex--;
                }
            },
            next        : function () {
                if (this.audioIndex == this.songs.length - 1) {
                    if (this.repeat) {
                        this.audioIndex = 0;
                    }
                } else {
                    this.audioIndex++;
                }
            }
        },
        filters : {
            time: function (value) {
                var length = Math.floor(parseInt(value));
                var minute = Math.floor(value / 60);
                if (minute < 10) {
                    minute = '0' + minute;
                }
                var second = length % 60;
                if (second < 10) {
                    second = '0' + second;
                }
                return minute + ':' + second;
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">


    .text-ellipsis {
        overflow      : hidden;
        white-space   : nowrap;
        text-overflow : ellipsis;
    }

    [v-cloak] {
        display : none
    }

    .player {
        margin        : 200px auto;
        border-radius : 3px;
        padding       : 15px;
        width         : 441px;
    }

    .player-panel {
        width         : 100%;
        height        : 45px;
        border-radius : 2px;
    }

    .player-btn {
        cursor : pointer;
        margin : 0 15px;
        i {
            color : #3b8cff;
        }

    }

    .player-btn span {
        display : block;
    }

    .player-prev {

        position : relative;
        i.fa-circle-thin {
            font-size : 50px;
            color     : #d3e4fd;
        }
        i.fa-step-backward {
            position  : absolute;
            top       : 50%;
            left      : 50%;
            transform : translate(-50%, -50%);
            font-size : 14px;
            color     : #3b8cff;
        }

    }

    .player-pause {
        i {
            font-size : 60px;
            color     : #3b8cff
        }

    }

    .player-play {
        i {
            font-size : 60px;
            color     : #3b8cff
        }
    }

    .player-next {
        position : relative;
        i.fa-circle-thin {
            font-size : 50px;
            color     : #d3e4fd;
        }
        i.fa-step-forward {
            position  : absolute;
            top       : 50%;
            left      : 50%;
            transform : translate(-50%, -50%);
            font-size : 14px;
            color     : #3b8cff;
        }
    }

    .player-buttons {
        overflow        : hidden;
        display         : flex;
        justify-content : center;
        align-items     : center;
    }

    .player-panel-details {
        width      : 100%;
        height     : 100%;
        text-align : center;
        color      : #333;
    }

    .player-panel-volume {
        display      : flex;
        align-items  : center;
        margin-right : 0;
        i {
            color     : #3b8cff;
            font-size : 20px;
        }
        .volume-button {
            width : 25px;
        }
        .volume-range {
            width       : 60px;
            margin-left : 5px;

        }
    }

    .player-panel-title {
        width       : 100%;
        height      : 22px;
        font-size   : 16px;
        line-height : 22px;
        color       : #5e687e;
    }

    .player-panel-time {
        width     : 100%;
        overflow  : hidden;
        font-size : 10px;
        color     : #424e67
    }

    .player-time-total {
        font-size      : 10px;
        vertical-align : text-bottom;
    }

    .backBlack {
        background-color : #000
    }

    .player-range {
        .el-slider__bar, .el-slider__runway {
            border-radius : 0
        }
        .el-slider__runway {
            background : #edf4fd
        }
        .el-slider__button {
            width         : 2px;
            border-radius : 0;
            height        : 12px;
        }
    }


</style>


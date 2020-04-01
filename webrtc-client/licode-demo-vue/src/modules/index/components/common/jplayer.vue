<template>
    <div>
        <div id="jplayer_1"></div>
        <div class="player" id="jp_container_1">
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
          <span class="player-loop" @click="toggleLoop">
              <i class="fa" :class="{'fa-random':isloop,'fa-circle':!isloop}" aria-hidden="true"></i>
          </span>
                    </div>
                    <div class="player-btn">
          <span class="player-prev" @click="prev">
            <i class="fa fa-circle-thin" aria-hidden="true"></i>
            <i class="fa fa-step-backward" aria-hidden="true"></i>
          </span>
                    </div>
                    <div class="player-btn">
            <span class="player-pause jp-play">
              <i class="fa " :class="{'fa-pause-circle':!isPause,'fa-play-circle':isPause}" aria-hidden="true"></i>
            </span>
                    </div>

                    <div class="player-btn">
          <span class="player-next" @click="next()">
             <i class="fa fa-circle-thin" aria-hidden="true"></i>
             <i class="fa fa-step-forward" aria-hidden="true"></i>
          </span>
                    </div>
                    <div class="player-panel-volume player-btn" ref="volume-control">
                        <div class="volume-button" @click="Mute">
                            <i class="fa" :class="{'fa-volume-off':!volume,'fa-volume-up':volume}"></i>
                        </div>
                        <div class="volume-range">
                            <el-slider v-model="volume" @input="volumeChange" :show-tooltip="false"></el-slider>
                        </div>
                    </div>
                </div>
                <div style="clear: both"></div>
                <div class="player-range">
                    <el-slider :show-tooltip="false" v-model="current" :min="0" :format-tooltip="formatTooltip"
                               @change="change" @mousedown.native="mouseDown"></el-slider>
                    <div class="player-panel-time">
                        <span class="player-time-current pull-left jp-current-time"></span>
                        <span class="player-time-total pull-right jp-duration"></span>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        props   : {
            volume: {
                type   : String,
                default: '60'
            },
            songs : {
                type: Array
            }
        },
        data    : function () {
            return {
                isPause   : true,
                current   : 0,
                oldVolume : 0,
                isloop    : true,
                audioIndex: 0
            }
        },
        mounted : function () {
            var that    = this;
            this.myPlay = $("#jplayer_1").jPlayer({
                ready            : function () {
                    $(this).jPlayer("setMedia", {
                        mp3: that.currentAudio.url,

                    })
                    that.myPlay.jPlayer("option", "volume", that.volume / 100);
                },
                play             : function (event) {
                    that.isPause = false;
                },
                pause            : function (event) {
                    that.isPause = true;
                },
                timeupdate       : function (event) {
                    that.current = event.jPlayer.status.currentPercentAbsolute

                },
                ended            : function () {
                    that.next(true)

                },
                supplied         : "mp3",
                wmode            : "window",
                useStateClassSkin: true,
                autoBlur         : false,
                smoothPlayBar    : true,
                keyEnabled       : true,
                loop             : that.isloop,

            });
        },
        computed: {
            currentAudio: function () {
                return this.songs[this.audioIndex];
            }
        },
        methods : {

            toggleLoop(){
                this.myPlay.jPlayer("option", "loop", !this.isloop);
                this.isloop = !this.isloop

            },
            formatTooltip(val){


            },
            volumeChange(val){
                if (typeof this.myPlay != 'undefined') {
                    this.myPlay.jPlayer("option", "muted", false);
                    this.myPlay.jPlayer("option", "volume", val / 100);
                }
            },
            Mute(){
                if (this.volume) {
                    this.oldVolume = this.volume;
                    this.myPlay.jPlayer("option", "muted", true);
                    this.volume = 0;
                } else {
                    this.myPlay.jPlayer("option", "muted", false);
                    this.volume = this.oldVolume;
                    this.myPlay.jPlayer("option", "volume", this.volume / 100);
                }

            },
            mouseDown(){
                this.myPlay.jPlayer('pause')
                this.isPause = true
            },
            change(val){

                var sp = this.myPlay.data("jPlayer").status.seekPercent
                this.myPlay.jPlayer("playHead", val * (100 / sp))
                this.myPlay.jPlayer('play')
                this.isPause = false
            },
            next(isend){
                if ((isend && !this.isloop) || !isend) {

                    if (this.audioIndex == this.songs.length - 1) {

                        this.audioIndex = 0;
                    } else {
                        this.audioIndex++;
                    }
                    this.myPlay.jPlayer("setMedia", {
                        mp3: this.currentAudio.url,
                    })
                    this.myPlay.jPlayer("play")
                }


            },
            prev(){
                if (this.audioIndex == 0) {
                    this.audioIndex = this.songs.length - 1;
                } else {
                    this.audioIndex--;
                }
                this.myPlay.jPlayer("setMedia", {
                    mp3: this.currentAudio.url,
                })
                this.myPlay.jPlayer("play")

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

    .player {
        margin           : 200px auto;
        border-radius    : 3px;
        padding          : 15px;
        width            : 441px;
        background-color : #f7faff
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



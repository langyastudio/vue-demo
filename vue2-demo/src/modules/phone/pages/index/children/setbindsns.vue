<template>
    <div style="width:100%">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <img src="~static/images/1.jpeg" alt="">
                </div>
                <div class="swiper-slide">
                    <img src="~static/images/2.jpg" alt="">
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                info: '我是账号绑定',
                list: [{name: 'li'}, {name: 'zhao'}]
            }
        },
        mounted(){
            //初始化swiper
            new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                loop      : true
            });

        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .swiper-container {
        width  : 100%;
        height : 200px;
        .swiper-slide {
            width  : 100%;
            height : 100%;
        }
        img {
            display : block;
            width   : 100%;
            height  : 100%;
        }
    }
</style>

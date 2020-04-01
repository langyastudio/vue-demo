<template>
    <div style="height:100%">
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
            new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                loop      : true
            });
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .table_container {
        padding : 20px;
    }

    .swiper-container {
        width  : 100%;
        height : 100%;
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

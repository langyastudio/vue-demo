<template>
    <div class="not-exsit">
        <div class="no-exsit-imgc">
            <img src="~static/images/404.png" alt="">
        </div>
        <div class="no-exsit-content">
            <h1>404</h1>
            <p>抱歉，你访问的页面不存在</p>
            <el-button @click="reback" type="primary">返回首页</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            reback() {
                location.href = '/'
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "~@/style/common/variable";

    .not-exsit {
        height          : 100%;
        display         : flex;
        align-items     : center;
        justify-content : space-around;
        .no-exsit-imgc {
            width : 482px;
            img {
                width : 100%
            }
        }
        .no-exsit-content {
            h1 {
                font-size : 100px;
                margin    : 0 0 24px 0;
                color     : rgba(0, 0, 0, .7);
            }
            p {
                font-size : 20px;
                color     : $text-third-color;
                margin    : 0 0 24px 0;
            }
        }
    }
</style>

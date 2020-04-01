<template>
    <div class="header_container">
        <div class="logoContain">
            <img class="logo" src="~static/images/logo.png" alt="">
            <div> 头部</div>
            <ul class="head-nav-list">
                <li><a href="/">首页</a></li>
                <li><a href="/video">视频</a></li>
                <li><a href="/audio">音频</a></li>
                <li><a href="/upload">上传</a></li>
                <li><a href="/valaditor">表单验证</a></li>
                <li><a href="/editor">Editor</a></li>
                <li><a href="/admin/visitor">后台管理</a></li>
            </ul>
        </div>

    </div>
</template>

<script>
    import {setCookie, removeCookie} from '@/config/utils';
    export default {
        data(){
            return {}
        },
        created(){
            setCookie("MazeCloud", "f023516f02cfe15986daceda2b1152e1")

        },
        computed: {},
        methods : {}
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    .header_container {
        background-color : #fff;
        height           : 60px;
        display          : flex;
        justify-content  : space-between;
        align-items      : center;
        padding-left     : 20px;
        color            : #2697ea;
        .logoContain {
            display     : flex;
            align-items : center;

            .logo {
                margin-right  : 10px;
                width         : 50px;
                height        : 50px;
                border-radius : 50%;
            }
        }
        .head-nav-list {
            li {
                float : left;
                a {
                    display : block;
                    padding : 0 30px
                }
            }

        }

    }
</style>

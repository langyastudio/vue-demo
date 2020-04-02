<template>
    <div class="header_container">
        <div class="logoContain">
            <div> 头部</div>
            <ul class="head-nav-list">
                <li><a href="/">首页</a></li>
            </ul>
        </div>

    </div>
</template>

<script>
    export default {
        data(){
            return {}
        },
        created(){


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

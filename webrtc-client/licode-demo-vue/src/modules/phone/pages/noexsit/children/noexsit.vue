<template>
    <div>
        <div class="noexsit-wrap">
            <div class="noexsit-wrap-head">
                <div class="container text-center" style="color: #636b6f;">
                    <h1>找不到页面</h1>
                    <h3>为你造成的不便我们深表歉意</h3>
                </div>
            </div>

            <div class="notfound">
                <div class="container">
                    <div class="notfount-text text-center">
                        <h3>也许你正在寻找以下内容之一？</h3>
                        <p><a href="/m/user/setprofile">首页</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        components: {},
        mounted(){
            document.title = 404
        }
    }
</script>


<style lang="scss" scoped rel="stylesheet/scss">
    .noexsit-wrap {
        text-align     : center;
        position       : fixed;
        top            : 0;
        bottom         : 55px;
        width          : 100%;
        display        : flex;
        flex-direction : column;
        .noexsit-wrap-head {
            background-color : #edeff0;
            flex             : 1;
            display          : flex;
            flex-direction   : column;
            justify-content  : center;
            h1 {
                margin : 0;
            }

        }
        .notfound {
            color           : #636b6f;
            flex            : 1;
            display         : flex;
            flex-direction  : column;
            justify-content : center;
        }
    }


</style>

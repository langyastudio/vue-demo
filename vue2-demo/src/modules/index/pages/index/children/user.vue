<template>
    <div>
        <head-top></head-top>
        <el-row class="container">
            <el-col :span="4" style=" background-color: #fff;height:100%">
                <el-menu :default-active="defaultActive" theme="dark" router>
                    <el-menu-item index="/">demo1</el-menu-item>
                    <el-menu-item index="/index/demo2">demo2</el-menu-item>

                </el-menu>
            </el-col>
            <el-col :span="20">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>

            </el-col>

        </el-row>
        <foot-bootom></foot-bootom>
    </div>
</template>

<script>
    import headTop from 'index/components/header/header-top'
    import footBootom from 'index/components/footer/footer-bottom'
    export default {
        data(){
            return {

            }
        },
        computed  : {
            defaultActive: function () {
                return this.$route.path;
            }
        },
        components: {
            headTop,
            footBootom,
        },
        mounted(){

        },
        methods   : {

        }
    }
</script>


<style lang="scss" scoped rel="stylesheet/scss">
    .container {
        width      : 1170px;
        margin     : 20px auto;
        height : 400px;
    }


</style>

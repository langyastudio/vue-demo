<template>
    <div>
        <head-top></head-top>
        <el-row class="container">
            <el-col :span="6" style=" background-color: #fff;">
                <el-menu :default-active="defaultActive" theme="dark" router>
                    <el-menu-item index="/video"><i class="el-icon-menu"></i>video</el-menu-item>
                    <el-menu-item index="/video/hls"><i class="el-icon-menu"></i>videohls</el-menu-item>
                    <el-menu-item index="/video/rtmp"><i class="el-icon-menu"></i>videortmp</el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="18">
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
        computed  : {
            defaultActive: function () {
                return this.$route.path;
            }
        },
        components: {
            headTop,
            footBootom
        },
    }
</script>


<style lang="scss" scoped rel="stylesheet/scss">
    .container {
        width      : 1170px;
        margin     : 0 auto;
        display    : flex;
        min-height : 900px;
    }


</style>

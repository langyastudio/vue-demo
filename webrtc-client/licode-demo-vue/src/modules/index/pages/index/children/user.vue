<template>
    <div>
        <head-top></head-top>
        <el-row class="container">
            <el-col :span="6" style=" background-color: #fff;">
                <el-menu :default-active="defaultActive" router>
                    <el-menu-item index="/"><i class="el-icon-menu"></i><span>用户信息</span></el-menu-item>
                    <el-menu-item index="/index/setbindsns"><i class="el-icon-menu"></i><span>账号绑定</span></el-menu-item>
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
    import echartVue from './echart'
    export default {
        computed  : {
            defaultActive: function () {
                return this.$route.path;
            }
        },
        components: {
            headTop,
            footBootom,
            echartVue
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

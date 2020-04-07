<template>
    <div>
        <head-top></head-top>
        <el-row class="container">
            <el-col>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import headTop from 'index/components/header/header-top'
    import footBootom from 'index/components/footer/footer-bottom'

    export default {
        data() {
            return {}
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
        mounted() {

        },
        methods   : {}
    }
</script>

<style lang="scss" scoped rel="stylesheet/scss">
    .container {
        width: 1170px;
        margin: 24px auto;
        height: 400px;
    }
</style>

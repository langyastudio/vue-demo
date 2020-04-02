<template>
    <div>
        <head-top></head-top>
        <el-row class="container">

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
            footBootom,
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

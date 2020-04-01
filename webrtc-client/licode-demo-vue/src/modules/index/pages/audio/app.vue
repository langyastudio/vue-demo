<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

    export default {
        data(){
            return {}
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../../../style/common/mixin';
    #app {
        min-width : 1170px;
    }

</style>

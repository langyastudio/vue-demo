<template>
    <mt-header fixed title="标题过长会隐藏后面的内容啊哈哈哈哈">
        <a style="display:block" href="/m/video" slot="left">
            <mt-button icon="back">返回</mt-button>
        </a>
        <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
</template>

<script>
    import {setCookie} from '@/config/utils';

    export default {
        data(){
            return {}
        },
        created(){
            setCookie('MazeCloud', 'f023516f02cfe15986daceda2b1152e1')

        },
        computed: {},
        methods : {}
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>

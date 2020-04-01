<template>
    <div class="">
        <ul>
            <li v-for="item in list">{{item.name}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        mounted(){

        },
        props  : ['list'],
        methods: {},
        watch  : {}
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>

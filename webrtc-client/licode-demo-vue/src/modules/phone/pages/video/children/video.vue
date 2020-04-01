<template>
    <div>
        <head-top></head-top>
        <div class="container">
            另一个
        </div>
        <foot-bootom></foot-bootom>
    </div>
</template>

<script>
    import headTop from 'phone/components/header/header-top'
    import footBootom from 'phone/components/footer/footer-bottom'
    export default {
        components: {
            headTop,
            footBootom
        },
    }
</script>


<style lang="scss" scoped rel="stylesheet/scss">
    .container {
        width    : 100%;
        position : absolute;
        top      : 40px;
        bottom   : 55px;
    }


</style>

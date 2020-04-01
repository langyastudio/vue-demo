<template>
    <div>
        <i class="fa fa-bath" aria-hidden="true"></i>
        <mt-cell-swipe
            title="标题文字"
            :right="[
    {
      content: 'Delete',
      style: { background: 'red', color: '#fff' },
      handler: () => this.$messagebox('delete')
    },
    {  content: 'save',
      style: { background: 'green', color: '#fff' },
      handler: () => this.$messagebox('save')}
  ]"></mt-cell-swipe>
    </div>

</template>

<script>
    import {getCourseList, creatCourse, editCourse} from '@/api/getdata'
    import Bowser from 'bowser'


    export default {
        data(){
            return {
                list: [{name: 'wang'}, {name: 'li'}]
            }
        },

        created(){
            console.log(Bowser)


        },
        mounted(){

        },
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>

<template>
    <div>
        <span class="week-prev el-icon-arrow-left" @click="week_prev"></span>
        <span class="week-time">{{week_time.start}} --- {{dtime(new Date(new Date(week_time.start.replace(/-/g, '/')).getTime()  + 6 *60*60*24*1000)).format('YYYY-MM-DD')}}</span>
        <span class="week-next el-icon-arrow-right" @click="week_next"></span>
    </div>

</template>

<script>
    import dtime from 'time-formater'
    export default {
        data(){
            return{
                week_time:{
                    start:''
                },
            }
        },
        mounted(){
            this.getsCurWeekTime()

        },
        methods: {
            dtime,
            setWeekTime(from){
                this.week_time = {
                    start:from
                }
            },
            getsCurWeekTime() {
                var d = new Date();
                var w1 = d.getDay();
                var from;
                if (w1 == 0) w1 = 7;
                if(w1 == 1){
                    from = dtime(new Date(new Date().getTime())).format('YYYY-MM-DD')
                }else{
                    from = dtime(new Date(new Date().getTime()  - (w1 - 1) *60*60*24*1000)).format('YYYY-MM-DD')
                }
                this.setWeekTime(from)

            },
            week_prev(){
                var from =   dtime(new Date(new Date(this.week_time.start.replace(/-/g, '/')).getTime()  - 7 *60*60*24*1000)).format('YYYY-MM-DD')
                this.setWeekTime(from);

            },
            week_next(){
                var from =   dtime(new Date(new Date(this.week_time.start.replace(/-/g, '/')).getTime()  + 7 *60*60*24*1000)).format('YYYY-MM-DD')
                this.setWeekTime(from);

            },

        },
        watch:{
            week_time(val){
                var end = dtime(new Date(new Date(val.start.replace(/-/g, '/')).getTime()  + 6 *60*60*24*1000)).format('YYYY-MM-DD')

                this.$emit('change',val.start,end)
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~@/style/common/variable";
    .week-prev,.week-next{
        cursor: pointer;

    }

</style>

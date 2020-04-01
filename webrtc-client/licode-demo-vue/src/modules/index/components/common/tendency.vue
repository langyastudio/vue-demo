<template>
    <div style="width: 100%;height:450px;">

        <div id="line1" class="line1" style="width:100%;height:100%"></div>
    </div>

</template>

<script>
    export default {
        data(){
            return {
                userNum: [0, 30, 40, 65, 23, 56, 43]
            }
        },
        mounted(){
            this.myChart = echarts.init(document.getElementById('line1'));
            this.initData();

        },
        props  : ['userCount', 'timeData'],
        methods: {
            initData(){
                const colors = ['#2697eb'];
                const option = {
                    color  : colors,
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis  : {
                        type       : 'category',
                        boundaryGap: false,
                        data       : this.timeData
                    },
                    yAxis  : [
                        {
                            type     : 'value',
                            min      : 0,
                            max      : 75,
                            position : 'left',
                            axisLine : {
                                lineStyle: {
                                    color: '#999',
                                }
                            },
                            axisLabel: {
                                formatter: '{value}'
                            },
                            interval : 15
                        },
                        {
                            show: false,
                        },
                    ],
                    series : [{
                        name: '用户增长数',
                        data: this.userCount,
                        type: 'line'
                    }

                    ]
                };
                if (typeof this.myChart != 'undefined')
                    this.myChart.setOption(option);
            },

        },
        watch  : {
            userCount: function () {
                this.initData();

            },
            timeData : function () {

            },
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .line1 {
        display         : flex;
        justify-content : center;
    }
</style>

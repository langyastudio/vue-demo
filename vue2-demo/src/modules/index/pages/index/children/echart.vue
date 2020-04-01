<template>
    <div>
        <div class="test test-max-h" style="font-size:14px;color:#666">
            发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦发大水发大厦大厦发大水发大厦发大水发大厦发大水发大厦发大水发你好

        </div>
        <div class="test test-max-h" style="font-size:14px;color:#666">
            fdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsafdfsafafsafsa

        </div>
        <el-button type="primary" @click="openModal">打开模态框</el-button>
        <week @change="weekChange"></week>

        <div id="captcha"></div>
        <div id="msg"></div>
        <section class="data_section">
            <el-row :gutter="20" class="data_section_row">
                <el-col :span="8" class="data-list-item">
                    <div class="data_list">总用户数</div>
                    <div class="data_num">120</div>
                </el-col>
                <el-col :span="8" class="data-list-item">
                    <div class="data_list">今日新增用户数</div>
                    <div class="data_num">40</div>
                </el-col>
                <el-col :span="8" class="data-list-item">
                    <div class="data_list">日活跃用户数</div>
                    <div class="data_num">60</div>
                </el-col>
            </el-row>
        </section>
        <div class="button-container" style="overflow:hidden">
            <el-row class="pull-right">
                <el-button type="primary" @click="getUserNum(1)">本周</el-button>
                <el-button type="primary" @click="getUserNum(2)">本月</el-button>
                <el-button type="primary" @click="getUserNum(3)">全年</el-button>
            </el-row>
        </div>
        <tendency :userCount='userCount' :timeData='timeData'></tendency>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%">
                <el-table-column
                    width="100">
                </el-table-column>
                <el-table-column
                    property="registe_time"
                    label="注册日期"
                    width="220">
                </el-table-column>
                <el-table-column
                    property="username"
                    label="用户姓名"
                    width="220">
                </el-table-column>
                <el-table-column
                    property="city"
                    label="注册地址">
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="count">
                </el-pagination>
            </div>
        </div>

        <modal-dialog :isShow="isShow" @close="closeModal" title="模态框"></modal-dialog>

    </div>
</template>

<script>
    import {getCourseList, creatCourse, editCourse} from '@/api/getdata'
    import tendency from 'index/components/common/tendency'
    import week from 'index/components/common/week'
    import modalDialog from 'index/components/common/modal-dialog'
    import dtime from 'time-formater'
    import {getCurrentMonthLast} from '@/config/utils'
    import {mapActions, mapState} from 'vuex'

    export default {
        data(){
            return {
                isShow:false,
                timeData   : [],
                userCount  : [],
                allMonth   : [],
                allDay     : [],
                sevenDate  : [],
                tableData  : [],
                currentPage: 1,
                count      : 0
            }
        },
        components: {
            tendency,
            modalDialog,
            week

        },
        computed  : {
            ...mapState(['userInfo']),
        },
        created(){
            this.getCourseList();
            editCourse({
                data    : {
                    channel_id    : 40,
                    catalog_values: '83,858',
                    title         : 'vue测试',
                    series_num    : 12,
                    audiences     : '',
                    description   : 'jhkl',
                    course_id     : '4b7a4a043d968bdf2e8a0018a1ebfec3'
                },
                callback: function (res) {


                }
            })


        },
        mounted(){
            jigsaw.init({
                el: document.getElementById('captcha'),
                onSuccess: function() {
                    document.getElementById('msg').innerHTML = '登录成功！'
                },
                onFail: cleanMsg,
                onRefresh: cleanMsg
            })
            function cleanMsg() {
                document.getElementById('msg').innerHTML = ''
            }

            $clamp('.test',{
                clamp:2,
                truncationHTML:'<span class="readmore">展开</span>',
                max_class:"test-max-h"
            })


            this.getUserData()


            var time = new Date()
            //一周
            for (let i = 6; i > -1; i--) {
                var date = dtime(time.getTime() - 86400000 * i).format('MM-DD')
                this.sevenDate.push(date);
                this.timeData.push(date)
            }


            for (var i = 1; i <= getCurrentMonthLast(); i++) {
                var date = dtime(new Date(time.getFullYear(), time.getMonth(), i, 0, 0, 0)).format('MM-DD')
                this.allDay.push(date)
            }

            //全年
            for (var i = 1; i <= 12; i++) {
                this.allMonth.push(i + '月')
            }
            this.userCount = [0, 15, 30, 40, 60, 23, 46]
        },
        methods   : {
            ...mapActions(['getUserData']),
            weekChange(from,end){
                console.log(from)
                console.log(end)

            },
            closeModal(){
                this.isShow = false
            },
            openModal(){
                this.isShow = true
            },
            getCourseList(){
                var that = this;
                getCourseList({
                    data    : {page: 1, per_page: 8, type: 1, audit: 2},
                    callback: function (res) {
                        that.tableData = [];
                    }
                })

            },
            getUserNum(type){
                if (type == 1) {
                    this.userCount = [20, 15, 30, 40, 60, 23, 46];
                    this.timeData  = this.sevenDate
                } else if (type == 2) {
                    this.userCount = [60, 30, 10, 50, 10, 24, 36]
                    this.timeData  = this.allDay;
                } else if (type == 3) {
                    this.userCount = [30, 20, 10, 40, 50, 14, 26, 45, 56, 34, 23, 45];
                    this.timeData  = this.allMonth
                }
            },
            handleSizeChange(){

            },
            handleCurrentChange(){

            }
        },
        watch     : {
            userInfo(val){
                console.log(val)
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" >
    .test{
        line-height:20px;

    }
    .test-max-h{
        max-height:40px;
        overflow:hidden;
    }
    .readmore{
        color:blue;
        cursor:pointer
    }
    .table_container {
        padding : 20px;
    }

    .data_section {
        .data_section_row {
            height     : 105px;
            text-align : center;
            background : #fff;
            margin     : 20px 0 !important;
            padding    : 24px 0
        }
        .data-list-item {
            border-left : 1px solid #ddd;
            &:first-child {
                border : none
            }
        }
        .data_list {
            font-size   : 14px;
            color       : gray;
            line-height : 30px;

        }
        .data_num {
            font-size   : 24px;
            font-weight : bold;

        }
    }
</style>

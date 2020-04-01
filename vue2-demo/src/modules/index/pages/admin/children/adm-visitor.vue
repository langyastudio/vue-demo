<template>
    <div class="adm-visitor-manage-wrap">
        <el-row class="adm-visitor-manage-wrap-content">
            <div class="adm-visit-list-title adm-module-title">访问控制</div>
            <div class="adm-visit-form">
                <div class="adm-visit-form-item">
                    <div class="adm-visit-title">注册：</div>
                    <div class="adm-visit-cnt">
                        <div class="adm-visit-radio-group">
                            <el-radio-group>
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="adm-visit-desc">
                            开启后将打开注册功能
                        </div>

                    </div>

                </div>
                <div class="adm-visit-form-item">
                    <div class="adm-visit-title">微信：</div>
                    <div class="adm-visit-cnt">
                        <div class="adm-visit-radio-group">
                            <el-radio-group>
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="adm-visit-desc">
                            开启后将打开关于微信的所有功能
                        </div>

                    </div>

                </div>
                <div class="adm-visit-form-item">
                    <div class="adm-visit-title">校验码：</div>
                    <div class="adm-visit-cnt">
                        <div class="adm-visit-radio-group">
                            <el-radio-group>
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="adm-visit-desc">
                            开启后需要校验码进行加强验证
                        </div>

                    </div>

                </div>
                <div class="adm-visit-form-item">
                    <div class="adm-visit-title">速率限制：</div>
                    <div class="adm-visit-cnt">
                        <div class="adm-visit-radio-group">
                            <el-radio-group>
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="adm-visit-desc">
                            开启后限制后台接口请求的频率，防止恶意攻击
                        </div>

                    </div>

                </div>
                <div class="adm-visit-form-item">
                    <div class="adm-visit-title">单点登录：</div>
                    <div class="adm-visit-cnt">
                        <div class="adm-visit-radio-group">
                            <el-radio-group>
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="adm-visit-desc">
                            开启后同一客户端（windows、mac、linux、mobile、pad）只允许一个账户登录
                        </div>

                    </div>

                </div>
                <div class="adm-visit-btn-panel">
                    <el-button type="primary" @click="saveVisit" :loading="visitloading" size="small">保存</el-button>
                    <el-button type="default" @click="resetVisit" size="small">重置</el-button>
                </div>
            </div>


        </el-row>


    </div>
</template>

<script>

    export default {
        data(){
            return {
                visitloading:false
            }
        },
        computed:{

        },
        components: {

        },
        mounted(){

        },
        methods   : {
            saveVisit(){

            },
            resetVisit(){

            }

        },

    }
</script>


<style lang="scss" rel="stylesheet/scss">
    @import "~@/style/common/variable";

    .adm-visitor-manage-wrap {
        background : #fff;
        padding: 24px 32px 48px 32px;
        margin: 24px;
        height: calc(100% - 64px - 97px - 48px);

        .adm-visitor-manage-wrap-content {
            display        : flex;
            flex-direction : column;
            height         : 100%;
            .adm-visit-form{
                height:100%;
                overflow:auto;
            }
            .adm-visit-form-item{
                display:flex;
                margin-bottom:30px;
                height:50px;
                .adm-visit-title{
                    float:left;
                    margin-right:24px;
                    width:80px;
                    text-align: right;
                }
                .adm-visit-cnt{
                    float:left;
                    .adm-visit-desc{
                        margin-top:16px;
                        color:#999;
                        font-size:13px;
                    }


                }


            }
            .adm-visit-btn-panel{
                padding-left:104px;
                margin-bottom: 0;
                font-size: 0;
            }
        }

    }

</style>

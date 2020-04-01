<template>
    <el-dialog :width="defaultW" top="0" custom-class="custom-dialog" :title="title" :visible.async="isShow"
               @close="close" @open="open" @closed="closed" :before-close="beforeClose" v-dialogDrag>
        <slot></slot>
        <div slot="footer" class="dialog-footer" style="overflow: hidden;min-height: 32px;font-size:0">
            <el-button type="primary" @click="save" v-show="save_btn_show" :loading="loading" size="small">{{btn2Text}}</el-button>
            <el-button v-if="title!='修改头像'" @click="cancel" size="small">{{btn1Text}}</el-button>

        </div>
    </el-dialog>
</template>
<script>
    import dialogDrag from '@/directive/el-drag-dialog' // waves directive
    export default {
        props: {
            defaultW  : {
                type   : String,
                default: '520px'
            },
            isShow  : {
                type   : Boolean,
                default: false
            },
            save_btn_show  : {
                type   : Boolean,
                default: true
            },
            title   : {
                type: String
            },
            btn1Text: {
                type   : String,
                default: '取 消'
            },
            btn2Text: {
                type   : String,
                default: '保 存'
            },


        },
        directives: { dialogDrag },
        data() {
            return {
                loading:false,
                is_clear_form:false
            };
        },
        components: {

        },
        methods   : {
            save(){
                this.is_clear_form = true;
                this.$emit('save')
            },
            cancel(){
                this.is_clear_form = false;
                this.$emit('close', this.isShow)
            },
            beforeClose(done){
                this.is_clear_form = false;
                done()
            },
            close(){
                this.$emit('close', this.isShow)
            },
            closed(){
                this.loading = false;
                this.$emit('closed',this.is_clear_form);
                this.is_clear_form = false;
            },
            open(){
                _css('.custom-dialog',{'left':0,'top':0})
            },
        }
    };
</script>


<style lang="scss" rel="stylesheet/scss">
    @import "~@/style/common/variable";

    .el-dialog__wrapper {
        display     : flex;
        align-items : center;

    }

    .custom-dialog {
        .el-dialog__header {
            border-bottom : 1px solid #ddd;
            height        : 54px;
            line-height   : 54px;
            padding       : 0 20px;
            background: #2697eb;
            cursor:move;

            .el-dialog__title {
                font-size : 15px;
                color: #fff;
            }
            .el-dialog__close{
                color: #fff;
            }

        }
        .el-dialog__body {
            padding       : 24px;
            border-bottom : 1px solid #ddd;
        }
        .el-dialog__footer {
            padding : 16px 20px;
        }
        .el-form {
            .el-form-item:last-child {
                margin-bottom : 0
            }
        }

        .el-button--mini {
            padding   : 0px;
            height    : 32px;
            font-size : 14px;
        }
        .el-button {
            padding: 8px 15px;
            font-size: 14px;
        }
        .el-form-item--mini .el-form-item__content,
        .el-form-item--mini .el-form-item__label,
        .el-input--mini .el-input__inner {
            height      : 32px;
            line-height : 32px;
            font-size   : 14px;
        }
    }

</style>


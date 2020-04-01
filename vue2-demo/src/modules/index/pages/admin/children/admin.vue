<template>
    <div class="admin-container">
        <div class="admin-left-area">

            <el-scrollbar wrap-class="scrollbar-wrapper">
                <el-menu
                    :default-active="defaultActive"
                    class="el-menu-vertical-demo admin-left-list"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#001529"
                    text-color="#999"
                    active-text-color="#fff"
                    :collapse="isCollapse"
                    :collapse-transition="isanimate"
                    router>
                    <el-menu-item style="cursor:default" index="" disabled class="admin-title">
                        <template slot="title">
                            <span slot="title">后台管理</span>
                        </template>
                    </el-menu-item>
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="iconfont iconcogs"></i>
                            <span slot="title">站点管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/admin/visitor">访问控制</el-menu-item>
                            <el-menu-item index="/admin/video">视频配置</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span slot="title">权限设置</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/admin/role">角色管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">权限管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">d管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">d管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">d管理</el-menu-item>
                            <el-menu-item index="/admin/userrole">d管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-scrollbar>


        </div>
        <div class="admin-right-area">
            <el-row class="admin-user-meta-info">
                <div class="adm-meta-router">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>后台管理</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(item, index) in $route.meta" key="index">{{item}}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="admin-moudle-title">{{$route.meta[$route.meta.length-1]}}</div>
            </el-row>
            <keep-alive>
                <router-view ref="router-wrap"></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>

    export default {
        data(){
            return {

            }

        },
        computed  : {

            defaultActive: function () {
                return this.$route.path;
            },
            isanimate(){
                return !bowser.msie
            },

        },
        components: {

        },
        mounted(){

        },
        methods   : {


        }
    }
</script>


<style lang="scss" rel="stylesheet/scss">
    @import "~@/style/common/variable";
    .el-menu--vertical{
        .el-menu-item{
            opacity:1!important;
        }
    }

    .admin-container {
        display : flex;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width      : 280px;
        height:100%;
    }

    .admin-title {
        height       : 64px !important;
        line-height  : 64px !important;
        background   : $admin-title-bg-color !important;
        color        : #fff !important;
        padding-left : 24px !important;
        font-size    : 16px !important;

    }

    .admin-container {
        height : 100%;
        .el-menu {
            padding      : 0px 0;
            border-right : 0;
            .el-menu-item, .el-submenu__title {
                height        : 40px;
                line-height   : 40px;
                margin-bottom : 10px;


            }
            .el-menu-item.is-active:not(.adm_active_info) {
                background : $admin-nav-active-bg-color !important;
            }
            .el-menu-item-group__title {
                padding : 0
            }
            .el-submenu__title{
                i{
                    vertical-align: middle;
                    margin-right: 5px;
                    width: 24px;
                    text-align: center;
                    font-size: 18px;
                    display: inline-block;
                }
            }
        }
        .el-submenu.is-active .el-submenu__title {
            span {
                color : #fff;
            }

        }
        .el-submenu.is-active{
            i{
                color : #fff;
            }
        }
        .el-menu-item:hover{
            background-color: rgb(40,58,90)!important;
            color:#fff!important;

        }
        .el-menu-item.is-disabled {
            opacity: 1!important;
        }
        .el-menu-item.is-disabled.admin-title {
            background   : $admin-title-bg-color !important;
        }

    }

    .admin-left-area {
        height         : 100%;
        display        : flex;
        flex-direction : column;
        transition     : all .5s;
        overflow       : hidden;
        .admin-left-list {
            flex : 1;
            opacity:1!important;
        }
        .adm_active_info{
            padding-left:0!important;
            padding-right:0!important;
            margin-bottom:0!important;
            a{
                text-align: center;
                display:block;
                font-size: 14px;
                color: rgb(153, 153, 153)!important;
                height: 40px;
                line-height: 40px;

            }
            &:hover{
                a{
                    color: #fff !important;
                }
            }

        }
        .adm_active_bottom{
            position: absolute;
            width: 100%;
            bottom:0
        }

        .el-scrollbar{
            height: 100%;
            .el-scrollbar__view{
                height:100%
            }
        }

    }

    .hideleft {
        width : 0;
    }

    .admin-right-area {
        flex           : 1;
        transition     : all .5s;
        overflow       : hidden;
        display        : flex;
        flex-direction : column;
        height         : 100%;
        .admin-user-meta-info {
            background : #fff;
            padding    : 20px 24px;
            border-top: 1px solid #ddd;
        }

        .el-breadcrumb__item span {
            color : $text-four-color !important;
        }
        .el-breadcrumb__item:last-child span {
            color : $text-second-color !important;
        }
        .admin-moudle-title {
            margin-top : 24px;
            font-size  : 20px;
            font-weight:bold;
        }
        .adm-module-title{
            line-height: 32px;
            font-weight: 700;
            margin-bottom:24px;
        }

        .el-tabs__header{
            margin:0;
            border-bottom:none
        }
        .el-tabs__header .el-tabs__nav{
            border:none;
        }
        .el-tabs__item{
            background: #fafafa;
            margin-left:2px;
            border:1px solid #e4e7ed;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .el-tabs__item:first-child{
            margin-left:0;
            border-left:1px solid #e4e7ed!important;
        }
        .el-tabs__header .el-tabs__item.is-active{
            background:#fff;
        }

    }


</style>

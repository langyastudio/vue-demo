import Vue from 'vue'
import {routerMode} from '@/config/env'
import Router from 'vue-router'

Vue.use(Router);

const index_user          = r => require.ensure([], () => r(require('index/pages/index/children/user')), 'index/index-main');
const index_echart        = r => require.ensure([], () => r(require('index/pages/index/children/echart')), 'index/index-main');
const index_setbindsns    = r => require.ensure([], () => r(require('index/pages/index/children/setbindsns')), 'index/index-main');
const video_play          = r => require.ensure([], () => r(require('index/pages/video/children/video')), 'index/video-main');
const video_normal        = r => require.ensure([], () => r(require('index/pages/video/children/video-normal')), 'index/video-main');
const video_hls           = r => require.ensure([], () => r(require('index/pages/video/children/video-hls')), 'index/video-main');
const video_rtmp          = r => require.ensure([], () => r(require('index/pages/video/children/video-rtmp')), 'index/video-main');
const audio_play          = r => require.ensure([], () => r(require('index/pages/audio/children/audio')), 'index/audio-main');
const audio_normal        = r => require.ensure([], () => r(require('index/pages/audio/children/audio-normal')), 'index/audio-main');
const upload_upload       = r => require.ensure([], () => r(require('index/pages/upload/children/upload')), 'index/upload-main');
const upload_con          = r => require.ensure([], () => r(require('index/pages/upload/children/upload-con')), 'index/upload-main');
const editor_editor       = r => require.ensure([], () => r(require('index/pages/editor/children/editor')), 'index/editor-main');
const editor_con          = r => require.ensure([], () => r(require('index/pages/editor/children/editor-con')), 'index/editor-main');
const valaditor_valaditor = r => require.ensure([], () => r(require('index/pages/valaditor/children/valaditor')), 'index/valaditor-main');
const valaditor_con       = r => require.ensure([], () => r(require('index/pages/valaditor/children/valaditor-con')), 'index/valaditor-main');
const noexsit             = r => require.ensure([], () => r(require('index/pages/noexsit/children/noexsit')), 'index/no-exsit');
const admin                = r => require.ensure([], () => r(require('index/pages/admin/children/admin')), 'index/admin-main');
const adm_visitor          = r => require.ensure([], () => r(require('index/pages/admin/children/adm-visitor')), 'index/admin-main');
const routes = [
    {
        path     : '/',
        component: index_user,
        name     : '',
        children : [{
            path     : '',
            component: index_echart,
            meta     : [],
        }],
        meta     : {scrollToTop: true}
    },
    {
        path     : '/index',
        component: index_user,
        name     : '',
        children : [{
            path     : '',
            component: index_echart,
            meta     : [],
        }, {
            path     : '/index/setbindsns',
            component: index_setbindsns,
            meta     : [],
        }]
    },
    {
        path     : '/video',
        component: video_play,
        name     : '',
        children : [{
            path     : '',
            component: video_normal,
            meta     : [],
        }, {
            path     : '/video/hls',
            component: video_hls,
            meta     : [],
        }, {
            path     : '/video/rtmp',
            component: video_rtmp,
            meta     : [],
        }]
    },
    {
        path     : '/audio',
        component: audio_play,
        name     : '',
        children : [{
            path     : '',
            component: audio_normal,
            meta     : [],
        }]
    },
    {
        path     : '/upload',
        component: upload_upload,
        name     : '',
        children : [{
            path     : '',
            component: upload_con,
            meta     : [],
        }]
    },
    {
        path     : '/editor',
        component: editor_editor,
        name     : '',
        children : [{
            path     : '',
            component: editor_con,
            meta     : [],
        }]
    },
    {
        path     : '/valaditor',
        component: valaditor_valaditor,
        name     : '',
        children : [{
            path     : '',
            component: valaditor_con,
            meta     : [],
        }]
    },
    {
        path     : '/admin',
        component: admin,
        name     : '',
        children : [{
            path     : '/admin/visitor',
            component: adm_visitor,
            meta     : ['站点管理', '访问控制'],
        }]
    },
    {
        path     : '*',
        component: noexsit,
        name     : '',
    },
];

export default new Router({
    mode  : routerMode,
    routes,
    strict: process.env.NODE_ENV !== 'production',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            // savedPosition is only available for popstate navigations.
            return savedPosition
        } else {
            const position = {};
            // new navigation.
            // scroll to anchor by returning the selector
            if (to.hash) {
                position.selector = to.hash
            }
            // check if any matched route config has meta that requires scrolling to top
            if (to.matched.some(m => m.meta.scrollToTop)) {
                // cords will be used if no selector is provided,
                // or if the selector didn't match any element.
                position.x = 0;
                position.y = 0;
            }
            // if the returned position is falsy or an empty object,
            // will retain current scroll position.
            return position
        }
    }
})

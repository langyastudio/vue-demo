import Vue from 'vue'
import {routerMode} from '@/config/env'
import Router from 'vue-router'

Vue.use(Router);

const index_user          = r => require.ensure([], () => r(require('index/pages/index/children/user')), 'index/index-main');
const index_setbindsns    = r => require.ensure([], () => r(require('index/pages/index/children/setbindsns')), 'index/index-main');
const noexsit             = r => require.ensure([], () => r(require('index/pages/noexsit/children/noexsit')), 'index/no-exsit');
const admin                = r => require.ensure([], () => r(require('index/pages/admin/children/admin')), 'index/admin-main');
const adm_visitor          = r => require.ensure([], () => r(require('index/pages/admin/children/adm-visitor')), 'index/admin-main');
const routes = [
    {
        path     : '/',
        component: index_user,
        name     : '',
        meta     : {scrollToTop: true}
    },
    {
        path     : '/index',
        component: index_user,
        name     : '',
        children : [ {
            path     : '/index/setbindsns',
            component: index_setbindsns,
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

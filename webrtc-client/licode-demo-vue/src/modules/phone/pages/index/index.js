import Vue from 'vue'
import router from '@/router/phone'
import store from '@/store/phone'
import MintUI from 'mint-ui'
import App from './app'
import '@/style/phone.scss'
import VueClipboards from 'vue-clipboards';
import zh_CN from 'vee-validate/dist/locale/zh_CN'
Vue.config.productionTip = false

const i18n = new VueI18n({
    locale: 'zh_CN',
})

Vue.use(VeeValidate, {
    i18n,
    i18nRootKey: 'validation',
    dictionary : {
        zh_CN
    },
    events     : 'blur',
});

//自定义提示信息
VeeValidate.Validator.localize({
    zh_CN: {
        messages: {
            required: (name) => {
                return '请输入' + name + ''
            }
        }
    }
})

Vue.use(VueClipboards);

Vue.use(MintUI);

new Vue({
    el        : '#app',
    router,
    store,
    template  : '<App/>',
    components: {App}
})
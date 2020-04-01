import Vue from 'vue'
import router from '@/router/phone'
import MintUI from 'mint-ui'
import App from './app'
import '@/style/phone.scss'

Vue.config.productionTip = false

Vue.use(MintUI);

new Vue({
    el        : '#app',
    router,
    template  : '<App/>',
    components: {App}
})




import Vue from 'vue'
import router from '@/router'
import ElementUI from 'element-ui'
import App from './app'
import '@/style/index.scss'
import uploader from 'vue-simple-uploader'

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.use(uploader)


new Vue({
    el        : '#app',
    router,
    template  : '<App/>',
    components: {App}
})





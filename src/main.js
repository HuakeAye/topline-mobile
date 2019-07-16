import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import './styles/index.less'
import zhCN from '../node_modules/vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'

Vue.use(VeeValidate, {
  events: ''
})

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

Validator.localize('zh_CN', zhCN)

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

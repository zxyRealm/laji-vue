// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import Vue from 'vue'
import App from './App.vue'
import router from './router/routes'
import Axios from 'axios'
import Zepto from 'zepto'
import Consume from './components/custom/custom'
import myIcon from './components/custom/icon.vue'
import Hint from './components/common/hint.vue'
import md5 from 'md5'
import store from './store/store'
import './assets/js/common'
import filter from './filter'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
Vue.use(ElementUI)
Vue.component(myIcon.name,myIcon);
Vue.component(Hint.name,Hint);
Vue.use(require('vue-wechat-title'));
Vue.use(require('./assets/js/fun'));
Vue.use(require('./service/service'))
Vue.prototype.$md5 = md5;
Vue.prototype.$http = Zepto;
Vue.prototype.$consume = Consume; //打赏、小米椒、金椒

var root = new Vue({
  el: '#app',
  store,
  router,
  filter,
  template: '<App/>',
  components:{App}
}).$mount("#app");
//
// document.addEventListener('DOMContentLoaded', function () {
//   root.$mount('#app')
// });

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSweetalert2 from 'vue-sweetalert2';
import '@/style.scss'
import 'sweetalert2/dist/sweetalert2.min.css';
import VueMask from 'v-mask'

Vue.config.productionTip = false

// axios.defaults.baseURL = process.env.VUE_APP_URL_BASE
axios.defaults.baseURL = process.env.VUE_APP_URL_BASE
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('Authorization');

Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2);
Vue.use(VueMask);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
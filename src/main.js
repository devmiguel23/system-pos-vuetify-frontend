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

Vue.config.productionTip = false

axios.defaults.baseURL = "http://localhost:4000/api"
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('Authorization');

// axios.interceptors.response.use(undefined, error => {
//   console.log(error);
//   // if (error.response.status == 401 && error.response.statusText == 'Unauthorized') {
//   //   return Promise.reject(error);
//   // }
// });

Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

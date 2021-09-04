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
axios.defaults.headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzI1ODE3NzE5NzZhMTVhMGE4ZmYyZiIsImVtYWlsIjoibWRlc2Fycm9sbGFkb3IyM0BnbWFpbC5jb20iLCJpYXQiOjE2MzA2ODkzMDUsImV4cCI6MTYzMDc3NTcwNX0.j94Ft2LqAY7ocotRO4sPAcJogf_LpVTQQ22lF0ZxyvI'
}

Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

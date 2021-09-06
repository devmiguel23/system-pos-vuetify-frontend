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
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzUyYTE4MDRhMTA1MWM5MDdiMzk2ZSIsInVzZXJuYW1lIjoiaGRqaGFrZXIiLCJlbWFpbCI6Im1kZXNhcnJvbGxhZG9yMjNAZ21haWwuY29tIiwiZnVsbG5hbWUiOiJNaWd1ZWwgRGUgSmVzdXMiLCJwaG9uZW51bWJlciI6Iig4MDkpLTkyMy0xNDEyIiwiYWlkIjoiNDAyLTI0NzYwNTItNiIsImNsYWltcyI6WzI1NSwyNTQsMjUzLDI1MiwyNTEsMjUwLDI0OSwyNDhdLCJzdGF0dXMiOnRydWUsImlhdCI6MTYzMDkwNjE4MiwiZXhwIjoxNjMwOTkyNTgyfQ.dY9qRDf8P4Ui5eXIPysbJjMy5tblK5CxeBQMBG9H3VM'
}

Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

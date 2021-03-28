import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'
import router from './router'
import Axios from 'axios'

// CSS
import './assets/style.css';

// Store
import store from './store'

Vue.use(vuetify)

Vue.prototype.$apiUrl = 'localhost:8000/api/';
Vue.prototype.$http = Axios;
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'
import router from './router'
import Axios from 'axios'
import Vuelidate from 'vuelidate'

// CSS
import './assets/style.css';

// Store
import store from './store'

// Components
Vue.component('snackbar', () => import('./components/Snackbar'))
Vue.component('confirm-delete-modal', () => import('./components/ConfirmDeleteModal'))
Vue.component('loading-overlay', () => import('./components/LoadingOverlay'))

Vue.use(vuetify)
Vue.use(Vuelidate)

Vue.prototype.$apiUrl = 'localhost:8000/api/';
Vue.prototype.$http = Axios;
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

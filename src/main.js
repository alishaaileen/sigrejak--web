import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'
import router from './router'
import Axios from 'axios'
import Vuelidate from 'vuelidate'
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

export const SocketInstance = socketio('http://localhost:5000', {
  query: {
    token: localStorage.getItem('appKey')
  },
  autoConnect: false,
});

// Dev purpose
SocketInstance.onAny((event, ...args) => { console.log(event, args)})

// CSS
import './assets/style.css';

// Store
import store from './store'

// Components
Vue.component('snackbar', () => import('./components/Snackbar'))
Vue.component('confirm-delete-modal', () => import('./components/ConfirmDeleteModal'))
Vue.component('loading-overlay', () => import('./components/LoadingOverlay'))
Vue.component('btn-kembali', () => import('./components/ButtonKembali'))

Vue.use(vuetify)
Vue.use(Vuelidate)
Vue.use(SocketInstance)
Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketInstance
}))

Vue.prototype.$apiUrl = 'localhost:8000/api/';
Vue.prototype.$http = Axios;
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

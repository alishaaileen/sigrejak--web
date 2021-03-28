import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import admin from './modules/admin'
import keluarga from './modules/keluarga'
import notifikasi from './modules/notifikasi'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    admin,
    keluarga,
    notifikasi,
  },
  strict: debug,
//   plugins: debug ? [createLogger()] : []
})
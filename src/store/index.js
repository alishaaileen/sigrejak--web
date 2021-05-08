import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import pengurus from './modules/pengurus'
import keluarga from './modules/keluarga'

import notifikasi from './modules/notifikasi'
import snackbar from './modules/snackbar'
import deleteData from './modules/deleteData'
import loading from './modules/loading'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    pengurus,
    keluarga,
    notifikasi,
    snackbar,
    deleteData,
    loading
  },
  strict: debug,
//   plugins: debug ? [createLogger()] : []
})
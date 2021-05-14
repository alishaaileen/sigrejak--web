import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store'

import keluargaRoutes from './keluarga'
import pengurusRoutes from './pengurus'

const importView = (path) => {
  return () => import(`../views/${path}.vue`)
}

Vue.use(VueRouter)

const routes = [
  // KELUARGA LOGIN
  {
    path: '/',
    name: 'KeluargaLogin',
    component: importView("Login/loginKeluarga"),
    beforeEnter: (to,from, next) => {
      if(localStorage.getItem('token')) {
        next('/keluarga/dashboard')
        return
      }
    
      next()
    }
  },
  keluargaRoutes,
  // ADMIN LOGIN
  {
    path: '/login-pengurus',
    name: 'loginPengurus',
    component: importView("Login/loginPengurus"),
    beforeEnter: (to,from, next) => {
      if(localStorage.getItem('token')) {
        next('/pengurus/dashboard')
        return
      }
    
      next()
    },
  },
  pengurusRoutes,
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

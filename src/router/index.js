import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

const importView = (path) => {
  console.log(`../views/${path}.vue`)
  return () => import(`../views/${path}.vue`)
}

Vue.use(VueRouter)

const keluargaRouteGuard = (to,from, next) => {
  if(!localStorage.getItem('keluarga-token')) {
    next('/')
    return
  }

  next()
}

const adminRouteGuard = (to,from, next) => {
  if(!store.getters.isAuthenticated) {
    next('/admin-login')
    return
  }

  next()
}

const routes = [
  // KELUARGA LOGIN
  {
    path: '/',
    name: 'KeluargaLogin',
    component: importView("Login/loginKeluarga"),
    beforeEnter: (to,from, next) => {
      if(localStorage.getItem('keluarga-token')) {
        next('/keluarga/dashboard')
        return
      }
    
      next()
    }
  },
  // KELUARGA =======================================
  {
    path: '/keluarga',
    name: 'Keluarga',
    component: importView("Keluarga/Keluarga"),
    beforeEnter: keluargaRouteGuard,
    redirect: '/keluarga/dashboard',
    children: [
      // Dashboard Keluarga =========================
      {
        path: '/keluarga/dashboard',
        name: 'DashboardKeluarga',
        component: importView("Keluarga/Dashboard")
      }
    ]
  },
  // ADMIN =======================================
  {
    path: '/admin-login',
    name: 'loginAdmin',
    component: importView("Login/loginAdmin"),
    beforeEnter: (to,from, next) => {
      if(localStorage.getItem('admin-token')) {
        next('/admin/dashboard')
        return
      }
    
      next()
    }
  },
  {
    path: '/admin',
    name: 'LoginAdmin',
    component: importView("Admin/Admin"),
    beforeEnter: adminRouteGuard,
    redirect: '/admin/dashboard',
    children: [
      // Dashboard Admin =========================
      {
        path: '/admin/dashboard',
        name: 'DashboardAdmin',
        component: importView("Admin/Dashboard")
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

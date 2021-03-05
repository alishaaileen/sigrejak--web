import Vue from 'vue'
import VueRouter from 'vue-router'

const importView = (path) => {
  console.log(`../views/${path}.vue`)
  return () => import(`../views/${path}.vue`)
}

Vue.use(VueRouter)

const routes = [
  // USER =======================================
  {
    path: '/',
    name: 'LoginUser',
    component: importView("Login/loginUser"),
    children: [
      // Dashboard User =========================
      {
        path: '/dashboard',
        name: 'DashboardUser',
        component: importView("User/Dashboard")
      }
    ]
  },
  // ADMIN =======================================
  {
    path: '/admin',
    name: 'LoginAdmin',
    component: importView("Login/loginAdmin"),
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

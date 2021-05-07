import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store'

const importView = (path) => {
  return () => import(`../views/${path}.vue`)
}

Vue.use(VueRouter)

const keluargaRouteGuard = (to,from, next) => {
  if(!localStorage.getItem('token')) {
    next('/')
    return
  }

  next()
}

// const adminRouteGuard = (to,from, next) => {
//   if(!store.getters.isAuthenticated) {
//     next('/admin-login')
//     return
//   }

//   next()
// }

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
      },
      // Profile Keluarga =========================
      {
        path: '/keluarga/profile',
        name: 'ProfileKeluarga',
        component: importView("Keluarga/Profile")
      },
      // Anggota Keluarga =========================
      {
        path: '/keluarga/anggota-keluarga',
        name: 'ViewAnggotaKeluarga',
        component: importView("Keluarga/AnggotaKeluarga/ViewAll")
      },
      {
        path: '/keluarga/tambah-anggota',
        name: 'AddAnggotaKeluarga',
        component: importView("Keluarga/AnggotaKeluarga/Add")
      },
      {
        path: '/keluarga/detail-anggota-keluarga/:id',
        name: 'DetailAnggotaKeluarga',
        component: importView("Keluarga/AnggotaKeluarga/Detail")
      },
      // Kelola Surat =========================
      {
        path: '/keluarga/kelola-surat',
        name: 'KelolaSuratMenu',
        component: importView("Keluarga/KelolaSurat/KelolaSurat")
      },
      {
        path: '/keluarga/kelola-surat/surat-keterangan-pindah',
        name: 'ViewSuratKeteranganPindah',
        component: importView("Keluarga/KelolaSurat/SuratKeteranganPindah/ViewAll")
      },
      {
        path: '/keluarga/kelola-surat/surat-keterangan-pindah/buat-surat',
        name: 'AddSuratKeteranganPindah',
        component: importView("Keluarga/KelolaSurat/SuratKeteranganPindah/Add")
      },
      // Ketua Lingkungan =========================
      {
        path: '/keluarga/kelola-data-lingkungan',
        name: 'KetuaLingkunganDashboard',
        component: importView("Keluarga/KetuaLingkungan/Dashboard")
      },
      // {
      //   path: '/keluarga/kelola-data-lingkungan',
      //   name: 'KetuaLingkunganDashboard',
      //   component: importView("Keluarga/KetuaLingkungan/Dashboard")
      // },
    ]
  },
  // ADMIN =======================================
  {
    path: '/login-admin',
    name: 'loginAdmin',
    component: importView("Login/loginAdmin"),
    beforeEnter: (to,from, next) => {
      if(localStorage.getItem('token')) {
        next('/admin/dashboard')
        return
      }
    
      next()
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: importView("Admin/Admin"),
    // beforeEnter: adminRouteGuard,
    redirect: '/admin/dashboard',
    children: [
      // Dashboard Admin =========================
      {
        path: '/admin/dashboard',
        name: 'DashboardAdmin',
        component: importView("Admin/Dashboard")
      },
      // Kelola Admin =========================
      {
        path: '/admin/kelola-admin',
        name: 'ViewAllAdmin',
        component: importView("Admin/KelolaAdmin/ViewAll")
      },
      {
        path: '/admin/tambah-admin',
        name: 'AddAdmin',
        component: importView("Admin/KelolaAdmin/Add")
      },
      {
        path: '/admin/detail-admin/:id',
        name: 'AdminDetailAdmin',
        component: importView("Admin/KelolaAdmin/Detail")
      },
      // Kelola Keluarga =========================
      {
        path: '/admin/kelola-keluarga',
        name: 'AdminViewAllKeluarga',
        component: importView("Admin/KelolaKeluarga/ViewAll")
      },
      {
        path: '/admin/tambah-keluarga',
        name: 'AdminAddKeluarga',
        component: importView("Admin/KelolaKeluarga/Add")
      },
      {
        path: '/admin/detail-keluarga/:id',
        name: 'AdminDetailKeluarga',
        component: importView("Admin/KelolaKeluarga/Detail")
      },
      {
        path: '/admin/detail-anggota-keluarga/:id',
        name: 'AdminDetailAnggotaKeluarga',
        component: importView("Admin/KelolaKeluarga/Detail")
      },
      // Kelola Lingkungan =========================
      {
        path: '/admin/kelola-lingkungan',
        name: 'ViewLingkungan',
        component: importView("Admin/KelolaLingkungan/ViewAll")
      },
      {
        path: '/admin/tambah-lingkungan',
        name: 'AddLingkungan',
        component: importView("Admin/KelolaLingkungan/Add")
      },
      {
        path: '/admin/detail-lingkungan/:id',
        name: 'DetailLingkungan',
        component: importView("Admin/KelolaLingkungan/Detail")
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

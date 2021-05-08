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

// const pengurusRouteGuard = (to,from, next) => {
//   if(!store.getters.isAuthenticated) {
//     next('/pengurus-login')
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
        path: '/keluarga/anggota',
        name: 'ViewAnggotaKeluarga',
        component: importView("Keluarga/AnggotaKeluarga/ViewAll")
      },
      {
        path: '/keluarga/tambah',
        name: 'AddAnggotaKeluarga',
        component: importView("Keluarga/AnggotaKeluarga/Add")
      },
      {
        path: '/keluarga/anggota/:id',
        name: 'DetailAnggotaKeluarga',
        component: importView("Keluarga/AnggotaKeluarga/Detail")
      },
      // Kelola Surat =========================
      {
        path: '/keluarga/surat',
        name: 'KelolaSuratMenu',
        component: importView("Keluarga/KelolaSurat/KelolaSurat")
      },
      {
        path: '/keluarga/surat/surat-keterangan-pindah',
        name: 'ViewSuratKeteranganPindah',
        component: importView("Keluarga/KelolaSurat/SuratKeteranganPindah/ViewAll")
      },
      {
        path: '/keluarga/surat/surat-keterangan-pindah/tambah',
        name: 'AddSuratKeteranganPindah',
        component: importView("Keluarga/KelolaSurat/SuratKeteranganPindah/Add")
      },
      // Ketua Lingkungan =========================
      {
        path: '/keluarga/ketua-lingkungan',
        name: 'KetuaLingkunganDashboard',
        component: importView("Keluarga/KetuaLingkungan/Dashboard")
      },
      // {
      //   path: '/keluarga/ketua-lingkungan',
      //   name: 'KetuaLingkunganDashboard',
      //   component: importView("Keluarga/KetuaLingkungan/Dashboard")
      // },
    ]
  },
  // ADMIN =======================================
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
  {
    path: '/pengurus',
    name: 'Pengurus',
    component: importView("Pengurus/Pengurus"),
    // beforeEnter: pengurusRouteGuard,
    redirect: '/pengurus/dashboard',
    children: [
      // Dashboard Pengurus =========================
      {
        path: '/pengurus/dashboard',
        name: 'DashboardPengurus',
        component: importView("Pengurus/Dashboard")
      },
      // Kelola Pengurus =========================
      {
        path: '/pengurus/pengurus',
        name: 'ViewAllPengurus',
        component: importView("Pengurus/KelolaPengurus/ViewAll")
      },
      {
        path: '/pengurus/pengurus/tambah',
        name: 'AddPengurus',
        component: importView("Pengurus/KelolaPengurus/Add")
      },
      {
        path: '/pengurus/pengurus/:id',
        name: 'PengurusDetailPengurus',
        component: importView("Pengurus/KelolaPengurus/Detail")
      },
      // Kelola Keluarga =========================
      {
        path: '/pengurus/keluarga',
        name: 'PengurusViewAllKeluarga',
        component: importView("Pengurus/KelolaKeluarga/ViewAll")
      },
      {
        path: '/pengurus/keluarga/tambah',
        name: 'PengurusAddKeluarga',
        component: importView("Pengurus/KelolaKeluarga/Add")
      },
      {
        path: '/pengurus/keluarga/anggota/tambah',
        name: 'PengurusAddAnggotaKeluarga',
        component: importView("Keluarga/AnggotaKeluarga/Add")
      },
      {
        path: '/pengurus/keluarga/:id',
        name: 'PengurusDetailKeluarga',
        component: importView("Pengurus/KelolaKeluarga/Detail")
      },
      {
        path: '/pengurus/keluarga/anggota/:id',
        name: 'PengurusDetailAnggotaKeluarga',
        component: importView("Pengurus/KelolaKeluarga/Detail")
      },
      // Kelola Lingkungan =========================
      {
        path: '/pengurus/lingkungan',
        name: 'ViewLingkungan',
        component: importView("Pengurus/KelolaLingkungan/ViewAll")
      },
      {
        path: '/pengurus/lingkungan/tambah',
        name: 'AddLingkungan',
        component: importView("Pengurus/KelolaLingkungan/Add")
      },
      {
        path: '/pengurus/lingkungan/:id',
        name: 'DetailLingkungan',
        component: importView("Pengurus/KelolaLingkungan/Detail")
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

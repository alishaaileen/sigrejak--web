const pengurusRouteGuard = (to,from, next) => {
  if(!localStorage.getItem('token')) {
    next('/')
    return
  }

  next()
}

const importView = (path) => {
  return () => import(`../../views/${path}.vue`)
}

const pengurus = {
  path: '/pengurus',
  name: 'Pengurus',
  component: importView("Pengurus/Pengurus"),
  beforeEnter: pengurusRouteGuard,
  // redirect: '/pengurus/dashboard',
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
}

export default pengurus
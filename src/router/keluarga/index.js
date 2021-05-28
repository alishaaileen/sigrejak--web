const keluargaRouteGuard = (to,from, next) => {
  if(!localStorage.getItem('appKey')) {
    next('/')
    return
  }

  next()
}

const importView = (path) => {
  return () => import(`../../views/${path}.vue`)
}

const keluarga = {
  path: '/keluarga',
  name: 'Keluarga',
  component: importView("Keluarga/Keluarga"),
  beforeEnter: keluargaRouteGuard,
  // redirect: '/keluarga/dashboard',
  children: [
    // Dashboard Keluarga =========================
    {
      path: 'dashboard',
      name: 'DashboardKeluarga',
      component: importView("Keluarga/Dashboard")
    },
    // Profile Keluarga =========================
    {
      path: 'profile',
      name: 'ProfileKeluarga',
      component: importView("Keluarga/Profile"),
      children: [
        {
          path: 'informasi-akun',
          name: 'InfoAkunKeluarga',
          component: importView("Keluarga/Profile/EditProfile")
        },
        {
          path: 'ubah-password',
          name: 'UbahPassKeluarga',
          component: importView("Keluarga/Profile/UbahPassword")
        }
      ]
    },
    // Anggota Keluarga =========================
    {
      path: 'anggota',
      name: 'ViewAnggotaKeluarga',
      component: importView("Keluarga/AnggotaKeluarga/ViewAll")
    },
    {
      path: 'tambah',
      name: 'AddAnggotaKeluarga',
      component: importView("Keluarga/AnggotaKeluarga/Add")
    },
    {
      path: 'anggota/:id',
      name: 'DetailAnggotaKeluarga',
      component: importView("Keluarga/AnggotaKeluarga/Detail")
    },
    // ==========================================
    // Kelola Surat =========================
    // ==========================================
    {
      path: 'surat',
      name: 'KelolaSuratMenu',
      component: importView("Keluarga/KelolaSurat/KelolaSurat")
    },
    // ===== Surat Keterangan Pindah =====
    {
      path: 'surat/surat-keterangan-pindah',
      name: 'ViewSuratKeteranganPindah',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganPindah/ViewAll")
    },
    {
      path: 'surat/surat-keterangan-pindah/tambah',
      name: 'AddSuratKeteranganPindah',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganPindah/Add")
    },
    // ===== Surat Keterangan Mati =====
    {
      path: 'surat/surat-keterangan-mati',
      name: 'ViewSuratKeteranganMati',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganMati/ViewAll")
    },
    {
      path: 'surat/surat-keterangan-mati/tambah',
      name: 'AddSuratKeteranganMati',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganMati/Add")
    },
    {
      path: 'surat/surat-keterangan-pindah/edit/:id',
      name: 'UpdateSuratKeteranganPindah',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganPindah/Edit")
    },
    // ===== Surat Keterangan =====
    {
      path: 'surat/surat-keterangan',
      name: 'ViewSuratKeterangan',
      component: importView("Keluarga/KelolaSurat/SuratKeterangan/ViewAll")
    },
    {
      path: 'surat/surat-keterangan/tambah',
      name: 'AddSuratKeterangan',
      component: importView("Keluarga/KelolaSurat/SuratKeterangan/Add")
    },
    {
      path: 'surat/surat-keterangan/edit/:id',
      name: 'UpdateSuratKeterangan',
      component: importView("Keluarga/KelolaSurat/SuratKeterangan/Edit")
    },
    // ===== Surat Keterangan Beasiswa =====
    {
      path: 'surat/surat-keterangan-beasiswa',
      name: 'ViewSuratKeteranganBeasiswa',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganBeasiswa/ViewAll")
    },
    {
      path: 'surat/surat-keterangan-beasiswa/tambah',
      name: 'AddSuratKeteranganBeasiswa',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganBeasiswa/Add")
    },
    {
      path: 'surat/surat-keterangan-beasiswa/edit/:id',
      name: 'UpdateSuratKeteranganBeasiswa',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganBeasiswa/Edit")
    },
    // ===== Surat Izin Pelayanan Ekaristi =====
    {
      path: 'surat/surat-izin-ekaristi',
      name: 'ViewSuratIzinEkaristi',
      component: importView("Keluarga/KelolaSurat/SuratIzinPelayananEkaristi/ViewAll")
    },
    {
      path: 'surat/surat-izin-ekaristi/tambah',
      name: 'AddSuratIzinEkaristi',
      component: importView("Keluarga/KelolaSurat/SuratIzinPelayananEkaristi/Add")
    },
    {
      path: 'surat/surat-izin-ekaristi/edit/:id',
      name: 'UpdateSuratIzinEkaristi',
      component: importView("Keluarga/KelolaSurat/SuratIzinPelayananEkaristi/Edit")
    },
    // ==========================================
    //                      =====================
    // Ketua Lingkungan     =====================
    //                      =====================
    // ==========================================
    {
      path: 'ketua/surat',
      name: 'KetuaLingkunganSurat',
      component: importView("Keluarga/KetuaLingkungan/Dashboard")
    },
    // ===== Surat Keterangan Pindah =====
    {
      path: 'surat/surat-keterangan-pindah',
      name: 'KetuaViewSuratKeteranganPindah',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganPindah/ViewAll")
    },
    // ===== Surat Keterangan Mati =====
    {
      path: 'surat/surat-keterangan-mati',
      name: 'KetuaViewSuratKeteranganMati',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganMati/ViewAll")
    },
    // ===== Surat Keterangan =====
    {
      path: 'surat/surat-keterangan',
      name: 'KetuaViewSuratKeterangan',
      component: importView("Keluarga/KetuaLingkungan/SuratKeterangan/ViewAll")
    },
  ]
}

export default keluarga
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
    {
      path: 'surat/surat-keterangan-pindah/detail/:id',
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
      path: 'surat/surat-keterangan/detail/:id',
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
      path: 'surat/surat-keterangan-beasiswa/detail/:id',
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
      path: 'surat/surat-izin-ekaristi/detail/:id',
      name: 'UpdateSuratIzinEkaristi',
      component: importView("Keluarga/KelolaSurat/SuratIzinPelayananEkaristi/Edit")
    },
    // ===== Surat Baptis Anak =====
    {
      path: 'surat/surat-baptis-anak',
      name: 'ViewSuratBaptisAnak',
      component: importView("Keluarga/KelolaSurat/SuratBaptisAnak/ViewAll")
    },
    {
      path: 'surat/surat-baptis-anak/tambah',
      name: 'AddSuratBaptisAnak',
      component: importView("Keluarga/KelolaSurat/SuratBaptisAnak/Add")
    },
    {
      path: 'surat/surat-baptis-anak/detail/:id',
      name: 'UpdateSuratBaptisAnak',
      component: importView("Keluarga/KelolaSurat/SuratBaptisAnak/Edit")
    },
    // ===== Surat Pelayanan Minyak Suci =====
    {
      path: 'surat/surat-minyak-suci',
      name: 'ViewSuratMinyakSuci',
      component: importView("Keluarga/KelolaSurat/SuratPelayananMinyakSuci/ViewAll")
    },
    {
      path: 'surat/surat-minyak-suci/tambah',
      name: 'AddSuratMinyakSuci',
      component: importView("Keluarga/KelolaSurat/SuratPelayananMinyakSuci/Add")
    },
    {
      path: 'surat/surat-minyak-suci/detail/:id',
      name: 'UpdateSuratMinyakSuci',
      component: importView("Keluarga/KelolaSurat/SuratPelayananMinyakSuci/Edit")
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
      path: 'surat/surat-keterangan-mati/detail/:id',
      name: 'UpdateSuratKeteranganMati',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganMati/Edit")
    },
    // ===== Surat Komuni Penguatan =====
    {
      path: 'surat/surat-komuni-penguatan',
      name: 'ViewSuratKomuniPenguatan',
      component: importView("Keluarga/KelolaSurat/SuratKomuniPenguatan/ViewAll")
    },
    {
      path: 'surat/surat-komuni-penguatan/tambah',
      name: 'AddSuratKomuniPenguatan',
      component: importView("Keluarga/KelolaSurat/SuratKomuniPenguatan/Add")
    },
    {
      path: 'surat/surat-komuni-penguatan/detail/:id',
      name: 'UpdateSuratKomuniPenguatan',
      component: importView("Keluarga/KelolaSurat/SuratKomuniPenguatan/Edit")
    },
    // ==========================================
    //                      =====================
    // Ketua Lingkungan     =====================
    //                      =====================
    // ==========================================
    {
      path: 'ketua/surat',
      name: 'KetuaLingkunganSurat',
      component: importView("Keluarga/KetuaLingkungan/index")
    },
    // ===== Surat Izin Pelayanan Ekaristi =====
    {
      path: 'ketua/surat/surat-izin-ekaristi',
      name: 'KetuaViewSuratIzinEkaristi',
      component: importView("Keluarga/KetuaLingkungan/SuratIzinPelayananEkaristi/ViewAll")
    },
    {
      path: 'ketua/surat/surat-izin-ekaristi/detail/:id',
      name: 'KetuaViewSuratIzinEkaristiDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratIzinPelayananEkaristi/Detail")
    },
    // ===== Surat Keterangan Beasiswa =====
    {
      path: 'ketua/surat/surat-keterangan-beasiswa',
      name: 'KetuaViewSuratKeteranganBeasiswa',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganBeasiswa/ViewAll")
    },
    {
      path: 'ketua/surat/surat-keterangan-beasiswa/detail/:id',
      name: 'KetuaViewSuratKeteranganBeasiswaDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganBeasiswa/Detail")
    },
    // ===== Surat Keterangan Pindah =====
    {
      path: 'ketua/surat/surat-keterangan-pindah',
      name: 'KetuaViewSuratKeteranganPindah',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganPindah/ViewAll")
    },
    {
      path: 'ketua/surat/surat-keterangan-pindah/detail/:id',
      name: 'KetuaViewSuratKeteranganDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganPindah/Detail")
    },
    // ===== Surat Keterangan Mati =====
    {
      path: 'ketua/surat/surat-keterangan-mati',
      name: 'KetuaViewSuratKeteranganMati',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganMati/ViewAll")
    },
    {
      path: 'ketua/surat/surat-keterangan-mati/detail/:id',
      name: 'KetuaViewSuratKeteranganMatiDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganMati/Detail")
    },
    // ===== Surat Keterangan =====
    {
      path: 'ketua/surat/surat-keterangan',
      name: 'KetuaViewSuratKeterangan',
      component: importView("Keluarga/KetuaLingkungan/SuratKeterangan/ViewAll")
    },
    {
      path: 'ketua/surat/surat-keterangan/detail/:id',
      name: 'KetuaViewSuratKeteranganDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratKeterangan/Detail")
    },
    // ===== Surat Keterangan Minyak Suci =====
    {
      path: 'ketua/surat/surat-minyak-suci',
      name: 'KetuaViewSuratMinyakSuci',
      component: importView("Keluarga/KetuaLingkungan/SuratPelayananMinyakSuci/ViewAll")
    },
    {
      path: 'ketua/surat/surat-minyak-suci/tambah',
      name: 'KetuaAddSuratMinyakSuci',
      component: importView("Keluarga/KetuaLingkungan/SuratPelayananMinyakSuci/Add")
    },
    {
      path: 'ketua/surat/surat-minyak-suci/detail/:id',
      name: 'KetuaViewSuratMinyakSuciDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratPelayananMinyakSuci/Detail")
    },
    // ===== Surat Baptis Anak =====
    {
      path: 'ketua/surat/surat-baptis-anak',
      name: 'KetuaViewSuratBaptisAnak',
      component: importView("Keluarga/KetuaLingkungan/SuratBaptisAnak/ViewAll")
    },
    {
      path: 'ketua/surat/surat-baptis-anak/detail/:id',
      name: 'KetuaViewSuratBaptisAnakDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratBaptisAnak/Detail")
    },
  ]
}

export default keluarga
const pengurusRouteGuard = (to,from, next) => {
  if(!localStorage.getItem('appKey')) {
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
    // Profile pengurus =========================
    {
      path: 'profile',
      name: 'ProfilePengurus',
      component: importView("Pengurus/Profile/ProfileView"),
      children: [
        {
          path: 'informasi-akun',
          name: 'InfoAkunPengurus',
          component: importView("Pengurus/Profile/EditProfile")
        },
        {
          path: 'ubah-password',
          name: 'UbahPassPengurus',
          component: importView("Pengurus/Profile/UbahPassword")
        }
      ]
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
    // Kelola Surat =========================
    {
      path: 'surat',
      name: 'AdminViewSurat',
      component: importView("Pengurus/KelolaSurat/index")
    },
    // ===== Surat Izin Pelayanan Ekaristi =====
    {
      path: 'surat/surat-izin-ekaristi',
      name: 'AdminViewSuratIzinEkaristi',
      component: importView("Pengurus/KelolaSurat/SuratIzinPelayananEkaristi/ViewAll")
    },
    // ===== Surat Keterangan =====
    {
      path: 'surat/surat-keterangan',
      name: 'AdminViewSuratKeterangan',
      component: importView("Pengurus/KelolaSurat/SuratKeterangan/ViewAll")
    },
    // ===== Surat Pelayanan Minyak Suci =====
    {
      path: 'surat/surat-minyak-suci',
      name: 'AdminViewSuratKeterangan',
      component: importView("Pengurus/KelolaSurat/SuratPelayananMinyakSuci/ViewAll")
    },
    // ===== Surat Keterangan Pindah =====
    {
      path: 'surat/surat-keterangan-pindah',
      name: 'AdminViewSuratKeteranganPindah',
      component: importView("Pengurus/KelolaSurat/SuratKeteranganPindah/ViewAll")
    },
    // ===== Surat Keterangan Mati =====
    {
      path: 'surat/surat-keterangan-mati',
      name: 'AdminViewSuratKeteranganMati',
      component: importView("Pengurus/KelolaSurat/SuratKeteranganMati/ViewAll")
    },
    // ===== Surat Keterangan Beasiswa =====
    {
      path: 'surat/surat-keterangan-beasiswa',
      name: 'AdminViewSuratKeteranganBeasiswa',
      component: importView("Pengurus/KelolaSurat/SuratKeteranganBeasiswa/ViewAll")
    },
    // ===== Surat Baptis Anak =====
    {
      path: 'surat/surat-baptis-anak',
      name: 'AdminViewSuratBaptisAnak',
      component: importView("Pengurus/KelolaSurat/SuratBaptisAnak/ViewAll")
    },
    // ===== Surat Komuni Penguatan =====
    {
      path: 'surat/surat-komuni-penguatan',
      name: 'AdminViewSuratKomuniPenguatan',
      component: importView("Pengurus/KelolaSurat/SuratKomuniPenguatan/ViewAll")
    },
  ]
}

export default pengurus
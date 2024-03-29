const keluargaRouteGuard = (to,from, next) => {
  if(!localStorage.getItem('appKey')) {
    next('/')
    return
  }

  next()
}

const importView = (path) => {
  return () => import(`@/views/${path}.vue`)
}

const keluarga = {
  path: '/keluarga',
  name: 'Keluarga',
  component: importView("Keluarga/Keluarga"),
  beforeEnter: keluargaRouteGuard,
  redirect: '/keluarga/anggota',
  children: [
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
    {
      path: 'surat/surat-keterangan-pindah/chat/:id',
      name: 'ChatSuratKeteranganPindah',
      component: importView("Keluarga/Chat")
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
    {
      path: 'surat/surat-keterangan/chat/:id',
      name: 'ChatSuratKeterangan',
      component: importView("Keluarga/Chat")
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
    {
      path: 'surat/surat-keterangan-beasiswa/chat/:id',
      name: 'ChatSuratKeteranganBeasiswa',
      component: importView("Keluarga/Chat")
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
    {
      path: 'surat/surat-izin-ekaristi/chat/:id',
      name: 'ChatSuratIzinEkaristi',
      component: importView("Keluarga/Chat")
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
    {
      path: 'surat/surat-baptis-anak/chat/:id',
      name: 'ChatSuratBaptisAnak',
      component: importView("Keluarga/Chat")
    },
    // ===== Surat Baptis Dewasa =====
    {
      path: 'surat/surat-baptis-dewasa',
      name: 'ViewSuratBaptisDewasa',
      component: importView("Keluarga/KelolaSurat/SuratBaptisDewasa/ViewAll")
    },
    {
      path: 'surat/surat-baptis-dewasa/tambah',
      name: 'AddSuratBaptisDewasa',
      component: importView("Keluarga/KelolaSurat/SuratBaptisDewasa/Add")
    },
    {
      path: 'surat/surat-baptis-dewasa/detail/:id',
      name: 'UpdateSuratBaptisDewasa',
      component: importView("Keluarga/KelolaSurat/SuratBaptisDewasa/Edit")
    },
    {
      path: 'surat/surat-baptis-dewasa/chat/:id',
      name: 'ChatSuratBaptisDewasa',
      component: importView("Keluarga/Chat")
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
    {
      path: 'surat/surat-minyak-suci/chat/:id',
      name: 'ChatSuratMinyakSuci',
      component: importView("Keluarga/Chat")
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
    {
      path: 'surat/surat-keterangan-mati/chat/:id',
      name: 'ChatSuratKeteranganMati',
      component: importView("Keluarga/Chat")
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
    {
      path: 'surat/surat-komuni-penguatan/chat/:id',
      name: 'ChatSuratKomuniPenguatan',
      component: importView("Keluarga/Chat")
    },
    // ===== Surat Keterangan Calon Pengantin =====
    {
      path: 'surat/surat-keterangan-calon-pengantin',
      name: 'ViewSuratKeteranganCalonPengantin',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganCalonPengantin/ViewAll")
    },
    {
      path: 'surat/surat-keterangan-calon-pengantin/tambah',
      name: 'AddSuratKeteranganCalonPengantin',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganCalonPengantin/Add")
    },
    {
      path: 'surat/surat-keterangan-calon-pengantin/detail/:id',
      name: 'UpdateSuratKeteranganCalonPengantin',
      component: importView("Keluarga/KelolaSurat/SuratKeteranganCalonPengantin/Edit")
    },
    {
      path: 'surat/surat-keterangan-calon-pengantin/chat/:id',
      name: 'ChatSuratKeteranganCalonPengantin',
      component: importView("Keluarga/Chat")
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
    {
      path: 'ketua/surat/surat-izin-ekaristi/chat/:id',
      name: 'KetuaChatSuratIzinEkaristi',
      component: importView("Keluarga/Chat")
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
    {
      path: 'ketua/surat/surat-keterangan-beasiswa/chat/:id',
      name: 'KetuaChatSuratKeteranganBeasiswa',
      component: importView("Keluarga/Chat")
    },
    // ===== Surat Keterangan Pindah =====
    {
      path: 'ketua/surat/surat-keterangan-pindah',
      name: 'KetuaViewSuratKeteranganPindah',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganPindah/ViewAll")
    },
    {
      path: 'ketua/surat/surat-keterangan-pindah/detail/:id',
      name: 'KetuaViewSuratKeteranganPindahDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganPindah/Detail")
    },
    {
      path: 'ketua/surat/surat-keterangan-pindah/chat/:id',
      name: 'KetuaChatSuratKeteranganPindah',
      component: importView("Keluarga/Chat")
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
    {
      path: 'ketua/surat/surat-keterangan-mati/chat/:id',
      name: 'KetuaChatSuratKeteranganMati',
      component: importView("Keluarga/Chat")
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
    {
      path: 'ketua/surat/surat-keterangan/chat/:id',
      name: 'KetuaChatSuratKeterangan',
      component: importView("Keluarga/Chat")
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
    {
      path: 'ketua/surat/surat-minyak-suci/chat/:id',
      name: 'KetuaChatSuratMinyakSuci',
      component: importView("Keluarga/Chat")
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
    {
      path: 'ketua/surat/surat-baptis-anak/chat/:id',
      name: 'KetuaChatSuratBaptisAnak',
      component: importView("Keluarga/Chat")
    },
    // ===== Surat Baptis Dewasa =====
    {
      path: 'ketua/surat/surat-baptis-dewasa',
      name: 'KetuaViewSuratBaptisDewasa',
      component: importView("Keluarga/KetuaLingkungan/SuratBaptisDewasa/ViewAll")
    },
    {
      path: 'ketua/surat/surat-baptis-dewasa/detail/:id',
      name: 'KetuaViewSuratBaptisDewasaDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratBaptisDewasa/Detail")
    },
    {
      path: 'ketua/surat/surat-baptis-dewasa/chat/:id',
      name: 'KetuaChatSuratBaptisDewasa',
      component: importView("Keluarga/Chat")
    },
    // ===== Surat Komuni Penguatan =====
    {
      path: 'ketua/surat/surat-komuni-penguatan',
      name: 'KetuaViewSuratKomuniPenguatan',
      component: importView("Keluarga/KetuaLingkungan/SuratKomuniPenguatan/ViewAll")
    },
    {
      path: 'ketua/surat/surat-komuni-penguatan/detail/:id',
      name: 'KetuaViewSuratKomuniPenguatanDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratKomuniPenguatan/Detail")
    },
    {
      path: 'ketua/surat/surat-komuni-penguatan/chat/:id',
      name: 'KetuaChatSuratKomuniPenguatan',
      component: importView("Keluarga/Chat")
    },
    // ===== Surat Keterangan Calon Pengantion =====
    {
      path: 'ketua/surat/surat-keterangan-calon-pengantin',
      name: 'KetuaViewSuratKeteranganCalonPengantin',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganCalonPengantin/ViewAll")
    },
    {
      path: 'ketua/surat/surat-keterangan-calon-pengantin/detail/:id',
      name: 'KetuaViewSuratKeteranganCalonPengantinDetail',
      component: importView("Keluarga/KetuaLingkungan/SuratKeteranganCalonPengantin/Detail")
    },
    {
      path: 'ketua/surat/surat-keterangan-calon-pengantin/chat/:id',
      name: 'KetuaChatSuratKeteranganCalonPengantin',
      component: importView("Keluarga/Chat")
    },
  ]
}

export default keluarga
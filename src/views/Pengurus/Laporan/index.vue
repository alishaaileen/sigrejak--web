<template>
  <div>
    <h1 class="mb-5">Laporan</h1>

    <v-card class="pa-6" flat>
      <v-row dense>
        <v-col cols="4" v-for="(card, i) in cards" :key="i">
          <router-link :to="card.to" class="text-decoration-none">
            <v-card
              class="outline-grey"
              hover
              outlined
              rounded="lg"
            >
              <div>
                <v-card-title class="headline">
                  <h5>{{ card.title }}</h5>
                </v-card-title>

                <v-card-subtitle v-text="card.desc"></v-card-subtitle>
              </div>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-card>
    <snackbar />
  </div>
</template>

<script>
export default {
  data: () => ({
    selectedJenisSurat: '',
    cards: [
      // {
      //   title: 'Semua', 
      //   desc: 'Laporan semua surat',
      //   to: 'laporan/semua',
      // },
      {
        title: 'Surat Izin Pelayanan Ekaristi', 
        desc: 'Laporan Surat Izin Pelayanan Ekaristi',
        to: 'laporan/surat-izin-ekaristi',
      },
      {
        title: 'Surat Keterangan Beasiswa', 
        desc: 'Laporan Surat Keterangan Beasiswa',
        to: 'laporan/surat-keterangan-beasiswa',
      },
      {
        title: 'Surat Keterangan',
        desc: 'Laporan Surat Keterangan',
        to: 'laporan/surat-keterangan',
      },
      {
        title: 'Surat Baptis Anak',
        desc: 'Laporan Surat Baptis Anak',
        to: 'laporan/surat-baptis-anak',
      },
      {
        title: 'Surat Baptis Dewasa',
        desc: 'Laporan Surat Baptis Dewasa',
        to: 'laporan/surat-baptis-dewasa',
      },
      {
        title: 'Surat Komuni I/Penguatan',
        desc: 'Laporan Surat Komuni I/Penguatan',
        to: 'laporan/surat-komuni-penguatan',
      },
      {
        title: 'Surat Ket. Calon Pengantin',
        desc: 'Laporan Surat Ket. Calon Pengantin',
        to: 'laporan/surat-keterangan-calon-pengantin',
      },
      {
        title: 'Surat Ply. Minyak Suci',
        desc: 'Laporan Surat Pelayanan Minyak Suci',
        to: 'laporan/surat-minyak-suci',
      },
      {
        title: 'Surat Keterangan Mati',
        desc: 'Laporan Surat Keterangan Mati',
        to: 'laporan/surat-keterangan-mati',
      },
      {
        title: 'Surat Keterangan Pindah',
        desc: 'Laporan Surat Keterangan Pindah',
        to: 'laporan/surat-keterangan-pindah',
      },
    ],
  }),
}
</script>

<style>

</style>
<template>
  <div>
    <h1>Surat-surat</h1>

    <v-card class="mt-5 pa-6" flat>
      <v-text-field
        v-model="search"
        outlined
        prepend-inner-icon="mdi-magnify"
        placeholder="Cari surat"
        dense
      ></v-text-field>

      <div v-for="(card, i) in filteredCards" :key="i">
        <router-link :to="card.to" class="text-decoration-none">
          <v-card
            class="mb-6 outline-grey"
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
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: '',
    cards: [
      {
        title: 'Surat Izin Pelayanan Ekaristi', 
        desc: 'Pelayanan ekaristi yang dipimpin oleh Romo dari luar Paroki Kumetiran dicatat dalam surat ini',
        to: 'surat/surat-izin-ekaristi',
      },
      {
        title: 'Surat Keterangan Beasiswa', 
        desc: 'Pengajuan beasiswa paroki bagi warga Paroki Kumetiran',
        to: 'surat/surat-keterangan-beasiswa',
      },
      {
        title: 'Surat Keterangan',
        desc: 'Surat yang dapat dipakai untuk bermacam keperluan selain keterangan perkawinan',
        to: 'surat/surat-keterangan',
      },
      {
        title: 'Surat Baptis Anak',
        desc: 'Pengajuan baptisan anak yang berusia 1 hari sampai 7 tahun',
        to: 'surat/surat-baptis-anak',
      },
      {
        title: 'Surat Baptis Dewasa',
        desc: 'Pengajuan baptisan bagi orang yang berusia diatas 7 tahun',
        to: 'surat/surat-baptis-dewasa',
      },
      {
        title: 'Surat Komuni/Penguatan (Krisma)',
        desc: 'Pengajuan komuni pertama dan/atau penguatan bagi umat yang sudah menerima baptis Katolik',
        to: 'surat/surat-komuni-penguatan',
      },
      {
        title: 'Surat Keterangan Calon Pengantin',
        desc: 'Surat yang dibuat ketika umat Paroki Kumetiran akan menikah',
        to: 'surat/surat-keterangan-calon-pengantin',
      },
      {
        title: 'Surat Pelayanan Minyak Suci',
        desc: 'Surat yang menampung informasi pelayanan minyak suci yang ada di wilayah Paroki Kumetiran',
        to: 'surat/surat-pelayanan-minyak-suci',
      },
      {
        title: 'Surat Keterangan Mati',
        desc: 'Surat yang dibuat jika ada umat Kumetiran yang meninggal dunia',
        to: 'surat/surat-keterangan-mati',
      },
      {
        title: 'Surat Keterangan Pindah',
        desc: 'Umat Paroki Kumetiran yang akan pindah ke paroki lain harus membuat surat ini',
        to: 'surat/surat-keterangan-pindah',
      },
    ],
  }),
  computed: {
    filteredCards() {
      return this.cards.filter((card) => {
        return card.title.toLowerCase().match(this.search.toLowerCase())
      })
    },
  },
  methods: {
  }
}
</script>

<style>

</style>
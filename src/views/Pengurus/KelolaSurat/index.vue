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
            class="mb-6 outline-grey card-border"
            hover
            outlined
            rounded="lg"
          >
            <div>
              <v-card-title class="headline">
                <v-badge
                  color="amber darken-1"
                  :value="card.unverifiedCount > 0"
                  :content="card.unverifiedCount"
                  class="mb-2"
                >
                  <h3>{{ card.title }}</h3>
                </v-badge>
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
import { getData } from '../../../utils'
export default {
  data: () => ({
    search: '',
    cards: [
      {
        endpoint: 'surat-izin-pelayanan-ekaristi',
        title: 'Surat Izin Pelayanan Ekaristi', 
        desc: 'Pelayanan ekaristi yang dipimpin oleh Romo dari luar Paroki Kumetiran dicatat dalam surat ini',
        to: 'surat/surat-izin-ekaristi',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan-beasiswa',
        title: 'Surat Keterangan Beasiswa', 
        desc: 'Pengajuan beasiswa paroki bagi warga Paroki Kumetiran',
        to: 'surat/surat-keterangan-beasiswa',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan',
        title: 'Surat Keterangan',
        desc: 'Surat yang dapat dipakai untuk bermacam keperluan selain keterangan perkawinan',
        to: 'surat/surat-keterangan',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-baptis-anak',
        title: 'Surat Baptis Anak',
        desc: 'Pengajuan baptisan anak yang berusia 1 hari sampai 7 tahun',
        to: 'surat/surat-baptis-anak',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-baptis-dewasa',
        title: 'Surat Baptis Dewasa',
        desc: 'Pengajuan baptisan bagi orang yang berusia diatas 7 tahun',
        to: 'surat/surat-baptis-dewasa',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-komuni-penguatan',
        title: 'Surat Komuni/Penguatan (Krisma)',
        desc: 'Pengajuan komuni pertama dan/atau penguatan bagi umat yang sudah menerima baptis Katolik',
        to: 'surat/surat-komuni-penguatan',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan-calon-pengantin',
        title: 'Surat Keterangan Calon Pengantin',
        desc: 'Surat yang dibuat ketika umat Paroki Kumetiran akan menikah',
        to: 'surat/surat-keterangan-calon-pengantin',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-pelayanan-minyak-suci',
        title: 'Surat Pelayanan Minyak Suci',
        desc: 'Surat yang menampung informasi pelayanan minyak suci yang ada di wilayah Paroki Kumetiran',
        to: 'surat/surat-minyak-suci',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan-mati',
        title: 'Surat Keterangan Mati',
        desc: 'Surat yang dibuat jika ada umat Kumetiran yang meninggal dunia',
        to: 'surat/surat-keterangan-mati',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan-pindah',
        title: 'Surat Keterangan Pindah',
        desc: 'Umat Paroki Kumetiran yang akan pindah ke paroki lain harus membuat surat ini',
        to: 'surat/surat-keterangan-pindah',
        unverifiedCount: 0,
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
  mounted() {
    this.getSuratNotApprovedBySekretariat()
  },
  methods: {
    getSuratNotApprovedBySekretariat() {
      this.cards.map(async (card) => {
        let tempData = await getData(`/${card.endpoint}`)
        
        card.unverifiedCount = tempData.filter(surat => surat.sekretariat_approval != 1 && surat.ketua_lingkungan_approval === 1)
        card.unverifiedCount = card.unverifiedCount.length
      })
    }
  }
}
</script>

<style>

</style>
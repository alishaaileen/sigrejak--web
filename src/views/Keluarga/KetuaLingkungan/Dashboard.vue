<template>
  <div>
    <h1>Surat-surat Lingkungan {{ lingkungan.nama_lingkungan }}</h1>

    <v-card flat class="mt-5 pa-6">
      <h4 class="">Nama lingkungan: {{ lingkungan.nama_lingkungan }}</h4>
      
      <p>Paroki: Kumetiran</p>
      <p>Ketua lingkungan: {{ lingkungan.ketua_lingkungan }}</p>
    </v-card>
    
    <v-card class="mt-5 pa-6" flat>
      <v-text-field
        v-model="search"
        outlined
        prepend-inner-icon="mdi-magnify"
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
import { getData } from '../../../utils'

export default {
  data: () => ({
    lingkungan: {},
    search: '',
    cards: [
      {
        title: 'Surat Keterangan Pindah',
        desc: 'lorem ipsum',
        to: 'surat/surat-keterangan-pindah',
      },
      {
        title: 'Surat Keterangan Mati',
        desc: 'lorem ipsum',
        to: 'surat/surat-keterangan-mati',
      },
      {
        title: 'Surat Pelayanan Minyak Suci',
        desc: 'lorem ipsum',
        to: 'surat/surat-minyak-suci',
      },
      {
        title: 'Surat Keterangan Calon Pengantin',
        desc: 'lorem ipsum',
        to: 'surat/surat-calon-pengantin',
      },
      {
        title: 'Surat Keterangan',
        desc: 'lorem ipsum',
        to: 'surat/surat-keterangan',
      },
      {
        title: 'Surat Baptis Anak',
        desc: 'lorem ipsum',
        to: 'surat/surat-baptis-anak',
      },
      {
        title: 'Surat Baptis Dewasa',
        desc: 'lorem ipsum',
        to: 'surat/surat-baptis-dewasa',
      },
      {
        title: 'Surat Komuni',
        desc: 'lorem ipsum',
        to: 'surat/surat-komuni',
      },
      {
        title: 'Surat Keterangan Beasiswa', 
        desc: 'lorem ipsum',
        to: 'surat/surat-keterangan-beasiswa',
      },
      {
        title: 'Surat Izin Pelayanan Ekaristi', 
        desc: 'lorem ipsum',
        to: 'surat/surat-izin-pelayanan-ekaristi',
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
  async mounted() {
    this.lingkungan = await getData(`/lingkungan/${this.$store.state.keluarga.lingkunganId}`)
    this.lingkungan = this.lingkungan[0]
  }
}
</script>

<style>

</style>
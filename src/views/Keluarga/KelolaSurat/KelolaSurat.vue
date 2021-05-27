<template>
  <div>
    <h1>Surat-surat</h1>

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
export default {
  data: () => ({
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
        to: 'surat/surat-pelayanan-minyak-suci',
      },
      {
        title: 'Surat Keterangan Calon Pengantin',
        desc: 'lorem ipsum',
        to: 'surat/surat-keterangan-calon-pengantin',
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
  methods: {
  }
}
</script>

<style>

</style>
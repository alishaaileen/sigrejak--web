<template>
  <v-container>
    <div class="d-flex flex-wrap">
      <div v-for="(card, i) in cards" :key="i">
        <router-link :to="card.to" class="text-decoration-none">
          <v-card
            class="sm mb-5 mr-4 align-stretch"
            outlined
            width="700"
            hover
          >
            <div>
              <v-card-title
                class="headline text-decoration-none"
                v-text="card.title"
              ></v-card-title>

              <v-card-subtitle v-text="card.desc"></v-card-subtitle>
            </div>
          </v-card>
        </router-link>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
data: () => ({
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
    ]
  })
}
</script>

<style>

</style>
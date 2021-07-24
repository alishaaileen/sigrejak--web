<template>
  <div>
    <h1 class="mb-5">Dashboard</h1>

    <v-card class="pa-6 mb-15" flat>
      <h3 class="mb-5">Surat Yang Belum Terverifikasi</h3>
      
      <v-row dense>
        <v-col v-for="(surat, i) in suratList" :key="i" cols="4">
          <v-card
            class="pa-3 d-flex" 
            flat
            outlined
          >
              <span>{{ surat.title }}</span>
              <v-spacer></v-spacer>
              <v-chip :color="surat.unverifiedCount != 0 ? `amber darken-1` : ``">
                <span :class="surat.unverifiedCount != 0 ? `color-white` : ``">{{ surat.unverifiedCount }}</span>
              </v-chip>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    
    <v-card class="pa-6" flat>
      <h2 class="mb-5 text-center">Jadwal Baptis</h2>
      <calendar-baptis
        class="mb-5"
        :romoList="romoList"
      ></calendar-baptis>
    </v-card>
  </div>
</template>

<script>
import CalendarBaptis from '../../components/CalendarBaptis.vue'
import { getData } from '../../utils'

export default {
  components: {
    CalendarBaptis,
  },
  data: () => ({
    pengurus: {},
    romoList: [],
    suratList: [
      {
        endpoint: 'surat-izin-pelayanan-ekaristi',
        title: 'Izin Pelayanan Ekaristi', 
        to: 'laporan/surat-izin-ekaristi',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan-beasiswa',
        title: 'Keterangan Beasiswa', 
        to: 'laporan/surat-keterangan-beasiswa',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan',
        title: 'Keterangan',
        to: 'laporan/surat-keterangan',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-baptis-anak',
        title: 'Baptis Anak',
        to: 'laporan/surat-baptis-anak',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-baptis-dewasa',
        title: 'Baptis Dewasa',
        to: 'laporan/surat-baptis-dewasa',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-komuni-penguatan',
        title: 'Komuni I/Penguatan',
        to: 'laporan/surat-komuni-penguatan',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan-calon-pengantin',
        title: 'Keterangan Calon Pengantin',
        to: 'laporan/surat-keterangan-calon-pengantin',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-pelayanan-minyak-suci',
        title: 'Pelayanan Minyak Suci',
        to: 'laporan/surat-minyak-suci',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan-mati',
        title: 'Keterangan Kematian',
        to: 'laporan/surat-keterangan-mati',
        unverifiedCount: 0,
      },
      {
        endpoint: 'surat-keterangan-pindah',
        title: 'Keterangan Pindah',
        to: 'laporan/surat-keterangan-pindah',
        unverifiedCount: 0,
      },
    ]
  }),
  async mounted() {
    this.pengurus = this.$store.state.pengurus

    this.romoList = await getData(`/admin/role/4`)

    this.getSuratNotApprovedBySekretariat()
  },
  methods: {
    getSuratNotApprovedBySekretariat() {
      this.suratList.map(async (surat) => {
        let tempData = await getData(`/${surat.endpoint}`)
        
        surat.unverifiedCount = tempData.filter(surat => surat.sekretariat_approval != 1 && surat.ketua_lingkungan_approval === 1)
        surat.unverifiedCount = surat.unverifiedCount.length
      })
    }
  }
}
</script>

<style>

</style>
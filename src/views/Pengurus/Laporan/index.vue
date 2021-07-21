<template>
  <div>
    <h1 class="mb-5">Laporan</h1>

    <v-card class="pa-6" flat>
      <v-row>
        <!-- <v-col>
          <v-select
            v-model="selectedEndpoint"
            :items="jenisSuratOption"
            item-text="name"
            item-value="endpoint"
            label="Surat"
            outlined
            dense
          ></v-select>
        </v-col> -->
        <v-col>
          <v-select
            v-model="selectedJangkaWaktuOption"
            :items="jangkaWaktuOption"
            item-text="name"
            item-value="id"
            label="Jangka waktu"
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col v-if="selectedJangkaWaktuOption">
          <v-select
            v-model="selectedJangkaWaktu"
            label="Pilih"
            outlined
            dense
            :items="jangkaWaktu"
          ></v-select>
        </v-col>
        <v-col>
          <v-btn
            class="text-none mt-2"
            @click="generate"
            color="blue darken-3"
            dark
            depressed
          >
            Lihat
          </v-btn>
        </v-col>
      </v-row>
      <area-chart />
    </v-card>
    <snackbar />
  </div>
</template>

<script>
import { getData } from '../../../utils'
import AreaChart from "../../../components/AreaChart"

export default {
  components: {
    AreaChart,
  },
  props: ['options'],
  data: () => ({
    selectedJenisSurat: '',
    jenisSuratOption: [
      // { endpoint: '/', name: 'Semua', },
      { endpoint: '/surat-izin-pelayanan-ekaristi', name: 'Surat Izin Pelayanan Ekaristi', data: [] },
      { endpoint: '/surat-keterangan-beasiswa', name: 'Surat Keterangan Beasiswa', data: [] },
      { endpoint: '/surat-keterangan', name: 'Surat Keterangan', data: [] },
      { endpoint: '/surat-baptis-anak', name: 'Surat Baptis Anak', data: [] },
      { endpoint: '/surat-baptis-dewasa', name: 'Surat Baptis Dewasa', data: [] },
      { endpoint: '/surat-komuni-penguatan', name: 'Surat Komuni I/Penguatan', data: [] },
      { endpoint: '/surat-keterangan-calon-pengantin', name: 'Surat Keterangan Calon Pengantin', data: [] },
      { endpoint: '/surat-pelayanan-minyak-suci', name: 'Surat Pelayanan Minyak Suci', data: [] },
      { endpoint: '/surat-keterangan-mati', name: 'Surat Keterangan Kematian', data: [] },
      { endpoint: '/surat-keterangan-pindah', name: 'Surat Keterangan Pindah', data: [] },
    ],
    selectedJangkaWaktuOption: null,
    jangkaWaktuOption: [
      { id: 1, name: 'Bulanan' },
      { id: 2, name: 'Tahunan' }
    ],
    selectedJangkaWaktu: null,
    selectedEndpoint: null,
    bulanList: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ],
    tahunList: [],

    data: [],
  }),
  computed: {
    jangkaWaktu() {
      return (this.selectedJangkaWaktuOption === 1 ? this.bulanList : this.tahunList)
    }
  },
  mounted() {
    this.initTahun()
    this.jenisSuratOption.map(async (e) => {
      e.data = await getData(e.endpoint)
    })
  },
  methods: {
    initTahun() {
      let tahun = new Date()
      
      tahun = tahun.getFullYear()

      for(var i=0; i<50; i++) {
        this.tahunList.push(tahun)
        tahun--
      }
    },
    async generate() {
      try {
        this.data = await getData(this.selectedEndpoint)
        console.log(this.data)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
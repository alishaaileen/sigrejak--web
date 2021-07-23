<template>
  <div>
    <btn-kembali path="/pengurus/laporan" />

    <h1 class="mb-5">Laporan Semua Surat</h1>

    <v-card class="pa-6" flat>
      <v-row>
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
            @click="generateData"
            color="blue darken-3"
            dark
            depressed
          >
            Lihat
          </v-btn>
        </v-col>
      </v-row>
      <div>
        <v-row>
          <v-col>
            <bar-chart :chart-data="chartData"/>
          </v-col>
          <v-col>
            <pie-chart :chart-data="chartData"/>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <snackbar />
  </div>
</template>

<script>
import { getData } from '../../../utils'
import BarChart from "../../../components/Chart/BarChart"
import PieChart from "../../../components/Chart/PieChart"

export default {
  components: {
    BarChart,
    PieChart,
  },
  props: ['options'],
  data: () => ({
    selectedJenisSurat: '',
    jenisSuratList: [
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
    chartData: [],
  }),
  computed: {
    jangkaWaktu() {
      return (this.selectedJangkaWaktuOption === 1 ? this.bulanList : this.tahunList)
    }
  },
  mounted() {
    this.initTahun()
    this.jenisSuratList.map(async (surat) => {
      surat.data = await getData(surat.endpoint)
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
    async generateData() {
      let tempData = []
        , SuratAll = tempData.length
        , SuratSelesai = tempData.filter(e => e.sekretariat_approval === 1)
        , SuratBelumSelesai = tempData.filter(e => e.sekretariat_approval != 1)
        , SuratDihapus = tempData.filter(e => e.deleted_at != null)

      let chartData = [
        SuratAll.length,
        SuratSelesai.length,
        SuratBelumSelesai.length,
        SuratDihapus.length

      ]

      this.chartData = {
        labels: ["Total surat", "Selesai", "Belum selesai", "Dihapus/dibatalkan",],
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#00D8FF", "#41B883", "#E46651", "#f87979"],
            data: chartData
          },
        ]
      };
    }
  }
}
</script>

<style>

</style>
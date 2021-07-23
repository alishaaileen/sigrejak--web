<template>
  <div>
    <btn-kembali path="/pengurus/laporan" />

    <h1 class="mb-5">Laporan Surat Baptis Anak</h1>

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
            <v-card flat outlined class="pa-6">
              <h2>Bar</h2>
              <bar-chart :chart-data="chartData"/>
            </v-card>
          </v-col>
          <v-col>
            <v-card flat outlined class="pa-6">
              <h2>Keseluruhan</h2>
              <pie-chart :chart-data="chartData"/>
            </v-card>
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
    endpoint: '/surat-baptis-anak',
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
  async mounted() {
    this.initTahun()
    this.data = await getData(this.endpoint)
    this.generateData()
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
      let tempData = this.data
        // , SuratAll = tempData.length
        , SuratSelesai = tempData.filter(e => e.sekretariat_approval === 1 && e.deleted_at == null)
        , SuratBelumSelesai = tempData.filter(e => e.sekretariat_approval != 1 && e.deleted_at == null)
        , SuratDihapus = tempData.filter(e => e.deleted_at != null)

      let chartData = [
        // SuratAll.length,
        SuratSelesai.length,
        SuratBelumSelesai.length,
        SuratDihapus.length

      ]

      this.chartData = {
        labels: ["Selesai", "Belum selesai", "Dihapus/dibatalkan",],
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#00C853", "#FF9800", "#E46651"],
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
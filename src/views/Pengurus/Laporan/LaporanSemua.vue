<template>
  <div>
    <!-- <btn-kembali path="/pengurus/laporan" /> -->

    <h1 class="mb-5">Laporan</h1>

    <v-card flat class="pa-6 mb-5">
      <h2 class="mb-5">Perbandingan data tahunan</h2>

      <p>Grafik ini menunjukan perbandingan jumlah total masing-masing surat yang selesai, belum selesai, dan dibatalkan berdasarkan tahun</p>
      
      <v-row dense class="mb-5">
        <v-col>
          <v-select
            hide-details
            v-model="selectedTahunBar"
            label="Pilih"
            outlined
            dense
            :items="tahunList"
          ></v-select>
        </v-col>
        <v-col>
          <v-btn
            :disabled="disableBarIsTrue"
            class="text-none mt-2"
            @click="generateBarChart"
            color="blue darken-3"
            dark
            depressed
          >
            Lihat
          </v-btn>
        </v-col>
      </v-row>

      <bar-chart :height="500" :chart-data="chartDataBar" :options="{ maintainAspectRatio:false }"/>
    </v-card>


    <v-card flat class="pa-6">
      <h2 class="mb-5">Keseluruhan Per Bulan/Tahun</h2>

      <p>Grafik ini menunjukan jumlah semua surat yang selesai, belum selesai, dan dibatalkan berdasarkan bulan atau tahun</p>

      <v-row dense class="mb-5">
        <v-col>
          <v-select
            hide-details
            v-model="selectedJangkaWaktuPie"
            :items="jangkaWaktuOption"
            item-text="name"
            item-value="id"
            label="Jangka waktu"
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col v-if="selectedJangkaWaktuPie === 1">
          <v-select
            hide-details
            v-model="selectedBulanPie"
            label="Pilih"
            outlined
            dense
            :items="bulanList"
          ></v-select>
        </v-col>
        <v-col v-if="selectedJangkaWaktuPie">
          <v-select
            hide-details
            v-model="selectedTahunPie"
            label="Pilih"
            outlined
            dense
            :items="tahunList"
          ></v-select>
        </v-col>
        <v-col>
          <v-btn
            :disabled="disablePieIsTrue"
            class="text-none mt-2"
            @click="generatePieChart"
            color="blue darken-3"
            dark
            depressed
          >
            Lihat
          </v-btn>
        </v-col>
      </v-row>
      
      <pie-chart :width="500" :chart-data="chartDataPie" :options="{ maintainAspectRatio:false }"/>
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
      { endpoint: '/surat-izin-pelayanan-ekaristi', name: 'Surat Izin Pelayanan Ekaristi', data: [{created_at: ''}], color: '#E91E63', },
      { endpoint: '/surat-keterangan-beasiswa', name: 'Surat Keterangan Beasiswa', data: [{created_at: ''}], color: '#673AB7', },
      { endpoint: '/surat-keterangan', name: 'Surat Keterangan', data: [{created_at: ''}], color: '#3F51B5', },
      { endpoint: '/surat-baptis-anak', name: 'Surat Baptis Anak', data: [{created_at: ''}], color: '#2196F3', },
      { endpoint: '/surat-baptis-dewasa', name: 'Surat Baptis Dewasa', data: [{created_at: ''}], color: '#009688', },
      { endpoint: '/surat-komuni-penguatan', name: 'Surat Komuni I/Penguatan', data: [{created_at: ''}], color: '#4CAF50', },
      { endpoint: '/surat-keterangan-calon-pengantin', name: 'Surat Keterangan Calon Pengantin', data: [{created_at: ''}], color: '#FFC107', },
      { endpoint: '/surat-pelayanan-minyak-suci', name: 'Surat Pelayanan Minyak Suci', data: [{created_at: ''}], color: '#795548', },
      { endpoint: '/surat-keterangan-mati', name: 'Surat Keterangan Kematian', data: [{created_at: ''}], color: '#607D8B', },
      { endpoint: '/surat-keterangan-pindah', name: 'Surat Keterangan Pindah', data: [{created_at: ''}], color: '#E64A19', },
    ],
    jangkaWaktuOption: [
      { id: 1, name: 'Bulanan' },
      { id: 2, name: 'Tahunan' }
    ],
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
    selectedJangkaWaktuPie: null,
    selectedBulanPie: null,
    selectedTahunPie: null,
    selectedTahunBar: null,

    tahunList: [],
    data: [],
    chartDataPie: [],
    chartDataBar: [],
  }),
  mounted() {
    this.initTahun()
    this.jenisSuratList.map(async (surat) => {
      surat.data = await getData(surat.endpoint)
      this.data = this.data.concat(surat.data)
    })
  },
  computed: {
    disablePieIsTrue() {
      if (this.selectedJangkaWaktuPie === null)
        return true
      else if (this.selectedJangkaWaktuPie === 1 && (this.selectedBulanPie === null || this.selectedTahunPie === null))
        return true
      else if (this.selectedJangkaWaktuPie === 2 && this.selectedTahunPie === null)
        return true
      
      return false
    },
    disableBarIsTrue() {
      if (this.selectedTahunBar === null)
        return true
      
      return false
    },
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
    generateBarChart() {
      let chartData = []

      this.jenisSuratList.map(e => {
        let tempData = {
          label: e.name,
          backgroundColor: e.color,
          data: [],
        }

        let tempSelesaiCount = e.data.filter(surat => {
          return surat.created_at.substring(6,10) == this.selectedTahunBar && surat.sekretariat_approval === 1 && surat.deleted_at === null
        })
        let tempBelumSelesaiCount = e.data.filter(surat => {
          return surat.created_at.substring(6,10) == this.selectedTahunBar && surat.sekretariat_approval != 1 && surat.deleted_at === null
        })
        let tempBatalCount = e.data.filter(surat => surat.created_at.substring(6,10) == this.selectedTahunBar && surat.deleted_at != null)

        tempData.data = [tempSelesaiCount.length, tempBelumSelesaiCount.length, tempBatalCount.length]
        
        chartData.push(tempData)
      })

      this.chartDataBar = {
        labels: ["Selesai", "Belum selesai", "Dihapus/dibatalkan",],
        datasets: chartData
      };
      console.log(this.chartDataBar)
    },
    generatePieChart() {
      let tempData = []
      
      if (this.selectedJangkaWaktuPie === 2) {
        tempData = this.data.filter(e => {
          let tempTahun = e.created_at.substring(6,10)
          return tempTahun == this.selectedTahunPie
        })
      } else if (this.selectedJangkaWaktuPie === 1) {
        let tempBulan = this.bulanList.indexOf(this.selectedBulanPie)+1
        tempBulan = tempBulan < 10 ? `0${tempBulan}` : tempBulan

        tempData = this.data.filter(e => e.created_at.substring(6,10) == this.selectedTahunPie && e.created_at.substring(3,5) === tempBulan )
      }

      let SuratSelesai = tempData.filter(e => e.sekretariat_approval === 1)
        , SuratBelumSelesai = tempData.filter(e => e.sekretariat_approval != 1)
        , SuratDihapus = tempData.filter(e => e.deleted_at != null)

      let chartData = [
        SuratSelesai.length,
        SuratBelumSelesai.length,
        SuratDihapus.length
      ]

      this.chartDataPie = {
        labels: ["Selesai", "Belum selesai", "Dihapus/dibatalkan",],
        datasets: [
          {
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
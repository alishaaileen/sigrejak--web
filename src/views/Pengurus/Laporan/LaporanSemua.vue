<template>
  <div>
    <!-- <btn-kembali path="/pengurus/laporan" /> -->

    <h1 class="mb-5">Laporan</h1>

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
        <v-col v-if="selectedJangkaWaktuOption === 1">
          <v-select
            v-model="selectedBulan"
            label="Pilih"
            outlined
            dense
            :items="bulanList"
          ></v-select>
        </v-col>
        <v-col v-if="selectedJangkaWaktuOption">
          <v-select
            v-model="selectedTahun"
            label="Pilih"
            outlined
            dense
            :items="tahunList"
          ></v-select>
        </v-col>
        <v-col>
          <v-btn
            :disabled="disableIsTrue"
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
        {{data.length}}
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
    selectedBulan: null,
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
    selectedTahun: null,
    tahunList: [],
    data: [],
    chartData: [],
  }),
  mounted() {
    this.initTahun()
    this.jenisSuratList.map(async (surat) => {
      surat.data = await getData(surat.endpoint)
    })
  },
  computed: {
    disableIsTrue() {
      if (this.selectedJangkaWaktuOption === null)
        return true
      else if (this.selectedJangkaWaktuOption === 1 && (this.selectedBulan === null || this.selectedTahun === null))
        return true
      else if (this.selectedJangkaWaktuOption === 2 && this.selectedTahun === null)
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
    generateData() {
      let tempData = []

      this.jenisSuratList.map(surat => {
        tempData = tempData.concat(surat.data)
      })

      if (this.selectedJangkaWaktuOption === 2) {
        this.data = tempData.filter(e => {
          console.log(e.created_at)
          let tempTahun = e.created_at.substring(6,10)
          return tempTahun == this.selectedTahun
        })
      } else if (this.selectedJangkaWaktuOption === 1) {
        this.data = tempData.filter(e => e.created_at.substring(6,10) == this.selectedTahun && e.created_at.substring(3,5) === this.selectedBulan)
      }

      let SuratSelesai = this.data.filter(e => e.sekretariat_approval === 1)
        , SuratBelumSelesai = this.data.filter(e => e.sekretariat_approval != 1)
        , SuratDihapus = this.data.filter(e => e.deleted_at != null)

      let chartData = [
        SuratSelesai.length,
        SuratBelumSelesai.length,
        SuratDihapus.length
      ]

      this.chartData = {
        labels: ["Selesai", "Belum selesai", "Dihapus/dibatalkan",],
        datasets: [
          {
            label: null,
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
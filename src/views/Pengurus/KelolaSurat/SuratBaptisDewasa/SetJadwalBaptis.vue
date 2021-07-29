<template>
  <div>
    <btn-kembali path="/pengurus/surat/surat-baptis-dewasa" />

    <h1>Atur Jadwal Baptis Dewasa</h1>
    <div class="mt-5">
      <v-card flat class="pa-6">
        <v-row dense>
          <v-col>
            <calendar-baptis
              class="mb-5"
              :romoList="pastorList"
            ></calendar-baptis>
          </v-col>

          <v-col cols="4">
            <v-card-title>
              <h3>Info Calon</h3>
            </v-card-title>

            <v-divider></v-divider>

            <div class="px-3 py-4">
              <v-card class="mb-5" outlined>
                <v-card-text>
                  <label>No. Surat</label>
                  <p>{{ surat.no_surat }}</p>

                  <label>Nama calon</label>
                  <p>{{ surat.nama }}</p>

                  <label>Nama baptis</label>
                  <p>{{ surat.nama_baptis }}</p>
                </v-card-text>
              </v-card>
            </div>

          </v-col>
        </v-row>

        <h2 class="mb-5">Pilih Jadwal</h2>

        <v-divider></v-divider>

        <h3 class="mt-5 mb-5">A) Tahap I</h3>
          <autocomplete
            label="Romo*"
            :suggestionList="pastorList"
            itemText="nama"
            :value="romoTahapSatu.nama"
            @changeData="changeIdRomoTahapSatu"
          ></autocomplete>

          <label>Tanggal</label>
          <v-menu
            ref="menuTglTahapSatu"
            v-model="isDatePickerTahapSatuActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="data.tgl_tahap_satu"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="data.tgl_tahap_satu"
              :min="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>

          <label>Tempat</label>
          <v-text-field
            v-model="data.tempat_tahap_satu"
            required
            outlined
            dense
          ></v-text-field>

          <h3 class="mb-5">B) Tahap II</h3>
          <autocomplete
            label="Romo*"
            :suggestionList="pastorList"
            itemText="nama"
            :value="romoTahapDua.nama"
            @changeData="changeIdRomoTahapDua"
          ></autocomplete>

          <label>Tanggal</label>
          <v-menu
            ref="menuTglTahapDua"
            v-model="isDatePickerTahapDuaActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="data.tgl_tahap_dua"
                :value="data.tgl_tahap_dua"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="data.tgl_tahap_dua"
              :value="data.tgl_tahap_dua"
              :min="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>

          <label>Tempat</label>
          <v-text-field
            v-model="data.tempat_tahap_dua"
            required
            outlined
            dense
          ></v-text-field>

          <h3 class="mb-5">C) Jadwal baptis</h3>

          <autocomplete
            label="Romo pembaptis*"
            :suggestionList="pastorList"
            itemText="nama"
            :value="romoPembaptis.nama"
            @changeData="changeIdPastor"
          ></autocomplete>

          <label>Tanggal baptis</label>
          <v-menu
            ref="menu"
            v-model="isDatePickerActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="tglBaptis"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="tglBaptis"
              :min="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>
          
          <label>Jam</label>
          <div class="d-flex">
            <v-select
              :items="jam"
              v-model="waktu.jam"
              outlined
              dense
              placeholder="jam"
            ></v-select>
            <h3 class="mx-2 py-2">:</h3>
            <v-select
              :items="menit"
              v-model="waktu.menit"
              outlined
              dense
              placeholder="menit"
            ></v-select>
          </div>

          <label>Tempat</label>
          <v-text-field
            v-model="data.tempat_baptis"
            required
            outlined
            dense
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              class="text-none"
              depressed
              dark
              color="blue accent-4"
              @click="sekretariatVerify"
            >
              Simpan
            </v-btn>
          </div>
      </v-card>
    </div>
    <snackbar />
  </div>
</template>

<script>
import { getData, getOneData } from '../../../../utils'
import { verifySurat } from '../../../../utils/pengurus'

import Autocomplete from '../../../../components/Autocomplete.vue'
import CalendarBaptis from '../../../../components/CalendarBaptis.vue'

export default {
  components: {
    Autocomplete,
    CalendarBaptis,
  },
  data: () => ({
    isDatePickerActive: false,
    isDatePickerTahapSatuActive: false,
    isDatePickerTahapDuaActive: false,
    jam: [],
    menit: [],
    tglBaptis: '',
    waktu: { jam: '', menit: '' },
    pastorList: [],
    surat: {},
    data: {
      role: 'sekretariat',
      nama_baptis: '',
      id_sekretariat: '',
      tempat_tahap_satu: '',
      tgl_tahap_satu: '',
      id_romo_tahap_satu: '',
      tempat_tahap_dua: '',
      tgl_tahap_dua: '',
      id_romo_tahap_dua: '',
      id_romo_pembaptis: '',
      jadwal_baptis: '',
      tempat_baptis: '',
    },
    romoTahapSatu: {},
    romoTahapDua: {},
    romoPembaptis: {},
  }),
  async mounted() {
    // Inisialisasi array jam
    this.jam = this.initWaktu(1, 24)
    // Inisialisasi array menit
    this.menit = this.initWaktu(0, 59)

    // Get info surat
    this.surat = await getOneData(`/surat-baptis-dewasa/${this.$route.params.id}`)

    this.data.id_sekretariat = this.$store.state.pengurus.id
    this.data.nama_baptis = this.surat.nama_baptis

    this.pastorList = await getData(`/admin/role/4`)
    if (this.surat.jadwal_baptis != null) {
      this.romoPembaptis = this.pastorList.find(e => e.id === this.surat.id_romo_pembaptis)
      this.romoTahapSatu = this.pastorList.find(e => e.id === this.surat.id_romo_tahap_satu)
      this.romoTahapDua = this.pastorList.find(e => e.id === this.surat.id_romo_tahap_dua)

      this.data.id_romo_tahap_satu = this.surat.id_romo_tahap_satu
      this.data.tempat_tahap_satu = this.surat.tempat_tahap_satu
      this.data.tgl_tahap_satu = this.surat.tgl_tahap_satu
      
      this.data.id_romo_tahap_dua = this.surat.id_romo_tahap_dua
      this.data.tgl_tahap_dua = this.surat.tgl_tahap_dua
      this.data.tempat_tahap_dua = this.surat.tempat_tahap_dua
      
      this.data.id_romo_pembaptis = this.surat.id_romo_tahap_satu
      this.data.tempat_baptis = this.surat.tempat_baptis
      this.tglBaptis = this.surat.jadwal_baptis.substring(0, 10)
      this.waktu.jam = this.surat.jadwal_baptis.substring(11, 13)
      this.waktu.menit = this.surat.jadwal_baptis.substring(14, 16)
    }
  },
  methods: {
    initWaktu(start, limit) {
      let temp = []

      for(let i=start; i<=limit; i++) {
        i<10 ? temp.push(`0${i}`) : temp.push(i.toString())
      }

      return temp
    },
    saveDate (date) {
      this.$refs.menuTglTahapSatu.save(date)
      this.$refs.menuTglTahapDua.save(date)
      this.$refs.menu.save(date)
    },
    changeIdPastor(e) {
      let temp = this.pastorList.find(_ => _.nama === e)
      this.data.id_romo_pembaptis = temp.id
    },
    changeIdRomoTahapSatu(e) {
      let temp = this.pastorList.find(_ => _.nama === e)
      this.data.id_romo_tahap_satu = temp.id
      console.log(this.data.id_romo_pembaptis)
    },
    changeIdRomoTahapDua(e) {
      let temp = this.pastorList.find(_ => _.nama === e)
      this.data.id_romo_tahap_dua = temp.id
    },





    async sekretariatVerify() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      this.data.jadwal_baptis = `${this.tglBaptis} ${this.waktu.jam}:${this.waktu.menit}:00`

      console.log(this.data)
      
      snackbar = await verifySurat('/surat-baptis-dewasa', this.$route.params.id, this.data)
      console.log(snackbar)
      
      if(snackbar.color === 'success') {
        this.$router.push('/pengurus/surat/surat-baptis-dewasa')
      }
      
      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>

<style>

</style>
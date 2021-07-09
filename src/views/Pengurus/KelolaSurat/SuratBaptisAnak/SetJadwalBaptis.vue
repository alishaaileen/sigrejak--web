<template>
  <div>
    <btn-kembali path="/pengurus/surat/surat-baptis-anak" />

    <h1>Atur Jadwal Baptis Anak</h1>

    <div class="mt-5">
      <v-card flat>
        <v-row dense>
          <v-col>
            <calendar-baptis
              class="mb-5 pl-4"
              :romoList="pastorList"
            ></calendar-baptis>
          </v-col>

          <v-col cols="4">
            <v-card-title>
              <h3>Pilih Jadwal</h3>
            </v-card-title>

            <v-divider></v-divider>

            <div class="pl-4 pr-6 py-4">
              <v-card class="mb-5" outlined>
                <v-card-text>
                  <label>No. Surat</label>
                  <p>{{ surat.no_surat }}</p>

                  <label>Nama anak</label>
                  <p>{{ surat.nama }}</p>

                  <label>Nama baptis</label>
                  <p>{{ surat.nama_baptis }}</p>
                </v-card-text>
              </v-card>

              <autocomplete
                label="Romo pembaptis*"
                :suggestionList="pastorList"
                itemText="nama"
                :value="romoPembaptis.nama"
                @changeData="changeIdPastor"
              ></autocomplete>

              <label>Tanggal</label>
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
            </div>

          </v-col>
        </v-row>
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
    jam: [],
    menit: [],
    tglBaptis: '',
    waktu: { jam: '', menit: '' },
    pastorList: [],
    surat: {},
    data: {
      role: 'sekretariat',
      id_sekretariat: '',
      jadwal_baptis: '',
      id_romo_pembaptis: '',
      nama_baptis: '',
    },
    romoPembaptis: {}
  }),
  async mounted() {
    // Inisialisasi array jam
    this.jam = this.initWaktu(1, 24)
    // Inisialisasi array menit
    this.menit = this.initWaktu(0, 59)

    // Get info surat
    this.surat = await getOneData(`/surat-baptis-anak/${this.$route.params.id}`)

    this.data.id_sekretariat = this.$store.state.pengurus.id
    this.data.nama_baptis = this.surat.nama_baptis
    this.data.romoPembaptis = this.surat.id_romo_pembaptis || null

    this.pastorList = await getData(`/admin/role/4`)
    if (this.surat.jadwal_baptis != null) {
      this.tglBaptis = this.surat.jadwal_baptis.substring(0, 10)
      this.waktu.jam = this.surat.jadwal_baptis.substring(11, 13)
      this.waktu.menit = this.surat.jadwal_baptis.substring(14, 16)
      this.romoPembaptis = this.pastorList.find(e => e.id === this.surat.id_romo_pembaptis)
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
      this.$refs.menu.save(date)
    },
    async changeIdPastor(e) {
      let temp = this.pastorList.find(_ => {
        return _.nama === e
      })
      this.data.id_romo_pembaptis = temp.id
    },





    async sekretariatVerify() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      this.data.jadwal_baptis = `${this.tglBaptis} ${this.waktu.jam}:${this.waktu.menit}:00`

      console.log(this.data)
      
      snackbar = await verifySurat('/surat-baptis-anak', this.$route.params.id, this.data)
      console.log(snackbar)
      
      if(snackbar.color === 'success') {
        this.$router.push('/pengurus/surat/surat-baptis-anak')
      }
      
      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>

<style>

</style>
<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-izin-ekaristi" />
    
    <h1>Tambah Surat Izin Pelayanan Ekaristi</h1>

    <div class="form mt-5">
      <v-card class="pa-6 mx-auto" flat>
        <v-form @submit.prevent="submit">
          <label>Tanggal pelaksanaan*</label>
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
                v-model="formData.tgl_pelaksanaan"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_pelaksanaan"
              :min="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>

          <v-row>
            <v-col>
              <label>Waktu mulai*</label>
              <div class="d-flex">
                <v-select
                  :items="jam"
                  v-model="waktu.mulai.jam"
                  outlined
                  dense
                  placeholder="jam"
                ></v-select>
                <h3 class="mx-2 py-2">:</h3>
                <v-select
                  :items="menit"
                  v-model="waktu.mulai.menit"
                  outlined
                  dense
                  placeholder="menit"
                ></v-select>
              </div>
            </v-col>
            <v-col>
              <label>Waktu selesai*</label>
              <div class="d-flex">
                <v-select
                  :items="jam"
                  v-model="waktu.selesai.jam"
                  outlined
                  dense
                  placeholder="jam"
                ></v-select>
                <h3 class="mx-2 py-2">:</h3>
                <v-select
                  :items="menit"
                  v-model="waktu.selesai.menit"
                  outlined
                  dense
                  placeholder="menit"
                ></v-select>
              </div>
            </v-col>
          </v-row>

          <label>Ujud/intensi*</label>
          <v-textarea
            v-model="formData.intensi"
            required
            outlined
            dense
          ></v-textarea>

          <autocomplete
            label="Lingkungan pelaksanaan ekaristi*"
            :suggestionList="lingkunganList"
            itemText="nama_lingkungan"
            @changeData="changeIdLingkungan"
          ></autocomplete>

          <label>Alamat lokasi/tempat/rumah*</label>
          <v-textarea
            v-model="formData.lokasi_rumah"
            required
            outlined
            dense
          ></v-textarea>

          <label>Nomor telepon rumah/HP*</label>
          <v-text-field
            v-model="formData.no_telp_lokasi"
            required
            outlined
            dense
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <label>Dipimpin oleh*</label>
          <v-text-field
            v-model="formData.romo_pemimpin"
            prefix="Romo"
            placeholder="(nama romo)"
            required
            outlined
            dense
          ></v-text-field>

          <label>Alamat/komunitas*</label>
          <v-textarea
            v-model="formData.alamat_komunitas"
            required
            outlined
            dense
          ></v-textarea>

          <label>Nomor telepon komunitas*</label>
          <v-text-field
            v-model="formData.no_telp_komunitas"
            required
            outlined
            dense
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none mt-2"
              type="submit"
              color="blue accent-4"
              dark
              depressed
            >
              Ajukan surat
            </v-btn>
          </div>
        </v-form>
      </v-card>     
    </div>
    <snackbar />
  </div>
</template>

<script>
import { getData, postData } from '../../../../utils'
import Autocomplete from '../../../../components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    url: '/surat-izin-pelayanan-ekaristi',
    isDatePickerActive: false,
    jam: [],
    menit: [],
    waktu: {
      mulai: { jam: '', menit: '' },
      selesai: { jam: '', menit: '' },
    },
    lingkunganList: [],
    formData: {
      id_lingkungan: null,
      id_keluarga: null,

      tgl_pelaksanaan: '',
      waktu_mulai: '',
      waktu_selesai: '',
      intensi: '',
      lokasi_rumah: '',
      no_telp_lokasi: '',

      romo_pemimpin: '',
      alamat_komunitas: '',
      no_telp_komunitas: '',

      ketua_lingkungan: null,
      isKetuaLingkungan: false,
    },
  }),
  async mounted() {
    // Inisialisasi array jam
    this.jam = this.initWaktu(1, 24)
    // Inisialisasi array menit
    this.menit = this.initWaktu(0, 59)

    this.lingkunganList = await getData(`/lingkungan`)
    this.formData.id_keluarga = this.$store.state.keluarga.id
    if (this.$store.state.keluarga.lingkunganId != null) {
      this.formData.isKetuaLingkungan = true
      this.formData.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
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
    changeIdLingkungan(e) {
      let temp = this.lingkunganList.find((_) => { return _.nama_lingkungan === e })

      this.formData.id_lingkungan = temp.id
    },
    setAllWaktu(waktu) {
      this.formData.waktu_mulai = `${waktu.mulai.jam}:${waktu.mulai.menit}`
      this.formData.waktu_selesai = `${waktu.selesai.jam}:${waktu.selesai.menit}`
    },
    saveDate (date) {
      this.$refs.menu.save(date)
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      this.setAllWaktu(this.waktu)

      let snackbar = {}

      try {
        let response = await postData(`${this.url}/add`, this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
          this.$router.push('/keluarga/surat/surat-izin-ekaristi')
        } else {
          snackbar.color = 'error',
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error',
        snackbar.text = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>

<style>

</style>
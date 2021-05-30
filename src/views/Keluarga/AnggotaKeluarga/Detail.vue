<template>
  <div>
    <btn-kembali path="/keluarga/anggota" />
    
    <h1>Detail Anggota Keluarga</h1>
    
    <v-card class="form mt-5 pa-6" light flat>
      <h2>Informasi Umum</h2>
      
      <v-form class="mt-4">
        <v-row>
          <v-col>
            <label>Nama lengkap*</label>
            <v-text-field
              v-model="umat.nama"
              required
              outlined
              dense
            ></v-text-field>

            <label>Nama baptis</label>
            <v-text-field
              v-model="umat.nama_baptis"
              required
              outlined
              dense
            ></v-text-field>

            <label>Jenis kelamin*</label>
            <v-select
              :items="[ 'Pria', 'Wanita' ]"
              v-model="umat.jenis_kelamin"
              outlined
              dense
            ></v-select>

            <label>Tempat lahir*</label>
            <v-text-field
              v-model="umat.tempat_lahir"
              required
              outlined
              dense
            ></v-text-field>

            <label>Tanggal lahir*</label>
            <birth-date-picker
              :tgl="umat.tgl_lahir"
              @saveDate="saveDate"
            ></birth-date-picker>
          </v-col>

          <v-col>
            <label>Nomor telepon</label>
            <v-text-field
              v-model="umat.no_telp"
              required
              outlined
              dense
            ></v-text-field>

            <label>Pekerjaan*</label>
            <v-text-field
              v-model="umat.pekerjaan"
              required
              outlined
              dense
            ></v-text-field>

            <label>Alamat*</label>
            <v-text-field
              v-model="umat.alamat"
              required
              outlined
              dense
            ></v-text-field>

            <autocomplete
              :value="umat.nama_lingkungan"
              label="Lingkungan tempat tinggal*"
              :suggestionList="lingkunganList"
              itemText="nama_lingkungan"
              @changeData="changeIdLingkungan"
            ></autocomplete>
          </v-col>
        </v-row>

        <div class="d-flex justify-end">
          <v-btn
            class="btn text-none"
            @click="saveUmat"
            color="blue accent-4"
            dark
            depressed
          >
            Simpan
          </v-btn>
        </div>
      </v-form>

      <h2>Informasi Lain</h2>

      <v-divider class="mt-4"></v-divider>

      <v-banner>
        <v-avatar
          slot="icon"
          color="yellow darken-3"
          size="35"
        >
          <v-icon
            icon="mdi-exclamation-thick"
            color="white"
            small
          >
            fas fa-exclamation
          </v-icon>
        </v-avatar>
          <span>
            Hanya data ayah dan ibu yang dapat diubah.
            <br>
            Jika data salah, harap hubungi sekretariat
          </span>
      </v-banner>
      
      <form class="mt-4">
        <v-row>
          <v-col>
            <autocomplete
              :value.sync="namaAyah"
              :disable="false"
              label="Ayah"
              :suggestionList="keluargaNameList"
              itemText="nama"
              @changeData="changeIdAyah"
            ></autocomplete>
            <autocomplete
              :value="namaIbu"
              :disable="false"
              label="Ibu"
              :suggestionList="keluargaNameList"
              itemText="nama"
              @changeData="changeIdIbu"
            ></autocomplete>
            <label>Pasangan</label>
            <v-text-field
              :value="detailUmat.id_pasangan"
              outlined
              readonly
              disabled
              dense
            ></v-text-field>
            <label>Cara menikah</label>
            <v-text-field
              :value="detailUmat.cara_menikah"
              outlined
              readonly
              disabled
              dense
            ></v-text-field>
          </v-col>
          <v-col>
            <label>Tanggal baptis</label>
            <birth-date-picker
              :tgl="detailUmat.tgl_baptis"
              @saveDate="saveDate"
              :editable="true"
            ></birth-date-picker>

            <label>Tanggal komuni</label>
            <birth-date-picker
              :tgl="detailUmat.tgl_komuni"
              @saveDate="saveDate"
              :editable="true"
            ></birth-date-picker>

            <label>Tanggal penguatan</label>
            <birth-date-picker
              :tgl="detailUmat.tgl_penguatan"
              @saveDate="saveDate"
              :editable="true"
            ></birth-date-picker>

            <label>Tanggal menikah</label>
            <birth-date-picker
              :tgl="detailUmat.tgl_menikah"
              @saveDate="saveDate"
              :editable="true"
            ></birth-date-picker>
          </v-col>
        </v-row>
        <div class="d-flex justify-end">
          <v-btn
            class="btn text-none"
            @click="saveDetailUmat"
            color="blue accent-4"
            dark
            depressed
          >
            Simpan
          </v-btn>
        </div>
      </form>
    </v-card>
    <snackbar></snackbar>
  </div>
</template>

<script>
import { getData, editData } from '../../../utils'

import BirthDatePicker from '../../../components/BirthDatePicker'
import Autocomplete from '../../../components/Autocomplete'

export default {
  components: {
    BirthDatePicker,
    Autocomplete
  },
  data: () => ({
    lingkunganList: [],
    umat: {},
    detailUmat: {},
    anggotaKeluarga: [],
    namaAyah: '',
    namaIbu: '',
  }),
  computed: {
    keluargaNameList() {
      return this.anggotaKeluarga.filter(e => {
        if(e.id != this.umat.id && e.id != this.detailUmat.id_ayah && e.id != this.detailUmat.id_ibu) {
          return e.nama
        }
      })
    },
  },
  async mounted() {
    this.lingkunganList = await getData(`/lingkungan`)
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)

    this.umat = await getData(`/umat/${this.$route.params.id}`)
    this.umat = this.umat[0]
    this.detailUmat = await getData(`/detail-umat/${this.$route.params.id}`)
    this.detailUmat = this.detailUmat[0]
    if(this.detailUmat.id_ayah) this.setNamaAyah()
    if(this.detailUmat.id_ibu) this.setNamaIbu()
  },
  methods: {
    changeIdLingkungan(e) {
      let temp = this.lingkunganList.find(_ => _.nama_lingkungan == e)
      this.umat.lingkungan_id = temp.id
    },
    changeIdAyah(e) {
      let temp = this.anggotaKeluarga.find(_ => _.nama === e)
      this.detailUmat.id_ayah = temp.id
    },
    changeIdIbu(e) {
      let temp = this.anggotaKeluarga.find(_ => _.nama === e)
      this.detailUmat.id_ibu = temp.id
    },
    setNamaAyah() {
      let temp = this.anggotaKeluarga.find(_ => _.id === this.detailUmat.id_ayah)
      
      this.namaAyah = temp ? temp.nama : ''
    },
    setNamaIbu() {
      let temp = this.anggotaKeluarga.find(_ => _.id === this.detailUmat.id_ibu)
      
      this.namaIbu = temp ? temp.nama : ''
    },
    saveDate(newDate) {
      this.umat.tgl_lahir = newDate
    },
    async saveUmat() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await editData('/umat', this.$route.params.id, this.umat)

        if (response.status >= 200 && response.status < 300) {          
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil tersimpan!'
          this.umat = await getData(`/umat/${this.$route.params.id}`)
          this.umat = this.umat[0]
        } else {
          snackbar.color = 'error'
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error'
        snackbar.text = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
    async saveDetailUmat() {
      console.log(this.detailUmat.id_ayah)
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await editData('/detail-umat', this.$route.params.id, {
          id_ayah: this.detailUmat.id_ayah,
          id_ibu: this.detailUmat.id_ibu,
        })

        if (response.status >= 200 && response.status < 300) {          
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil tersimpan!'
          this.umat = await getData(`/detail-umat/${this.$route.params.id}`)
        } else {
          snackbar.color = 'error'
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error'
        snackbar.text = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    }
  }
}
</script>

<style>

</style>
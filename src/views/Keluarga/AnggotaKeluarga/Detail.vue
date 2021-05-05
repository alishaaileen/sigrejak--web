<template>
  <div>
    <h1 class="page-title">Detail Anggota Keluarga</h1>
    
    <div class="form mt-5">
      <h2 class="page-title">Informasi Umum</h2>

      <v-divider class="mt-4"></v-divider>
      
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
              :value="paroki.nama_paroki"
              :disable="false"
              label="Paroki tempat tinggal*"
              :suggestionList="parokiNameList"
              @changeData="changeIdParoki"
            ></autocomplete>

            <autocomplete
              :value="lingkungan.nama_lingkungan"
              label="Lingkungan tempat tinggal*"
              :suggestionList.sync="lingkunganNameList"
              @changeData="changeIdLingkungan"
            ></autocomplete>
          </v-col>
        </v-row>

        <div class="d-flex justify-end">
          <v-btn
            class="btn text-none"
            @click="saveUmat"
            color="success"
            dark
            depressed
          >
            Simpan
          </v-btn>
        </div>
      </v-form>
    </div>

    <div class="mt-7">
      <h2 class="page-title">Informasi lain</h2>

      <v-divider class="mt-4"></v-divider>

      <v-banner>
        <v-avatar
          slot="icon"
          color="deep-purple"
          size="40"
        >
          <v-icon
            icon="mdi-exclamation-thick"
            color="white"
          >
            mdi-exclamation-thick
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
              :value="namaAyah"
              :disable="false"
              label="Ayah"
              :suggestionList="keluargaNameList"
              @changeData="changeIdAyah"
            ></autocomplete>
            <autocomplete
              :value="namaIbu"
              :disable="false"
              label="Ibu"
              :suggestionList="keluargaNameList"
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
            color="success"
            dark
            depressed
          >
            Simpan
          </v-btn>
        </div>
      </form>
    </div>
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
    parokiList: [],
    lingkunganList: [],
    umat: {},
    detailUmat: {},
    anggotaKeluarga: [],
  }),
  computed: {
    parokiNameList() {
      return this.parokiList.map(e => e.nama_paroki)
    },
    lingkunganNameList() {
      // return this.lingkunganList.filter(e => {
      //   if (e.paroki_id === this.paroki.id)
      //     return e.nama_lingkungan
      // })
      return this.lingkunganList.map(e => {
        if (e.paroki_id === this.paroki.id) {
          return e.nama_lingkungan
        } else {
          return null
        }
      }).filter(e => e !== null)
    },
    keluargaNameList() {
      return this.anggotaKeluarga.map(e => e.nama)
    },
    paroki() {
      var tempLingkungan = this.lingkunganList.find(e => e.id === this.umat.lingkungan_id)
      var tempParoki = this.parokiList.find(e => e.id === tempLingkungan.paroki_id)
      return tempParoki
    },
    lingkungan() {
      var temp = this.lingkunganList.find(e => e.id === this.umat.lingkungan_id)
      return temp
    },
  },
  async mounted() {
    this.lingkunganList = await getData(`/lingkungan`)
    this.parokiList = await getData(`/paroki`)
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)

    this.umat = await getData(`/umat/${this.$route.params.id}`)
    this.umat = this.umat[0]
    this.detailUmat = await getData(`/detail-umat/${this.$route.params.id}`)
    this.detailUmat = this.detailUmat[0]
  },
  methods: {
    changeIdParoki(e) {
      this.parokiList.map((_) => {
        if (_.nama_paroki == e) {
          this.umat.paroki_id = _.id;
          return
        }
      })
    },
    changeIdLingkungan(e) {
      this.lingkunganList.map((_) => {
        if (_.nama_lingkungan == e) {
          this.umat.lingkungan_id = _.id;
          return
        }
      })
    },
    changeIdAyah(e) {
      this.anggotaKeluarga.map((_) => {
        if (_.nama == e) {
          this.detailUmat.id_ayah = _.id;
          return
        }
      })
    },
    changeIdIbu(e) {
      this.anggotaKeluarga.map((_) => {
        if (_.nama == e) {
          this.detailUmat.id_ibu = _.id;
          return
        }
      })
    },
    namaAyah() {
      this.anggotaKeluarga.map((_) => {
        if (_.id == this.detailUmat.id_ayah) return _.nama
      })
      return ""
    },
    namaIbu() {
      this.anggotaKeluarga.map((_) => {
        if (_.id == this.detailUmat.id_ibu) return _.nama
      })
      return ""
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
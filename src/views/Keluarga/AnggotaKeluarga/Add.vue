<template>
  <div>
    <h1>Tambah Anggota Keluarga</h1>
    
    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-6 mx-auto" flat>
        <v-form>
          <label>Nama lengkap*</label>
          <v-text-field
            v-model="formData.nama"
            required
            outlined
            dense
          ></v-text-field>

          <label>Nama baptis</label>
          <v-text-field
            v-model="formData.nama_baptis"
            required
            outlined
            dense
          ></v-text-field>

          <label>Jenis kelamin*</label>
          <v-select
            :items="[ 'Pria', 'Wanita' ]"
            v-model="formData.jenis_kelamin"
            outlined
            dense
          ></v-select>

          <label>Tempat lahir*</label>
          <v-text-field
            v-model="formData.tempat_lahir"
            required
            outlined
            dense
          ></v-text-field>

          <label>Tanggal lahir</label>
          <v-menu
            ref="dateMenu"
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_lahir"
                prepend-inner-icon="mdi-calendar"
                dense
                readonly
                outlined
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="formData.tgl_lahir"
              :max="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>

          <label>Nomor telepon</label>
          <v-text-field
            v-model="formData.no_telp"
            required
            outlined
            dense
          ></v-text-field>

          <label>Pekerjaan*</label>
          <v-text-field
            v-model="formData.pekerjaan"
            required
            outlined
            dense
          ></v-text-field>

          <label>Alamat*</label>
          <v-text-field
            v-model="formData.alamat"
            required
            outlined
            dense
          ></v-text-field>

          <autocomplete
            label="Lingkungan tempat tinggal*"
            :suggestionList.sync="lingkunganNameList"
            @changeData="changeIdLingkungan"
          ></autocomplete>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none mt-2"
              type="submit"
              color="blue accent-4"
              dark
              depressed
            >
              Tambah anggota
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>

    <snackbar></snackbar>
  </div>
</template>

<script>
import { getData, postData } from '../../../utils'

import Autocomplete from '../../../components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    parokiList: [],
    lingkunganList: [],
    formData: {
      nama: '',
      tempat_lahir: '',
      tgl_lahir: null,
      jenis_kelamin: '',
      nama_baptis: '',
      alamat: '',
      no_telp: '',
      pekerjaan: '',
      is_dead: 0,
      is_umat_active: 1,
      lingkungan_id: '',
      paroki_id: '',
      keluarga_id: '',
    },
    dateMenu: false,
  }),
  watch: {
    dateMenu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  computed: {
    lingkunganNameList() {
      return this.lingkunganList.map(e => e.nama_lingkungan)
      // return this.lingkunganList.map(e => {
      //   if (e.paroki_id === this.formData.paroki_id) {
      //     return e.nama_lingkungan
      //   } else {
      //     return null
      //   }
      // }).filter(e => e !== null)
    },
  },
  async mounted() {
    this.lingkunganList = await getData('/lingkungan')
  },
  methods: {
    changeIdLingkungan(e) {
      this.lingkunganList.map((_) => {
        if (_.nama_lingkungan == e) {
          this.formData.lingkungan_id = _.id;
          return
        }
      })
    },
    saveDate (date) {
      this.$refs.dateMenu.save(date)
    },
    async submit () {
      this.$store.dispatch('loading/openLoading')
      let snackbar = {}

      // Assign keluarga_id to the form
      this.formData.keluarga_id = this.$store.state.keluarga.id
      
      try {
        let endpoint = '/umat/add'
        let response = await postData(endpoint, this.formData)

        if (response.status === 200) {
          endpoint = '/detail-umat/add'
          postData(endpoint, {
            id_umat: response.data.result.insertId
          })
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil ditambahkan!'
        }
        this.$router.push('anggota-keluarga')
      } catch (error) {
        snackbar.color = 'error',
        snackbar.text = error
      }
      this.$store.dispatch('loading/closeLoading')
      this.$store.dispatch('snackbar/openSnackbar', snackbar)
    },
  }
}
</script>

<style>

</style>
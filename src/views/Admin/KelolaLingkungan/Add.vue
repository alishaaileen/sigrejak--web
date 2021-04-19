<template>
  <div>
    <h1 class="page-title">Tambah Lingkungan</h1>

    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-3 mx-auto" outlined>
        <v-form>
          <label>Nama lingkungan*</label>
          <v-text-field
            v-model="formData.nama_lingkungan"
            required
            outlined
            dense
          ></v-text-field>

          <autocomplete
            label="Nama Paroki*"
            :suggestionList="parokiNameList"
            @changeData="changeIdParoki"
          ></autocomplete>

          <autocomplete
            label="Keluarga ketua lingkungan*"
            :suggestionList="keluargaNameList"
            @changeData="changeIdKeluarga"
          ></autocomplete>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              type="submit"
              color="success"
              dark
              depressed
            >
              Tambah Lingkungan
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
    Autocomplete
  },
  data: () => ({
    formData: {
      nama_lingkungan: '',
      paroki_id: null,
      id_ketua_lingkungan: null,
    },
    parokiList: [],
    keluargaList: [],
  }),
  computed: {
    parokiNameList: function () {
      return this.parokiList.map(e => e.nama_paroki)
    },
    keluargaNameList: function () {
      return this.keluargaList.map(e => e.nama_keluarga)
    },
  },
  async mounted() {
    this.parokiList = await getData('/paroki')
    this.keluargaList = await getData('/keluarga')
  },
  methods: {
    changeIdParoki(e) {
      this.parokiList.map((_) => {
        if (_.nama_paroki == e) {
          this.formData.paroki_id = _.id;
          return
        }
      })
    },
    changeIdKeluarga(e) {
      this.keluargaList.map((_) => {
        if (_.nama_keluarga == e) {
          this.formData.id_ketua_lingkungan = _.id;
          return
        }
      })
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await postData('/lingkungan/store', this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil ditambahkan!'
          this.$router.push('kelola-lingkungan')
        } else {
          snackbar.color = 'error',
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error',
        snackbar.text = error

        console.error = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    }
  }
}
</script>
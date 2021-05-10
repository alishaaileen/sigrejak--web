<template>
  <div>
    <h1>Detail Lingkungan</h1>

    <v-divider></v-divider>

    <div class="form mt-5">
      <v-card class="pa-6 mx-auto" flat>
        <h2>Informasi Lingkungan</h2>
        <div class="my-3">
          <v-form>
            <label>Nama lingkungan*</label>
            <v-text-field
              v-model="lingkungan.nama_lingkungan"
              required
              outlined
              dense
            ></v-text-field>

            <autocomplete
              :value="lingkungan.ketua_lingkungan"
              label="Keluarga ketua lingkungan*"
              :suggestionList="keluargaNameList"
              @changeData="changeIdKeluarga"
            ></autocomplete>

            <div class="d-flex justify-end">
              <v-btn
                class="btn text-none"
                @click="save"
                color="blue accent-4"
                dark
                depressed
              >
                Simpan
              </v-btn>
            </div>
          </v-form>

        </div>
      </v-card>
    </div>
    <snackbar/>
  </div>
</template>

<script>
import { getData, editData } from '../../../utils'

import Autocomplete from '../../../components/Autocomplete'

export default {
  components: {
    Autocomplete
  },
  data: () => ({
    lingkungan: {},
    keluargaList: [],
  }),
  async mounted() {
    this.tableLoading = true

    this.lingkungan = await getData(`/lingkungan/${this.$route.params.id}`)
    this.lingkungan = this.lingkungan[0]
    this.keluargaList = await getData(`/keluarga`)
    
    this.tableLoading = false
  },
  computed: {
    keluargaNameList: function () {
      return this.keluargaList.map(e => e.nama_keluarga)
    },
  },
  methods: {
    changeIdKeluarga(e) {
      this.keluargaList.map((_) => {
        if (_.nama_keluarga == e) {
          this.lingkungan.ketua_lingkungan_id = _.id;
          return
        }
      })
    },
    async save() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await editData('/lingkungan', this.$route.params.id, {
          nama_lingkungan: this.lingkungan.nama_lingkungan,
          ketua_lingkungan_id: this.lingkungan.ketua_lingkungan_id,
        })

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil tersimpan!'
          this.$router.push('/pengurus/lingkungan')
        } else {
          snackbar.color = 'error'
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error'
        snackbar.text = error

        console.error = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>
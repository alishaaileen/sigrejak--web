<template>
  <div>
    <h1>Detail Lingkungan</h1>

    <v-divider></v-divider>

    <div class="form mt-5">
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

          <label>Nama paroki</label>
          <v-text-field
            :value="paroki.nama_paroki"
            readonly
            disabled
            outlined
            dense
          ></v-text-field>

          <autocomplete
            :value="keluargaKetuaLingkungan[0].nama_keluarga"
            label="Keluarga ketua lingkungan*"
            :suggestionList="keluargaNameList"
            @changeData="changeIdKeluarga"
          ></autocomplete>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              @click="save"
              color="success"
              dark
              depressed
            >
              Simpan
            </v-btn>
          </div>
        </v-form>

      </div>
    </div>
    <snackbar></snackbar>
  </div>
</template>

<script>
import { getData, editData } from '../../../../utils'

import Autocomplete from '../../../../components/Autocomplete'

export default {
  components: {
    Autocomplete
  },
  data: () => ({
    lingkungan: {
      nama_lingkungan: '',
      paroki_id: null,
      ketua_lingkungan_id: null,
    },
    paroki: {},
    keluarga: {},
    keluargaList: [],
  }),
  async mounted() {
    this.lingkungan = await getData(`/lingkungan/${this.$route.params.id}`)
    this.lingkungan = this.lingkungan[0]

    this.paroki = await getData(`/paroki/${this.lingkungan.paroki_id}`)
    this.paroki = this.paroki[0]

    this.keluargaList = await getData(`/keluarga`)
  },
  computed: {
    keluargaNameList() {
      return this.keluargaList.map(e => e.nama_keluarga)
    },
    keluargaKetuaLingkungan() {
      return this.keluargaList.filter(e => {
          return e.id === this.lingkungan.ketua_lingkungan_id ? e : null
        }
      )
    }
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
        let response = await editData('/lingkungan', this.$route.params.id, this.lingkungan)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil tersimpan!'
          this.$router.push('kelola-paroki')
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
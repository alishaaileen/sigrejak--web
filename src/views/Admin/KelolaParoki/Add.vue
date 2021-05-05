<template>
  <div>
    <h1 class="page-title">Tambah Paroki</h1>

    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-3 mx-auto" outlined>
        <v-form>
          <label>Nama paroki*</label>
          <v-text-field
            v-model="formData.nama_paroki"
            required
            outlined
            dense
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              type="submit"
              color="success"
              dark
              depressed
            >
              Tambah Paroki
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
    <snackbar></snackbar>
  </div>
</template>

<script>
import { postData } from '../../../utils'

export default {
  data: () => ({
    formData: {
      nama_paroki: '',
    },
  }),
  computed: {
    romoNameList: function () {
      return this.romoList.map(e => e.nama)
    },
  },
  methods: {
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await postData('/paroki/add', this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success'
          snackbar.text = 'Data berhasil ditambahkan!'
          
          this.$router.push('kelola-paroki')
        } else {
          snackbar.color = 'error',
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error'
        snackbar.text = error
        console.error = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    }
  }
}
</script>
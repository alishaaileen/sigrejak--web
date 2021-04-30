<template>
  <div>
    <h1 class="page-title">Tambah Keluarga</h1>

    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-3 mx-auto" outlined>
        <v-form>
          <label>Nama keluarga*</label>
          <v-text-field
            v-model="formData.nama_keluarga"
            required
            outlined
            dense
          ></v-text-field>

          <label>Username*</label>
          <v-text-field
            v-model="formData.username"
            required
            outlined
            dense
          ></v-text-field>

          <label>Email*</label>
          <v-text-field
            v-model="formData.email"
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
              Tambah Keluarga
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
    <snackbar></snackbar>
  </div>
</template>

<script>
import { randomPassword, postData } from '../../../utils'

export default {
  data: () => ({
    formData: {
      nama_keluarga: '',
      username: '',
      email: '',
      password: ''
    },
  }),
  methods: {
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      this.formData.password = randomPassword(6)

      try {
        let response = await postData('/keluarga/register', this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil ditambahkan!'
          this.$router.push('kelola-keluarga')
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
    },
  }
}
</script>
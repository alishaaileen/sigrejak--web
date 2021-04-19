<template>
  <div>
    <h1 class="page-title">Tambah Admin</h1>

    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-3 mx-auto" outlined>
        <v-form>
          <label>Nama*</label>
          <v-text-field
            v-model="formData.nama"
            required
            outlined
            dense
          ></v-text-field>

          <label>Email*</label>
          <v-text-field
            v-model="formData.nama_baptis"
            required
            outlined
            dense
          ></v-text-field>

          <label>Jabatan*</label>
          <v-select
            :items="[ 'Sekretariat', 'Romo', '' ]"
            v-model="formData.jenis_kelamin"
            outlined
            dense
          ></v-select>

          <label>Nomor telepon</label>
          <v-text-field
            v-model="formData.no_telp"
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
import { postData } from '../../../utils'

export default {
  data: () => ({
    formData: {
      nama: '',
      email: '',
      role: '',
      password: '',
    }
  }),
  methods: {
    async submit() {
      this.$store.dispatch('loading/openLoading')

      let snackbar = {}

      try {
        await postData('/admin/store', this.formData)

        snackbar.color = 'success'
        snackbar.text = 'Data berhasil ditambahkan!'
      } catch (error) {
        console.error(error)

        snackbar.color = 'error'
        snackbar.text = error
      }

      this.$store.dispatch('loading/closeLoading')
      this.$store.dispatch('snackbar/openSnackbar', snackbar)
    }
  }
}
</script>

<style>

</style>
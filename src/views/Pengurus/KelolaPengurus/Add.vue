<template>
  <div>
    <h1>Tambah Pengurus</h1>

    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-6 mx-auto" flat>
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
            v-model="formData.email"
            required
            outlined
            dense
          ></v-text-field>

          <label>Jabatan*</label>
          <v-select
            :items="[ 'Sekretariat', 'Romo' ]"
            v-model="formData.role"
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
import { postData } from '../../../utils'

export default {
  data: () => ({
    formData: {
      nama: '',
      email: '',
      role: null,
    }
  }),
  methods: {
    async submit() {
      this.$store.dispatch('loading/openLoading')
      let snackbar = {}

      if (this.formData.role === "Sekretariat") this.formData.role = 2;
      else if (this.formData.role === "Romo") this.formData.role = 4;

      try {
        let response = await postData('/admin/register', this.formData)
        
        if(response.status >= 200 && response.status < 300) {
          snackbar.color = 'success'
          snackbar.text = 'Data berhasil ditambahkan!'

          this.$router.push('/pengurus/pengurus')
        } else {
          snackbar.color = 'error'
          snackbar.text = 'Harap periksa kembali inputan anda!'
        }
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
<template>
  <div>
    <h2>Ubah Password</h2>
    <v-form class="my-3">
      <label>Password lama*</label>
      <v-text-field
        v-model="password.lama"
        :append-icon="showPasswordLama ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPasswordLama ? 'text' : 'password'"
        @click:append="showPasswordLama = !showPasswordLama"
        required
        outlined
        dense
      ></v-text-field>

      <label>Password baru*</label>
      <v-text-field
        v-model="password.baru"
        :append-icon="showPasswordBaru ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPasswordBaru ? 'text' : 'password'"
        @click:append="showPasswordBaru = !showPasswordBaru"
        required
        outlined
        dense
      ></v-text-field>

      <label>Ulangi password baru*</label>
      <v-text-field
        v-model="password.ulangBaru"
        :append-icon="showPasswordUlang ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPasswordUlang ? 'text' : 'password'"
        @click:append="showPasswordUlang = !showPasswordUlang"
        required
        outlined
        dense
        @input="errorPassBaru = password.baru === password.ulangBaru 
                ? null 
                :'password tidak sama'"
        :error-messages="errorPassBaru"
      ></v-text-field>

      <div class="d-flex justify-end">
        <v-btn
          class="btn text-none mt-2"
          color="blue accent-4"
          @click="ubahPassword"
          dark
          depressed
        >
          Simpan
        </v-btn>
      </div>
    </v-form>
    <snackbar/>
  </div>
</template>

<script>
import axios from 'axios'
import { API_URL } from '../../../constants'

export default {
  data: () => ({
    showPasswordLama: false,
    showPasswordBaru: false,
    showPasswordUlang: false,
    password: {
      id: null,
      lama: '',
      baru: '',
      ulangBaru: '',
    },
    errorPassBaru: '',
  }),
  methods: {
    async ubahPassword() {
      let snackbar = {}
      if (!this.errorPassBaru) {
        this.password.id = this.$store.state.pengurus.id
        
        try {
          let response = await axios.post(`${API_URL}/admin/change-pw`, this.password)
          
          if (response.status >= 200 && response.status < 300) {
            this.password = {}
            snackbar.color = 'success',
            snackbar.text = 'Password berhasil diubah!'
          }
        }catch(e) {
          if (e.response.status === 400){
            snackbar.color = 'error',
            snackbar.text = 'Password lama salah'
          } else {
            snackbar.color = 'error',
            snackbar.text = 'Terjadi kesalahan. Harap ulangi'
          }
        }
      } else {
        snackbar.color = 'error',
        snackbar.text = 'Password baru tidak sama'
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    }
  }
}
</script>

<style>

</style>
<template>
  <div id="login" class="login-keluarga d-flex align-center justify-center">
    <v-card class="login-form-box mx-auto" width="500" outlined elevation="5">
      <h1>Lupa Password</h1>

      <v-form @submit.prevent="login">
        <v-text-field
          placeholder="Email"
          v-model="user.username"
          append-icon="mdi-account"
          @input="resetErrorMsg"
        >
        </v-text-field>

        <small v-show="errorMsg" class="error--text font-weight-medium">
          {{ errorMsg }}
        </small>


        <v-card-actions>
          <v-btn
            color="#20A2BA"
            rounded
            block
            large
            dark
            type="submit"
            @click="login"
            >Kirim email</v-btn
          >
        </v-card-actions>
        <div>
          <small><a href="">Lupa password?</a></small>
        </div>
      </v-form>
    </v-card>

    <loading-overlay></loading-overlay>
  </div>
</template>

<script>
import axios from 'axios'
import { API_URL } from '../../constants'

export default {
  data() {
    return {
      showPassword: false,
      user: {
        username: '',
        password: '',
      },
      errorMsg: null,
    }
  },
  methods: {
    async login() {
      this.$store.dispatch('loading/openLoading')

      try {
        let response = await axios.post(`${API_URL}/keluarga/login`, this.user)

        this.$store.dispatch('keluarga/login', response.data)
        this.$router.push("/keluarga/dashboard");
      } catch (error) {
        if(error.response.status >= 400 && error.response.status < 500 ) {
          this.errorMsg = "Username atau Password salah"
        }
      }
      this.$store.dispatch('loading/closeLoading')
    },
    resetErrorMsg() {
      this.errorMsg = null
    }
  }
}
</script>

<style>

</style>
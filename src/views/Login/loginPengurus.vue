<template>
  <div id="login" class="login-pengurus">
    <div class="d-flex align-stretch justify-start">
      <v-card
        class="side-login"
        width="500"
        outlined
        elevation="5"
        tile
        height="100%"
      >
        <div class="d-flex align-center">
          <div class="mx-auto">
            <h1 class="mb-10">Masuk Akun Pengurus</h1>

            <v-form @submit.prevent="login">
              <v-text-field
                placeholder="Email"
                v-model="pengurus.email"
                @input="resetErrorMsg"
                outlined
              ></v-text-field>

              <v-text-field
                placeholder="Password"
                v-model="pengurus.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                @input="resetErrorMsg"
                :error-messages="errorMsg"
                outlined
              ></v-text-field>

              <!-- <small v-show="errorMsg" class="error--text font-weight-medium">
                {{ errorMsg }}
              </small> -->

              <v-card-actions>
                <v-btn
                  color="blue accent-4"
                  rounded
                  block
                  large
                  dark
                  type="submit"
                  @click="login"
                  >Masuk</v-btn
                >
              </v-card-actions>
              <div class="text-center mt-3">
                <small><a href="">Lupa password?</a></small>
              </div>
            </v-form>
          </div>
        </div>
      </v-card>
    </div>
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
      pengurus: {
        email: '',
        password: '',
      },
      errorMsg: null,
    }
  },
  methods: {
    async login() {
      this.$store.dispatch('loading/openLoading')

      try {
        let response = await axios.post(`${API_URL}/admin/login`, this.pengurus)

        this.$store.dispatch('pengurus/login', response.data)
        this.$router.push("/pengurus/dashboard");
      } catch (error) {
        if(error.response.status >= 400 && error.response.status < 500 ) {
          this.errorMsg = "Email atau Password salah"
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
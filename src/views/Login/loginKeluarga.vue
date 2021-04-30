<template>
  <div id="login" class="d-flex align-center justify-center">
    <v-card class="login-form-box mx-auto" width="600" outlined>
      <h1>Masuk Akun Keluarga</h1>

      <v-form @submit.prevent="login">
        <v-text-field
          placeholder="Username"
          v-model="user.username"
          append-icon="mdi-account"
          @input="resetErrorMsg"
        >
        </v-text-field>

        <v-text-field
          placeholder="Password"
          v-model="user.password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
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
            >Masuk</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>

    <loading-overlay></loading-overlay>
  </div>
</template>

<script>
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
    login() {
      this.$store.dispatch('loading/openLoading')

      this.$store.dispatch('keluarga/login', {
        username: this.user.username,
        password: this.user.password
      }).then((res) => {
        if(res === 400) {
          this.errorMsg = "Username atau Password salah"
        } else if (res === 422) {
          this.errorMsg = "Harap isi Username dan Password dengan benar"
        } else if (res === 200) {
          this.$router.push("/keluarga/dashboard");
        }
      }).catch((error) => {
        console.error(error)
      })

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
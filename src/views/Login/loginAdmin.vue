<template>
  <div id="login" class="d-flex align-center justify-center">
    <v-card class="login-form-box mx-auto" width="600" outlined>
      <h1>Masuk Admin</h1>

      <v-form @submit.prevent="login">
        <v-text-field
          placeholder="Email"
          v-model="admin.email"
          append-icon="mdi-account"
        >
        </v-text-field>

        <v-text-field
          placeholder="Password"
          v-model="admin.password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
        >
        </v-text-field>

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
      admin: {
        email: '',
        password: '',
      },
    }
  },
  created() {

  },
  methods: {
    async login() {
      this.$store.dispatch('loading/openLoading')
      
      this.$store.dispatch('admin/login', {
        email: this.admin.email,
        password: this.admin.password
      }).then(() => {
        this.$router.push("/admin/dashboard");
      }).catch((error) => {
        console.error(error)
      })

      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>

<style>

</style>
<template>
  <v-row justify="center">
    <v-dialog
      v-model="isModalActive"
      max-width="500px"
      @click:outside="close"
    >
      <v-card class="pa-3">
        <v-card-title class="mb-5">
          <h2>Password</h2>
        </v-card-title>
        <v-card-text>
          <p>
            Password: <b>{{ password }}</b>
            <br><br>
            Pesan ini akan hilang. Harap segera berikan password ke pengguna.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-none"
            color="error"
            depressed
            @click="close"
          >
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    isModalActive: Boolean,
    password: String
  },
  methods: {
    close() {
      this.$emit('close')
    },
  }
}
</script>

<style>

</style>
<template>
  <div class="text-center ma-2">
    <v-snackbar
      app
      top
      right
      :color="snackbar.color"
      v-model="snackbar.active"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="close"
        >
          OK
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    snackbar: 'snackbar'
  }),
  methods: {
    close() {
      this.$store.commit('snackbar/resetSnackbar')
    }
  }
}
</script>

<style>

</style>
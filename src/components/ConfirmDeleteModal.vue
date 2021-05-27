<template>
  <v-row justify="center">
    <v-dialog
      v-model="del.active"
      max-width="500px"
      @click:outside="action(false)"
    >
      <v-card class="pa-3">
        <v-card-title class="mb-5">
          <h2>Hapus data?</h2>
        </v-card-title>
        <v-card-text>
          <p>
            Data anda akan terhapus
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-none"
            color="grey darken-1"
            text
            @click="action(false)"
          >
            Batal
          </v-btn>
          <v-btn
            class="text-none"
            color="error"
            depressed
            @click="action(true)"
          >
            Hapus
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    del: 'deleteData',
  }),
  methods: {
    action(decision) {
      this.$emit('confirmDelete', decision)
    },
  }

}
</script>

<style>

</style>
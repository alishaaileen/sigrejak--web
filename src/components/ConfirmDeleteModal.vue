<template>
  <v-row justify="center">
    <v-dialog
      v-model="del.active"
      max-width="500px"
      @click:outside="action(false)"
    >
      <v-card>
        <v-card-title class="text-h4">
          Apakah anda yakin?
        </v-card-title>
        <v-card-text>
          Apakah anda yakin akan menghapus data?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="action(false)"
          >
            Batal
          </v-btn>
          <v-btn
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
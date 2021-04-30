<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Pilih Anggota Keluarga</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  :items="nameOfFamilyMembers"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { getData } from '../utils'

export default {
  data: () => ({
    dialog: false,
    familyMembers: [],
  }),
  async mounted() {
    this.familyMembers = await getData(`/keluarga/anggota/${this.$store.state.keluarga.id}`)
  },
  computed: {
    nameOfFamilyMembers() {
      return this.familyMembers.map(e => e.nama)
    }
  }
}
</script>
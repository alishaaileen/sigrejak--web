<template>
  <div>
    <h2>Informasi Akun</h2>

    <v-form class="my-3">
      <label>Jenis akun</label>
      <div>
        <v-chip
          class="mb-6 mt-2"
          :color="profile.lingkunganId != null ? `indigo accent-2` : `blue lighten-2`"
          text-color="white"
        >
          <span v-if="profile.lingkunganId" class="color-white">Ketua Lingkungan</span>
          <span v-else class="color-white">Keluarga</span>
        </v-chip>
      </div>

      <label>Nama keluarga</label>
      <v-text-field
        v-model="profile.nama_keluarga"
        required
        outlined
        dense
      ></v-text-field>

      <label>Nama kepala keluarga</label>
      <v-text-field
        v-model="profile.nama_kepala_keluarga"
        required
        outlined
        dense
      ></v-text-field>

      <label>Nomor telepon/HP kepala keluarga</label>
      <v-text-field
        v-model="profile.no_telp_kepala_keluarga"
        required
        outlined
        dense
      ></v-text-field>

      <label>Username</label>
      <v-text-field
        v-model="profile.username"
        required
        outlined
        dense
      ></v-text-field>

      <label>Email</label>
      <v-text-field
        v-model="profile.email"
        required
        outlined
        dense
      ></v-text-field>

      <div class="d-flex justify-end">
        <v-btn
          class="btn text-none mt-2"
          color="blue accent-4"
          @click="editProfile"
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
import { getData, editData } from '../../../utils'

export default {
  data: () => ({
    profile: {
      nama_keluarga: '',
      nama_kepala_keluarga: '',
      no_telp_kepala_keluarga: '',
      lingkunganId: null,
      username: '',
      email: '',
    },
  }),
  async created() {
    this.profile = await getData(`/keluarga/${this.$store.state.keluarga.id}`)
    this.profile = this.profile[0]
    this.profile.lingkunganId = this.$store.state.keluarga.lingkunganId
  },
  methods: {
    async editProfile() {
      let snackbar ={}
      
      try {
        let response = await editData(`/keluarga`, this.$store.state.keluarga.id, this.profile)
        
        if (response.status >= 200 && response.status < 300) {
          // this.profile = await getData(`/keluarga/${this.$store.state.keluarga.id}`)
          // this.profile = this.profile[0]
          this.$store.dispatch('keluarga/getUserProfile')
          console.log(this.$store.state.keluarga)
          snackbar.color = 'success',
          snackbar.text = 'Profile keluarga berhasil diubah!'
        } else {
          snackbar.color = 'error',
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      }catch(e) {
        snackbar.color = 'error',
        snackbar.text = 'Harap periksa kembali inputan anda'
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    }
  }
}
</script>

<style>

</style>
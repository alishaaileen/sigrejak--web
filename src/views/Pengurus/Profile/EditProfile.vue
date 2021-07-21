<template>
  <div>
    <h2>Informasi Akun</h2>

    <v-form class="my-3">
      <label>Jenis akun</label>
      <div>
        <v-chip
          class="mb-6 mt-2"
          :color="getRoleColor(profile.role)"
          text-color="white"
        >
          <span v-if="profile.role === 1" class="color-white">Super Admin</span>
          <span v-else-if="profile.role === 2" class="color-white">Sekretariat</span>
          <span v-else class="color-white">Romo</span>
        </v-chip>
      </div>

      <label>Nama</label>
      <v-text-field
        v-model="profile.nama"
        required
        outlined
        dense
      ></v-text-field>

      <label>E-mail</label>
      <v-text-field
        v-model="profile.email"
        required
        outlined
        dense
      ></v-text-field>

      <label>No. telepon</label>
      <v-text-field
        v-model="profile.no_telp"
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
      nama: '',
      email: '',
      role: '',
      no_telp: '',
    },
  }),
  async mounted() {
    this.profile = await getData(`/admin/${this.$store.state.pengurus.id}`)
    this.profile = this.profile[0]
    this.profile.lingkunganId = this.$store.state.pengurus.lingkunganId
  },
  methods: {
    getRoleColor(role) {
      if (role === 1) return "indigo"
      else if (role === 2) return "cyan"
      else if (role === 3) return "light-blue"
    },
    async editProfile() {
      let snackbar ={}
      
      try {
        let response = await editData(`/admin`, this.$store.state.pengurus.id, this.profile)
        
        if (response.status >= 200 && response.status < 300) {
          // this.profile = await getData(`/admin/${this.$store.state.pengurus.id}`)
          // this.profile = this.profile[0]
          this.$store.dispatch('pengurus/getPengurusProfile')
          snackbar.color = 'success',
          snackbar.text = 'Profile berhasil diubah!'
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
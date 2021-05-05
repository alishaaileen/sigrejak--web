<template>
  <div>
    <h1 class="page-title">Detail Admin</h1>

    <div class="form mt-5">
      <v-form>
        <label>Nama*</label>
        <v-text-field
          v-model="admin.nama"
          required
          outlined
          dense
        ></v-text-field>

        <label>Email*</label>
        <v-text-field
          v-model="admin.email"
          required
          outlined
          dense
        ></v-text-field>

        <label>Jabatan*</label>
        <v-select
          :items="[ 'Sekretariat', 'Romo', 'Super Admin' ]"
          v-model="admin.role"
          outlined
          dense
        ></v-select>

        <label>Nomor telepon</label>
        <v-text-field
          v-model="admin.no_telp"
          required
          outlined
          dense
        ></v-text-field>

        <div class="d-flex justify-end">
          <v-btn
            class="btn text-none"
            @click="save"
            color="success"
            dark
            depressed
          >
            Tambah anggota
          </v-btn>
        </div>
      </v-form>
    </div>

    <snackbar></snackbar>
  </div>
</template>

<script>
import { getData, editData } from '../../../utils'

export default {
  data: () => ({
    admin: {
      nama: '',
      email: '',
      role: null,
      no_telp: '',
    }
  }),
  async mounted() {
    this.admin = await getData(`/admin/${this.$route.params.id}`)
    this.admin = this.admin[0]

    if (this.admin.role === 1) this.admin.role = "Super Admin";
    else if (this.admin.role === 2) this.admin.role = "Sekretariat";
    else if (this.admin.role === 3) this.admin.role = "Romo";
  },
  methods: {
    async save() {
      this.$store.dispatch('loading/openLoading')
      let snackbar = {}

      if (this.admin.role === "Super Admin") this.admin.role = 1;
      else if (this.admin.role === "Sekretariat") this.admin.role = 2;
      else if (this.admin.role === "Romo") this.admin.role = 3;

      try {
        let response = await editData('/admin', this.$route.params.id, this.admin)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil tersimpan!'
          this.$router.push('/admin/kelola-admin')
        } else {
          snackbar.color = 'error'
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error'
        snackbar.text = error

        console.error = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>
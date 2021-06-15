<template>
  <div>
    <btn-kembali path="/pengurus/pengurus" />
    <h1>Detail Pengurus</h1>

    <div class="form mt-5">
      <v-card class="pa-6 mx-auto" flat>
        <v-form>
          <label>Nama*</label>
          <v-text-field
            v-model="pengurus.nama"
            required
            outlined
            dense
          ></v-text-field>

          <label>Email*</label>
          <v-text-field
            v-model="pengurus.email"
            required
            outlined
            dense
          ></v-text-field>

          <label>Jabatan*</label>
          <p>{{ pengurus.role }}</p>

          <label>Nomor telepon</label>
          <v-text-field
            v-model="pengurus.no_telp"
            required
            outlined
            dense
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              @click="save"
              color="blue accent-4"
              dark
              depressed
            >
              Simpan
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>

    <snackbar></snackbar>
  </div>
</template>

<script>
import { getData, editData } from '../../../utils'

export default {
  data: () => ({
    pengurus: {
      nama: '',
      email: '',
      role: null,
      no_telp: '',
    }
  }),
  async mounted() {
    this.pengurus = await getData(`/admin/${this.$route.params.id}`)
    this.pengurus = this.pengurus[0]

    // Ubah Role dari angka jadi kata-kata
    if (this.pengurus.role === 1) this.pengurus.role = "Super Admin";
    else if (this.pengurus.role === 2) this.pengurus.role = "Sekretariat";
    else if (this.pengurus.role === 3) this.pengurus.role = "Romo Paroki";
    else if (this.pengurus.role === 4) this.pengurus.role = "Romo";
  },
  methods: {
    async save() {
      this.$store.dispatch('loading/openLoading')
      let snackbar = {}

      // Ubah role kata-kata jadi angka
      if (this.pengurus.role === "Super Admin") this.pengurus.role = 1;
      else if (this.pengurus.role === "Sekretariat") this.pengurus.role = 2;
      else if (this.pengurus.role === "Romo Paroki") this.pengurus.role = 3;
      else if (this.pengurus.role === "Romo") this.pengurus.role = 4;

      try {
        let response = await editData('/admin', this.$route.params.id, this.pengurus)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil tersimpan!'
          this.$router.push('/pengurus/pengurus')
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
<template>
  <div>
    <h1>Detail Pengurus</h1>

    <div class="form mt-5">
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
        <v-select
          :items="[ 'Sekretariat', 'Romo', 'Super Pengurus' ]"
          v-model="pengurus.role"
          outlined
          dense
        ></v-select>

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
            color="indigo accent-4"
            dark
            depressed
          >
            Simpan
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
    pengurus: {
      nama: '',
      email: '',
      role: null,
      no_telp: '',
    }
  }),
  async mounted() {
    this.pengurus = await getData(`/pengurus/${this.$route.params.id}`)
    this.pengurus = this.pengurus[0]

    if (this.pengurus.role === 1) this.pengurus.role = "Super Pengurus";
    else if (this.pengurus.role === 2) this.pengurus.role = "Sekretariat";
    else if (this.pengurus.role === 3) this.pengurus.role = "Romo";
  },
  methods: {
    async save() {
      this.$store.dispatch('loading/openLoading')
      let snackbar = {}

      if (this.pengurus.role === "Super Pengurus") this.pengurus.role = 1;
      else if (this.pengurus.role === "Sekretariat") this.pengurus.role = 2;
      else if (this.pengurus.role === "Romo") this.pengurus.role = 3;

      try {
        let response = await editData('/pengurus', this.$route.params.id, this.pengurus)

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
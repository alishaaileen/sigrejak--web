<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat/surat-keterangan" />
    
    <h1 class="mb-5">Detail Surat Keterangan</h1>

    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <h3>Detail Informasi</h3>
            <v-spacer></v-spacer>
            <v-btn
              class="btn text-none mr-3"
              color="yellow accent-4"
              dark
              depressed
              rounded
            >
              <v-icon small>mdi-chat</v-icon>
              Chat
            </v-btn>

            <v-btn
              class="btn text-none"
              color="blue accent-4"
              dark
              rounded
              depressed
              v-if="data.ketua_lingkungan_approval === 0"
              @click="verify"
            >
              Verifikasi
            </v-btn>
            <v-chip
              v-if="data.ketua_lingkungan_approval === 1"
              :color="data.ketua_lingkungan_approval === 1 ? 'green' : 'grey lighten-2'"
            >
              <span class="color-white">
                Terverifikasi
              </span>
            </v-chip>

          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <h3 class="mb-5">Informasi Surat</h3>
            <label>No. surat</label>
            <p>{{ data.no_surat }}</p>

            <label>Tanggal surat</label>
            <p>{{ data.created_at }}</p>

            <v-divider class="mb-5"></v-divider>

            <h3 class="mb-5">Informasi Umat</h3>

            <label>Nama</label>
            <p>{{ data.nama }}</p>

            <label>Tempat, tanggal lahir</label>
            <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>

            <label>Alamat</label>
            <p>{{ data.alamat }}</p>

            <label>Pendidikan</label>
            <p>{{ data.pendidikan }}</p>

            <label>Pekerjaan</label>
            <p>{{ data.pekerjaan }}</p>

            <v-divider class="mb-5"></v-divider>

            <h3 class="mb-5">Informasi Orang Tua</h3>

            <label>Nama orang tua</label>
            <p>{{ data.nama_ortu }}</p>

            <label>Alamat orang tua</label>
            <p>{{ data.alamat_ortu }}</p>

            <v-divider class="mb-5"></v-divider>

            <h3 class="mb-5">Keperluan</h3>

            <label>Keperluan</label>
            <p>{{ data.keperluan }}</p>
          </v-card-text>
        </v-card>    
      </v-col>
    </v-row>
    <snackbar />
  </div>
</template>

<script>
import { getOneData, editData } from '../../../../utils'

export default {
  data: () => ({
    url: '/surat-keterangan',
    data: {},
    textChat: '',
    isAlertOrtuActive: false,
  }),
  async mounted() {
    this.data = await getOneData(`${this.url}/${this.$route.params.id}`)
  },
  computed: {
    isVerifyDisabled() {
      return this.data.ketua_lingkungan_approval ? true : false
    }
  },
  methods: {
    async verify() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      this.data.ketua_lingkungan_approval = 1
      this.data.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga

      try {
        let response = await editData('/surat-keterangan', this.data.id, this.data)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil diverifikasi!'
          this.data = await getOneData(`/surat-keterangan/${this.$route.params.id}`)
        } else {
          snackbar.color = 'error',
          snackbar.text = 'Terjadi kesalahan! Mohon coba lagi'
        }
      } catch (error) {
        snackbar.color = 'error',
        snackbar.text = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>

<style>

</style>
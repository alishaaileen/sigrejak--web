<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat/surat-keterangan-beasiswa" />
    
    <h1 class="mb-5">Detail Surat Keterangan Beasiswa</h1>

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
            <div class="mb-15">
              <h2 class="mb-5">Informasi Siswa</h2>
              <v-divider class="mb-5"></v-divider>

              <label>No. surat</label>
              <p>{{ data.no_surat }}</p>

              <label>Tanggal surat</label>
              <p>{{ data.created_at }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Umat</h2>

              <v-divider class="mb-5"></v-divider>

              <label>Nama</label>
              <p>{{ data.nama }}</p>

              <label>Tempat, tanggal lahir</label>
              <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>

              <label>Alamat</label>
              <p>{{ data.alamat }}</p>

              <label>No. telepon</label>
              <p>{{ data.no_telp }}</p>

              <label>Sekolah/kelas</label>
              <p>{{ data.sekolah }} / {{ data.kelas }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Orang Tua</h2>
              
              <v-divider class="mb-5"></v-divider>

              <label>Nama orang tua</label>
              <p>{{ data.nama_ortu }}</p>

              <label>Nomor telepon</label>
              <p>{{ data.no_telp_ortu }}</p>

              <label>Alamat</label>
              <p>{{ data.alamat_ortu }}</p>
            </div>

            <h2 class="mb-5">Keterangan Beasiswa</h2>
            
            <v-divider class="mb-5"></v-divider>

            <label>Status beasiswa</label>
            <p>{{ data.status_beasiswa }}</p>

            <label>Permohonan</label>
            <p>{{ data.permohonan }}</p>

            <label>File syarat beasiswa</label>
            <div class="mt-1">
              <v-btn
                class="text-none"
                outlined
                small
                color="blue"
                @click="downloadFile(data.file_syarat_beasiswa)"
              >
                klik untuk melihat file
              </v-btn>
            </div>
          </v-card-text>
        </v-card>    
      </v-col>
    </v-row>
    <snackbar />
  </div>
</template>

<script>
import { getOneData } from '../../../../utils'
import { verifySurat } from '../../../../utils/pengurus'
import { API_URL } from '../../../../constants'

export default {
  data: () => ({
    url: '/surat-keterangan-beasiswa',
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
    async downloadFile(fileName) {
      window.open(`${API_URL}/files/${fileName}`, '_blank')
    },
    async verify() {
      let snackbar
      
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      this.data.ketua_lingkungan_approval = 1
      this.data.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
      snackbar = await verifySurat(this.url, this.data.id, this.data)

      if (snackbar.color === 'success') {
        this.$router.push('/keluarga/ketua/surat/surat-keterangan-beasiswa')
      }

      this.data = await getOneData(`${this.url}/${this.$route.params.id}`)

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>

<style>

</style>
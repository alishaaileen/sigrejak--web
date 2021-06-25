<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat/surat-komuni-penguatan" />
    
    <h1 class="mb-5">Detail Surat {{ tempJenisSurat }}</h1>

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
              <h2 class="mb-5">Informasi Surat</h2>
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

              <label>Nama baptis</label>
              <p>{{ data.nama_baptis }}</p>

              <label>Paroki tempat baptis</label>
              <p>{{ data.paroki_baptis }}</p>

              <label>Tanggal baptis</label>
              <p>{{ data.tgl_baptis }}</p>

              <label>No. surat baptis</label>
              <p>{{ data.no_surat_baptis }}</p>

              <label>Alamat</label>
              <p>{{ data.alamat }}</p>

              <label>No. telepon/HP</label>
              <p>{{ data.no_telp }}</p>

              <label>Nama sekolah/kelas</label>
              <p>{{ data.sekolah }} / {{ data.kelas }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Orang Tua</h2>
              
              <v-divider class="mb-5"></v-divider>

              <label>Nama ayah</label>
              <p>{{ data.nama_ayah }}</p>
              
              <label>Nama ibu</label>
              <p>{{ data.nama_ibu }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Wali Penguatan</h2>
              
              <v-divider class="mb-5"></v-divider>

              <label>Nama Santo/a pelindung</label>
              <p>{{ data.nama_pelindung }}</p>

              <label>Nama wali penguatan</label>
              <p>{{ data.nama_wali_penguatan }}</p>

              <label>Tanggal krisma wali</label>
              <p>{{ data.tgl_krisma_wali }}</p>
            </div>

            <h2 class="mb-5">Syarat-syarat</h2>
            
            <v-divider class="mb-5"></v-divider>

            <label>Akta lahir</label>
            <div class="mb-5">
              <v-btn
                class="text-none"
                outlined
                color="blue"
                @click="openCloseModal(true)"
              >
                Lihat akta lahir
              </v-btn>
            </div>

            <label>Surat nikah sipil & gereja dan Surat baptis terbaru Emban/Wali</label>
            <div class="mt-1">
              <v-btn
                class="text-none"
                outlined
                color="blue"
                @click="downloadFile(data.file_syarat)"
              >
                Klik untuk melihat file
              </v-btn>
            </div>
          </v-card-text>
        </v-card>    
      </v-col>
    </v-row>

    <dialog-image
      :isDialogActive="isImageCardActive"
      :imageSrc="displayGambarAkta"
      @close="openCloseModal"
    ></dialog-image>

    <snackbar />
  </div>
</template>

<script>
import { getOneData } from '../../../../utils'
import { verifySurat } from '../../../../utils/pengurus'
import { API_URL } from '../../../../constants'
import DialogImage from '../../../../components/DialogImage.vue'

export default {
  components: {
    DialogImage,
  },
  data: () => ({
    url: '/surat-komuni-penguatan',
    data: {},
    tempJenisSurat: '',
    displayGambarAkta: null,
    isImageCardActive: false,
  }),
  async mounted() {
    this.data = await getOneData(`${this.url}/${this.$route.params.id}`)

    this.tempJenisSurat = (this.data.jenis_surat === 1 ? 'Komuni I' : 'Penguatan')

    this.getImage(this.data.file_akta_lahir)
  },
  computed: {
    isVerifyDisabled() {
      return this.data.ketua_lingkungan_approval ? true : false
    }
  },
  methods: {
    openCloseModal(bool) {
      this.isImageCardActive = bool
    },
    async getImage(endpoint) {
      this.displayGambarAkta = `${API_URL}/files/${endpoint}`
    },
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
        this.$router.push('/keluarga/ketua/surat/surat-komuni-penguatan')
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
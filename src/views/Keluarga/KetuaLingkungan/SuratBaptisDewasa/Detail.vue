<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat/surat-baptis-dewasa" />
    
    <h1 class="mb-5">Detail Surat Baptis Dewasa</h1>

    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <h3>Detail Informasi</h3>
            <v-spacer></v-spacer>
            <button-chat
              :countChatUnread="countChatUnread"
              :chatPageUrl="`/keluarga/ketua/surat/surat-baptis-dewasa/chat/${data.id}`"
              :detailPageUrl="`/keluarga/ketua/surat/surat-baptis-dewasa/detail/${data.id}`"
              :endpointUrl="url"
            ></button-chat>
            <v-chip
              v-if="data.ketua_lingkungan_approval === 1"
              :color="data.ketua_lingkungan_approval === 1 ? 'green' : 'grey lighten-2'"
              class="ml-2"
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
              <h2 class="mb-5">Informasi Siswa</h2>

              <v-divider class="mb-5"></v-divider>

              <label>Nama</label>
              <p>{{ data.nama }}</p>

              <label>Tempat, tanggal lahir</label>
              <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>

              <label>Nama baptis</label>
              <p>{{ data.nama_baptis }}</p>

              <label>Alamat</label>
              <p>{{ data.alamat }}</p>

              <label>No. telepon</label>
              <p>{{ data.no_telp }}</p>

              <label>Nama ayah</label>
              <p>{{ data.nama_ayah }}</p>
              
              <label>Nama ibu</label>
              <p>{{ data.nama_ibu }}</p>

              <label>Status perkawinan</label>
              <p>{{ data.status_perkawinan }}</p>

              <div v-if="data.status_perkawinan === 'Akan menikah'">
                <label>Akan menikah dengan</label>
                <p>{{ data.calon_pasangan }}</p>

                <label>Tanggal menikah</label>
                <p>{{ data.tgl_menikah_calon }}</p>
              </div>

              <div v-if="data.status_perkawinan === 'Sudah menikah'">
                <label>Cara menikah</label>
                <p>{{ data.cara_menikah }}</p>

                <label>Tempat menikah</label>
                <p>{{ data.tempat_menikah }}</p>

                <label>Tanggal menikah</label>
                <p>{{ data.tgl_menikah }}</p>

                <div v-if="data.pembatalan_perkawinan">
                  <label>Alasan pembatalan perkawinan</label>
                  <p>{{ data.pembatalan_perkawinan }}</p>
                </div>
              </div>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Wali Baptis</h2>
              
              <v-divider class="mb-5"></v-divider>

              <label>Nama</label>
              <p>{{ data.nama_wali }}</p>

              <label>Tanggal krisma</label>
              <p>{{ data.tgl_krisma_wali }}</p>

              <label>Tempat krisma</label>
              <p>{{ data.tempat_krisma_wali }}</p>
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
                @click="downloadFile(data.file_syarat_baptis)"
              >
                Klik untuk melihat file
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions v-if="data.ketua_lingkungan_approval === 0" class="py-3 px-5">
            <v-spacer></v-spacer>
            <v-btn
              class="btn text-none"
              color="blue accent-4"
              dark
              depressed
              v-if="data.ketua_lingkungan_approval === 0"
              @click="verify"
            >
              Verifikasi
            </v-btn>
          </v-card-actions>
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
import { getOneData, changeDateFormat } from '../../../../utils'
import { verifySurat } from '../../../../utils/pengurus'
import { API_URL } from '../../../../constants'
import DialogImage from '../../../../components/DialogImage.vue'
import ButtonChat from '../../../../components/ButtonChat.vue'

export default {
  components: {
    DialogImage,
    ButtonChat,
  },
  data: () => ({
    url: '/surat-baptis-dewasa',
    data: {},
    displayGambarAkta: null,
    isImageCardActive: false,
    countChatUnread: 0,
  }),
  async mounted() {
    this.data = await getOneData(`${this.url}/${this.$route.params.id}`)
    this.data.tgl_lahir = changeDateFormat(this.data.tgl_lahir)

    this.getImage(this.data.file_akta_lahir)

    // Get jumlah chat yg belum read
    this.countChatUnread = await getOneData(`/chat/count-unread/${this.$route.params.id}`)
    this.countChatUnread = this.countChatUnread.count_unread
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

      this.data.role = 'ketua lingkungan'
      this.data.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
      snackbar = await verifySurat(this.url, this.data.id, this.data)

      if (snackbar.color === 'success') {
        this.$router.push('/keluarga/ketua/surat/surat-baptis-dewasa')
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>

<style>

</style>
<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat/surat-keterangan-calon-pengantin" />
    
    <h1 class="mb-5">Detail Surat Keterangan Calon Pengantin</h1>

    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <h3>Detail Informasi</h3>
            <v-spacer></v-spacer>
            <button-chat
              :countChatUnread="countChatUnread"
              :chatPageUrl="`/keluarga/ketua/surat/surat-keterangan-calon-pengantin/chat/${data.id}`"
              :detailPageUrl="`/keluarga/ketua/surat/surat-keterangan-calon-pengantin/detail/${data.id}`"
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

              <label>Pekerjaan</label>
              <p>{{ data.pekerjaan }}</p>

              <label>Agama</label>
              <p>Katolik</p>

              <label>Nama ayah</label>
              <p>{{ data.nama_ayah }}</p>

              <label>Nama ibu</label>
              <p>{{ data.nama_ibu }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Pasangan</h2>
              
              <v-divider class="mb-5"></v-divider>

              <label>Nama</label>
              <p>{{ data.nama_pasangan }}</p>

              <label>Tempat, tanggal lahir</label>
              <p>{{ `${data.tempat_lahir_pasangan}, ${data.tgl_lahir_pasangan}` }}</p>

              <label>Alamat</label>
              <p>{{ data.alamat_pasangan }}</p>

              <label>No. telepon</label>
              <p>{{ data.no_telp_pasangan }}</p>

              <label>Pekerjaan</label>
              <p>{{ data.pekerjaan_pasangan }}</p>

              <label>Agama</label>
              <p>{{ data.agama_pasangan }}</p>

              <label>Nama ayah</label>
              <p>{{ data.nama_ayah_pasangan }}</p>

              <label>Nama ibu</label>
              <p>{{ data.nama_ibu_pasangan }}</p>
            </div>

            <h2 class="mb-5">Syarat-syarat</h2>
            
            <v-divider class="mb-5"></v-divider>

            <label>File syarat</label>
            <div class="mt-1">
              <v-btn
                class="text-none"
                outlined
                small
                color="blue"
                @click="downloadFile(data.file_syarat)"
              >
                klik untuk melihat file
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
    <snackbar />
  </div>
</template>

<script>
import { getOneData, changeDateFormat } from '@/utils'
import { verifySurat } from '@/utils/pengurus'
import { API_URL } from '@/constants'
import ButtonChat from '@/components/ButtonChat.vue'

export default {
  components: {
    ButtonChat,
  },
  data: () => ({
    url: '/surat-keterangan-calon-pengantin',
    data: {},
    textChat: '',
    countChatUnread: 0,
  }),
  async mounted() {
    this.data = await getOneData(`${this.url}/${this.$route.params.id}`)
    this.data.tgl_lahir = changeDateFormat(this.data.tgl_lahir)

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
        this.$router.push('/keluarga/ketua/surat/surat-keterangan-calon-pengantin')
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
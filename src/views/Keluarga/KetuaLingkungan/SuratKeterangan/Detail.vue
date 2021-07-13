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
            <button-chat
              :countChatUnread="countChatUnread"
              :chatPageUrl="`/keluarga/ketua/surat/surat-keterangan/chat/${data.id}`"
              :detailPageUrl="`/keluarga/ketua/surat/surat-keterangan/detail/${data.id}`"
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

              <label>Keperluan</label>
              <p>{{ data.keperluan }}</p>
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

              <label>Pendidikan</label>
              <p>{{ data.pendidikan }}</p>

              <label>Pekerjaan</label>
              <p>{{ data.pekerjaan }}</p>
            </div>

            <h2 class="mb-5">Informasi Orang Tua</h2>
            
            <v-divider class="mb-5"></v-divider>

            <label>Nama orang tua</label>
            <p>{{ data.nama_ortu }}</p>

            <label>Alamat orang tua</label>
            <p>{{ data.alamat_ortu }}</p>
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
import { getOneData, changeDateFormat } from '../../../../utils'
import { verifySurat } from '../../../../utils/pengurus'
import ButtonChat from '../../../../components/ButtonChat.vue'

export default {
  components: {
    ButtonChat,
  },
  data: () => ({
    url: '/surat-keterangan',
    data: {},
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
    async verify() {
      let snackbar
      
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      this.data.role = 'ketua lingkungan'
      this.data.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
      snackbar = await verifySurat(this.url, this.data.id, this.data)

      if (snackbar.color === 'success') {
        this.$router.push('/keluarga/ketua/surat/surat-keterangan')
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
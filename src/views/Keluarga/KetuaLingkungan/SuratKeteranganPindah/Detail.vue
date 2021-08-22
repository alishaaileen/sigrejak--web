<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat/surat-keterangan-pindah" />
    
    <h1 class="mb-5">Detail Surat Keterangan Pindah</h1>

    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <h3>Detail Informasi</h3>
            <v-spacer></v-spacer>
            <button-chat
              :countChatUnread="countChatUnread"
              :chatPageUrl="`/keluarga/ketua/surat/surat-keterangan-pindah/chat/${data.id}`"
              :detailPageUrl="`/keluarga/ketua/surat/surat-keterangan-pindah/detail/${data.id}`"
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
              <h2 class="mb-5">Informasi Umat</h2>

              <v-divider class="mb-5"></v-divider>

              <label>Nama</label>
              <p>{{ data.nama }}</p>

              <label>Tempat, tanggal lahir</label>
              <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Tempat Tinggal Lama</h2>

              <v-divider></v-divider>

              <label>Tanggal pertama kali domisili</label>
              <p>{{ data.tgl_domisili_lama }}</p>

              <label>Alamat lama</label>
              <p>{{ data.alamat_lama }}</p>

              <label>Paroki lama</label>
              <p>Kumetiran</p>

              <label>Lingkungan lama</label>
              <p>{{ data.nama_lingkungan_lama }}</p>
            </div>

            <h2 class="mb-5">Tempat Tinggal Baru</h2>
            
            <v-divider class="mb-5"></v-divider>

            <label>Tanggal mulai domisili</label>
            <p>{{ data.tgl_domisili_baru }}</p>

            <label>Paroki baru</label>
            <p>{{ data.paroki_baru }}</p>

            <label>Lingkungan baru</label>
            <p>{{ data.nama_lingkungan_baru }}</p>

            <label>Alamat baru</label>
            <p>{{ data.alamat_baru }}</p>

            <label>Nomor telepon baru</label>
            <p>{{ data.no_telp_baru }}</p>
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
import ButtonChat from '@/components/ButtonChat.vue'

export default {
  components: {
    ButtonChat,
  },
  data: () => ({
    url: '/surat-keterangan-pindah',
    data: {},
    countChatUnread: 0,
  }),
  async mounted() {
    this.data = await getOneData(`${this.url}/${this.$route.params.id}`)
    this.data.tgl_lahir = changeDateFormat(this.data.tgl_lahir)
    this.data.tgl_domisili_lama = changeDateFormat(this.data.tgl_domisili_lama)
    this.data.tgl_domisili_baru = changeDateFormat(this.data.tgl_domisili_baru)

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
        this.$router.push('/keluarga/ketua/surat/surat-keterangan-pindah')
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
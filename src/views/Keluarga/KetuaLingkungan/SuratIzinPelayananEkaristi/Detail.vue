<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat/surat-izin-ekaristi" />
    
    <h1 class="mb-5">Detail Surat Izin Pelayanan Ekaristi</h1>

    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <h3>Detail Informasi</h3>
            <v-spacer></v-spacer>
            <button-chat
              :countChatUnread="countChatUnread"
              :chatPageUrl="`/keluarga/ketua/surat/surat-izin-ekaristi/chat/${data.id}`"
              :detailPageUrl="`/keluarga/ketua/surat/surat-izin-ekaristi/detail/${data.id}`"
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
              <h2 class="mb-5">Informasi Keluarga yang mengajukan</h2>
              <v-divider class="mb-5"></v-divider>

              <label>Keluarga yang mengajukan</label>
              <p>{{ `${data.nama_keluarga} (${data.nama_kepala_keluarga})` }}</p>

              <label>Nomor telepon kepala keluarga</label>
              <p>{{ data.no_telp_kepala_keluarga }}</p>
            </div>
            <div>
              <h2 class="mb-5">Informasi Pelaksanaan Ekaristi</h2>
              <v-divider class="mb-5"></v-divider>

              <label>Tanggal pelaksanaan • Waktu</label>
              <p>{{ changeDate(this.data.tgl_pelaksanaan) }} • {{ data.waktu_mulai.substring(0, 5) }} - {{ data.waktu_selesai.substring(0, 5) }}</p>

              <label>Ujud/intensi</label>
              <p>{{ data.intensi }}</p>

              <label>Lingkungan pelaksanaan ekaristi</label>
              <p>{{ data.nama_lingkungan }}</p>

              <label>Alamat lokasi/tempat/rumah</label>
              <p>{{ data.lokasi_rumah }}</p>

              <label>Nomor telepon rumah/HP</label>
              <p>{{ data.no_telp_lokasi }}</p>

              <label>Dipimpin oleh</label>
              <p>Romo {{ data.romo_pemimpin }}</p>

              <label>Alamat komunitas</label>
              <p>{{ data.alamat_komunitas }}</p>

              <label>Nomor telepon komunitas</label>
              <p>{{ data.no_telp_komunitas }}</p>
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
import ButtonChat from '@/components/ButtonChat.vue'

export default {
  components: {
    ButtonChat,
  },
  data: () => ({
    url: '/surat-izin-pelayanan-ekaristi',
    data: {
      waktu_mulai: '',
      waktu_selesai: '',
    },
    countChatUnread: 0,
  }),
  async mounted() {
    this.data = await getOneData(`${this.url}/${this.$route.params.id}`)

    // Get jumlah chat yg belum read
    this.countChatUnread = await getOneData(`/chat/count-unread/${this.$route.params.id}/${this.$store.state.keluarga.id}`)
    this.countChatUnread = this.countChatUnread.count_unread
  },
  computed: {
    isVerifyDisabled() {
      return this.data.ketua_lingkungan_approval ? true : false
    }
  },
  methods: {
    changeDate(date) {
      return changeDateFormat(date)
    },
    async verify() {
      let snackbar
      
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      this.data.role = 'ketua lingkungan'
      this.data.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
      snackbar = await verifySurat(this.url, this.data.id, this.data)

      if (snackbar.color === 'success') {
        this.$router.push('/keluarga/ketua/surat/surat-izin-ekaristi')
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
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
            <h3 class="mb-5">Informasi Surat Izin</h3>
            <label>No. surat</label>
            <p>{{ data.no_surat }}</p>

            <label>Tanggal surat</label>
            <p>{{ data.created_at }}</p>

            <v-divider class="mb-5"></v-divider>

            <label>Keluarga yang mengajukan</label>
            <p>{{ `${data.nama_keluarga} (${data.nama_kepala_keluarga})` }}</p>

            <label>Nomor telepon kepala keluarga</label>
            <p>{{ data.no_telp_kepala_keluarga }}</p>

            <label>Tanggal pelaksanaan • Waktu</label>
            <p>{{ `${data.tgl_pelaksanaan} • ${data.waktu_mulai.substring(0, 5)} - ${data.waktu_selesai.substring(0, 5)}` }}</p>

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

export default {
  data: () => ({
    url: '/surat-izin-pelayanan-ekaristi',
    data: {
      waktu_mulai: '',
      waktu_selesai: '',
    },
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
      let snackbar
      
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      this.data.ketua_lingkungan_approval = 1
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
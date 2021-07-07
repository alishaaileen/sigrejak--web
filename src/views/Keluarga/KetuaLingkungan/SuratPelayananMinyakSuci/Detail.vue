<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat/surat-minyak-suci" />
    
    <h1 class="mb-5">Detail Surat Pelayanan Minyak Suci</h1>

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

              <label>Alamat</label>
              <p>{{ data.alamat }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Minyak Suci</h2>
              
              <v-divider class="mb-5"></v-divider>

              <label>Sudah/Belum pernah menerima minyak suci</label>
              <p>{{ data.status_terima_minyak }}</p>

              <label v-if="data.status_terima_minyak === 'Sudah pernah'">Tanggal penerimaan minyak suci</label>
              <p>{{ data.tgl_terima_minyak }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Pasangan</h2>
              
              <v-divider class="mb-5"></v-divider>

              <p v-if="data.nama_pasangan === null">Tidak punya pasangan</p>

              <div v-if="data.nama_pasangan != null">
                <label>Nama pasangan</label>
                <p>{{ data.nama_pasangan }}</p>

                <label>Cara menikah</label>
                <p>{{ data.cara_menikah }}</p>

                <label>Tahun menikah</label>
                <p>{{ data.tahun_menikah }}</p>
              </div>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Keluarga Yang Bertanggung Jawab</h2>
              
              <v-divider class="mb-5"></v-divider>

              <label>Nama keluarga</label>
              <p>{{ data.nama_keluarga_penanggung_jawab }}</p>

              <label>Alamat</label>
              <p>{{ data.alamat_keluarga_penanggung_jawab }}</p>

              <label>Nomor telepon</label>
              <p>{{ data.no_telp_keluarga_penanggung_jawab }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Pastor Pelayan</h2>
              
              <v-divider class="mb-5"></v-divider>

              <label>Nama pastor</label>
              <p>{{ pastorPelayan.nama }}</p>
            </div>
          </v-card-text>
        </v-card>    
      </v-col>
    </v-row>
    <snackbar />
  </div>
</template>

<script>
import { getOneData, changeDateFormat } from '../../../../utils'
import { verifySurat } from '../../../../utils/pengurus'

export default {
  data: () => ({
    url: '/surat-pelayanan-minyak-suci',
    data: {},
    textChat: '',
    pastorPelayan: { nama: '' },
  }),
  async mounted() {
    this.data = await getOneData(`${this.url}/${this.$route.params.id}`)
    this.data.tgl_lahir = changeDateFormat(this.data.tgl_lahir)
    this.data.tgl_terima_minyak = changeDateFormat(this.data.tgl_terima_minyak)
    
    this.pastorPelayan = await getOneData(`/admin/${this.data.id_pastor_pelayan}`)
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
        this.$router.push('/keluarga/ketua/surat/surat-minyak-suci')
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
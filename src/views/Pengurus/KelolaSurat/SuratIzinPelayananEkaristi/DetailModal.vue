<template>
  <v-row justify="center">
    <v-dialog
      v-model="isModalDetailActive"
      max-width="700px"
      scrollable
      @click:outside="close"
    >
      <v-card>
        <v-toolbar
          color="blue accent-4"
          dark
          flat
        >
          <h2 class="white--text">Detail Info</h2>
          <v-spacer></v-spacer>

          <v-btn icon @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div>
            <v-card flat outlined class="pa-2 mt-5">
              <v-row class="text-center">
                <v-col>
                  <div class="py-2">
                    <v-icon v-if="data.ketua_lingkungan_approval === 1" color="green darken-1" large>far fa-check-circle</v-icon>
                    <v-icon v-else color="grey" large>fas fa-history</v-icon>
                    <div class="mt-2">
                      <label>Ketua lingkungan</label>
                      <p class="ma-0">{{ data.ketua_lingkungan_approval === 1 ? data.ketua_lingkungan : '-' }}</p>
                    </div>
                  </div>
                </v-col>
                <v-col>
                  <div class="py-2">
                    <v-icon v-if="data.sekretariat_approval === 1" color="green darken-1" large>far fa-check-circle</v-icon>
                    <v-icon v-else color="grey" large>fas fa-history</v-icon>
                    <div class="mt-2">
                      <label>Sekretariat</label>
                      <p class="ma-0">{{ data.sekretariat_approval === 1 ? sekretariat.nama : '-' }}</p>
                    </div>
                  </div>
                </v-col>
                <v-col>
                  <div class="py-2">
                    <v-icon v-if="data.romo_approval === 1" color="green darken-1" large>far fa-check-circle</v-icon>
                    <v-icon v-else color="grey" large>fas fa-history</v-icon>
                    <div class="mt-2">
                      <label>Romo Paroki</label>
                      <p class="ma-0">{{ data.romo_approval === 1 ? romoParoki.nama : '-' }}</p>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <h2 class="mt-15 mb-5">Informasi Surat Izin</h2>

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

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-none"
            color="primary"
            rounded
            dark
            :disabled="data.sekretariat_approval === 1"
            @click="sekretariatVerify(data.id)"
          >
            <div class="ma-4">Verifikasi</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { verifySurat } from '../../../../utils/pengurus'
export default {
  props:{
    isModalDetailActive: Boolean,
    url: String,
    data: Object,
    sekretariat: Object,
    romoParoki: Object,
  },
  methods: {
    async sekretariatVerify() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      this.close()
      let snackbar = {}
      
      this.data.sekretariat_approval = 1
      this.data.id_sekretariat = this.$store.state.pengurus.id
      snackbar = await verifySurat(this.url, this.data.id, this.data)

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
    close() {
      this.$emit('closeModal', false)
    },
  }

}
</script>

<style>

</style>
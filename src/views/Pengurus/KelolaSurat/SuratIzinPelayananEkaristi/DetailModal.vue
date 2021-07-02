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
            <v-text-field
              v-model="data.no_surat"
              required
              outlined
              dense
            ></v-text-field>

            <label>Tanggal surat</label>
            <p>{{ data.created_at }}</p>

            <v-divider class="mb-5"></v-divider>

            <label>Keluarga yang mengajukan</label>
            <p>{{ `${data.nama_keluarga} (${data.nama_kepala_keluarga})` }}</p>

            <label>Nomor telepon kepala keluarga</label>
            <p>{{ data.no_telp_kepala_keluarga }}</p>

            <label>Tanggal pelaksanaan • Waktu</label>
            <p>{{ changeDate(data.tgl_pelaksanaan) }} • {{ data.waktu_mulai.substring(0, 5) }} - {{ data.waktu_selesai.substring(0, 5) }}</p>

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
            @click="sekretariatVerify(data)"
          >
            <div class="ma-4">{{ data.sekretariat_approval === 1 ? 'Simpan': 'Verifikasi' }}</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { changeDateFormat } from '../../../../utils'
export default {
  props:{
    isModalDetailActive: Boolean,
    url: String,
    data: Object,
    sekretariat: Object,
    romoParoki: Object,
  },
  methods: {
    changeDate(date) {
      return changeDateFormat(date)
    },
    sekretariatVerify(dataSurat) {
      this.$emit('verify', dataSurat)
    },
    close() {
      this.$emit('closeModal')
    },
  }

}
</script>

<style>

</style>
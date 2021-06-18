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
                    <v-icon v-if="data.pastor_pelayan_approval === 1" color="green darken-1" large>far fa-check-circle</v-icon>
                    <v-icon v-else color="grey" large>fas fa-history</v-icon>
                    <div class="mt-2">
                      <label>Pastor Pelayan</label>
                      <p class="ma-0">{{ data.pastor_pelayan_approval === 1 ? pastorPelayan.nama : '-' }}</p>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <h2 class="mt-7 mb-3">Informasi Surat</h2>

            <label>No. surat</label>
            <p>{{ data.no_surat }}</p>

            <label>Tanggal surat</label>
            <p>{{ data.created_at }}</p>


            <h2 class="mt-7 mb-3">Informasi Umat</h2>

            <label>Nama</label>
            <p>{{ data.nama }}</p>

            <label>Tempat, tanggal lahir</label>
            <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>

            <label>Alamat</label>
            <p>{{ data.alamat }}</p>

            <h2 class="mt-7 mb-3">Informasi Minyak Suci</h2>

            <label>Sudah/Belum pernah menerima minyak suci</label>
            <p>{{ data.status_terima_minyak }}</p>

            <label v-if="data.status_terima_minyak === 'Sudah pernah'">Tanggal penerimaan minyak suci</label>
            <p>{{ data.tgl_terima_minyak }}</p>

            <h2 class="mt-7 mb-3">Informasi Pasangan</h2>

            <p v-if="data.nama_pasangan === null">Tidak punya pasangan</p>

            <div v-if="data.nama_pasangan != null">
              <label>Nama pasangan</label>
              <p>{{ data.nama_pasangan }}</p>

              <label>Cara menikah</label>
              <p>{{ data.cara_menikah }}</p>

              <label>Tahun menikah</label>
              <p>{{ data.tahun_menikah }}</p>
            </div>

            <h2 class="mt-7 mb-3">Informasi Keluarga Yang Bertanggung Jawab</h2>
            
            <label>Nama keluarga</label>
            <p>{{ data.nama_keluarga_penanggung_jawab }}</p>

            <label>Alamat</label>
            <p>{{ data.alamat_keluarga_penanggung_jawab }}</p>

            <label>Nomor telepon</label>
            <p>{{ data.no_telp_keluarga_penanggung_jawab }}</p>

            <h2 class="mt-7 mb-3">Informasi Pastor Pelayan</h2>

            <label>Nama pastor</label>
            <p>{{ pastorPelayan.nama }}</p>

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
            @click="sekretariatVerify(data)"
          >
            <div class="ma-4">Verifikasi</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props:{
    isModalDetailActive: Boolean,
    data: Object,
    url: String,
    sekretariat: Object,
    pastorPelayan: Object,
  },
  methods: {
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
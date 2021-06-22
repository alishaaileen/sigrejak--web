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

            <h2 class="mt-7 mb-5">Informasi Surat</h2>

            <label>No. surat</label>
            <p>{{ data.no_surat }}</p>

            <label>Tanggal surat</label>
            <p>{{ data.created_at }}</p>


            <h2 class="mt-15 mb-5">Informasi Umat</h2>

            <label>Nama</label>
            <p>{{ data.nama }}</p>

            <label>Nama</label>
            <p>{{ data.nama_baptis }}</p>

            <label>Tempat, tanggal lahir</label>
            <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>

            <label>Alamat</label>
            <p>{{ data.alamat }}</p>

            <label>Tempat meninggal</label>
            <p>{{ data.tempat_meninggal }}</p>

            <label>Tanggal meninggal</label>
            <p>{{ data.tgl_meninggal }}</p>

            <label>Tempat pemakaman/kremasi</label>
            <p>{{ data.tempat_makam_kremasi }}</p>

            <label>Tanggal pemakaman/kremasi</label>
            <p>{{ data.tgl_makam_kremasi }}</p>

            <h2 class="mt-15 mb-5">Informasi Keluarga</h2>

            <label>Nama orang tua</label>
            <p>{{ ortu.nama }}</p>

            <label>Nama pasangan</label>
            <p>{{ data.nama_pasangan }}</p>

            <h2 class="mt-15 mb-5">Sakramen Yang Diterima Sebelum Meninggal</h2>

            <ol type="a">
              <h3><li>Viaticum (Komuni)</li></h3>
              <label>Tanggal</label>
              <p>{{ data.tgl_komuni }}</p>

              <label>Nama pelayan sakramen</label>
              <p>{{ data.pelayan_komuni }}</p>


              <h3><li>Pengampunan dosa</li></h3>
              <label>Tanggal</label>
              <p>{{ data.tgl_pengampunan_dosa }}</p>

              <label>Nama pelayan sakramen</label>
              <p>{{ data.pelayan_pengampunan_dosa }}</p>


              <h3><li>Perminyakan orang sakit</li></h3>
              <label>Tanggal</label>
              <p>{{ data.tgl_perminyakan }}</p>

              <label>Nama pelayan sakramen</label>
              <p>{{ data.pelayan_perminyakan }}</p>


              <h3><li>Baptis darurat</li></h3>
              <label>Tanggal</label>
              <p>{{ data.tgl_baptis_darurat }}</p>

              <label>Nama pelayan sakramen</label>
              <p>{{ data.pelayan_baptis_darurat }}</p>
            </ol>

            <h2 class="mt-15 mb-5">Informasi lain</h2>

            <label>Imam yang memberkati</label>
            <p>{{ data.nama_imam }}</p>

            <label>Nama pelapor</label>
            <p>{{ data.nama_pelapor }}</p>

            <label>Nomor HP pelapor</label>
            <p>{{ data.no_hp_pelapor }}</p>

            <label>Nomor HP keluarga/penanggung jawab yang bisa dihubungi</label>
            <p>{{ data.no_hp_penanggungjawab }}</p>
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
    ortu: Object,
    sekretariat: Object,
    romoParoki: Object,
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
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

            <label>Tempat, tanggal lahir</label>
            <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>

            <label>Alamat</label>
            <p>{{ data.alamat }}</p>

            <label>Nomor telepon</label>
            <p>{{ data.no_telp }}</p>

            <label>Sekolah/kelas</label>
            <p>{{ data.sekolah }} / {{ data.kelas }}</p>

            <h2 class="mt-15 mb-5">Informasi Orang tua</h2>

            <label>Nama ayah</label>
            <p>{{ data.nama_ayah }}</p>

            <label>Pekerjaan ayah</label>
            <p>{{ data.pekerjaan_ayah }}</p>

            <label>Nama ibu</label>
            <p>{{ data.nama_ibu }}</p>

            <label>Pekerjaan ibu</label>
            <p>{{ data.pekerjaan_ibu }}</p>

            <label>Alamat</label>
            <p>{{ data.alamat_ortu }}</p>

            <h2 class="mt-15 mb-5">Keterangan Beasiswa</h2>

            <label>Status beasiswa</label>
            <p>{{ data.status_beasiswa }}</p>

            <label>Permohonan</label>
            <p>{{ data.permohonan }}</p>

            <label>File syarat beasiswa</label>
            <div class="mt-1">
              <v-btn
                class="text-none"
                outlined
                small
                color="blue"
                @click="downloadFile(data.file_syarat_beasiswa)"
              >
                klik untuk melihat file
              </v-btn>
            </div>

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
import { API_URL } from '../../../../constants'
export default {
  props:{
    isModalDetailActive: Boolean,
    data: Object,
    url: String,
    sekretariat: Object,
    romoParoki: Object,
  },
  methods: {
    async downloadFile(fileName) {
      window.open(`${API_URL}/files/${fileName}`, '_blank')
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
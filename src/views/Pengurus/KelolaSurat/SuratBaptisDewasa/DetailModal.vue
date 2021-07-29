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
              </v-row>
            </v-card>

            <h2 class="mt-7 mb-5">Informasi Surat</h2>

            <label>No. surat</label>
            <p>{{ data.no_surat }}</p>

            <label>Tanggal surat</label>
            <p>{{ data.created_at }}</p>

            <label>Romo Pembaptis</label>
            <p>{{ romoPembaptis.nama === null ? '-' : romoPembaptis.nama }}</p>

            <label>Jadwal pembaptisan</label>
            <p>{{ data.jadwal_baptis === null ? 'Belum ditetapkan' : changeDateTime(data.jadwal_baptis) }}</p>

            <h2 class="mt-15 mb-5">Informasi Calon</h2>

            <v-divider class="mb-5"></v-divider>

            <label>Nama</label>
            <p>{{ data.nama }}</p>

            <label>Tempat, tanggal lahir</label>
            <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>

            <label>Nama baptis</label>
            <p>{{ data.nama_baptis }}</p>

            <label>Alamat</label>
            <p>{{ data.alamat }}</p>

            <label>No. telepon</label>
            <p>{{ data.no_telp }}</p>

            <label>Nama ayah</label>
            <p>{{ data.nama_ayah }}</p>
            
            <label>Nama ibu</label>
            <p>{{ data.nama_ibu }}</p>

            <label>Status perkawinan</label>
            <p>{{ data.status_perkawinan }}</p>

            <div v-if="data.status_perkawinan === 'Akan menikah'">
              <label>Akan menikah dengan</label>
              <p>{{ data.calon_pasangan }}</p>

              <label>Tanggal menikah</label>
              <p>{{ data.tgl_menikah_calon }}</p>
            </div>

            <div v-if="data.status_perkawinan === 'Sudah menikah'">
              <label>Cara menikah</label>
              <p>{{ data.cara_menikah }}</p>

              <label>Tempat menikah</label>
              <p>{{ data.tempat_menikah }}</p>

              <label>Tanggal menikah</label>
              <p>{{ data.tgl_menikah }}</p>

              <div v-if="data.pembatalan_perkawinan">
                <label>Alasan pembatalan perkawinan</label>
                <p>{{ data.pembatalan_perkawinan }}</p>
              </div>
            </div>
            
            <h2 class="mt-15 mb-5">Informasi Wali Baptis</h2>
            
            <v-divider class="mb-5"></v-divider>

            <label>Nama</label>
            <p>{{ data.nama_wali }}</p>

            <label>Tanggal krisma</label>
            <p>{{ data.tgl_krisma_wali }}</p>

            <label>Tempat krisma</label>
            <p>{{ data.tempat_krisma_wali }}</p>

            <h2 class="mt-15 mb-5">Syarat-syarat</h2>

            <label>Akta lahir</label>
            <div class="mb-5">
              <v-btn
                class="text-none"
                outlined
                color="blue"
                @click="openImage"
              >
                Lihat akta lahir
              </v-btn>
            </div>

            <label>Surat nikah sipil & gereja dan Surat baptis terbaru Emban/Wali</label>
            <div class="mt-1">
              <v-btn
                class="text-none"
                outlined
                color="blue"
                @click="downloadFile(data.file_syarat_baptis)"
              >
                Klik untuk melihat file
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
            @click="$router.push(`/pengurus/surat/surat-baptis-dewasa/atur-jadwal/${data.id}`)"
          >
            <p class="ma-4">Atur jadwal</p>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { API_URL } from '../../../../constants'
import { convertDateTime } from '../../../../utils'

export default {
  props:{
    isModalDetailActive: Boolean,
    data: Object,
    url: String,
    sekretariat: Object,
    romoPembaptis: Object,
  },
  methods: {
    changeDateTime(dateTime) {
      return convertDateTime(dateTime)
    },
    openImage() {
      this.$emit('openImage', true, this.data.file_akta_lahir)
    },
    async downloadFile(fileName) {
      window.open(`${API_URL}/files/${fileName}`, '_blank')
    },
    close() {
      this.$emit('closeModal')
    },
  }

}
</script>

<style>

</style>
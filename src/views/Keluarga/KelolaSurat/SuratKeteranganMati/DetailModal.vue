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
                    <v-icon v-if="data.imam_pemberkat_approval === 1" color="green darken-1" large>far fa-check-circle</v-icon>
                    <v-icon v-else color="grey" large>fas fa-history</v-icon>
                    <div class="mt-2">
                      <label>Pastor pelayan</label>
                      <p class="ma-0">{{ data.nama_imam }}</p>
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

            <!-- <h2 class="mt-7 mb-3">Informasi Surat</h2> -->
            
            <h2 class="mt-7 mb-3">Informasi Surat</h2>

            <label>No. surat</label>
            <p>{{ data.no_surat }}</p>

            <label>Tanggal surat</label>
            <p>{{ data.created_at }}</p>

            <label>Nama</label>
            <p>{{ data.nama }}</p>

            <label>Nama baptis</label>
            <p>{{ data.nama_baptis }}</p>

            <label>Tempat/tanggal lahir</label>
            <p>{{ `${data.tempat_lahir}/${data.tgl_lahir}` }}</p>

            <label>Alamat</label>
            <p>{{ data.alamat }}</p>

            <label>Tempat meninggal</label>
            <p>{{ data.tempat_meninggal }}</p>

            <label>Tanggal meninggal</label>
            <p>{{ data.tgl_meninggal }}</p>

            <label>Tempat pemakaman/kremasi</label>
            <p>{{ data.tempat_makam_kremasi }}</p>

            <label>Tanggal makam/kremasi</label>
            <p>{{ data.tgl_makam_kremasi }}</p>
            
            <h2 class="mt-7 mb-3">Informasi Keluarga</h2>
            
            <label>Nama orang tua</label>
            <p>{{ ortu.nama }}</p>

            <div v-show="data.nama_pasangan">
              <label>Nama pasangan</label>
              <p>{{ data.nama_pasangan }}</p>
            </div>

            <h2 class="mt-7 mb-3">Sakramen yang diterima sebelum meninggal</h2>

            <label>a. Viaticum (Komuni)</label>
            <p>{{ data.tgl_komuni }} oleh {{ data.pelayan_komuni }}</p>

            <label>b. Pengampunan Dosa</label>
            <p>{{ data.tgl_pengampunan_dosa }} oleh {{ data.pelayan_pengampunan_dosa }}</p>

            <label>c. Perminyakan Orang Sakit</label>
            <p>{{ data.tgl_perminyakan }} oleh {{ data.pelayan_perminyakan }}</p>

            <label>d. Baptis Darurat</label>
            <p>{{ data.tgl_baptis_darurat }} oleh {{ data.pelayan_baptis_darurat }}</p>

            <h2 class="mt-7 mb-3">Informasi lain</h2>

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
          <small>
            <v-icon small color="blue">fas fa-info-circle</v-icon> Data dapat diedit jika belum disetujui Ketua Lingkungan
          </small>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :disabled="!data.isEditable"
            @click="goToEdit(data.id)"
          >
            Edit
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
    ortu: Object,
    sekretariat: Object,
  },
  methods: {
    goToEdit(id) {
      this.$router.push(`/keluarga/surat/surat-keterangan-mati/edit/${id}`)
    },
    close() {
      this.$emit('closeModal', false)
    },
  }

}
</script>

<style>

</style>
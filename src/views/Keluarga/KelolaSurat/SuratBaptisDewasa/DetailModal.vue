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

            <!-- <h2 class="mt-7 mb-5">Informasi Surat</h2> -->
            
            <h2 class="mt-15 mb-5">Informasi Surat Baptis Anak</h2>

            <label>No. surat</label>
            <p>{{ data.no_surat }}</p>

            <label>Tanggal surat</label>
            <p>{{ data.created_at }}</p>

            <label>Nama anak</label>
            <p>{{ data.nama }}</p>

            <label>Tempat/tanggal lahir</label>
            <p>{{ `${data.tempat_lahir}/${data.tgl_lahir}` }}</p>

            <label>Nama baptis</label>
            <p>{{ data.nama_baptis }}</p>

            <h2 class="mt-15 mb-5">Informasi Orang Tua</h2>
            
            <label>Nama ayah</label>
            <p>{{ data.nama_ayah }}</p>

            <label>Nama ibu</label>
            <p>{{ data.nama_ibu }}</p>

            <label>Alamat orang tua</label>
            <p>Romo {{ data.alamat_ortu }}</p>

            <label>Nomor telepon orang tua</label>
            <p>{{ data.no_telp_ortu }}</p>

            <label>Cara menikah orang tua</label>
            <p>{{ data.cara_ortu_menikah }}</p>

            <label>Tanggal menikah orang tua</label>
            <p>{{ data.tgl_ortu_menikah }}</p>

            <h2 class="mt-15 mb-5">Informasi Orang Tua</h2>
            
            <label>Nama wali baptis</label>
            <p>{{ data.nama_wali_baptis }}</p>

            <label>Tanggal krisma wali baptis</label>
            <p>{{ data.tgl_krisma_wali_baptis }}</p>

            <h2 class="mt-15 mb-5">Jadwal Baptis</h2>

            <label>Tanggal baptis</label>
            <p>{{ data.tgl_baptis ? data.tgl_baptis : 'Menunggu proses verifikasi' }}</p>

            <label>Yang membaptis</label>
            <p>{{ data.romo_pembaptis ? `Romo ${data.romo_pembaptis}` : 'Menunggu proses verifikasi' }}</p>
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
    sekretariat: Object,
  },
  methods: {
    goToEdit(id) {
      this.$router.push(`/keluarga/surat/surat-baptis-anak/edit/${id}`)
    },
    close() {
      this.$emit('closeModal', false)
    },
  }

}
</script>

<style>

</style>
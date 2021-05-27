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
            <h2 class="mt-7 mb-3">Informasi Surat</h2>

            <label>No. surat</label>
            <p>{{ data.no_surat }}</p>

            <label>Tanggal surat</label>
            <p>{{ data.created_at }}</p>

            <h2 class="mt-7 mb-3">Informasi Umat</h2>

            <label>Nama</label>
            <p>{{ data.nama }}</p>

            <label>Nama baptis</label>
            <p>{{ data.nama_baptis }}</p>

            <label>Tempat, tanggal lahir</label>
            <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>

            <label>Alamat</label>
            <p>{{ data.alamat }}</p>

            <label>Tanggal komuni</label>
            <p>{{ data.tgl_komuni }}</p>

            <!-- <h2 class="mt-7 mb-3">Tempat Tinggal Baru</h2>

            <label>Tanggal mulai domisili</label>
            <p>{{ data.tgl_mulai_domisili }}</p>

            <label>Alamat baru</label>
            <p>{{ data.alamat_ortu }}</p> -->

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
  },
  methods: {
    goToEdit(id) {
      this.$router.push(`/keluarga/surat/surat-keterangan/edit/${id}`)
    },
    close() {
      this.$emit('closeModal', false)
    },
  }

}
</script>

<style>

</style>
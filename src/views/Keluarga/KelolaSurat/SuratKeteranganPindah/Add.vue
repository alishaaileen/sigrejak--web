<template>
  <div>
    <h1 class="page-title">Tambah Surat Keterangan Pindah</h1>

    <div class="form mt-5" @submit.prevent="submit">
      <!-- <v-card class="pa-3 mx-auto" outlined> -->
        <v-form>
          <label>Nama*</label>
          <v-text-field
            v-model="formData.nama_paroki"
            required
            outlined
            dense
            readonly
          ></v-text-field>

          <label>Tempat lahir</label>
          <v-text-field
            v-model="formData.nama_paroki"
            required
            outlined
            dense
            readonly
          ></v-text-field>

          <label>Tanggal lahir</label>
          <v-text-field
            v-model="formData.nama_paroki"
            required
            outlined
            dense
            readonly
          ></v-text-field>

          <label>Alamat baru*</label>
          <v-text-field
            v-model="formData.nama_paroki"
            required
            outlined
            dense
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              type="submit"
              color="success"
              dark
              depressed
            >
              Tambah Paroki
            </v-btn>
          </div>
        </v-form>
      <!-- </v-card> -->
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    formData: {
      no_surat: null,
      tgl_form: null,
      id_lingkungan: null,
      ketua_lingkungan: null,
      id_umat: null,
      nama: null,
      tempat_lahir: null,
      tgl_lahir: null,
      alamat_lama: null,
      no_telp_lama: null,
      tgl_mulai_domisili: null,
      alamat_baru: null,
      no_telp_baru: null,
      id_lingkungan_baru: null,
      id_paroki_baru: null,
    },
  })
}
</script>

<style>

</style>
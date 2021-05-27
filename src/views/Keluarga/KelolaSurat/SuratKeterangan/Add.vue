<template>
  <div>
    <h1>Tambah Surat Keterangan</h1>

    <div class="form mt-5">
      <v-card class="pa-6 mx-auto" flat>
        <v-form @submit.prevent="submit">
          <h3 class="mb-5">Informasi Umat</h3>

          <autocomplete
            label="Nama*"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdUmat"
          ></autocomplete>

          <label>Tempat lahir</label>
          <v-text-field
            v-model="formData.tempat_lahir"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

          <label>Tanggal lahir</label>
          <v-text-field
            v-model="formData.tgl_lahir"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

          <label>Alamat</label>
          <v-text-field
            v-model="formData.alamat"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

          <label>Pekerjaan</label>
          <v-text-field
            v-model="formData.pekerjaan"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

          <label>Pendidikan</label>
          <v-text-field
            v-model="formData.pendidikan"
            required
            outlined
            dense
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <label>Nama orang tua*</label>
          <v-text-field
            v-model="formData.nama_ortu"
            required
            outlined
            dense
          ></v-text-field>

          <label>Alamat orang tua*</label>
          <v-text-field
            v-model="formData.alamat_ortu"
            required
            outlined
            dense
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <!-- <h3 class="mb-5">Tempat Tinggal Baru</h3> -->

          <label>Keperluan*</label>
          <v-textarea
            v-model="formData.keperluan"
            required
            outlined
            dense
          ></v-textarea>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none mt-2"
              type="submit"
              color="blue accent-4"
              dark
              depressed
            >
              Ajukan surat
            </v-btn>
          </div>
        </v-form>
      </v-card>     
    </div>
    <snackbar />
  </div>
</template>

<script>
import { getData, postData } from '../../../../utils'
import Autocomplete from '../../../../components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    formData: {
      id_keluarga: null,
      id_lingkungan: null,
      ketua_lingkungan: null,
      
      id_umat: null,
      tempat_lahir: null,
      tgl_lahir: null,
      alamat: null,
      pekerjaan: null,

      pendidikan: null,
      id_ortu: null,
      nama_ortu: null,
      alamat_ortu: null,
      isKetuaLingkungan: 0,
    },
    anggotaKeluarga: [],
    lingkunganList: [],
    umat: {},
  }),
  async mounted() {
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.formData.id_keluarga = this.$store.state.keluarga.id
    if (this.$store.state.keluarga.lingkunganId) {
      this.formData.isKetuaLingkungan = true
      this.formData.ketua_lingkungan = this.$store.state.keluarga.nama_keluarga
    }
  },
  methods: {
    changeIdUmat(e) {
      this.anggotaKeluarga.map((_) => {
        if (_.nama == e) {
          this.formData.id_umat = _.id;
          this.formData.id_lingkungan = _.lingkungan_id;
          this.formData.tempat_lahir = _.tempat_lahir
          this.formData.tgl_lahir = _.tgl_lahir
          this.formData.alamat = _.alamat
          this.formData.pekerjaan = _.pekerjaan
          return
        }
      })
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await postData('/surat-keterangan/add', this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
          this.$router.push('/keluarga/surat/surat-keterangan')
        } else {
          snackbar.color = 'error',
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error',
        snackbar.text = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>

<style>

</style>
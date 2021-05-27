<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-mati" />
    
    <h1>Tambah Surat Keterangan Mati</h1>

    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-6 mx-auto" flat>
        <v-form>
          <h3 class="mb-5">Informasi Umat</h3>

          <autocomplete
            label="Nama*"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdUmat"
          ></autocomplete>

          <label>Nama baptis</label>
          <v-text-field
            v-model="formData.nama_baptis"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

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

          <label>Tanggal komuni</label>
          <v-text-field
            v-model="formData.tgl_komuni"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none mt-2"
              type="submit"
              color="blue accent-4"
              dark
              depressed
            >
              Tambah Paroki
            </v-btn>
          </div>
        </v-form>
      </v-card>     
    </div>
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
      tgl_form: null,
      id_lingkungan: null,
      ketua_lingkungan: null,
      id_umat: null,
    },
    anggotaKeluarga: [],
    lingkunganList: [],
    umat: {},
  }),
  async mounted() {
    this.lingkunganList = await getData(`/lingkungan`)
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
  },
  methods: {
    changeIdLingkungan(e) {
      this.lingkunganList.map((_) => {
        if (_.nama_lingkungan == e) {
          this.umat.id_lingungan_baru = _.id;
          return
        }
      })
    },
    changeIdUmat(e) {
      this.anggotaKeluarga.map((_) => {
        if (_.nama == e) {
          this.formData.id_umat = _.id;
          this.formData.tempat_lahir = _.tempat_lahir
          this.formData.tgl_lahir = _.tgl_lahir
          this.formData.alamat_lama = _.alamat
          return
        }
      })
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await postData('/surat-keterangan-mati/add', this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
          this.$router.push('surat-keterangan-mati')
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
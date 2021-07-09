<template>
  <div>
    <btn-kembali path="/pengurus/lingkungan" />
    
    <h1>Detail Lingkungan</h1>

    <div class="form mt-5">
      <v-card class="pa-6 mx-auto" flat>
        <div class="my-3">
          <v-form>
            <label>Nama lingkungan*</label>
            <v-text-field
              v-model="lingkungan.nama_lingkungan"
              required
              outlined
              dense
            ></v-text-field>

            <autocomplete
              :value="lingkungan.nama_keluarga"
              label="Ketua lingkungan*"
              :suggestionList="keluargaList"
              itemText="nama_keluarga"
              @changeData="changeIdKeluarga"
            ></autocomplete>

            <label>Nama kepala keluarga</label>
            <p>{{ selectedKeluarga.nama_keluarga }}</p>

            <label>Nama kepala keluarga</label>
            <p>{{ selectedKeluarga.nama_kepala_keluarga }}</p>

            <label>No. telepon kepala keluarga</label>
            <p>{{ selectedKeluarga.no_telp_kepala_keluarga }}</p>

            <div class="d-flex justify-end">
              <v-btn
                class="btn text-none"
                @click="save"
                color="blue accent-4"
                dark
                depressed
              >
                Simpan
              </v-btn>
            </div>
          </v-form>

        </div>
      </v-card>
    </div>
    <snackbar/>
  </div>
</template>

<script>
import { getData, getOneData, editData } from '../../../utils'

import Autocomplete from '../../../components/Autocomplete'

export default {
  components: {
    Autocomplete
  },
  data: () => ({
    lingkungan: {},
    keluargaList: [],
    selectedKeluarga: { id: '' },
  }),
  async mounted() {
    this.tableLoading = true

    this.lingkungan = await getOneData(`/lingkungan/${this.$route.params.id}`)
    
    this.keluargaList = await getData(`/keluarga`)
    
    this.selectedKeluarga = await getOneData(`/keluarga/${this.lingkungan.ketua_lingkungan_id}`)
    
    this.tableLoading = false
  },
  methods: {
    changeIdKeluarga(e) {
      this.selectedKeluarga = this.keluargaList.find(_ => _.nama_keluarga === e)
      this.formData.ketua_lingkungan_id = this.selectedKeluarga.id;
    },
    async save() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await editData('/lingkungan', this.$route.params.id, {
          nama_lingkungan: this.lingkungan.nama_lingkungan,
          ketua_lingkungan_id: this.lingkungan.ketua_lingkungan_id,
        })

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil tersimpan!'
          this.$router.push('/pengurus/lingkungan')
        } else {
          snackbar.color = 'error'
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error'
        snackbar.text = error

        console.error = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>
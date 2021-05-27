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

          <v-row>
            <v-col>
              <label>Tempat lahir</label>
              <v-text-field
                v-model="formData.tempat_lahir"
                required
                outlined
                dense
                readonly
                disabled
              ></v-text-field>
            </v-col>
            <v-col>
              <label>Tanggal lahir</label>
              <v-text-field
                v-model="formData.tgl_lahir"
                required
                outlined
                dense
                readonly
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

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

          <h3 class="mb-5">Informasi Orang Tua</h3>

          <v-alert
            v-show="isAlertOrtuActive"
            border="left"
            colored-border
            type="error"
            elevation="2"
          >
            <span>
              Siswa yang dipilih belum memiliki catatan orang tua.
              Harap lengkapi informasi di menu Anggota Keluarga.
            </span>
          </v-alert>

          <label>Nama orang tua*</label>
          <v-text-field
            v-model="formData.nama_ortu"
            required
            outlined
            dense
            disabled
            readonly
          ></v-text-field>

          <label>Alamat orang tua*</label>
          <v-text-field
            v-model="formData.alamat_ortu"
            required
            outlined
            dense
            disabled
            readonly
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Keperluan</h3>

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
              :disabled="isSubmitDisabled"
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
    umat: {},
    isAlertOrtuActive: false,
  }),
  computed: {
    isSubmitDisabled() {
      return this.isAlertOrtuActive ? true : false
    }
  },
  async mounted() {
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.formData.id_keluarga = this.$store.state.keluarga.id
    if (this.$store.state.keluarga.lingkunganId) {
      this.formData.isKetuaLingkungan = true
      this.formData.ketua_lingkungan = this.$store.state.keluarga.nama_keluarga
    }
  },
  methods: {
    async changeIdUmat(e) {
      let temp = this.anggotaKeluarga.find(_ => {
        return _.nama === e
      })
      this.formData.id_umat = temp.id;
      this.formData.id_lingkungan = temp.lingkungan_id;
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = temp.tgl_lahir
      this.formData.alamat = temp.alamat
      this.formData.pekerjaan = temp.pekerjaan

      let detailTemp = await getData(`/detail-umat/${temp.id}`)
      detailTemp = detailTemp[0]

      await this.setOrtu(detailTemp.id_ayah, detailTemp.id_ibu)
    },
    async setOrtu(idAyah, idIbu) {
      let tempOrangTua = {}

      if (idAyah === null) {
        if (idIbu === null) {
          this.isAlertOrtuActive = true
          this.formData.id_ortu = null
          this.formData.nama_ortu = null
          this.formData.alamat_ortu = null

          return
        } else {
          tempOrangTua = await getData(`/umat/${idIbu}`)
        }
      } else {
        tempOrangTua = await getData(`/umat/${idAyah}`)
      }
      this.isAlertOrtuActive = false
      tempOrangTua = tempOrangTua[0]
      this.formData.id_ortu = tempOrangTua.id
      this.formData.nama_ortu = tempOrangTua.nama
      this.formData.alamat_ortu = tempOrangTua.alamat
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
<template>
  <div>
    <h1>Tambah Surat Keterangan Pindah</h1>

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

          <label>Tempat lahir</label>
          <v-text-field
            v-model="formData.tempat_lahir"
            required
            outlined
            dense
            readonly
          ></v-text-field>

          <label>Tanggal lahir</label>
          <v-text-field
            v-model="formData.tgl_lahir"
            required
            outlined
            dense
            readonly
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Tempat Tinggal Lama</h3>

          <label>Alamat lama</label>
          <v-text-field
            v-model="formData.alamat_lama"
            required
            outlined
            dense
          ></v-text-field>

          <v-row>
            <v-col>
              <label>Paroki lama</label>
              <v-text-field
                v-model="formData.paroki_lama"
                required
                outlined
                dense
                readonly
              ></v-text-field>
            </v-col>
            <v-col>
              <label>Lingkungan lama</label>
              <v-text-field
                v-model="formData.id_lingkungan_lama"
                required
                outlined
                dense
                readonly
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Tempat Tinggal Baru</h3>
          <v-row>
            <v-col>
              <label>Paroki baru</label>
              <v-text-field
                v-model="formData.paroki_baru"
                required
                outlined
                dense
                readonly
              ></v-text-field>
            </v-col>
            <v-col>
              <autocomplete
                label="Lingkungan baru*"
                :suggestionList="lingkunganList"
                itemText="nama_lingkungan"
                @changeData="changeIdLingkungan"
              ></autocomplete>
            </v-col>
          </v-row>

          <label>Alamat baru*</label>
          <v-text-field
            v-model="formData.nama_paroki"
            required
            outlined
            dense
          ></v-text-field>

          <label>Nomor telepon baru*</label>
          <v-text-field
            v-model="formData.nama_paroki"
            required
            outlined
            dense
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
      paroki_lama: 'Kumetiran',
      nama: '',
      tempat_lahir: '',
      tgl_lahir: null,
      alamat_lama: '',
      no_telp_lama: '',
      tgl_mulai_domisili: null,
      alamat_baru: '',
      no_telp_baru: '',
      id_lingkungan_baru: null,
      paroki_baru: '',
    },
    anggotaKeluarga: [],
    parokiList: [],
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
        let response = await postData('/surat-keterangan-pindah/add', this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
          this.$router.push('surat-keterangan-pindah')
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
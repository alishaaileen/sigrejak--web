<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-pindah" />
    
    <h1>Tambah Surat Keterangan Pindah</h1>

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
          <p>{{ formData.tempat_lahir }}</p>

          <label>Tanggal lahir</label>
          <p>{{ formData.tgl_lahir }}</p>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Tempat Tinggal Lama</h3>

          <label>Tanggal pertama kali tinggal di domisili lama*</label>
          <v-menu
            ref="menu"
            v-model="isDatePickerTglLamaActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_domisili_lama"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_domisili_lama"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>

          <label>Alamat lama</label>
          <p>{{ formData.alamat_lama }}</p>

          <label>Paroki lama</label>
          <p>{{ formData.paroki_lama }}</p>

          <label>Lingkungan lama</label>
          <p>{{ formData.lingkungan_lama }}</p>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Tempat Tinggal Baru</h3>

          <small>Aktifkan tombol di bawah ini jika ingin pindah ke paroki selain Kumetiran</small>
          <v-row>
            <v-col cols="6">
              <v-switch
                v-model="isNotKumetiran"
                :label="isNotKumetiran ? 'Pindah ke paroki lain' : 'Pindah lingkungan saja (tetap di Kumetiran)'"
                color="primary"
                background-color="white"
                @change="switchParoki"
              ></v-switch>
            </v-col>
          </v-row>
          
          <label>Tanggal mulai domisili baru*</label>
          <v-menu
            ref="datePickerTglLama"
            v-model="isDatePickerTglBaruActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_domisili_baru"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_domisili_baru"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>

          <v-row>
            <v-col>
              <label>Paroki baru</label>
              <v-text-field
                v-model="formData.paroki_baru"
                required
                outlined
                dense
                :readonly="!isNotKumetiran"
                :disabled="!isNotKumetiran"
              ></v-text-field>
            </v-col>

            <v-col>
              <autocomplete
                v-if="!isNotKumetiran"
                label="Lingkungan baru*"
                :suggestionList="lingkunganList"
                itemText="nama_lingkungan"
                @changeData="changeIdLingkungan"
              ></autocomplete>
              <div v-else>
                <label>Lingkungan baru*</label>
                <v-text-field
                  v-model="formData.nama_lingkungan_baru"
                  required
                  outlined
                  dense
                ></v-text-field>
              </div>
            </v-col>
          </v-row>

          <label>Alamat baru*</label>
          <v-textarea
            v-model="formData.alamat_baru"
            required
            outlined
            dense
          ></v-textarea>

          <label>Nomor telepon baru*</label>
          <v-text-field
            v-model="formData.no_telp_baru"
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
import { getData, postData, changeDateFormat } from '../../../../utils'
import Autocomplete from '../../../../components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    formData: {
      id_lingkungan: null,
      ketua_lingkungan: null,
      id_keluarga: null,
      id_umat: null,
      paroki_lama: 'Kumetiran',
      nama: '',
      tempat_lahir: '-',
      tgl_lahir: '-',

      tgl_domisili_lama: null,
      alamat_lama: '-',
      id_lingkungan_lama: null,
      lingkungan_lama: '-',
      no_telp_lama: '-',
      
      tgl_domisili_baru: null,
      alamat_baru: '',
      nama_lingkungan_baru: '',
      no_telp_baru: '',
      id_lingkungan_baru: null,
      paroki_baru: 'Kumetiran',
      isKetuaLingkungan: false,
    },
    isNotKumetiran: false,
    anggotaKeluarga: [],
    parokiList: [],
    lingkunganList: [],
    umat: {},
    isDatePickerTglLamaActive: false,
    isDatePickerTglBaruActive: false,
  }),
  async mounted() {
    this.lingkunganList = await getData(`/lingkungan`)
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.formData.id_keluarga = this.$store.state.keluarga.id
    if (this.$store.state.keluarga.lingkunganId) {
      this.formData.isKetuaLingkungan = true
      this.formData.ketua_lingkungan = this.$store.state.keluarga.nama_keluarga
    }
  },
  methods: {
    saveDate (date) {
      this.$refs.menu.save(date)
      this.$refs.datePickerTglLama.save(date)
    },
    changeIdLingkungan(e) {
      let temp = this.lingkunganList.find((_) => { return _.nama_lingkungan === e })

      this.formData.id_lingkungan_baru = temp.id
      this.formData.nama_lingkungan_baru = temp.nama_lingkungan
    },
    changeIdUmat(e) {
      let temp = this.anggotaKeluarga.find(_ => { return _.nama === e })
      
      this.formData.id_lingkungan = temp.lingkungan_id
      this.formData.id_umat = temp.id;
      this.formData.nama = temp.nama;
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = changeDateFormat(temp.tgl_lahir)
      this.formData.no_telp_lama = temp.no_telp
      this.formData.alamat_lama = temp.alamat
      this.formData.lingkungan_lama = temp.nama_lingkungan
      this.formData.id_lingkungan_lama = temp.lingkungan_id
    },
    switchParoki() {
      if (!this.isNotKumetiran){
        this.formData.paroki_baru = 'Kumetiran'
        this.formData.nama_lingkungan_baru = ''
      }
      else {
        this.formData.id_lingkungan_baru = null
        this.formData.nama_lingkungan_baru = ''
        this.formData.paroki_baru = ''
      }
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
          this.$router.push('/keluarga/surat/surat-keterangan-pindah')
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
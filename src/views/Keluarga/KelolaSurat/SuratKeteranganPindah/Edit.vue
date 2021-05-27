<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-pindah" />
    
    <h1>Edit Surat Keterangan Pindah</h1>

    <div class="form mt-5">
      <v-card class="pa-6 mx-auto" flat>
        <v-form @submit.prevent="submit">
          <h3 class="mb-5">Informasi Umat</h3>

          <autocomplete
            label="Nama*"
            :value="formData.nama"
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

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Tempat Tinggal Lama</h3>

          <label>Alamat lama</label>
          <v-text-field
            v-model="formData.alamat_lama"
            required
            outlined
            dense
            readonly
            disabled
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
                disabled
              ></v-text-field>
            </v-col>
            <v-col>
              <label>Lingkungan lama</label>
              <v-text-field
                v-model="formData.nama_lingkungan_lama"
                required
                outlined
                dense
                readonly
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Tempat Tinggal Baru</h3>

          <small>Aktifkan tombol di bawah ini jika ingin pindah ke paroki selain Kumetiran</small>

          <v-row>
            <v-col cols="6">
              <v-switch
                v-model="isNotKumetiran"
                label="Pindah ke paroki lain"
                color="primary"
                background-color="white"
                @change="switchParoki"
              ></v-switch>
            </v-col>
          </v-row>
          
          <label>Tanggal mulai domisili*</label>
          <v-menu
            ref="menu"
            v-model="isDatePickerActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_mulai_domisili"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_mulai_domisili"
              :min="new Date().toISOString().substr(0, 10)"
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
                :value="formData.nama_lingkungan_baru"
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
          <v-text-field
            v-model="formData.alamat_baru"
            required
            outlined
            dense
          ></v-text-field>

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
              Simpan
            </v-btn>
          </div>
        </v-form>
      </v-card>     
    </div>
    <snackbar />
  </div>
</template>

<script>
import { getData, editData } from '../../../../utils'
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
      tempat_lahir: '',
      tgl_lahir: null,

      alamat_lama: '',
      id_lingkungan_lama: null,
      lingkungan_lama: '',
      no_telp_lama: '',
      
      tgl_mulai_domisili: null,
      alamat_baru: '',
      nama_lingkungan_baru: '',
      no_telp_baru: '',
      id_lingkungan_baru: null,
      paroki_baru: 'Kumetiran',
      ketua_lingkungan_approval: 0,
    },
    isNotKumetiran: false,
    anggotaKeluarga: [],
    parokiList: [],
    lingkunganList: [],
    umat: {},
    isDatePickerActive: false,
  }),
  async mounted() {
    this.lingkunganList = await getData(`/lingkungan`)
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    
    // Get data surat
    this.formData = await getData(`/surat-keterangan-pindah/${this.$route.params.id}`)
    this.formData = this.formData[0]

    // Mengaktifkan switch jika umat pindah ke paroki baru
    this.isNotKumetiran = this.formData.paroki_baru != 'Kumetiran' ? true : false
  },
  methods: {
    saveDate (date) {
      this.$refs.menu.save(date)
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
      this.formData.tgl_lahir = temp.tgl_lahir
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
      console.log(this.formData)
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await editData('/surat-keterangan-pindah', this.formData.id, this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil diubah!'
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
<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-baptis-anak" />

    <h1>Edit Surat Baptis Anak</h1>

    <div class="form mt-5">
      <v-card class="pa-6 mx-auto" flat>
        <v-form @submit.prevent="submit">
          <h3 class="mb-5">Informasi Anak</h3>

          <autocomplete
            label="Nama anak*"
            :value="formData.nama"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdAnak"
          ></autocomplete>

          <v-alert
            v-show="isAlertUmurActive"
            border="left"
            colored-border
            type="error"
            elevation="2"
          >
            <span>
              Orang yang dipilih berumur lebih dari 7 tahun.
              Harap mendaftar ke Baptis Dewasa
            </span>
          </v-alert>

          <label>Tempat lahir</label>
          <p>{{ formData.tempat_lahir }}</p>

          <label>Tanggal lahir</label>
          <p>{{ formData.tgl_lahir }}</p>

          <label>Nama Baptis*</label>
          <v-text-field
            v-model="formData.nama_baptis"
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
              Anak yang dipilih memiliki catatan orang tua yang belum lengkap.
              Harap lengkapi informasi di menu Anggota Keluarga.
            </span>
          </v-alert>

          <div v-show="!isAlertOrtuActive">
            <label>Nama ayah*</label>
            <p>{{ formData.nama_ayah }}</p>
            
            <label>Nama ibu*</label>
            <p>{{ formData.nama_ibu }}</p>

            <label>Alamat orang tua*</label>
            <p>{{ formData.alamat_ortu }}</p>

            <label>No. telepon orang tua*</label>
            <p>{{ formData.no_telp_ortu }}</p>

            <label>Cara menikah*</label>
            <v-select
              :items="caraMenikahList"
              v-model="formData.cara_ortu_menikah"
              outlined
              dense
            ></v-select>

            <div v-show="formData.cara_ortu_menikah === 'Cara lain'">
              <label>Cara lain*</label>
              <v-text-field
                v-model="temp_cara_ortu_menikah"
                required
                outlined
                dense
              ></v-text-field>
            </div>

            <label>Tanggal menikah*</label>
            <v-menu
              ref="menu"
              v-model="isDatePickerTglNikahActive"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="formData.tgl_ortu_menikah"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="formData.tgl_ortu_menikah"
                :max="new Date().toISOString().substr(0, 10)"
                @change="saveDate"
              ></v-date-picker>
            </v-menu>
          </div>
          
          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Informasi Wali Baptis</h3>

          <v-alert
            text
            rounded="4"
            color="orange"
          >
            <div class="title">
              <h4>Catatan</h4>
            </div>
            <p class="subtitle-5 ma-0">
              Wali baptis harus:
              <ol>
                <li>
                  Berjenis kelamin sama
                </li>
                <li>
                  Beragama Katolik
                </li>
                <li>
                  Sudah menerima sakramen penguatan (krisma)
                </li>
              </ol>
            </p>
          </v-alert>

          <label>Nama Wali Baptis*</label>
          <v-text-field
            v-model="formData.nama_wali_baptis"
            required
            outlined
            dense
          ></v-text-field>

          <label>Tanggal krisma wali baptis*</label>
          <v-menu
            ref="menu"
            v-model="isDatePickerTglKrismaWaliActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_krisma_wali_baptis"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_krisma_wali_baptis"
              :max="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>

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
import { countAge, getData, editData } from '../../../../utils'
import { caraMenikahList } from '../../../../constants'
import Autocomplete from '../../../../components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    url: '/surat-baptis-anak',
    caraMenikahList,
    isDatePickerTglNikahActive: false,
    isDatePickerTglKrismaWaliActive: false,
    formData: {},
    temp_cara_ortu_menikah: '',
    anggotaKeluarga: [],
    isAlertUmurActive: false,
    isAlertOrtuActive: false,
  }),
  computed: {
    isSubmitDisabled() {
      return (this.isAlertOrtuActive || this.isAlertUmurActive) ? true : false
    }
  },
  async mounted() {
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.formData = await getData(`${this.url}/${this.$route.params.id}`)
    this.formData = this.formData[0]

    if(!(this.caraMenikahList.find(e => e === this.formData.cara_ortu_menikah))) {
      this.temp_cara_ortu_menikah = this.formData.cara_ortu_menikah
      this.formData.cara_ortu_menikah = 'Cara lain'
    }
  },
  methods: {
    saveDate (date) {
      this.$refs.menu.save(date)
    },
    async changeIdAnak(e) {
      let temp = this.anggotaKeluarga.find(_ => {
        return _.nama === e
      })
      this.formData.id_anak = temp.id
      this.formData.id_lingkungan = temp.lingkungan_id
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = temp.tgl_lahir

      let umur = countAge(temp.tgl_lahir)
      this.isAlertUmurActive = (umur > 7) ? true : false

      let detailTemp = await getData(`/detail-umat/${temp.id}`)
      detailTemp = detailTemp[0]

      await this.setOrtu(detailTemp.id_ayah, detailTemp.id_ibu)
    },
    async setOrtu(idAyah, idIbu) {
      let tempOrangTua

      this.isAlertOrtuActive = (!idAyah || !idIbu) ? true : false

      if (idAyah) {
        tempOrangTua = await getData(`/umat/${idAyah}`)
        tempOrangTua = tempOrangTua[0]
        this.formData.nama_ayah = tempOrangTua.nama
        this.formData.alamat_ortu = tempOrangTua.alamat
        this.formData.no_telp_ortu = tempOrangTua.no_telp
      }
      if (idIbu) {
        tempOrangTua = await getData(`/umat/${idIbu}`)
        tempOrangTua = tempOrangTua[0]
        this.formData.nama_ibu = tempOrangTua.nama
      }
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}
      if(this.formData.cara_ortu_menikah === 'Cara lain') {
        this.formData.cara_ortu_menikah = this.temp_cara_ortu_menikah
      }

      try {
        let response = await editData(this.url, this.formData.id, this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil diubah!'
          this.$router.push('/keluarga/surat/surat-baptis-anak')
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
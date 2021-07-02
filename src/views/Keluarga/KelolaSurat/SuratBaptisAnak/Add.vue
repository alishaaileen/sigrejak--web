<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-baptis-anak" />

    <h1>Tambah Surat Baptis Anak</h1>

    <div class="form mt-5">
      <v-card class="pa-6" width="100%" flat>
        <v-form @submit.prevent="submit">
          <h3 class="mb-5">Informasi Anak</h3>

          <autocomplete
            label="Nama anak*"
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
              ref="menuTglMenikah"
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
              Catatan
            </div>
            <p class="subtitle-5 ma-0">
              Wali baptis harus:
              <ol type="a">
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
            ref="menuTglKrisma"
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

          <label>File syarat baptis anak*</label>
          <v-alert type="info" text>
            Harap melampirkan syarat baptis, yaitu:
            <ol>
              <li>Akta kelahiran anak (upload di menu <code>Anggota Keluarga > Detail</code> )</li>
              <li>Surat nikah sipil & gereja*</li>
              <li>Surat baptis terbaru Emban/Wali baptis yang sudah menerima Sakramen Penguatan*</li>
            </ol>
            Syarat yang memiliki tanda * harap discan/difoto lalu dimasukan ke dalam file <em>.zip</em> dan diupload disini.
          </v-alert>
          <div class="d-flex mb-5">
            <v-file-input
              accept="application/zip"
              style="display: none;"
              ref="inputSyaratBaptisAnak"
              v-model="formData.file_syarat_baptis"
            ></v-file-input>
            <div>
              <v-btn
                class="text-none"
                color="blue darken-3"
                dark
                depressed
                rounded
                @click="$refs.inputSyaratBaptisAnak.$refs.input.click()"
              >
                <v-icon>mdi-upload</v-icon>
                Upload file
              </v-btn>
            </div>
            <div v-if="formData.file_syarat_baptis.size != 0" class="ml-5">
              <p class="ma-0">
                {{ formData.file_syarat_baptis.name }}<br>
              </p>
              <small>{{ fileSize }} Mb</small>
            </div>
          </div>

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
import { countAge, getData, getOneData, postData, changeDateFormat } from '../../../../utils'
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
    formData: {
      id_keluarga: null,
      id_lingkungan: null,
      ketua_lingkungan: null,
      
      id_anak: null,
      tempat_lahir: '-',
      tgl_lahir: '-',
      nama_baptis: '',

      id_ortu: '-',
      nama_ayah: '-',
      nama_ibu: '-',
      alamat_ortu: '-',
      no_telp_ortu: '-',
      cara_ortu_menikah: '',
      tempat_ortu_menikah: '',
      tgl_ortu_menikah: '',

      nama_wali_baptis: '',
      tgl_krisma_wali_baptis: '',
      
      file_syarat_baptis: { size: 0 },
      
      isKetuaLingkungan: false,
    },
    temp_cara_ortu_menikah: '',
    anggotaKeluarga: [],
    isAlertUmurActive: false,
    isAlertOrtuActive: false,
  }),
  computed: {
    isSubmitDisabled() {
      return (this.isAlertOrtuActive || this.isAlertUmurActive) ? true : false
    },
    fileSize() {
      let sizeInMb = this.formData.file_syarat_baptis.size/1024/1024
      sizeInMb = sizeInMb.toString()
      sizeInMb = sizeInMb.substring(0, 5)

      return sizeInMb
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
    saveDate (date) {
      this.$refs.menuTglMenikah.save(date)
      this.$refs.menuTglKrisma.save(date)
    },
    async changeIdAnak(e) {
      let temp = this.anggotaKeluarga.find(_ => {
        return _.nama === e
      })
      this.formData.id_anak = temp.id
      this.formData.id_lingkungan = temp.lingkungan_id
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = changeDateFormat(temp.tgl_lahir)

      let umur = countAge(temp.tgl_lahir)
      this.isAlertUmurActive = (umur > 7) ? true : false

      let detailTemp = await getOneData(`/detail-umat/${temp.id}`)

      await this.setOrtu(detailTemp.id_ayah, detailTemp.id_ibu)
    },
    async setOrtu(idAyah, idIbu) {
      let tempOrangTua

      this.isAlertOrtuActive = (!idAyah || !idIbu) ? true : false

      if (idAyah) {
        tempOrangTua = await getOneData(`/umat/${idAyah}`)
        this.formData.nama_ayah = tempOrangTua.nama
        this.formData.alamat_ortu = tempOrangTua.alamat
        this.formData.no_telp_ortu = tempOrangTua.no_telp
      }
      if (idIbu) {
        tempOrangTua = await getOneData(`/umat/${idIbu}`)
        this.formData.nama_ibu = tempOrangTua.nama
      }
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}
        , formData = new FormData()
      if(this.formData.cara_ortu_menikah === 'Cara lain') {
        this.formData.cara_ortu_menikah = this.temp_cara_ortu_menikah
      }

      formData.append('id_keluarga', this.formData.id_keluarga)
      formData.append('id_lingkungan', this.formData.id_lingkungan)
      formData.append('id_anak', this.formData.id_anak)
      formData.append('nama_baptis', this.formData.nama_baptis)
      formData.append('cara_ortu_menikah', this.formData.cara_ortu_menikah)
      formData.append('tempat_ortu_menikah', this.formData.tempat_ortu_menikah)
      formData.append('tgl_ortu_menikah', this.formData.tgl_ortu_menikah)
      formData.append('nama_wali_baptis', this.formData.nama_wali_baptis)
      formData.append('tgl_krisma_wali_baptis', this.formData.tgl_krisma_wali_baptis)
      formData.append('ketua_lingkungan', this.formData.ketua_lingkungan)
      formData.append('isKetuaLingkungan', this.formData.isKetuaLingkungan)
      formData.append('file_syarat_baptis', this.formData.file_syarat_baptis)

      try {
        let response = await postData(`${this.url}/add`, formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
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
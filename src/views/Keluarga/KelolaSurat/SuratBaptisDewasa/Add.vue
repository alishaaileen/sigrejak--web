<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-baptis-dewasa" />

    <h1>Tambah Surat Baptis Dewasa</h1>

    <div class="form mt-5">
      <v-card class="pa-6" flat>
        <v-form ref="form" @submit.prevent="submit">
          <h3 class="mb-5">Informasi Calon Baptis</h3>

          <autocomplete
            label="Nama*"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdUmat"
            :rules="[required]"
          ></autocomplete>

          <v-alert
            v-show="isAlertUmurActive"
            border="left"
            colored-border
            type="error"
            elevation="2"
          >
            <span>
              Orang yang dipilih berumur kurang dari 7 tahun.
              Harap mendaftar ke Baptis Anak
            </span>
          </v-alert>

          <v-alert
            v-show="isAlertOrtuActive"
            border="left"
            colored-border
            type="error"
            elevation="2"
          >
            <span>
              Calon yang dipilih memiliki catatan orang tua yang belum lengkap.
              Harap lengkapi informasi di menu Anggota Keluarga.
            </span>
          </v-alert>

          <div v-show="!isAlertOrtuActive">
            <label>Nama ayah</label>
            <p>{{ formData.nama_ayah }}</p>
            
            <label>Nama ibu</label>
            <p>{{ formData.nama_ibu }}</p>
          </div>

          <label>Tempat lahir</label>
          <p>{{ formData.tempat_lahir }}</p>

          <label>Tanggal lahir</label>
          <p>{{ formData.tgl_lahir }}</p>

          <label>Alamat</label>
          <p>{{ formData.alamat }}</p>

          <label>No. Telp/HP</label>
          <p>{{ formData.no_telp }}</p>

          <label>Nama Baptis*</label>
          <v-text-field
            v-model="formData.nama_baptis"
            required
            outlined
            dense
            :rules="[required]"
          ></v-text-field>

          <label>Status perkawinan*</label>
          <v-select
            :items="['Belum menikah', 'Akan menikah', 'Sudah menikah']"
            v-model="formData.status_perkawinan"
            outlined
            dense
            @change="changeStatusPerkawinan"
            :rules="[required]"
          ></v-select>

          <div v-if="formData.status_perkawinan === 'Akan menikah'">
            <label>Akan menikah dengan*</label>
            <v-text-field
              v-model="formData.calon_pasangan"
              required
              outlined
              dense
              :rules="[required]"
            ></v-text-field>

            <label>Tanggal menikah dengan calon*</label>
            <v-menu
              ref="menuTglMenikahCalon"
              v-model="isDatePickerTglNikahCalonActive"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="formData.tgl_menikah_calon"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                  :rules="[required]"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="formData.tgl_menikah_calon"
                :min="new Date().toISOString().substr(0, 10)"
                @change="(date) => { this.$refs.menuTglMenikahCalon.save(date) }"
              ></v-date-picker>
            </v-menu>
          </div>

          <div v-else-if="formData.status_perkawinan === 'Sudah menikah'">
            <label>Cara menikah*</label>
            <v-select
              :items="caraMenikahList"
              v-model="formData.cara_menikah"
              outlined
              dense
              :rules="[required]"
            ></v-select>

            <div v-if="formData.cara_menikah === 'Cara lain'">
              <label>Cara lain*</label>
              <v-text-field
                v-model="temp_cara_menikah"
                required
                outlined
                dense
                :rules="[required]"
              ></v-text-field>
            </div>

            <label>Tempat menikah*</label>
            <v-text-field
              v-model="formData.tempat_menikah"
              required
              outlined
              dense
              :rules="[required]"
            ></v-text-field>

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
                  v-model="formData.tgl_menikah"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                  :rules="[required]"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="formData.tgl_menikah"
                :max="new Date().toISOString().substr(0, 10)"
                @change="(date) => { this.$refs.menuTglMenikah.save(date) }"
              ></v-date-picker>
            </v-menu>

            <v-row>
              <v-col cols="6">
                <v-switch
                  v-model="isBatalNikah"
                  :label="isBatalNikah ? 'Pernikahan diputuskan/dibatalkan' : 'Pernikahan tidak diputuskan/dibatalkan'"
                  color="primary"
                  background-color="white"
                  @change="switchBatalNikah"
                ></v-switch>
              </v-col>
            </v-row>

            <div v-if="isBatalNikah">
              <label>Alasan pemutusan/pembatalan*</label>
              <v-select
                :items="['Kematian', 'Perceraian sipil', 'Pembatalan Gerejani', 'Cara lain']"
                v-model="formData.pembatalan_perkawinan"
                outlined
                dense
                :rules="[required]"
              ></v-select>

              <div v-if="formData.pembatalan_perkawinan === 'Cara lain'">
                <label>Alasan pembatalan*</label>
                <v-text-field
                  v-model="temp_pembatalan_perkawinan"
                  outlined
                  dense
                  :rules="[required]"
                ></v-text-field>
              </div>
            </div>
          </div>

          <v-divider class="mb-5"></v-divider>

          <label>Mengikuti pelajaran agama sejak*</label>
          <v-menu
            ref="menuTglMulaiBelajar"
            v-model="isDatePickerTglMulaiBelajarActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_mulai_belajar_agama"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
                :rules="[required]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_mulai_belajar_agama"
              :max="new Date().toISOString().substr(0, 10)"
              @change="(date) => { this.$refs.menuTglMulaiBelajar.save(date) }"
            ></v-date-picker>
          </v-menu>

          <label>Mengikuti ekaristi sejak*</label>
          <v-menu
            ref="menuTglMulaiEkaristi"
            v-model="isDatePickerTglMulaiEkaristiActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_mulai_ikut_ekaristi"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
                :rules="[required]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_mulai_ikut_ekaristi"
              :max="new Date().toISOString().substr(0, 10)"
              @change="(date) => { this.$refs.menuTglMulaiEkaristi.save(date) }"
            ></v-date-picker>
          </v-menu>

          <label>Mengikuti kegiatan lingkungan sejak*</label>
          <v-menu
            ref="menuTglMulaiKegiatan"
            v-model="isDatePickerTglMulaiKegiatanActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_mulai_kegiatan_lingkungan"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
                :rules="[required]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_mulai_kegiatan_lingkungan"
              :max="new Date().toISOString().substr(0, 10)"
              @change="(date) => { this.$refs.menuTglMulaiKegiatan.save(date) }"
            ></v-date-picker>
          </v-menu>

          <label>Nama guru agama yang mengajar*</label>
          <v-text-field
            v-model="formData.nama_guru"
            required
            outlined
            dense
            :rules="[required]"
          ></v-text-field>
          
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
            v-model="formData.nama_wali"
            required
            outlined
            dense
            :rules="[required]"
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
                v-model="formData.tgl_krisma_wali"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
                :rules="[required]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_krisma_wali"
              :max="new Date().toISOString().substr(0, 10)"
              @change="(date) => { this.$refs.menuTglKrisma.save(date) }"
            ></v-date-picker>
          </v-menu>

          <label>Tempat krisma wali*</label>
          <v-text-field
            v-model="formData.tempat_krisma_wali"
            required
            outlined
            dense
            :rules="[required]"
          ></v-text-field>

          <label>File syarat baptis*</label>
          <v-alert type="info" text>
            Harap melampirkan syarat baptis, yaitu:
            <ol>
              <li>Akta kelahiran (upload di menu <code>Anggota Keluarga > Detail</code> )</li>
              <li>Surat nikah sipil & gereja*</li>
              <li>Surat baptis terbaru Emban/Wali baptis yang sudah menerima Sakramen Penguatan*</li>
            </ol>
            Syarat yang memiliki tanda * harap discan/difoto lalu dimasukan ke dalam file <em>.zip</em> dan diupload disini.
          </v-alert>
          <div class="d-flex mb-5">
            <v-file-input
              accept="application/zip"
              style="display: none;"
              ref="inputSyaratBaptisUmat"
              v-model="formData.file_syarat_baptis"
              :rules="[required, acceptZipOnly]"
            ></v-file-input>
            <div>
              <v-btn
                class="text-none"
                color="blue darken-3"
                dark
                depressed
                rounded
                @click="$refs.inputSyaratBaptisUmat.$refs.input.click()"
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
import { countAge, getData, getOneData, postData, changeDateFormat } from '@/utils'
import { required, acceptZipOnly } from '@/validations'
import { caraMenikahList } from '@/constants'

import Autocomplete from '@/components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    url: '/surat-baptis-dewasa',
    caraMenikahList,
    isBatalNikah: false,
    isDatePickerTglNikahCalonActive: false,
    isDatePickerTglNikahActive: false,
    isDatePickerTglKrismaWaliActive: false,
    isDatePickerTglMulaiBelajarActive: false,
    isDatePickerTglMulaiEkaristiActive: false,
    isDatePickerTglMulaiKegiatanActive: false,
    formData: {
      id_keluarga: null,
      id_lingkungan: null,
      ketua_lingkungan: null,
      
      id_umat: null,
      tempat_lahir: '-',
      tgl_lahir: '-',
      alamat: '-',
      no_telp: '-',
      nama_baptis: '',
      status_perkawinan: '',
      calon_pasangan: '',
      tgl_menikah_calon: '',
      cara_menikah: '',
      tempat_menikah: '',
      tgl_menikah: '',
      pembatalan_perkawinan: '',
      tgl_mulai_belajar_agama: null,
      tgl_mulai_ikut_ekaristi: null,
      tgl_mulai_kegiatan_lingkungan: null,
      nama_guru: '',

      nama_ayah: '-',
      nama_ibu: '-',

      nama_wali: '',
      tgl_krisma_wali: '',
      tempat_krisma_wali: '',
      
      file_syarat_baptis: { size: 0 },
      
      isKetuaLingkungan: false,
    },
    temp_cara_menikah: '',
    temp_pembatalan_perkawinan: '',
    anggotaKeluarga: [],
    isAlertUmurActive: false,
    isAlertOrtuActive: false,

    // validation rules
    required,
    acceptZipOnly,
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
    // console.log(this.$refs)
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)

    // filter anggota yg sudah dihapus
    this.anggotaKeluarga = this.anggotaKeluarga.filter(e => e.deleted_at === null)

    this.formData.id_keluarga = this.$store.state.keluarga.id
  },
  methods: {
    changeStatusPerkawinan() {
      this.formData.calon_pasangan = null
      this.formData.tgl_menikah_calon = null
      this.formData.cara_menikah = null
      this.formData.tempat_menikah = null
      this.formData.tgl_menikah = null
      this.formData.pembatalan_perkawinan = null
    },
    switchBatalNikah() {
      this.formData.pembatalan_perkawinan = null
    },
    async changeIdUmat(e) {
      let temp = this.anggotaKeluarga.find(_ => {
        return (_.nama === e && _.deleted_at === null)
      })
      this.formData.id_umat = temp.id
      this.formData.id_lingkungan = temp.lingkungan_id
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.alamat = temp.alamat
      this.formData.no_telp = temp.no_telp
      this.formData.tgl_lahir = changeDateFormat(temp.tgl_lahir)

      let umur = countAge(temp.tgl_lahir)
      this.isAlertUmurActive = (umur < 7) ? true : false

      let detailTemp = await getOneData(`/detail-umat/${temp.id}`)

      await this.setOrtu(detailTemp.id_ayah, detailTemp.id_ibu)
    },
    async setOrtu(idAyah, idIbu) {
      let tempOrangTua

      this.isAlertOrtuActive = (!idAyah || !idIbu) ? true : false

      if (idAyah) {
        tempOrangTua = await getOneData(`/umat/${idAyah}`)
        this.formData.nama_ayah = tempOrangTua.nama || '-'
      }
      if (idIbu) {
        tempOrangTua = await getOneData(`/umat/${idIbu}`)
        this.formData.nama_ibu = tempOrangTua.nama || '-'
      }
    },
    async submit() {
      let snackbar = {}
      
      if(!this.$refs.form.validate()) {
        this.$refs.form.validate()
        snackbar.color = 'error',
        snackbar.text = 'Harap periksa inputan anda kembali'
        this.$store.dispatch('snackbar/openSnackbar', snackbar)
        return
      }

      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let formData = new FormData()

      formData.append('id_keluarga', this.formData.id_keluarga)
      formData.append('id_lingkungan', this.formData.id_lingkungan)
      formData.append('id_umat', this.formData.id_umat)
      formData.append('nama_baptis', this.formData.nama_baptis)
      formData.append('status_perkawinan', this.formData.status_perkawinan)
      formData.append('calon_pasangan', this.formData.calon_pasangan)
      formData.append('tempat_menikah', this.formData.tempat_menikah)
      formData.append('tgl_mulai_belajar_agama', this.formData.tgl_mulai_belajar_agama)
      formData.append('tgl_mulai_ikut_ekaristi', this.formData.tgl_mulai_ikut_ekaristi)
      formData.append('tgl_mulai_kegiatan_lingkungan', this.formData.tgl_mulai_kegiatan_lingkungan)
      formData.append('nama_guru', this.formData.nama_guru)
      formData.append('nama_wali', this.formData.nama_wali)
      formData.append('tgl_krisma_wali', this.formData.tgl_krisma_wali)
      formData.append('tempat_krisma_wali', this.formData.tempat_krisma_wali)
      formData.append('file_syarat_baptis', this.formData.file_syarat_baptis)
      formData.append('cara_menikah', this.formData.cara_menikah === 'Cara lain'
        ? this.formData.cara_menikah
        : this.temp_cara_menikah
      )
      formData.append('pembatalan_perkawinan', this.formData.pembatalan_perkawinan === 'Cara lain'
        ? this.formData.cara_menikah
        : this.temp_pembatalan_perkawinan
      )
      if(this.formData.status_perkawinan === 'Akan menikah') {
        formData.append('tgl_menikah_calon', this.formData.tgl_menikah_calon)        
      } else if(this.formData.status_perkawinan === 'Sudah menikah') {
        formData.append('tgl_menikah', this.formData.tgl_menikah)
      }

      if (this.formData.id_lingkungan == this.$store.state.keluarga.lingkunganId) {
        this.formData.isKetuaLingkungan = true
        this.formData.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
      } else {
        this.formData.isKetuaLingkungan = false
        this.formData.ketua_lingkungan = null
      }
      formData.append('ketua_lingkungan', this.formData.ketua_lingkungan)
      formData.append('isKetuaLingkungan', this.formData.isKetuaLingkungan)

      try {
        let response = await postData(`${this.url}/add`, formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
          this.$router.push('/keluarga/surat/surat-baptis-dewasa')
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
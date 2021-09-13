<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-calon-pengantin" />

    <h1>Tambah Surat Keterangan Calon Pengantin</h1>

    <div class="form mt-5">
      <v-card class="pa-6" width="100%" flat>
        <v-form ref="form" @submit.prevent="submit">
          <v-alert type="info" color="orange" text icon="fas fa-info-circle">
            Satu surat hanya berlaku untuk <strong>satu orang</strong>
          </v-alert>
          <h3 class="mb-5">Informasi Umat</h3>

          <autocomplete
            label="Nama*"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdUmat"
            :rules="[required]"
          ></autocomplete>

          <v-alert
            v-show="isAlertOrtuActive"
            border="left"
            colored-border
            type="error"
            elevation="2"
          >
            <span>
              Umat yang dipilih belum memiliki catatan lengkap ayah dan ibu.
              Harap lengkapi informasi di menu Anggota Keluarga.
            </span>
          </v-alert>

          <label>Tempat lahir</label>
          <p>{{ formData.tempat_lahir }}</p>

          <label>Tanggal lahir</label>
          <p>{{ formData.tgl_lahir }}</p>

          <label>Alamat</label>
          <p>{{ formData.alamat }}</p>

          <label>No. telepon</label>
          <p>{{ formData.no_telp }}</p>

          <label>Pekerjaan</label>
          <p>{{ formData.pekerjaan }}</p>

          <label>Agama</label>
          <p>Katolik</p>

          <label>Nama ayah</label>
          <p>{{ formData.nama_ayah }}</p>

          <label>Nama ibu</label>
          <p>{{ formData.nama_ibu }}</p>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Informasi Pasangan</h3>

          <label>Nama pasangan*</label>
          <v-text-field
            v-model="formData.nama_pasangan"
            required
            outlined
            dense
            :rules="[required]"
          ></v-text-field>

          <label>Tempat lahir*</label>
          <v-textarea
            v-model="formData.tempat_lahir_pasangan"
            required
            outlined
            dense
            :rules="[required]"
          ></v-textarea>
          
          <label>Tanggal lahir pasangan*</label>
          <v-menu
            ref="dateMenu"
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_lahir_pasangan"
                prepend-inner-icon="mdi-calendar"
                dense
                readonly
                outlined
                v-bind="attrs"
                v-on="on"
                :rules="[required]"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="formData.tgl_lahir_pasangan"
              :max="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>
          
          <label>Alamat pasangan*</label>
          <v-textarea
            v-model="formData.alamat_pasangan"
            required
            outlined
            dense
            :hint="`${formData.alamat_pasangan.length}/255`"
            :rules="[required]"
          ></v-textarea>

          <label>No. telp pasangan*</label>
          <v-text-field
            v-model="formData.no_telp_pasangan"
            required
            outlined
            dense
            :rules="[required]"
          ></v-text-field>

          <label>Agama pasangan*</label>
          <v-select
            :items="[ 'Katolik', 'Kristen', 'Islam', 'Hindu', 'Buddha', 'Konghucu' ]"
            v-model="formData.agama_pasangan"
            outlined
            dense
            :rules="[required]"
          ></v-select>

          <label>Nama ayah pasangan*</label>
          <v-text-field
            v-model="formData.nama_ayah_pasangan"
            required
            outlined
            dense
            :rules="[required]"
          ></v-text-field>

          <label>Nama ibu pasangan* (nama kecil)</label>
          <v-text-field
            v-model="formData.nama_ibu_pasangan"
            required
            outlined
            dense
            :rules="[required]"
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Syarat-syarat</h3>

          <label>File syarat*</label>
          <v-alert type="info" dense text>
            Harap memasukan semua syarat dalam format <em>.zip</em> lalu upload file <em>.zip</em> -nya  
          </v-alert>
          <div class="d-flex mb-5">
            <v-file-input
              accept="application/zip"
              style="display: none;"
              ref="inputSyarat"
              v-model="formData.file_syarat"
              :rules="[required, acceptZipOnly]"
            ></v-file-input>
            <div>
              <v-btn
                class="text-none"
                color="blue darken-3"
                dark
                depressed
                @click="$refs.inputSyarat.$refs.input.click()"
              >
                <v-icon>mdi-upload</v-icon>
                Upload file
              </v-btn>
            </div>
            <div v-if="formData.file_syarat.size != 0" class="ml-5">
              <p class="ma-0">
                {{ formData.file_syarat.name }}<br>
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
import { getAnggotaKeluargaNotDeleted, getOneData, postData, changeDateFormat } from '@/utils'
import { required, acceptZipOnly } from '@/validations'
import Autocomplete from '@/components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    dateMenu: false,
    formData: {
      id_keluarga: null,
      id_lingkungan: null,
      ketua_lingkungan: null,
      
      id_umat: null,
      tempat_lahir: '-',
      tgl_lahir: '-',
      alamat: '-',
      no_telp: '-',
      pekerjaan: '-',
      nama_ayah: '-',
      nama_ibu: '-',

      nama_pasangan: '',
      tempat_lahir_pasangan: '',
      tgl_lahir_pasangan: '',
      alamat_pasangan: '',
      no_telp_pasangan: '',
      pekerjaan_pasangan: '',
      agama_pasangan: '',
      nama_ayah_pasangan: '',
      nama_ibu_pasangan: '',

      file_syarat: { size: 0 },
      
      isKetuaLingkungan: false,
    },
    anggotaKeluarga: [],
    isAlertOrtuActive: false,

    // validation rules
    required,
    acceptZipOnly,
  }),
  computed: {
    isSubmitDisabled() {
      return this.isAlertOrtuActive ? true : false
    },
    fileSize() {
      let sizeInMb = this.formData.file_syarat.size/1024/1024
      sizeInMb = sizeInMb.toString()
      sizeInMb = sizeInMb.substring(0, 5)

      return sizeInMb
    }
  },
  watch: {
    dateMenu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  async mounted() {
    this.anggotaKeluarga = await getAnggotaKeluargaNotDeleted(this.$store.state.keluarga.id)
    this.formData.id_keluarga = this.$store.state.keluarga.id
  },
  methods: {
    saveDate (date) {
      this.$refs.dateMenu.save(date)
    },
    async changeIdUmat(e) {
      let temp = this.anggotaKeluarga.find(_ => {
        return _.nama === e
      })
      this.formData.id_umat = temp.id
      this.formData.id_lingkungan = temp.lingkungan_id
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = changeDateFormat(temp.tgl_lahir)
      this.formData.alamat = temp.alamat
      this.formData.no_telp = temp.no_telp
      this.formData.pekerjaan = temp.pekerjaan

      let detailTemp = await getOneData(`/detail-umat/${temp.id}`)

      await this.setOrtu(detailTemp.id_ayah, detailTemp.id_ibu)
    },
    async setOrtu(idAyah, idIbu) {
      let tempOrangTua = {}

      this.isAlertOrtuActive = false
      if (idAyah === null || idIbu === null) {
        this.isAlertOrtuActive = true
      }
      
      tempOrangTua = await getOneData(`/umat/${idIbu}`)
      this.formData.nama_ibu = tempOrangTua.nama || '-'
      
      tempOrangTua = await getOneData(`/umat/${idAyah}`)
      this.formData.nama_ayah = tempOrangTua.nama || '-'
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
      formData.append('nama_pasangan', this.formData.nama_pasangan)
      formData.append('tempat_lahir_pasangan', this.formData.tempat_lahir_pasangan)
      formData.append('tgl_lahir_pasangan', this.formData.tgl_lahir_pasangan)
      formData.append('alamat_pasangan', this.formData.alamat_pasangan)
      formData.append('no_telp_pasangan', this.formData.no_telp_pasangan)
      formData.append('pekerjaan_pasangan', this.formData.pekerjaan_pasangan)
      formData.append('agama_pasangan', this.formData.agama_pasangan)
      formData.append('nama_ayah_pasangan', this.formData.nama_ayah_pasangan)
      formData.append('nama_ibu_pasangan', this.formData.nama_ibu_pasangan)
      formData.append('file_syarat', this.formData.file_syarat)

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
        let response = await postData('/surat-keterangan-calon-pengantin/add', formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
          this.$router.push('/keluarga/surat/surat-keterangan-calon-pengantin')
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
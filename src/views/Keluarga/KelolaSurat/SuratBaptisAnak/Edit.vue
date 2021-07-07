<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-baptis-anak" />

    <h1>Edit Surat Baptis Anak</h1>

    <div class="form mt-5">
      <v-card class="mx-auto" flat>
        <v-card-title>
          <h3>Detail Informasi</h3>
          
          <v-spacer></v-spacer>

          <v-btn
            class="btn text-none mr-3"
            color="yellow accent-4"
            dark
            depressed
            rounded
          >
            <v-icon small>mdi-chat</v-icon>
            Chat
          </v-btn>

          <approval-chip
            :approval="formData.ketua_lingkungan_approval"
            role="Ketua Lingkungan"
            :nama="formData.ketua_lingkungan"
          ></approval-chip>

          <approval-chip
            :approval="formData.sekretariat_approval"
            role="Sekretariat"
            :nama="sekretariat.nama"
          ></approval-chip>
        </v-card-title>

        <v-divider></v-divider>

        <v-form class="pa-6" @submit.prevent="submit">
          <h3 class="mb-5">Informasi Anak</h3>

          <autocomplete
            label="Nama anak*"
            :value="formData.nama"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdAnak"
            :disable="(!isEditable)"
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
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
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
              :disabled="(!isEditable)"
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
                  :disabled="(!isEditable)"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="formData.tgl_ortu_menikah"
                :max="new Date().toISOString().substr(0, 10)"
                @change="saveDate"
                :disabled="(!isEditable)"
                :readonly="(!isEditable)"
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
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-text-field>

          <label>Tanggal krisma wali baptis*</label>
          <v-menu
            ref="menu"
            v-model="isDatePickerTglKrismaWaliActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            :disabled="(!isEditable)"
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
                :disabled="(!isEditable)"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_krisma_wali_baptis"
              :max="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
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
          <div class="my-5">
            <v-btn v-if="(typeof formData.file_syarat_baptis) == 'string'"
              text
              small
              color="blue"
              @click="downloadFile(formData.file_syarat_baptis)"
            >
              klik untuk melihat file
            </v-btn>
          </div>
          <div class="d-flex mb-5">
            <v-file-input
              accept="application/zip"
              style="display: none;"
              ref="inputSyaratBaptisAnak"
              v-model="formData.file_syarat_baptis"
            ></v-file-input>
            <div>
              <v-btn
                v-if="isEditable"
                class="text-none"
                color="blue darken-3"
                dark
                depressed
                @click="$refs.inputSyaratBaptisAnak.$refs.input.click()"
              >
                Upload file
              </v-btn>
            </div>
            <div v-if="(typeof formData.file_syarat_baptis) != 'string'" class="ml-5">
              <p class="ma-0">{{formData.file_syarat_baptis.name}}</p>
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
import { countAge, getData, getOneData, editData, changeDateFormat } from '../../../../utils'
import { caraMenikahList } from '../../../../constants'
import Autocomplete from '../../../../components/Autocomplete'
import ApprovalChip from '../../../../components/ApprovalChip.vue'
import { API_URL } from '../../../../constants'

export default {
  components: {
    Autocomplete,
    ApprovalChip,
  },
  data: () => ({
    url: '/surat-baptis-anak',
    isEditable: false,
    caraMenikahList,
    isDatePickerTglNikahActive: false,
    isDatePickerTglKrismaWaliActive: false,
    formData: {},
    temp_cara_ortu_menikah: '',
    anggotaKeluarga: [],
    isAlertUmurActive: false,
    isAlertOrtuActive: false,
    sekretariat: { nama: '' },
  }),
  computed: {
    isSubmitDisabled() {
      return (this.isAlertOrtuActive || this.isAlertUmurActive || !this.isEditable) ? true : false
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
    this.formData = await getOneData(`${this.url}/${this.$route.params.id}`)
    this.formData.tgl_lahir = changeDateFormat(this.formData.tgl_lahir)

    if(!(this.caraMenikahList.find(e => e === this.formData.cara_ortu_menikah))) {
      this.temp_cara_ortu_menikah = this.formData.cara_ortu_menikah
      this.formData.cara_ortu_menikah = 'Cara lain'
    }

    // Get data sekretariat and romo if surat has been approved
    if(this.formData.id_sekretariat != null) {
      this.sekretariat = await getOneData(`/admin/${this.formData.id_sekretariat}`)
    }

    // Set editable boolean to true if ketua lingkungan have not approved
    this.isEditable = this.formData.ketua_lingkungan_approval === 1 ? false : true
  },
  methods: {
    async downloadFile(fileName) {
      window.open(`${API_URL}/files/${fileName}`, '_blank')
    },

    
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
        this.formData.nama_ayah = tempOrangTua.nama || '-'
        this.formData.alamat_ortu = tempOrangTua.alamat || '-'
        this.formData.no_telp_ortu = tempOrangTua.no_telp || '-'
      }
      if (idIbu) {
        tempOrangTua = await getOneData(`/umat/${idIbu}`)
        this.formData.nama_ibu = tempOrangTua.nama || '-'
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
      if (typeof this.formData.file_syarat_baptis != 'string') {
        formData.append('file_syarat_baptis', this.formData.file_syarat_baptis)
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
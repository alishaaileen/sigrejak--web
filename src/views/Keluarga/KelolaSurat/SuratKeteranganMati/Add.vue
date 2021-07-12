<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-mati" />
    
    <h1>Tambah Surat Keterangan Kematian</h1>

    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-6 mx-auto" flat>
        <v-form>
          <h3 class="mb-5">Informasi Umat</h3>

          <autocomplete
            label="Nama* (Pastikan umat yang dipilih memiliki data orang tua)"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdUmat"
          ></autocomplete>

          <label>Nama baptis</label>
          <p>{{ formData.nama_baptis }}</p>

          <label>Tempat lahir</label>
          <p>{{ formData.tempat_lahir }}</p>

          <label>Tanggal lahir</label>
          <p>{{formData.tgl_lahir}}</p>

          <label>Alamat</label>
          <p>{{ formData.alamat }}</p>

          <v-divider class="mb-5"></v-divider>

          <!-- <h3 class="mb-5">Informasi Kematian</h3> -->

          <label>Tempat meninggal*</label>
          <v-textarea
            v-model="formData.tempat_meninggal"
            required
            outlined
            dense
          ></v-textarea>

          <label>Tanggal meninggal*</label>
          <v-menu
            ref="menuTglMeninggal"
            v-model="isDatePickerTglMeninggalActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_meninggal"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_meninggal"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>

          <label>Tempat pemakaman/kremasi*</label>
          <v-textarea
            v-model="formData.tempat_makam_kremasi"
            required
            outlined
            dense
          ></v-textarea>

          <label>Tanggal pemakaman/kremasi*</label>
          <v-menu
            ref="menuTglMakam"
            v-model="isDatePickerTglMakamActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_makam_kremasi"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_makam_kremasi"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Informasi Keluarga</h3>

          <v-alert
            v-show="isAlertOrtuActive"
            border="left"
            colored-border
            type="error"
            elevation="2"
          >
            <span>
              Umat yang dipilih belum memiliki catatan orang tua.
              Harap lengkapi informasi di menu Anggota Keluarga.
            </span>
          </v-alert>

          <label>Nama orang tua</label>
          <p>{{ formData.nama_orang_tua }}</p>

          <label>Nama Pasangan*</label>
          <v-text-field
            v-model="formData.nama_pasangan"
            required
            outlined
            dense
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Sakramen yang diterima sebelum meninggal</h3>

          <h4 class="mb-5">a. Viaticum (Komuni)</h4>
          <v-row>
            <v-col>
              <label>Tanggal*</label>
              <v-menu
                ref="menuTglKomuni"
                v-model="isDatePickerKomuniActive"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formData.tgl_komuni"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.tgl_komuni"
                  @change="saveDate"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <label>Nama pelayan sakramen*</label>
              <v-text-field
                v-model="formData.pelayan_komuni"
                prefix="Romo"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>

          <h4 class="mb-5">b. Pengampunan Dosa</h4>
          <v-row>
            <v-col>
              <label>Tanggal*</label>
              <v-menu
                ref="menuTglPengampunan"
                v-model="isDatePickerPengampunanActive"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formData.tgl_pengampunan_dosa"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.tgl_pengampunan_dosa"
                  @change="saveDate"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <label>Nama pelayan sakramen*</label>
              <v-text-field
                v-model="formData.pelayan_pengampunan_dosa"
                prefix="Romo"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>

          <h4 class="mb-5">c. Perminyakan orang sakit</h4>
          <v-row>
            <v-col>
              <label>Tanggal*</label>
              <v-menu
                ref="menuTglPerminyakan"
                v-model="isDatePickerPerminyakanActive"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formData.tgl_perminyakan"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.tgl_perminyakan"
                  @change="saveDate"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <label>Nama pelayan sakramen*</label>
              <v-text-field
                v-model="formData.pelayan_perminyakan"
                prefix="Romo"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>

          <h4 class="mb-5">d. Baptis Darurat</h4>
          <v-row>
            <v-col>
              <label>Tanggal*</label>
              <v-menu
                ref="menuTglBaptisDarurat"
                v-model="isDatePickerBaptisDaruratActive"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formData.tgl_baptis_darurat"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.tgl_baptis_darurat"
                  @change="saveDate"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <label>Nama pelayan sakramen*</label>
              <v-text-field
                v-model="formData.pelayan_baptis_darurat"
                prefix="Romo"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="mb-5"></v-divider>

          <autocomplete
            label="Imam yang memberkati*"
            :suggestionList="imamList"
            itemText="nama"
            @changeData="changeIdImam"
          ></autocomplete>

          <label>Nama pelapor*</label>
          <v-text-field
            v-model="formData.nama_pelapor"
            required
            outlined
            dense
          ></v-text-field>

          <label>Nomor HP pelapor*</label>
          <v-text-field
            v-model="formData.no_hp_pelapor"
            required
            outlined
            dense
          ></v-text-field>

          <label>Nomor HP keluarga/penanggung jawab yang bisa dihubungi*</label>
          <v-text-field
            v-model="formData.no_hp_penanggungjawab"
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
              :disabled="isSubmitDisabled"
            >
              Ajukan surat
            </v-btn>
          </div>
        </v-form>
      </v-card>     
    </div>
    <snackbar></snackbar>
  </div>
</template>

<script>
import { getData, getOneData, postData, changeDateFormat } from '../../../../utils'
import Autocomplete from '../../../../components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    url: '/surat-keterangan-mati',
    isDatePickerTglMeninggalActive: false,
    isDatePickerTglMakamActive: false,
    isDatePickerKomuniActive: false,
    isDatePickerPengampunanActive: false,
    isDatePickerPerminyakanActive: false,
    isDatePickerBaptisDaruratActive: false,
    isAlertOrtuActive: false,
    formData: {
      id_keluarga: null,
      id_lingkungan: null,
      ketua_lingkungan: null,
      
      id_umat: null,
      nama_baptis: '-',
      tempat_lahir: '-',
      tgl_lahir: '-',
      alamat: '-',

      nama_orang_tua: '-',
      nama_pasangan: '',

      nama_keluarga_penanggung_jawab: '',
      alamat_keluarga_penanggung_jawab: '',
      no_telp_keluarga_penanggung_jawab: '',
      
      isKetuaLingkungan: false,
    },
    anggotaKeluarga: [],
    imamList: [],
  }),
  computed: {
    isSubmitDisabled() {
      return this.isAlertOrtuActive ? true : false
    }
  },
  async mounted() {
    this.imamList = await getData(`/admin/role/4`)
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.formData.id_keluarga = this.$store.state.keluarga.id
    if (this.$store.state.keluarga.lingkunganId) {
      this.formData.isKetuaLingkungan = true
      this.formData.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
    }
  },
  methods: {
    saveDate(date) {
      this.$refs.menuTglMeninggal.save(date)
      this.$refs.menuTglMakam.save(date)
      this.$refs.menuTglKomuni.save(date)
      this.$refs.menuTglPengampunan.save(date)
      this.$refs.menuTglPerminyakan.save(date)
      this.$refs.menuTglBaptisDarurat.save(date)
    },
    changeIdImam(e) {
      let temp = this.imamList.find(_ => {return _.nama === e})
      
      this.formData.id_imam_pemberkat = temp.id
    },
    async changeIdUmat(e) {
      let temp = this.anggotaKeluarga.find(_ => {return _.nama === e})
      
      this.formData.id_lingkungan = temp.lingkungan_id
      this.formData.id_umat = temp.id
      this.formData.nama_baptis = temp.nama_baptis
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = changeDateFormat(temp.tgl_lahir)
      this.formData.alamat = temp.alamat

      let detailTemp = await getOneData(`/detail-umat/${temp.id}`)
      this.setOrtu(detailTemp.id_ayah, detailTemp.id_ibu)
    },
    async setOrtu(idAyah, idIbu) {
      this.isAlertOrtuActive = false
      let temp

      if (idAyah == null && idIbu == null) {
        this.formData.nama_orang_tua = '-'
        this.isAlertOrtuActive = true
        return
      }
      else if (idAyah != null)
        temp = await getOneData(`/umat/${idAyah}`)
      else if (idIbu != null)
        temp = await getOneData(`/umat/${idIbu}`)
      
      this.formData.nama_orang_tua = temp.nama
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      if (this.formData.id_lingkungan == this.$store.state.keluarga.lingkunganId) {
        this.formData.isKetuaLingkungan = true
        this.formData.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
      } else {
        this.formData.isKetuaLingkungan = false
        this.formData.ketua_lingkungan = null
      }

      try {
        let response = await postData(`${this.url}/add`, this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
          this.$router.push('/keluarga/surat/surat-keterangan-mati')
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
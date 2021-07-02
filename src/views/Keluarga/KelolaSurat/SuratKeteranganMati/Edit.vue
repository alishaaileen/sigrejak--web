<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-mati" />

    <h1>Edit Surat Keterangan Mati</h1>

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

          <approval-chip
            :approval="formData.romo_approval"
            role="Romo"
            :nama="romoParoki.nama"
          ></approval-chip>
        </v-card-title>

        <v-divider></v-divider>

        <v-form class="pa-6" @submit.prevent="submit">
          <v-alert type="info" text icon="fas fa-info-circle">
            <p class="ma-0">
              Data dapat diedit jika belum disetujui Ketua Lingkungan
            </p>
          </v-alert>

          <h3 class="mb-5">Informasi Umat</h3>

          <autocomplete
            label="Nama* (Pastikan umat yang dipilih memiliki data orang tua)"
            :value="formData.nama"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdUmat"
            :disable="(!isEditable)"
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
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-textarea>

          <label>Tanggal meninggal*</label>
          <v-menu
            ref="menuTglMeninggal"
            v-model="isDatePickerTglMeninggalActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            :disabled="(!isEditable)"
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
                :disabled="(!isEditable)"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_meninggal"
              @change="saveDate"
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
            ></v-date-picker>
          </v-menu>

          <label>Tempat pemakaman/kremasi*</label>
          <v-textarea
            v-model="formData.tempat_makam_kremasi"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-textarea>

          <label>Tanggal pemakaman/kremasi*</label>
          <v-menu
            ref="menuTglMakam"
            v-model="isDatePickerTglMakamActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            :disabled="(!isEditable)"
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
                :disabled="(!isEditable)"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_makam_kremasi"
              @change="saveDate"
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
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
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
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
                :disabled="(!isEditable)"
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
                    :disabled="(!isEditable)"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.tgl_komuni"
                  @change="saveDate"
                  :disabled="(!isEditable)"
                  :readonly="(!isEditable)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <label>Nama pelayan sakramen*</label>
              <v-text-field
                v-model="formData.pelayan_komuni"
                required
                outlined
                dense
                :disabled="(!isEditable)"
                :readonly="(!isEditable)"
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
                :disabled="(!isEditable)"
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
                    :disabled="(!isEditable)"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.tgl_pengampunan_dosa"
                  @change="saveDate"
                  :disabled="(!isEditable)"
                  :readonly="(!isEditable)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <label>Nama pelayan sakramen*</label>
              <v-text-field
                v-model="formData.pelayan_pengampunan_dosa"
                required
                outlined
                dense
                :disabled="(!isEditable)"
                :readonly="(!isEditable)"
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
                :disabled="(!isEditable)"
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
                    :disabled="(!isEditable)"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.tgl_perminyakan"
                  @change="saveDate"
                  :disabled="(!isEditable)"
                  :readonly="(!isEditable)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <label>Nama pelayan sakramen*</label>
              <v-text-field
                v-model="formData.pelayan_perminyakan"
                required
                outlined
                dense
                :disabled="(!isEditable)"
                :readonly="(!isEditable)"
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
                :disabled="(!isEditable)"
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
                    :disabled="(!isEditable)"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.tgl_baptis_darurat"
                  @change="saveDate"
                  :disabled="(!isEditable)"
                  :readonly="(!isEditable)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <label>Nama pelayan sakramen*</label>
              <v-text-field
                v-model="formData.pelayan_baptis_darurat"
                required
                outlined
                dense
                :disabled="(!isEditable)"
                :readonly="(!isEditable)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="mb-5"></v-divider>

          <autocomplete
            label="Imam yang memberkati*"
            :value="formData.nama_imam"
            :suggestionList="imamList"
            itemText="nama"
            @changeData="changeIdImam"
            :disable="(!isEditable)"
          ></autocomplete>

          <label>Nama pelapor*</label>
          <v-text-field
            v-model="formData.nama_pelapor"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-text-field>

          <label>Nomor HP pelapor*</label>
          <v-text-field
            v-model="formData.no_hp_pelapor"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-text-field>

          <label>Nomor HP keluarga/penanggung jawab yang bisa dihubungi*</label>
          <v-text-field
            v-model="formData.no_hp_penanggungjawab"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
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
import { getData, getOneData, editData, changeDateFormat } from '../../../../utils'
import Autocomplete from '../../../../components/Autocomplete'
import ApprovalChip from '../../../../components/ApprovalChip.vue'

export default {
  components: {
    Autocomplete,
    ApprovalChip
  },
  data: () => ({
    url: '/surat-keterangan-mati',
    isEditable: false,
    isDatePickerTglMeninggalActive: false,
    isDatePickerTglMakamActive: false,
    isDatePickerKomuniActive: false,
    isDatePickerPengampunanActive: false,
    isDatePickerPerminyakanActive: false,
    isDatePickerBaptisDaruratActive: false,
    isAlertOrtuActive: false,
    formData: {},
    anggotaKeluarga: [],
    imamList: [],
    sekretariat: { nama: '' },
    romoParoki: { nama: '' },
  }),
  computed: {
    isSubmitDisabled() {
      return this.isAlertOrtuActive || !this.isEditable ? true : false
    }
  },
  async mounted() {
    this.imamList = await getData(`/admin/role/3`)
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.formData = await getOneData(`${this.url}/${this.$route.params.id}`)
    this.formData.tgl_lahir = changeDateFormat(this.formData.tgl_lahir)

    this.setOrtu(this.formData.id_ayah, this.formData.id_ibu)

    // Set editable boolean to true if ketua lingkungan have not approved
    this.isEditable = this.formData.ketua_lingkungan_approval === 1 ? false : true
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
      this.formData.nama_orang_tua = '-'
      this.isAlertOrtuActive = false

      if (idAyah == null && idIbu == null) {
        this.isAlertOrtuActive = true
        return
      }

      let temp
      
      if (idAyah != null)
        temp = await getOneData(`/umat/${idAyah}`)
      else if (idIbu != null)
        temp = await getOneData(`/umat/${idIbu}`)
      
      this.formData.nama_orang_tua = temp.nama
      console.log(this.formData.nama_orang_tua)
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      if(this.formData.status_terima_minyak === 'Belum pernah') {
        this.fotmData.tgl_terima_minyak = null
      }

      let snackbar = {}
      if(this.formData.cara_ortu_menikah === 'Cara lain') {
        this.formData.cara_ortu_menikah = this.temp_cara_ortu_menikah
      }

      try {
        let response = await editData(this.url, this.formData.id, this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil diubah!'
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
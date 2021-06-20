<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-pindah" />
    
    <h1>Edit Surat Keterangan Pindah</h1>

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
            label="Nama*"
            :value="formData.nama"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            :disable="(!isEditable)"
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
            v-model="isDatePickerActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            :disabled="(!isEditable)"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_domisili_lama"
                prepend-inner-icon="mdi-calendar"
                :disabled="(!isEditable)"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_domisili_lama"
              :min="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
            ></v-date-picker>
          </v-menu>

          <label>Alamat lama</label>
          <p>{{ formData.alamat_lama }}</p>

          <label>Paroki lama</label>
          <p>{{ formData.paroki_lama }}</p>

          <label>Lingkungan lama</label>
          <p>{{ formData.nama_lingkungan_lama }}</p>

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
                :disabled="(!isEditable)"
                :readonly="(!isEditable)"
              ></v-switch>
            </v-col>
          </v-row>
          
          <label>Tanggal mulai domisili baru*</label>
          <v-menu
            ref="menu"
            v-model="isDatePickerActive"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            :disabled="(!isEditable)"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.tgl_domisili_baru"
                prepend-inner-icon="mdi-calendar"
                :disabled="(!isEditable)"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_domisili_baru"
              :min="new Date().toISOString().substr(0, 10)"
              @change="saveDate"
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
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
                :readonly="!isNotKumetiran || (!isEditable)"
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
                :disable="(!isEditable)"
              ></autocomplete>
              <div v-else>
                <label>Lingkungan baru*</label>
                <v-text-field
                  v-model="formData.nama_lingkungan_baru"
                  required
                  outlined
                  dense
                  :disabled="(!isEditable)"
                  :readonly="(!isEditable)"
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
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-text-field>

          <label>Nomor telepon baru*</label>
          <v-text-field
            v-model="formData.no_telp_baru"
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
import { getData, getOneData, editData } from '../../../../utils'
import Autocomplete from '../../../../components/Autocomplete'
import ApprovalChip from '../../../../components/ApprovalChip.vue'

export default {
  components: {
    Autocomplete,
    ApprovalChip,
  },
  data: () => ({
    formData: {
      paroki_lama: 'Kumetiran',
      paroki_baru: 'Kumetiran',
    },
    isEditable: false,
    isNotKumetiran: false,
    anggotaKeluarga: [],
    parokiList: [],
    lingkunganList: [],
    umat: {},
    isDatePickerActive: false,
    sekretariat: { nama: '' },
    romoParoki: { nama: '' },
  }),
  computed: {
    isSubmitDisabled() {
      return !this.isEditable
    }
  },
  async mounted() {
    this.lingkunganList = await getData(`/lingkungan`)
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    
    // Get data surat
    this.formData = await getOneData(`/surat-keterangan-pindah/${this.$route.params.id}`)

    // Mengaktifkan switch jika umat pindah ke paroki baru
    this.isNotKumetiran = this.formData.paroki_baru != 'Kumetiran' ? true : false

    // Get data sekretariat and romo if surat has been approved
    if(this.formData.id_sekretariat != null) {
      this.sekretariat = await getOneData(`/admin/${this.formData.id_sekretariat}`)
    }
    if(this.formData.id_romo != null) {
      this.romoParoki = await getOneData(`/admin/${this.formData.id_romo}`)
    }

    // Set editable boolean to true if ketua lingkungan have not approved
    this.isEditable = this.formData.ketua_lingkungan_approval === 1 ? false : true
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
<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-pindah" />
    
    <h1>Edit Surat Keterangan Pindah</h1>

    <div class="form mt-5">
      <v-card class="mx-auto" flat>
        <v-card-title>
          <h3>Detail Informasi</h3>
          
          <v-spacer></v-spacer>

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

          <button-chat
            :countChatUnread="countChatUnread"
            :chatPageUrl="`/keluarga/surat/surat-izin-ekaristi/chat/${formData.id}`"
            :detailPageUrl="`/keluarga/surat/surat-izin-ekaristi/detail/${formData.id}`"
            :endpointUrl="url"
          ></button-chat>
        </v-card-title>

        <v-divider></v-divider>

        <v-form class="pa-6" ref="form" @submit.prevent="submit">
          <div class="mb-15">
            <label>No. surat</label>
            <p>{{ formData.no_surat }}</p>
            <v-btn
              class="text-none"
              depressed
              color="blue"
              text
              outlined
              @click="isSidebarLogActive = true"
            >
              Log surat
            </v-btn>
          </div>

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
            :rules="[required]"
          ></autocomplete>

          <label>Tempat lahir</label>
          <p>{{ formData.tempat_lahir }}</p>

          <label>Tanggal lahir</label>
          <p>{{ formData.tgl_lahir }}</p>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Tempat Tinggal Lama</h3>

          <label>Tanggal pertama kali tinggal di domisili lama*</label>
          <v-menu
            ref="datePickerTglLama"
            v-model="isDatePickerTglLamaActive"
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
                :rules="[required]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_domisili_lama"
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
            ref="datePickerTglBaru"
            v-model="isDatePickerTglBaruActive"
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
                :rules="[required]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.tgl_domisili_baru"
              @change="saveDate"
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
            ></v-date-picker>
          </v-menu>

          <v-row>
            <v-col v-if="isNotKumetiran">
              <label>Paroki baru</label>
              <v-text-field
                v-model="formData.paroki_baru"
                outlined
                dense
                :readonly="!isNotKumetiran || (!isEditable)"
                :disabled="!isNotKumetiran"
                :rules="[required]"
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
                :rules="[required]"
              ></autocomplete>
              <div v-else>
                <label>Lingkungan baru*</label>
                <v-text-field
                  v-model="formData.nama_lingkungan_baru"
                  outlined
                  dense
                  :disabled="(!isEditable)"
                  :readonly="(!isEditable)"
                  :rules="[required]"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>

          <label>Alamat baru*</label>
          <v-text-field
            v-model="formData.alamat_baru"
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
            :rules="[required]"
          ></v-text-field>

          <label>Nomor telepon baru*</label>
          <v-text-field
            v-model="formData.no_telp_baru"
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
            :rules="[required]"
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

    <sidebar-log-surat
      :logList="logList"
      :isSidebarActive="isSidebarLogActive"
      @closeSidebar="isSidebarLogActive = false"
    ></sidebar-log-surat>
  </div>
</template>

<script>
import { getData, getAnggotaKeluargaNotDeleted, getOneData, getLogSuratByNoSurat, editData, changeDateFormat } from '@/utils'
import Autocomplete from '@/components/Autocomplete'
import ApprovalChip from '@/components/ApprovalChip.vue'
import SidebarLogSurat from '@/components/SidebarLogSurat.vue'
import ButtonChat from '@/components/ButtonChat.vue'
import { required } from '@/validations'

export default {
  components: {
    Autocomplete,
    ApprovalChip,
    SidebarLogSurat,
    ButtonChat,
  },
  data: () => ({
    url: '/surat-keterangan-pindah',
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
    isDatePickerTglLamaActive: false,
    isDatePickerTglBaruActive: false,
    sekretariat: { nama: '' },
    romoParoki: { nama: '' },
    logList: [],
    isSidebarLogActive: false,
    countChatUnread: 0,

    // validation rules
    required,
  }),
  computed: {
    isSubmitDisabled() {
      return !this.isEditable
    }
  },
  async mounted() {
    this.lingkunganList = await getData(`/lingkungan`)
    this.anggotaKeluarga = await getAnggotaKeluargaNotDeleted(this.$store.state.keluarga.id)
    
    // Get data surat
    this.formData = await getOneData(`${this.url}/${this.$route.params.id}`)
    this.formData.tgl_lahir = changeDateFormat(this.formData.tgl_lahir)

    // Mengaktifkan switch jika umat pindah ke paroki baru
    this.isNotKumetiran = this.formData.paroki_baru != 'Kumetiran' ? true : false

    // Get Log surat
    this.logList = await getLogSuratByNoSurat(this.formData.id)

    // Get data sekretariat and romo if surat has been approved
    if(this.formData.id_sekretariat != null) {
      this.sekretariat = await getOneData(`/admin/${this.formData.id_sekretariat}`)
    }
    if(this.formData.id_romo != null) {
      this.romoParoki = await getOneData(`/admin/${this.formData.id_romo}`)
    }

    // Set editable boolean to true if ketua lingkungan have not approved
    this.isEditable = this.formData.ketua_lingkungan_approval === 1 ? false : true

    // Get jumlah chat yg belum read
    this.countChatUnread = await getOneData(`/chat/count-unread/${this.$route.params.id}`)
    this.countChatUnread = this.countChatUnread.count_unread
   },
  methods: {
    saveDate (date) {
      this.$refs.datePickerTglLama.save(date)
      this.$refs.datePickerTglBaru.save(date)
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
      if (this.isNotKumetiran){
        this.formData.id_lingkungan_baru = null
        this.formData.paroki_baru = ''
      }
      else {
        this.formData.paroki_baru = 'Kumetiran'
      }
      this.formData.nama_lingkungan_baru = ''
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

      try {
        let response = await editData(this.url, this.formData.id, this.formData)

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
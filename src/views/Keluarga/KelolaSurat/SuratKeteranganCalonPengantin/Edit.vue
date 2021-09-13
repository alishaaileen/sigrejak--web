<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-calon-pengantin" />
    
    <h1>Edit Surat Keterangan Calon Pengantin</h1>

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
            :chatPageUrl="`/keluarga/surat/surat-keterangan-calon-pengantin/chat/${formData.id}`"
            :detailPageUrl="`/keluarga/surat/surat-keterangan-calon-pengantin/detail/${formData.id}`"
            :endpointUrl="url"
          ></button-chat>
        </v-card-title>

        <v-divider></v-divider>

        <v-form class="pa-6" ref="form" @submit.prevent="submit">
          <div class="mb-15">
            <label>No. surat</label>
            <p>
              {{ formData.no_surat }}
            </p>
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

          <v-alert type="info" color="orange" text icon="fas fa-info-circle">
            Satu surat hanya berlaku untuk <strong>satu orang</strong>
          </v-alert>
          <h3 class="mb-5">Informasi Umat</h3>

          <autocomplete
            label="Nama*"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdUmat"
            :value="formData.nama"
            :disable="(!isEditable)"
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
            :readonly="(!isEditable)"
            :disabled="(!isEditable)"
            :rules="[required]"
          ></v-text-field>

          <label>Tempat lahir*</label>
          <v-textarea
            v-model="formData.tempat_lahir_pasangan"
            required
            outlined
            dense
            :hint="`${formData.tempat_lahir_pasangan.length}/255`"
            :readonly="(!isEditable)"
            :disabled="(!isEditable)"
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
            :disabled="(!isEditable)"
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
                :disabled="(!isEditable)"
                :rules="[required]"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              :readonly="(!isEditable)"
              :disabled="(!isEditable)"
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
            :readonly="(!isEditable)"
            :disabled="(!isEditable)"
            :rules="[required]"
          ></v-textarea>

          <label>No. telp pasangan*</label>
          <v-text-field
            v-model="formData.no_telp_pasangan"
            required
            outlined
            dense
            :readonly="(!isEditable)"
            :disabled="(!isEditable)"
            :rules="[required]"
          ></v-text-field>

          <label>Agama pasangan*</label>
          <v-select
            :items="[ 'Katolik', 'Kristen', 'Islam', 'Hindu', 'Buddha', 'Konghucu' ]"
            v-model="formData.agama_pasangan"
            outlined
            dense
            :readonly="(!isEditable)"
            :disabled="(!isEditable)"
            :rules="[required]"
          ></v-select>

          <label>Nama ayah pasangan*</label>
          <v-text-field
            v-model="formData.nama_ayah_pasangan"
            required
            outlined
            dense
            :readonly="(!isEditable)"
            :disabled="(!isEditable)"
            :rules="[required]"
          ></v-text-field>

          <label>Nama ibu pasangan* (nama kecil)</label>
          <v-text-field
            v-model="formData.nama_ibu_pasangan"
            required
            outlined
            dense
            :readonly="(!isEditable)"
            :disabled="(!isEditable)"
            :rules="[required]"
          ></v-text-field>

          <label>File syarat*</label>
          <v-alert type="info" dense text>
            Harap memasukan semua syarat dalam format <em>.zip</em> lalu upload file <em>.zip</em> -nya  
          </v-alert>
          <div class="my-5">
            <v-btn v-if="(typeof formData.file_syarat) == 'string'"
              text
              small
              color="blue"
              @click="downloadFile(formData.file_syarat)"
            >
              klik untuk melihat file
            </v-btn>
          </div>
          <div class="d-flex mb-5">
            <v-file-input
              accept="application/zip"
              style="display: none;"
              ref="inputSyarat"
              v-model="formData.file_syarat"
              :rules="[required]"
            ></v-file-input>
            <div>
              <v-btn
                v-if="isEditable"
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
            <div v-if="(typeof formData.file_syarat) != 'string'" class="ml-5">
              <p class="ma-0">{{formData.file_syarat.name}}</p>
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

    <sidebar-log-surat
      :logList="logList"
      :isSidebarActive="isSidebarLogActive"
      @closeSidebar="isSidebarLogActive = false"
    ></sidebar-log-surat>
  </div>
</template>

<script>
import { getAnggotaKeluargaNotDeleted, getOneData, getLogSuratByNoSurat, editData, changeDateFormat } from '@/utils'
import Autocomplete from '@/components/Autocomplete'
import ApprovalChip from '@/components/ApprovalChip.vue'
import { API_URL } from '@/constants'
import SidebarLogSurat from '@/components/SidebarLogSurat.vue'
import ButtonChat from '@/components/ButtonChat.vue'
import { required, acceptZipOnly } from '@/validations'

export default {
  components: {
    Autocomplete,
    ApprovalChip,
    SidebarLogSurat,
    ButtonChat,
  },
  data: () => ({
    url: '/surat-keterangan-calon-pengantin',
    formData: { file_syarat: {size: 0}},
    isEditable: false,
    anggotaKeluarga: [],
    isAlertOrtuActive: false,
    sekretariat: { nama: '' },
    romoParoki: { nama: '' },
    logList: [],
    isSidebarLogActive: false,
    countChatUnread: 0,

    // validation rules
    required,
    acceptZipOnly,
  }),
  computed: {
    isSubmitDisabled() {
      return this.isAlertOrtuActive || !this.isEditable ? true : false
    },
    fileSize() {
      let sizeInMb = this.formData.file_syarat.size/1024/1024
      sizeInMb = sizeInMb.toString()
      sizeInMb = sizeInMb.substring(0, 5)

      return sizeInMb
    }
  },
  async mounted() {
    this.anggotaKeluarga = await getAnggotaKeluargaNotDeleted(this.$store.state.keluarga.id)
    this.formData = await getOneData(`${this.url}/${this.$route.params.id}`)
    this.formData.tgl_lahir = changeDateFormat(this.formData.tgl_lahir)

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
    async downloadFile(fileName) {
      window.open(`${API_URL}/files/${fileName}`, '_blank')
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
      if (typeof this.formData.file_syarat != 'string') {
        formData.append('file_syarat', this.formData.file_syarat)
      }

      try {
        let response = await editData(this.url, this.formData.id, formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil diubah!'
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
<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-beasiswa" />
    
    <h1>Edit Surat Keterangan</h1>

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
            :chatPageUrl="`/keluarga/surat/surat-keterangan-beasiswa/chat/${formData.id}`"
            :detailPageUrl="`/keluarga/surat/surat-keterangan-beasiswa/detail/${formData.id}`"
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
            @changeData="changeIdSiswa"
            :disabled="(!isEditable)"
            :rules="[required]"
          ></autocomplete>

          <label>Tempat lahir</label>
          <p>{{ formData.tempat_lahir }}</p>

          <label>Tanggal lahir</label>
          <p>{{ formData.tgl_lahir }}</p>

          <label>Alamat</label>
          <p>{{ formData.alamat }}</p>

          <label>No. telepon</label>
          <p>{{ formData.no_telp }}</p>

          <label>Sekolah</label>
          <v-text-field
            v-model="formData.sekolah"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
            :rules="[required]"
          ></v-text-field>

          <label>Kelas</label>
          <v-text-field
            v-model="formData.kelas"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
            :rules="[required]"
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
              Siswa yang dipilih belum memiliki catatan lengkap ayah dan ibu.
              Harap lengkapi informasi di menu Anggota Keluarga.
            </span>
          </v-alert>

          <label>Nama ayah/ibu*</label>
          <p>{{ formData.nama_ayah }} / {{ formData.nama_ibu }}</p>

          <label>Alamat orang tua*</label>
          <p>{{ formData.alamat_ortu }}</p>

          <label>Pekerjaan ayah/ibu*</label>
          <p>{{ formData.pekerjaan_ayah }} / {{ formData.pekerjaan_ibu }}</p>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Keterangan Beasiswa</h3>

          <label>Status beasiswa*</label>
          <v-select
            :items="[ 'Belum pernah', 'Tidak pernah' ]"
            v-model="formData.status_beasiswa"
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
            :rules="[required]"
          ></v-select>

          <label>Lampirkan permohonan untuk keterangan beasiswa*</label>
          <v-textarea
            v-model="formData.permohonan"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
            :rules="[required]"
          ></v-textarea>

          <label>File syarat beasiswa*</label>
          <v-alert type="info" dense text>
            Harap memasukan semua syarat dalam format <em>.zip</em> lalu upload file <em>.zip</em> -nya  
          </v-alert>
          <div class="my-5">
            <v-btn v-if="(typeof formData.file_syarat_beasiswa) == 'string'"
              text
              small
              color="blue"
              @click="downloadFile(formData.file_syarat_beasiswa)"
            >
              klik untuk melihat file
            </v-btn>
          </div>
          <div class="d-flex mb-5">
            <v-file-input
              accept="application/zip"
              style="display: none;"
              ref="inputSyaratBeasiswa"
              v-model="formData.file_syarat_beasiswa"
              :rules="[required]"
            ></v-file-input>
            <div>
              <v-btn
                v-if="isEditable"
                class="text-none"
                color="blue darken-3"
                dark
                depressed
                @click="$refs.inputSyaratBeasiswa.$refs.input.click()"
              >
                <v-icon>mdi-upload</v-icon>
                Upload file
              </v-btn>
            </div>
            <div v-if="(typeof formData.file_syarat_beasiswa) != 'string'" class="ml-5">
              <p class="ma-0">{{ formData.file_syarat_beasiswa.name }}</p>
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
import { API_URL } from '@/constants'
import { required } from '@/validations'

import Autocomplete from '@/components/Autocomplete'
import ApprovalChip from '@/components/ApprovalChip.vue'
import SidebarLogSurat from '@/components/SidebarLogSurat.vue'
import ButtonChat from '@/components/ButtonChat.vue'

export default {
  components: {
    Autocomplete,
    ApprovalChip,
    SidebarLogSurat,
    ButtonChat,
  },
  data: () => ({
    url: '/surat-keterangan-beasiswa',
    formData: { file_syarat_beasiswa: {size: 0}},
    isEditable: false,
    anggotaKeluarga: [],
    isAlertOrtuActive: false,
    sekretariat: { nama: '' },
    romoParoki: { nama: '' },
    countChatUnread: 0,
    isSidebarLogActive: false,
    logList: [],

    // validation rules
    required,
  }),
  computed: {
    isSubmitDisabled() {
      return this.isAlertOrtuActive || !this.isEditable ? true : false
    },
    fileSize() {
      let sizeInMb = this.formData.file_syarat_beasiswa.size/1024/1024
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


    async changeIdSiswa(e) {
      let temp = this.anggotaKeluarga.find(_ => {
        return _.nama === e
      })
      this.formData.id_siswa = temp.id
      this.formData.id_lingkungan = temp.lingkungan_id
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = changeDateFormat(temp.tgl_lahir)
      this.formData.alamat = temp.alamat
      this.formData.no_telp = temp.no_telp

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
      this.formData.pekerjaan_ibu = tempOrangTua.pekerjaan || '-'
      
      tempOrangTua = await getOneData(`/umat/${idAyah}`)
      this.formData.nama_ayah = tempOrangTua.nama || '-'
      this.formData.pekerjaan_ayah = tempOrangTua.pekerjaan || '-'
      this.formData.alamat_ortu = tempOrangTua.alamat || '-'
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
      formData.append('id_siswa', this.formData.id_siswa)
      formData.append('sekolah', this.formData.sekolah)
      formData.append('kelas', this.formData.kelas)
      formData.append('status_beasiswa', this.formData.status_beasiswa)
      formData.append('permohonan', this.formData.permohonan)
      if (typeof this.formData.file_syarat_beasiswa != 'string') {
        formData.append('file_syarat_beasiswa', this.formData.file_syarat_beasiswa)
      }

      try {
        let response = await editData('/surat-keterangan-beasiswa', this.formData.id, formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil diubah!'
          this.$router.push('/keluarga/surat/surat-keterangan-beasiswa')
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
<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-minyak-suci" />

    <h1>Detail Surat Pelayanan Minyak Suci</h1>

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
            :chatPageUrl="`/keluarga/surat/surat-minyak-suci/chat/${formData.id}`"
            :detailPageUrl="`/keluarga/surat/surat-minyak-suci/detail/${formData.id}`"
            :endpointUrl="url"
          ></button-chat>
        </v-card-title>

        <v-divider></v-divider>

        <v-form class="pa-6" @submit.prevent="submit">
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
            :disable="(!isEditable)"
            @changeData="changeIdUmat"
          ></autocomplete>

          <label>Nama baptis</label>
          <p>{{ formData.nama_baptis }}</p>

          <label>Tempat lahir</label>
          <p>{{ formData.tempat_lahir }}</p>

          <label>Tanggal lahir</label>
          <p>{{ changeDate(formData.tgl_lahir) }}</p>

          <label>Alamat</label>
          <p>{{ formData.alamat }}</p>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Minyak Suci</h3>

          <label>Pelayanan Minyak Suci*</label>
          <v-select
            :items="['Sudah pernah', 'Belum pernah']"
            v-model="formData.status_terima_minyak"
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-select>

          <div v-show="formData.status_terima_minyak === 'Sudah pernah'">
            <label>Tanggal*</label>
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
                  v-model="formData.tgl_terima_minyak"
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
                v-model="formData.tgl_terima_minyak"
                :max="new Date().toISOString().substr(0, 10)"
                @change="saveDate"
                :disabled="(!isEditable)"
                :readonly="(!isEditable)"
              ></v-date-picker>
            </v-menu>
          </div>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Informasi Pasangan</h3>

          <small>Aktifkan tombol di bawah ini jika memiliki pasangan</small>
          <v-switch
            v-model="isPunyaPasangan"
            :label="isPunyaPasangan ? 'Memiliki pasangan' : 'Tidak memiliki pasangan'"
            color="primary"
            background-color="white"
            @change="changePasangan"
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-switch>

          <div v-if="isPunyaPasangan">
            <label>Nama pasangan</label>
            <v-text-field
              v-model="formData.nama_pasangan"
              required
              outlined
              dense
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
            ></v-text-field>

            <label>Cara menikah</label>
            <v-select
              :items="caraMenikahList"
              v-model="formData.cara_menikah"
              outlined
              dense
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
            ></v-select>

            <label>Tahun menikah</label>
            <v-select
              :items="tahunList"
              v-model="formData.tahun_menikah"
              clearable
              outlined
              dense
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
            ></v-select>
          </div>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb-5">Keluarga yang bertanggung jawab</h3>

          <label>Nama keluarga*</label>
          <v-text-field
            v-model="formData.nama_keluarga_penanggung_jawab"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-text-field>

          <label>Alamat*</label>
          <v-textarea
            v-model="formData.alamat_keluarga_penanggung_jawab"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-textarea>

          <label>Nomor telepon*</label>
          <v-text-field
            v-model="formData.no_telp_keluarga_penanggung_jawab"
            required
            outlined
            dense
            :disabled="(!isEditable)"
            :readonly="(!isEditable)"
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb">Pastor pelayan</h3>

          <autocomplete
            label="Nama pastor*"
            :value="formData.nama_pastor_pelayan"
            :suggestionList="pastorList"
            itemText="nama"
            @changeData="changeIdPastor"
            :disable="(!isEditable)"
          ></autocomplete>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              type="submit"
              color="blue accent-4"
              dark
              depressed
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
import { getData, getOneData, getLogSuratByNoSurat, editData, changeDateFormat } from '../../../../utils'
import { caraMenikahList } from '../../../../constants'
import Autocomplete from '../../../../components/Autocomplete'
import ApprovalChip from '../../../../components/ApprovalChip.vue'
import SidebarLogSurat from '../../../../components/SidebarLogSurat.vue'
import ButtonChat from '../../../../components/ButtonChat.vue'

export default {
  components: {
    Autocomplete,
    ApprovalChip,
    SidebarLogSurat,
    ButtonChat,
  },
  data: () => ({
    url: '/surat-pelayanan-minyak-suci',
    isEditable: false,
    isDatePickerActive: false,
    isPunyaPasangan: true,
    caraMenikahList,
    tahunList: [],
    formData: {
    },
    anggotaKeluarga: [],
    pastorList: [],
    sekretariat: { nama: '' },
    romoParoki: { nama: '' },
    logList: [],
    isSidebarLogActive: false,
    countChatUnread: 0,
  }),
  async mounted() {
    this.initTahun()
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.pastorList = await getData(`/admin/role/4`)
    this.formData = await getOneData(`${this.url}/${this.$route.params.id}`)

    // Get Log surat
    this.logList = await getLogSuratByNoSurat(this.formData.id)

    // Set editable boolean to true if ketua lingkungan have not approved
    this.isEditable = this.formData.ketua_lingkungan_approval === 1 ? false : true

    // Get data sekretariat and romo if surat has been approved
    if(this.formData.id_sekretariat != null) {
      this.sekretariat = await getOneData(`/admin/${this.formData.id_sekretariat}`)
    }
    if(this.formData.id_romo != null) {
      this.romoParoki = await getOneData(`/admin/${this.formData.id_romo}`)
    }

    if(this.formData.nama_pasangan === null) {
      this.isPunyaPasangan = false
    }

    // Get jumlah chat yg belum read
    this.countChatUnread = await getOneData(`/chat/count-unread/${this.$route.params.id}`)
    this.countChatUnread = this.countChatUnread.count_unread
  },
  computed: {
    isSubmitDisabled() {
      return !this.isEditable
    }
  },
  methods: {
    initTahun() {
      let tahun = new Date()
      
      tahun = tahun.getFullYear()

      for(var i=0; i<100; i++) {
        this.tahunList.push(tahun)
        tahun--
      }
    },
    saveDate (date) {
      this.$refs.menu.save(date)
    },
    changeDate(date) {
      return changeDateFormat(date)
    },
    changePasangan() {
      if (!this.isPunyaPasangan) {
        this.formData.nama_pasangan = null
        this.formData.cara_menikah = null
        this.formData.tahun_menikah = null
      }
    },
    async changeIdUmat(e) {
      let temp = this.anggotaKeluarga.find(_ => {
        return _.nama === e
      })
      this.formData.nama = temp.nama
      this.formData.id_lingkungan = temp.lingkungan_id
      this.formData.nama_baptis = temp.nama_baptis
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = temp.tgl_lahir
      this.formData.alamat = temp.alamat
    },
    async changeIdPastor(e) {
      let temp = this.pastorList.find(_ => {
        return _.nama === e
      })
      this.formData.id_pastor_pelayan = temp.id
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      if(this.formData.status_terima_minyak === 'Belum pernah') {
        this.formData.tgl_terima_minyak = null
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
          this.$router.push('/keluarga/surat/surat-minyak-suci')
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
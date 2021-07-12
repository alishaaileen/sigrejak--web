<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-izin-ekaristi" />

    <h1>Detail Surat Izin Pelayanan Ekaristi</h1>

    <div class="mt-5 d-flex">
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

          <v-badge
            dark
            color="orange"
            overlap
            :value="countChatUnread > 0"
            :content="countChatUnread"
          >
            <v-btn
              class="btn text-none"
              color="yellow accent-4"
              dark
              depressed
              rounded
              @click="goToChat"
            >
              <v-icon small>mdi-chat</v-icon>
              Chat
            </v-btn>
          </v-badge>
        </v-card-title>

        <v-divider></v-divider>

        <v-content class="pa-6">
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

          <v-form>
            <label>Tanggal pelaksanaan*</label>
            <v-menu
              :disabled="(!isEditable)"
              ref="menu"
              v-model="isDatePickerActive"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="formData.tgl_pelaksanaan"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  :disabled="(!isEditable)"
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                :disabled="(!isEditable)"
                v-model="formData.tgl_pelaksanaan"
                :min="new Date().toISOString().substr(0, 10)"
                @change="saveDate"
              ></v-date-picker>
            </v-menu>

            <v-row>
              <v-col>
                <label>Waktu mulai*</label>
                <div class="d-flex">
                  <v-select
                    :disabled="(!isEditable)"
                    :items="jam"
                    v-model="waktu.mulai.jam"
                    outlined
                    dense
                    placeholder="jam"
                  ></v-select>
                  <h3 class="mx-2 py-2">:</h3>
                  <v-select
                    :disabled="(!isEditable)"
                    :items="menit"
                    v-model="waktu.mulai.menit"
                    outlined
                    dense
                    placeholder="menit"
                  ></v-select>
                </div>
              </v-col>
              <v-col>
                <label>Waktu selesai*</label>
                <div class="d-flex">
                  <v-select
                    :disabled="(!isEditable)"
                    :items="jam"
                    v-model="waktu.selesai.jam"
                    outlined
                    dense
                    placeholder="jam"
                  ></v-select>
                  <h3 class="mx-2 py-2">:</h3>
                  <v-select
                    :disabled="(!isEditable)"
                    :items="menit"
                    v-model="waktu.selesai.menit"
                    outlined
                    dense
                    placeholder="menit"
                  ></v-select>
                </div>
              </v-col>
            </v-row>

            <label>Ujud/intensi*</label>
            <v-textarea
              v-model="formData.intensi"
              :disabled="(!isEditable)"
              required
              outlined
              dense
            ></v-textarea>

            <autocomplete
              label="Lingkungan pelaksanaan ekaristi*"
              :disable="(!isEditable)"
              :value="formData.nama_lingkungan"
              :suggestionList="lingkunganList"
              itemText="nama_lingkungan"
              @changeData="changeIdLingkungan"
            ></autocomplete>

            <label>Alamat lokasi/tempat/rumah*</label>
            <v-textarea
              v-model="formData.lokasi_rumah"
              :disabled="(!isEditable)"
              required
              outlined
              dense
            ></v-textarea>

            <label>Nomor telepon rumah/HP*</label>
            <v-text-field
              v-model="formData.no_telp_lokasi"
              :disabled="(!isEditable)"
              required
              outlined
              dense
            ></v-text-field>

            <v-divider class="mb-5"></v-divider>

            <label>Dipimpin oleh*</label>
            <v-text-field
              v-model="formData.romo_pemimpin"
              :disabled="(!isEditable)"
              prefix="Romo"
              placeholder="nama romo"
              required
              outlined
              dense
            ></v-text-field>

            <label>Alamat/komunitas*</label>
            <v-textarea
              v-model="formData.alamat_komunitas"
              :disabled="(!isEditable)"
              required
              outlined
              dense
            ></v-textarea>

            <label>Nomor telepon komunitas*</label>
            <v-text-field
              v-model="formData.no_telp_komunitas"
              :disabled="(!isEditable)"
              required
              outlined
              dense
            ></v-text-field>

            <div class="d-flex justify-end">
              <v-btn
                class="btn text-none mt-2"
                @click="submit"
                color="blue accent-4"
                dark
                depressed
                :disabled="isSubmitDisabled"
              >
                Simpan
              </v-btn>
            </div>
          </v-form>
        </v-content>
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
import { getData, getOneData, getLogSuratByNoSurat, editData } from '../../../../utils'
import Autocomplete from '../../../../components/Autocomplete'
import ApprovalChip from '../../../../components/ApprovalChip.vue'
import SidebarLogSurat from '../../../../components/SidebarLogSurat.vue'

export default {
  components: {
    Autocomplete,
    ApprovalChip,
    SidebarLogSurat,
  },
  data: () => ({
    url: '/surat-izin-pelayanan-ekaristi',
    isEditable: true,
    isDatePickerActive: false,
    jam: [],
    menit: [],
    waktu: {
      mulai: { jam: '', menit: '' },
      selesai: { jam: '', menit: '' },
    },
    lingkunganList: [],
    formData: {},
    sekretariat: { nama: '' },
    romoParoki: { nama: '' },
    logList: [],
    isSidebarLogActive: false,
    countChatUnread: 0,
  }),
  async mounted() {
    // Inisialisasi array jam
    this.jam = this.initWaktu(1, 24)
    // Inisialisasi array menit
    this.menit = this.initWaktu(0, 59)

    this.lingkunganList = await getData(`/lingkungan`)
    
    // Get data surat
    this.formData = await getOneData(`${this.url}/${this.$route.params.id}`)

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

    // Data from backend is in hh:mm:ss format
    // So, it is trimmed to hh:mm in the code below
    this.waktu.mulai.jam = this.formData.waktu_mulai.substring(0,2)
    this.waktu.mulai.menit = this.formData.waktu_mulai.substring(3,5)
    this.waktu.selesai.jam = this.formData.waktu_selesai.substring(0,2)
    this.waktu.selesai.menit = this.formData.waktu_selesai.substring(3,5)

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
    initWaktu(start, limit) {
      let temp = []

      for(let i=start; i<=limit; i++) {
        i<10 ? temp.push(`0${i}`) : temp.push(i.toString())
      }

      return temp
    },
    changeIdLingkungan(e) {
      let temp = this.lingkunganList.find((_) => { return _.nama_lingkungan === e })

      this.formData.id_lingkungan = temp.id
    },
    setAllWaktu(waktu) {
      this.formData.waktu_mulai = `${waktu.mulai.jam}:${waktu.mulai.menit}`
      this.formData.waktu_selesai = `${waktu.selesai.jam}:${waktu.selesai.menit}`
    },
    saveDate (date) {
      this.$refs.menu.save(date)
    },
    goToChat() {
      this.$store.dispatch('chat/setChat', {
        detailPageUrl: `/keluarga/surat/surat-izin-ekaristi/detail/${this.formData.id}`,
        endpointUrl: this.url
      })
      this.$router.push(`/keluarga/surat/surat-izin-ekaristi/chat/${this.formData.id}`)
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      this.setAllWaktu(this.waktu)

      let snackbar = {}

      try {
        let response = await editData(this.url, this.formData.id, this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil diubah!'
          this.$router.push('/keluarga/surat/surat-izin-ekaristi')
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
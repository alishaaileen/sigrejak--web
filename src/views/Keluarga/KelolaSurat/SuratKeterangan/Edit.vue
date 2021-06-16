<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan" />
    
    <h1>Detail Surat Keterangan</h1>

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

        <v-content class="pa-6">
          <h3 class="mb-5">Informasi Surat</h3>

          <label>Nomor surat</label>
          <p>{{ formData.no_surat }}</p>

          <label>Tanggal pembuatan surat</label>
          <p>{{ formData.created_at }}</p>

          <v-divider class="mb-5"></v-divider>

          <v-alert
            type="info"
            color="blue accent-2"
            elevation="0"
            icon="fas fa-info-circle"
            text
          >
            <span>
              Data dapat diedit jika belum disetujui Ketua Lingkungan
            </span>
          </v-alert>

          <v-form @submit.prevent="submit">
            <h3 class="mb-5">Informasi Umat</h3>

            <autocomplete
              label="Nama*"
              :value="formData.nama"
              :suggestionList="anggotaKeluarga"
              :disable="(!isEditable)"
              itemText="nama"
              @changeData="changeIdUmat"
            ></autocomplete>

            <label>Tempat lahir</label>
            <p>{{ formData.tempat_lahir }}</p>

            <label>Tanggal lahir</label>
            <p>{{ formData.tgl_lahir }}</p>

            <label>Alamat</label>
            <p>{{ formData.alamat }}</p>

            <label>Pekerjaan</label>
            <p>{{ formData.pekerjaan }}</p>

            <label>Pendidikan</label>
            <v-text-field
              v-model="formData.pendidikan"
              required
              outlined
              dense
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
            ></v-text-field>

            <v-divider class="mb-5"></v-divider>

            <v-alert
              v-show="isAlertOrtuActive"
              border="left"
              colored-border
              type="error"
              elevation="2"
            >
              <span>
                Siswa yang dipilih belum memiliki catatan orang tua.
                Harap lengkapi informasi di menu Anggota Keluarga.
              </span>
            </v-alert>

            <h3 class="mb-5">Informasi Orang Tua</h3>

            <label>Nama orang tua*</label>
            <p>{{ formData.nama_ortu }}</p>

            <label>Alamat orang tua*</label>
            <p>{{ formData.alamat_ortu }}</p>

            <v-divider class="mb-5"></v-divider>

            <h3 class="mb-5">Keperluan</h3>

            <label>Keperluan*</label>
            <v-textarea
              v-model="formData.keperluan"
              required
              outlined
              dense
              :disabled="(!isEditable)"
              :readonly="(!isEditable)"
            ></v-textarea>

            <div class="d-flex justify-end">
              <v-btn
                v-if="(!isSubmitDisabled)"
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
        </v-content>        
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
    formData: {},
    isEditable: false,
    anggotaKeluarga: [],
    isAlertOrtuActive: false,
    sekretariat: { nama: '' },
    romoParoki: { nama: '' },
  }),
  async mounted() {
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.formData = await getOneData(`/surat-keterangan/${this.$route.params.id}`)

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
  computed: {
    isSubmitDisabled() {
      return this.isAlertOrtuActive || !this.isEditable ? true : false
    }
  },
  methods: {
    async changeIdUmat(e) {
      let temp = this.anggotaKeluarga.find(_ => {
        return _.nama === e
      })
      this.formData.id_umat = temp.id;
      this.formData.id_lingkungan = temp.lingkungan_id;
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = temp.tgl_lahir
      this.formData.alamat = temp.alamat
      this.formData.pekerjaan = temp.pekerjaan

      let detailTemp = await getOneData(`/detail-umat/${temp.id}`)

      await this.setOrtu(detailTemp.id_ayah, detailTemp.id_ibu)
    },
    async setOrtu(idAyah, idIbu) {
      let tempOrangTua = {}

      if (idAyah === null) {
        if (idIbu === null) {
          this.isAlertOrtuActive = true
          this.formData.id_ortu = null
          this.formData.nama_ortu = null
          this.formData.alamat_ortu = null

          return
        } else {
          tempOrangTua = await getOneData(`/umat/${idIbu}`)
        }
      } else {
        tempOrangTua = await getOneData(`/umat/${idAyah}`)
      }
      this.isAlertOrtuActive = false
      this.formData.id_ortu = tempOrangTua.id
      this.formData.nama_ortu = tempOrangTua.nama
      this.formData.alamat_ortu = tempOrangTua.alamat
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      if(this.formData.ketua_lingkungan_approval === 1) {
        alert('tidak bisa edit karna sudah diapprove ketua lingkungan')
        return
      }

      try {
        let response = await editData('/surat-keterangan', this.formData.id, this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil diubah!'
          this.$router.push('/keluarga/surat/surat-keterangan')
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
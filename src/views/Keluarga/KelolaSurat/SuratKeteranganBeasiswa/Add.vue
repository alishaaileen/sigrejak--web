<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-beasiswa/" />

    <h1>Tambah Surat Keterangan Beasiswa</h1>

    <div class="form mt-5">
      <v-card class="pa-6" width="100%" flat>
        <v-form @submit.prevent="submit">
          <h3 class="mb-5">Informasi Siswa</h3>

          <autocomplete
            label="Nama*"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdSiswa"
          ></autocomplete>

          <label>Tempat lahir</label>
          <v-text-field
            v-model="formData.tempat_lahir"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

          <label>Tanggal lahir</label>
          <v-text-field
            v-model="formData.tgl_lahir"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

          <label>Alamat</label>
          <v-text-field
            v-model="formData.alamat"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

          <label>No. telepon</label>
          <v-text-field
            v-model="formData.no_telp"
            required
            outlined
            dense
            readonly
            disabled
          ></v-text-field>

          <label>Sekolah</label>
          <v-text-field
            v-model="formData.sekolah"
            required
            outlined
            dense
          ></v-text-field>

          <label>Kelas</label>
          <v-text-field
            v-model="formData.kelas"
            required
            outlined
            dense
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
              Siswa yang dipilih belum memiliki catatan orang tua.
              Harap lengkapi informasi di menu Anggota Keluarga.
            </span>
          </v-alert>

          <label>Nama orang tua*</label>
          <v-text-field
            v-model="formData.nama_ortu"
            required
            outlined
            dense
            disabled
            readonly
          ></v-text-field>

          <label>No. telepon orang tua*</label>
          <v-text-field
            v-model="formData.no_telp_ortu"
            required
            outlined
            dense
            disabled
            readonly
          ></v-text-field>

          <label>Alamat orang tua*</label>
          <v-text-field
            v-model="formData.alamat_ortu"
            required
            outlined
            dense
            disabled
            readonly
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <!-- <h3 class="mb-5">Tempat Tinggal Baru</h3> -->

          <label>Status beasiswa*</label>
          <v-select
            :items="[ 'Belum', 'Tidak pernah' ]"
            v-model="formData.status_beasiswa"
            outlined
            dense
          ></v-select>

          <label>Lampirkan permohonan untuk keterangan beasiswa*</label>
          <!-- <div>
            <p class="subtitle-3 mb-1">
              Tulis lampiran permohonan dari surat keterangan ini
            </p>
          </div> -->
          <v-textarea
            v-model="formData.permohonan"
            required
            outlined
            dense
          ></v-textarea>

          <v-alert
            text
            rounded="4"
            color="orange"
          >
            <!-- <div class="title">
              Lorem Ipsum
            </div> -->
            <h4>Catatan</h4>
            <p class="subtitle-5 ma-0">
              1. Dengan mengajukan surat, anak dianggap belum/tidak pernah menerima bantuan beasiswa dari lembaga/instansi lain
            </p>
          </v-alert>

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
    <snackbar />
  </div>
</template>

<script>
import { getData, postData } from '../../../../utils'
import Autocomplete from '../../../../components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    formData: {
      id_keluarga: null,
      id_lingkungan: null,
      ketua_lingkungan: null,
      
      id_siswa: null,
      tempat_lahir: null,
      tgl_lahir: null,
      alamat: null,
      no_telp: null,
      sekolah: null,
      kelas: null,

      id_ortu: null,
      nama_ortu: null,
      no_telp_ortu: null,
      alamat_ortu: null,

      status_beasiswa: '',
      permohonan: '',
      
      isKetuaLingkungan: 0,
    },
    anggotaKeluarga: [],
    isAlertOrtuActive: false,
  }),
  computed: {
    isSubmitDisabled() {
      return this.isAlertOrtuActive ? true : false
    }
  },
  async mounted() {
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.formData.id_keluarga = this.$store.state.keluarga.id
    if (this.$store.state.keluarga.lingkunganId) {
      this.formData.isKetuaLingkungan = true
      this.formData.ketua_lingkungan = this.$store.state.keluarga.nama_keluarga
    }
  },
  methods: {
    async changeIdSiswa(e) {
      let temp = this.anggotaKeluarga.find(_ => {
        return _.nama === e
      })
      this.formData.id_siswa = temp.id
      this.formData.id_lingkungan = temp.lingkungan_id
      this.formData.tempat_lahir = temp.tempat_lahir
      this.formData.tgl_lahir = temp.tgl_lahir
      this.formData.alamat = temp.alamat
      this.formData.no_telp = temp.no_telp

      let detailTemp = await getData(`/detail-umat/${temp.id}`)
      detailTemp = detailTemp[0]

      await this.setOrtu(detailTemp.id_ayah, detailTemp.id_ibu)
    },
    async setOrtu(idAyah, idIbu) {
      let tempOrangTua = {}

      if (idAyah === null) {
        if (idIbu === null) {
          this.isAlertOrtuActive = true
          this.formData.id_ortu = null
          this.formData.nama_ortu = null
          this.formData.no_telp_ortu = null
          this.formData.alamat_ortu = null

          return
        } else {
          tempOrangTua = await getData(`/umat/${idIbu}`)
        }
      } else {
        tempOrangTua = await getData(`/umat/${idAyah}`)
      }
      this.isAlertOrtuActive = false
      tempOrangTua = tempOrangTua[0]
      this.formData.id_ortu = tempOrangTua.id
      this.formData.nama_ortu = tempOrangTua.nama
      this.formData.no_telp_ortu = tempOrangTua.no_telp
      this.formData.alamat_ortu = tempOrangTua.alamat
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await postData('/surat-keterangan-beasiswa/add', this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
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
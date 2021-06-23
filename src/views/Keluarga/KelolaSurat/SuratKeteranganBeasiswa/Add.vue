<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-keterangan-beasiswa" />

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
          <p>{{ formData.nama_ortu }}</p>

          <label>No. telepon orang tua*</label>
          <p>{{ formData.no_telp_ortu }}</p>

          <label>Alamat orang tua*</label>
          <p>{{ formData.alamat_ortu }}</p>

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
          <v-textarea
            v-model="formData.permohonan"
            required
            outlined
            dense
          ></v-textarea>

          <label>File syarat beasiswa*</label>
          <v-alert type="info" dense text>
            Harap memasukan semua syarat dalam format <em>.zip</em> lalu upload file <em>.zip</em> -nya  
          </v-alert>
          <div class="d-flex mb-5">
            <v-file-input
              accept="application/zip"
              style="display: none;"
              ref="inputSyaratBeasiswa"
              v-model="formData.file_syarat_beasiswa"
            ></v-file-input>
            <div>
              <v-btn
                class="text-none"
                color="blue darken-3"
                dark
                depressed
                @click="$refs.inputSyaratBeasiswa.$refs.input.click()"
              >
                Upload file
              </v-btn>
            </div>
            <div v-if="formData.file_syarat_beasiswa.size != 0" class="ml-5">
              <p class="ma-0">
                {{ formData.file_syarat_beasiswa.name }}<br>
              </p>
              <small>{{ fileSize }} Mb</small>
            </div>
          </div>

          <v-alert
            text
            rounded="4"
            color="orange"
          >
            <div class="title">
              Catatan
            </div>
            <p class="subtitle-5 ma-0">
              Dengan mengajukan surat, anak dianggap belum/tidak pernah menerima bantuan beasiswa dari lembaga/instansi lain
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
      tempat_lahir: '-',
      tgl_lahir: '-',
      alamat: '-',
      no_telp: '-',
      sekolah: null,
      kelas: null,

      id_ortu: null,
      nama_ortu: '-',
      no_telp_ortu: '-',
      alamat_ortu: '-',

      status_beasiswa: 'Belum pernah',
      permohonan: '',
      file_syarat_beasiswa: { size: 0 },
      
      isKetuaLingkungan: 0,
    },
    anggotaKeluarga: [],
    isAlertOrtuActive: false,
  }),
  computed: {
    isSubmitDisabled() {
      return this.isAlertOrtuActive ? true : false
    },
    fileSize() {
      let sizeInMb = this.formData.file_syarat_beasiswa.size/1024/1024
      sizeInMb = sizeInMb.toString()
      sizeInMb = sizeInMb.substring(0, 5)

      return sizeInMb
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
          this.formData.nama_ortu = '-'
          this.formData.no_telp_ortu = '-'
          this.formData.alamat_ortu = '-'

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

      let formData = new FormData()
      formData.append('id_keluarga', this.formData.id_keluarga)
      formData.append('id_lingkungan', this.formData.id_lingkungan)
      formData.append('id_siswa', this.formData.id_siswa)
      formData.append('sekolah', this.formData.sekolah)
      formData.append('kelas', this.formData.kelas)
      formData.append('id_ortu', this.formData.id_ortu)
      formData.append('status_beasiswa', this.formData.status_beasiswa)
      formData.append('permohonan', this.formData.permohonan)
      formData.append('file_syarat_beasiswa', this.formData.file_syarat_beasiswa)
      formData.append('ketua_lingkungan', this.formData.ketua_lingkungan)
      formData.append('isKetuaLingkungan', this.formData.isKetuaLingkungan)

      let snackbar = {}

      try {
        let response = await postData('/surat-keterangan-beasiswa/add', formData)

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
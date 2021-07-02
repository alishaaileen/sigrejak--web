<template>
  <div>
    <btn-kembali path="/keluarga/surat/surat-minyak-suci" />

    <h1>Tambah Surat Pelayanan Minyak Suci</h1>

    <div class="form mt-5">
      <v-card class="pa-6" width="100%" flat>
        <v-form @submit.prevent="submit">
          <h3 class="mb-5">Informasi Umat</h3>

          <autocomplete
            label="Nama*"
            :suggestionList="anggotaKeluarga"
            itemText="nama"
            @changeData="changeIdUmat"
          ></autocomplete>

          <label>Nama baptis</label>
          <p>{{ formData.nama_baptis }}</p>

          <label>Tempat lahir</label>
          <p>{{ formData.tempat_lahir }}</p>

          <label>Tanggal lahir</label>
          <p>{{ formData.tgl_lahir }}</p>

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
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="formData.tgl_terima_minyak"
                :max="new Date().toISOString().substr(0, 10)"
                @change="saveDate"
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
          ></v-switch>

          <div v-if="isPunyaPasangan">
            <label>Nama pasangan</label>
            <v-text-field
              v-model="formData.nama_pasangan"
              required
              outlined
              dense
            ></v-text-field>

            <label>Cara menikah</label>
            <v-select
              :items="caraMenikahList"
              v-model="formData.cara_menikah"
              outlined
              dense
            ></v-select>

            <label>Tahun menikah</label>
            <v-select
              :items="tahunList"
              v-model="formData.tahun_menikah"
              clearable
              outlined
              dense
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
          ></v-text-field>

          <label>Alamat*</label>
          <v-textarea
            v-model="formData.alamat_keluarga_penanggung_jawab"
            required
            outlined
            dense
          ></v-textarea>

          <label>Nomor telepon*</label>
          <v-text-field
            v-model="formData.no_telp_keluarga_penanggung_jawab"
            required
            outlined
            dense
          ></v-text-field>

          <v-divider class="mb-5"></v-divider>

          <h3 class="mb">Pastor pelayan</h3>

          <autocomplete
            label="Nama pastor*"
            :suggestionList="pastorList"
            itemText="nama"
            @changeData="changeIdPastor"
          ></autocomplete>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none mt-2"
              type="submit"
              color="blue accent-4"
              dark
              depressed
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
import { getData, postData, changeDateFormat } from '../../../../utils'
import { caraMenikahList } from '../../../../constants'
import Autocomplete from '../../../../components/Autocomplete'

export default {
  components: {
    Autocomplete,
  },
  data: () => ({
    url: '/surat-pelayanan-minyak-suci',
    isDatePickerActive: false,
    isPunyaPasangan: true,
    caraMenikahList,
    tahunList: [],
    formData: {
      id_keluarga: null,
      id_lingkungan: null,
      ketua_lingkungan: null,
      
      id_umat: null,
      nama_baptis: '-',
      tempat_lahir: '-',
      tgl_lahir: '-',
      alamat: '-',

      nama_pasangan: '',
      cara_menikah: '',
      tahun_menikah: null,
      status_terima_minyak: 'Belum pernah',

      id_pastor_pelayan: null,

      nama_keluarga_penanggung_jawab: '',
      alamat_keluarga_penanggung_jawab: '',
      no_telp_keluarga_penanggung_jawab: '',
      
      isKetuaLingkungan: false,
    },
    anggotaKeluarga: [],
    pastorList: [],
  }),
  async mounted() {
    this.initTahun()
    this.anggotaKeluarga = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    this.pastorList = await getData(`/admin/role/3`)
    this.formData.id_keluarga = this.$store.state.keluarga.id
    if (this.$store.state.keluarga.lingkunganId) {
      this.formData.isKetuaLingkungan = true
      this.formData.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
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
      this.formData.tgl_lahir = changeDateFormat(temp.tgl_lahir)
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

      let snackbar = {}
      if(this.formData.status_terima_minyak === 'Belum pernah') {
        this.formData.tgl_terima_minyak = null
      }
      if(this.formData.cara_ortu_menikah === 'Cara lain') {
        this.formData.cara_ortu_menikah = this.temp_cara_ortu_menikah
      }

      try {
        let response = await postData(`${this.url}/add`, this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
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
<template>
  <div>
    <h1 class="page-title">Detail Anggota Keluarga</h1>
    
    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-3" outlined>
        <h4 class="text-h5">Informasi Umum</h4>
        <v-divider class="my-4"></v-divider>
        <v-form>
          <v-row>
            <v-col>
              <label>Nama lengkap*</label>
              <v-text-field
                v-model="umat.nama"
                required
                outlined
                dense
              ></v-text-field>

              <label>Nama baptis</label>
              <v-text-field
                v-model="umat.nama_baptis"
                required
                outlined
                dense
              ></v-text-field>

              <label>Jenis kelamin*</label>
              <v-select
                :items="[ 'Pria', 'Wanita' ]"
                v-model="umat.jenis_kelamin"
                outlined
                dense
              ></v-select>

              <label>Tempat lahir*</label>
              <v-text-field
                v-model="umat.tempat_lahir"
                required
                outlined
                dense
              ></v-text-field>

              <label>Tanggal lahir*</label>
              <birth-date-picker
                :tgl="umat.tgl_lahir"
                @saveDate="saveDate"
              ></birth-date-picker>
            </v-col>

            <v-col>
              <label>Nomor telepon</label>
              <v-text-field
                v-model="umat.no_telp"
                required
                outlined
                dense
              ></v-text-field>

              <label>Pekerjaan*</label>
              <v-text-field
                v-model="umat.pekerjaan"
                required
                outlined
                dense
              ></v-text-field>

              <label>Alamat*</label>
              <v-text-field
                v-model="umat.alamat"
                required
                outlined
                dense
              ></v-text-field>

              <label>Paroki tempat tinggal*</label>
              <v-autocomplete
                :items="parokiNameList"
                outlined
                dense
              ></v-autocomplete>

              <label>Lingkungan tempat tinggal*</label>
              <v-autocomplete
                :items="lingkunganNameList"
                outlined
                dense
              ></v-autocomplete>
            </v-col>
          </v-row>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              type="submit"
              color="success"
              dark
              depressed
            >
              Simpan
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>

    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-3" outlined>
        <h4 class="text-h5">Informasi lain</h4>
        <v-divider class="my-4"></v-divider>
        <v-row>
          <v-col>
            <label>Tanggal baptis</label>
            <birth-date-picker
              :tgl="detailUmat.tgl_baptis"
              @saveDate="saveDate"
            ></birth-date-picker>

            <label>Tanggal komuni</label>
            <birth-date-picker
              :tgl="detailUmat.tgl_komuni"
              @saveDate="saveDate"
            ></birth-date-picker>

            <label>Tanggal baptis</label>
            <birth-date-picker
              :tgl="detailUmat.tgl_penguatan"
              @saveDate="saveDate"
            ></birth-date-picker>
          </v-col>

          <v-col>
            <label>Cara menikah</label>
            <v-text-field
              v-model="detailUmat.cara_menikah"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script>
import { getData } from '../../../utils'

import BirthDatePicker from '../../../components/BirthDatePicker'

export default {
  components: {
    BirthDatePicker
  },
  data: () => ({
    parokiNameList: [],
    lingkunganNameList: [],
    umat: {},
    detailUmat: {},
  }),
  async mounted() {
    this.umat = await this.get(`/umat/${this.$store.state.keluarga.tempIdForDetail}`)
    this.detailUmat = await this.get(`/detail-umat/${this.$store.state.keluarga.tempIdForDetail}`)
  },
  methods: {
    get(endpoint) {
      return getData(endpoint)
    },
    saveDate(newDate) {
      this.umat.tgl_lahir = newDate
    },
  }
}
</script>

<style>

</style>
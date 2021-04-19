<template>
  <div>
    <h1 class="page-title">Tambah Paroki</h1>

    <div class="form mt-5" @submit.prevent="submit">
      <v-card class="pa-3 mx-auto" outlined>
        <v-form>
          <label>Nama paroki*</label>
          <v-text-field
            v-model="formData.nama_paroki"
            required
            outlined
            dense
          ></v-text-field>

          <autocomplete
            label="Romo paroki"
            :suggestionList="romoNameList"
            @changeData="changeIdRomo"
          ></autocomplete>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              type="submit"
              color="success"
              dark
              depressed
            >
              Tambah Paroki
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
    <snackbar></snackbar>
  </div>
</template>

<script>
import { getData, postData } from '../../../utils'

import Autocomplete from '../../../components/Autocomplete'

export default {
  components: {
    Autocomplete
  },
  data: () => ({
    formData: {
      nama_paroki: '',
      id_romo_paroki: null,
    },
    romoList: [],
  }),
  computed: {
    romoNameList: function () {
      return this.romoList.map(e => e.nama)
    },
  },
  async mounted() {
    this.romoList = await getData('/admin/romo')
  },
  methods: {
    changeIdRomo(e) {
      this.romoList.map((_) => {
        if (_.nama == e) {
          this.formData.id_romo_paroki = _.id;
          return
        }
      })
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await postData('/paroki/store', this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil ditambahkan!'
          this.$router.push('kelola-paroki')
        } else {
          snackbar.color = 'error',
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error',
        snackbar.text = error

        console.error = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    }
  }
}
</script>
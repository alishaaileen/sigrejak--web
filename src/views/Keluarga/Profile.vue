<template>
  <div>
    <h1>Profile Keluarga</h1>

    <div class="form mt-5">
      <h2>Informasi Umum</h2>
      <v-divider class="my-3"></v-divider>
        <v-form>
          <label>Nama keluarga</label>
          <v-text-field
            v-model="profile.nama_keluarga"
            required
            outlined
            dense
          ></v-text-field>

          <label>Username</label>
          <v-text-field
            v-model="profile.username"
            required
            outlined
            dense
          ></v-text-field>

          <label>Email</label>
          <v-text-field
            v-model="profile.email"
            required
            outlined
            dense
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none mt-2"
              color="indigo accent-4"
              @click="editProfile"
              dark
              depressed
            >
              Simpan
            </v-btn>
          </div>
        </v-form>

      <div class="mt-10">
        <h2 class="my-3">Anggota Keluarga</h2>
        <!-- <v-divider class="my-3"></v-divider> -->
        <v-card class="mx-auto" outlined>
          <v-data-table
            :headers="headers"
            :items="familyMembers"
            :search="search"
            :page.sync="page"
            :items-per-page="selectedJumlahData"
            :loading="tableLoading"
            loading-text="Memuat data ..."
            hide-default-footer
            @page-count="pageCount = $event"
          >
            <!-- TABLE TOP -->
            <template v-slot:top>
              <v-card-title>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="search"
                      prepend-inner-icon="mdi-magnify"
                      label="Cari"
                      single-line
                      hide-details
                      outlined
                      dense
                      background-color="#FAFAFA"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-title>
            </template>

            <!-- TABLE CONTENT -->
            <template v-slot:[`item.telepon`]="{ item }">
              <p v-if="item === null">-</p>
              <p>{{ item }}</p>
            </template>

            <template v-slot:footer>
              <v-divider></v-divider>
              <div class="d-flex justify-start text-center py-2">
                <v-pagination
                  class="table-pagination"
                  v-model="page"
                  :length="pageCount"
                  :total-visible="6"
                  color="indigo accent-4"
                ></v-pagination>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </div>

    </div>
    <snackbar></snackbar>
  </div>
</template>

<script>
import { getData, editData } from '../../utils'

export default {
  data: () => ({
    profile: {
      nama_keluarga: '',
      username: '',
      email: '',
    },
    tableLoading: true,
    search: '',
    headers: [
      {
        text: 'Nama', value: 'nama',
      },
      {
        text: 'Tempat lahir', value: 'tempat_lahir',
      },
      {
        text: 'Tgl Lahir', value: 'tgl_lahir',
      },
      {
        text: 'Jenis kelamin', value: 'jenis_kelamin',
      },
      {
        text: 'Telepon', value: 'no_telp',
      },
    ],
    familyMembers: [],
    page: 1,
    pageCount: 0,
    selectedJumlahData: 10,
    jumlahData: [10, 30, 50],
  }),
  async mounted() {
    this.tableLoading = true

    this.profile = await getData(`/keluarga/${this.$store.state.keluarga.id}`)
    this.profile = this.profile[0]

    this.familyMembers = await getData(`/umat/keluarga/${this.$store.state.keluarga.id}`)
    
    this.tableLoading = false
  },
  methods: {
    async editProfile() {
      let snackbar ={}
      
      try {
        console.log(this.profile)
        let response = await editData(`/keluarga`, this.$store.state.keluarga.id, this.profile)
        console.log(response.status)
        // if (response.status === 200) {
          this.profile = await getData(`/keluarga/${this.$store.state.keluarga.id}`)
          snackbar.color = 'success',
          snackbar.text = 'Profile keluarga berhasil diubah!'
        // } else {
        //   snackbar.color = 'error',
        //   snackbar.text = 'Harap periksa kembali inputan anda'
        // }
      }catch(e) {
        console.log(e)
        snackbar.color = 'error',
        snackbar.text = 'Harap periksa kembali inputan anda'
      }
    }
  }
}
</script>

<style>

</style>
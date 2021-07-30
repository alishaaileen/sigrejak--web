<template>
  <div>
    <btn-kembali path="/pengurus/keluarga" />
    
    <h1>Detail Keluarga</h1>

    <div class="form mt-5">
      <v-card class="pa-6 mx-auto" flat>
        <h2>Informasi Keluarga</h2>
        <v-form class="my-3">
          <label>Nama keluarga*</label>
          <v-text-field
            v-model="keluarga.nama_keluarga"
            required
            outlined
            dense
          ></v-text-field>

          <label>Username*</label>
          <v-text-field
            v-model="keluarga.username"
            required
            outlined
            dense
          ></v-text-field>

          <label>Email*</label>
          <v-text-field
            v-model="keluarga.email"
            required
            outlined
            dense
          ></v-text-field>

          <label>Nama kepala keluarga</label>
          <v-text-field
            v-model="keluarga.nama_kepala_keluarga"
            required
            outlined
            dense
          ></v-text-field>

          <label>No. telepon*</label>
          <v-text-field
            v-model="keluarga.no_telp_kepala_keluarga"
            required
            outlined
            dense
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              @click="save"
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

    <div class="mt-10">
      <div class="data-table">
        <v-card flat class="pt-5">
          <h2 class="ml-5">Anggota Keluarga</h2>
          <div class="my-3">
            <v-data-table
              :headers="headers"
              :items="familyMembers"
              :search="search"
              :page.sync="page"
              :items-per-page="selectedJumlahData"
              :expanded.sync="expanded"
              show-expand
              :loading="tableLoading"
              loading-text="Memuat data ..."
              hide-default-footer
              @page-count="pageCount = $event"
            >
              <!-- TABLE TOP -->
              <template v-slot:top>
                <v-card-title>
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
                  <!-- <v-btn
                    class="btn text-none mt-2 ml-4"
                    color="blue accent-4"
                    tag="router-link"
                    to="/pengurus/keluarga/anggota/tambah"
                    dark
                    depressed
                  >
                    Tambah anggota
                  </v-btn> -->
                </v-card-title>
              </template>

              <!-- TABLE CONTENT -->
              <template v-slot:[`item.telepon`]="{ item }">
                <p v-if="item.telepon === null">-</p>
                <p v-else>{{ item.telepon }}</p>
              </template>
              <template v-slot:[`item.deleted`]="{ item }">
                <div v-if="item.deleted_at != null">
                  <v-chip small>Terhapus</v-chip>
                </div>
              </template>
              <template v-slot:[`item.is_dead`]="{ item }">
                <span v-if="item.is_dead === 0"></span>
                <span v-else>
                  <v-icon color="grey darken-2">
                    fas fa-cross
                  </v-icon>
                </span>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td class="pa-0" :colspan="headers.length">
                  <v-sheet class="pa-6 ma-0">
                    <v-row class="pl-10">
                      <v-col>
                        <label>Tempat lahir</label>
                        <p>{{ item.tempat_lahir }}</p>
                      </v-col>
                      <v-col>
                        <label>Jenis kelamin</label>
                        <p>{{ item.jenis_kelamin }}</p>
                      </v-col>
                    </v-row>
                    <v-row class="pl-10">
                      <v-col>
                        <label>Alamat</label>
                        <p>{{ item.alamat }}</p>
                      </v-col>
                      <v-col>
                        <label>Pekerjaan</label>
                        <p>{{ item.pekerjaan }}</p>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </td>
              </template>
              <!-- <template v-slot:[`item.action`]="{ item }">
                <div>
                  <v-menu bottom offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn text fab small v-bind="attrs" v-on="on">
                        <v-icon color="#131313">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="goToDetail(item.id)">
                        <v-list-item-title>Ubah</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="openConfirmDelete(item.id)">
                        <v-list-item-title>Hapus</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template> -->

              <template v-slot:footer>
                <v-divider></v-divider>
                <div class="d-flex justify-start text-center py-2">
                  <v-pagination
                    class="table-pagination ml-2 mb-3"
                    v-model="page"
                    :length="pageCount"
                    :total-visible="6"
                    color="blue accent-4"
                  ></v-pagination>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-card>
      </div>
    </div>
    <snackbar></snackbar>
  </div>
</template>

<script>
import { getData, editData } from '../../../utils'

export default {
  data: () => ({
    keluarga: {
      nama_keluarga: '',
      username: '',
      email: '',
    },
    tableLoading: true,
    search: '',
    expanded: [],
    headers: [
      {
        text: 'Nama', value: 'nama',
      },
      {
        text: 'Nama baptis', value: 'nama_baptis',
      },
      {
        text: 'Telepon', value: 'no_telp',
      },
      {
        text: 'Terhapus', value: 'deleted',
      },
      {
        text: '', value: 'is_dead',
      },
      // {
      //   text: 'Aksi', value: 'action',
      // },
    ],
    familyMembers: [],
    page: 1,
    pageCount: 0,
    selectedJumlahData: 10,
    jumlahData: [10, 30, 50],
    deleteId: null,
  }),
  async mounted() {
    this.tableLoading = true

    this.keluarga = await getData(`/keluarga/${this.$route.params.id}`)
    this.keluarga = this.keluarga[0]

    this.familyMembers = await getData(`/umat/keluarga/${this.$route.params.id}`)
    
    this.tableLoading = false
  },
  methods: {
    async save() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await editData('/keluarga', this.$route.params.id, this.keluarga)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil tersimpan!'
        } else {
          snackbar.color = 'error'
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error'
        snackbar.text = error

        console.error = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>
<template>
  <div>
    <h1>Daftar Lingkungan</h1>

    <div class="data-table mt-5">
      <v-card flat outlined>
        <v-data-table
          :headers="headers"
          :items="data"
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
                <v-col cols="3">
                  <v-btn
                    class="btn text-none"
                    color="success"
                    tag="router-link"
                    :to="`/admin/lingkungan/tambah-lingkungan`"
                    dark
                    depressed
                  >
                    Tambah lingkungan
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
          </template>

          <!-- TABLE CONTENT -->
          <template v-slot:[`item.ketua_lingkungan_id`]="{ item }">
            <p>{{ getNamaKeluarga(item.ketua_lingkungan_id) }}</p>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <div>
              <v-menu bottom offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text fab small v-bind="attrs" v-on="on">
                    <v-icon color="#131313">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="goToDetail(item.id)">
                    <v-list-item-title>Detil</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openConfirmDelete(item.id)">
                    <v-list-item-title>Hapus</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>

          <template v-slot:footer>
            <v-divider></v-divider>
            <div class="d-flex justify-start text-center py-2">
              <v-pagination
                class="table-pagination"
                v-model="page"
                :length="pageCount"
                :total-visible="6"
                color="blue"
              ></v-pagination>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <snackbar></snackbar>

    <confirm-delete-modal
      @confirmDelete="confirmDeleteData"
    ></confirm-delete-modal>
  </div>
</template>

<script>
import { getData, deleteData } from '../../../utils'

export default {
  data: () => ({
    tableLoading: true,
    search: '',
    headers: [
      {
        text: 'Nama lingkungan', value: 'nama_lingkungan',
      },
      {
        text: 'Ketua lingkungan', value: 'ketua_lingkungan_id',
      },
      {
        text: '', value: 'action',
      },
    ],
    data: [],
    page: 1,
    pageCount: 0,
    selectedJumlahData: 10,
    jumlahData: [10, 30, 50],
    deleteId: null,
  }),
  async mounted() {
    this.tableLoading = true
    this.data = await getData(`/lingkungan`)
    this.tableLoading = false
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/admin/detail-lingkungan/${id}`)
    },
    openConfirmDelete(id) {
      this.deleteId = id
      this.$store.dispatch('deleteData/openModal')
    },
    async confirmDeleteData(decision) {
      // Close confirmation modal
      this.$store.commit('deleteData/resetModal')
      
      let snackbar = {}

      // Activate loading overlay
      this.$store.dispatch('loading/openLoading')

      if (decision) {
        try {
          let response = await deleteData('/lingkungan', this.deleteId)
          
          if (response.status >= 200 && response.status < 300) {
            snackbar = {
              active: true,
              color: 'success',
              text: 'Data berhasil dihapus',
            }

            this.data = await getData('/lingkungan')
          } else {
            snackbar = {
              active: true,
              color: 'error',
              text: 'Terjadi kesalahan. Silahkan refresh dan coba lagi',
            }
          }
        } catch (error) {
          snackbar = {
            active: true,
            color: 'error',
            text: error,
          }
          console.error(error)
        }
        this.$store.dispatch('snackbar/openSnackbar', snackbar)
      }
      this.$store.dispatch('loading/closeLoading')
    }
  }
}
</script>

<style>

</style>
<template>
  <div>
    <h1>Daftar Pengurus</h1>

    <div class="data-table mt-5">
      <v-card class="" flat>
        <v-data-table
          :headers="headers"
          :items="pengurus"
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
              <v-btn
                class="btn text-none ml-4 mt-2"
                color="blue accent-4"
                tag="router-link"
                to="pengurus/tambah"
                dark
                depressed
              >
                Tambah pengurus
              </v-btn>
            </v-card-title>
          </template>

          <!-- TABLE CONTENT -->
          <template v-slot:[`item.role`]="{ item }">
            <span v-if="item.role === 1">Super Admin</span>
            <span v-else-if="item.role === 2">Sekretariat</span>
            <span v-else>Romo</span>
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
                class="table-pagination ml-2 mb-3"
                v-model="page"
                :length="pageCount"
                :total-visible="6"
                color="blue accent-4"
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
        text: 'Nama', value: 'nama',
      },
      {
        text: 'E-mail', value: 'email',
      },
      {
        text: 'Jabatan', value: 'role',
      },
      {
        text: 'Nomor telepon', value: 'no_telp',
      },
      {
        text: '', value: 'action',
      },
    ],
    pengurus: [],
    page: 1,
    pageCount: 0,
    selectedJumlahData: 10,
    jumlahData: [10, 30, 50],
    deleteId: null,
  }),
  async mounted() {
    this.tableLoading = true
    // this.pengurus = await this.getAllPengurus('/admin')
    this.pengurus = await getData('/admin')
    this.tableLoading = false
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/pengurus/pengurus/${id}`)
    },
    openConfirmDelete(id) {
      this.deleteId = id
      this.$store.dispatch('deleteData/openModal')
    },
    async confirmDeleteData(decision) {
      // Close confirmation modal
      this.$store.commit('deleteData/resetModal')

      if (decision) {
        let snackbar = {}
  
        // Activate loading overlay
        this.$store.dispatch('loading/openLoading')
        try {
          let response = await deleteData('/admin', this.deleteId)
          
          if (response.status === 200) {
            snackbar.color = 'success',
            snackbar.text = 'Data berhasil dihapus'

            this.pengurus = await getData('/admin')
          } else {
            snackbar.color = 'error'
            snackbar.text = 'Terjadi kesalahan. Silahkan refresh dan coba lagi'
          }
        } catch (error) {
          snackbar.color = 'error'
          snackbar.text = error
        }
        this.$store.dispatch('snackbar/openSnackbar', snackbar)
        this.$store.dispatch('loading/closeLoading')
      }
    }
  }
}
</script>

<style>

</style>
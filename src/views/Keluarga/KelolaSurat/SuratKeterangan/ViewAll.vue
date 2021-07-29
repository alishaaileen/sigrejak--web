<template>
  <div>
    <btn-kembali path="/keluarga/surat" />
    
    <h1>Surat Keterangan</h1>

    <div class="data-table mt-5">
      <v-card flat>
        <v-data-table
          :headers="headers"
          :items="suratNotDeleted"
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
                class="btn text-none mt-2 ml-4"
                color="blue accent-4"
                tag="router-link"
                to="surat-keterangan/tambah"
                dark
                depressed
              >
                Buat surat
              </v-btn>
            </v-card-title>
          </template>

          <!-- TABLE CONTENT -->
          <template v-slot:[`item.status_ketua_lingkungan`]="{ item }">
            <span v-if="item.ketua_lingkungan_approval === 1" class="d-flex justify-center">
              <v-icon color="green darken-2">far fa-check-circle</v-icon>
            </span>
            <span v-else>
              <v-icon color="grey darken-2">fas fa-history</v-icon>
            </span>
          </template>
          <template v-slot:[`item.status_sekretariat`]="{ item }">
            <span v-if="item.sekretariat_approval === 1" class="d-flex justify-center">
              <v-icon color="green darken-2">far fa-check-circle</v-icon>
            </span>
            <span v-else>
              <v-icon color="grey darken-2">fas fa-history</v-icon>
            </span>
          </template>
          <template v-slot:[`item.status_romo`]="{ item }">
            <span v-if="item.romo_approval === 1" class="d-flex justify-center">
              <v-icon color="green darken-2">far fa-check-circle</v-icon>
            </span>
            <span v-else>
              <v-icon color="grey darken-2">fas fa-history</v-icon>
            </span>
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
                    <v-list-item-title>{{ item.ketua_lingkungan_approval === 1 ? 'Detail' : 'Ubah' }}</v-list-item-title>
                  </v-list-item>

                  <v-list-item
                    v-if="item.ketua_lingkungan_approval === 1 && item.sekretariat_approval === 1 && item.romo_approval === 1"
                    @click="cetak(item.id)"
                  >
                    <v-list-item-title>Cetak surat</v-list-item-title>
                  </v-list-item>

                  <v-list-item :disabled="item.ketua_lingkungan_approval === 1" @click="openConfirmDelete(item.id)">
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
import { getData, deleteData, cetakSurat } from '../../../../utils'

export default {
  data: () => ({
    url: '/surat-keterangan',
    tableLoading: true,
    search: '',
    headers: [
      {
        text: 'Umat', value: 'nama',
      },
      {
        text: 'Keperluan', value: 'keperluan',
      },
      {
        text: 'K. Lingkungan', value: 'status_ketua_lingkungan', align: 'center', sortable: false
      },
      {
        text: 'Sekretariat', value: 'status_sekretariat', align: 'center', sortable: false
      },
      {
        text: 'Romo', value: 'status_romo', align: 'center', sortable: false
      },
      {
        text: 'Aksi', value: 'action', sortable: false
      },
    ],
    surat: [],
    page: 1,
    pageCount: 0,
    selectedJumlahData: 10,
    jumlahData: [10, 30, 50],
    deleteId: null,
    isModalDetailActive: false,
    selectedDetail: {},
  }),
  computed: {
    suratNotDeleted() {
      return this.surat.filter(e => e.deleted_at === null)
    }
  },
  async mounted() {
    this.tableLoading = true
    this.surat = await getData(`${this.url}/keluarga/${this.$store.state.keluarga.id}`)
    this.tableLoading = false
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/keluarga/surat${this.url}/detail/${id}`)
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
          let response = await deleteData(this.url, this.deleteId)
          
          if (response.status === 200) {
            snackbar.color = 'success'
            snackbar.text = 'Data berhasil dihapus'
            this.surat = await getData(`${this.url}/keluarga/${this.$store.state.keluarga.id}`)
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
    },
    async cetak(id) {
      this.$store.dispatch('loading/openLoading')
      
      let link = await cetakSurat(this.url, id)
      
      this.$store.dispatch('loading/closeLoading')

      window.open(link, '_blank')
    },
  }
}
</script>
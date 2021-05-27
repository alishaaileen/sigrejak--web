<template>
  <div>
    <h1>Surat Keterangan Mati</h1>

    <div class="data-table mt-5">
      <v-card flat>
        <v-data-table
          :headers="headers"
          :items="surat"
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
                    class="btn text-none mt-2"
                    color="blue accent-4"
                    tag="router-link"
                    to="surat-keterangan-mati/tambah"
                    dark
                    depressed
                  >
                    Buat surat
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
          </template>

          <!-- TABLE CONTENT -->
          <template v-slot:[`item.telepon`]="{ item }">
            <p v-if="item === null">-</p>
            <p>{{ item }}</p>
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
                  <v-list-item @click="openModalDetail(item)">
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

    <modal-detail
      :isModalDetailActive="isModalDetailActive"
      :data="selectedDetail"
      @closeModal="(_) => { isModalDetailActive = _ }"
    ></modal-detail>

    <confirm-delete-modal
      @confirmDelete="confirmDeleteData"
    ></confirm-delete-modal>
  </div>
</template>

<script>
import { getData, deleteData } from '../../../../utils'

import ModalDetail from './DetailModal'

export default {
  components: {
    ModalDetail,
  },
  data: () => ({
    tableLoading: true,
    search: '',
    headers: [
      {
        text: 'No. surat', value: 'no_surat',
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
      {
        text: '', value: 'action',
      },
    ],
    surat: [],
    page: 1,
    pageCount: 0,
    selectedJumlahData: 10,
    jumlahData: [10, 30, 50],
    deleteId: null,
    isModalDetailActive: false,
    selectedDetail: null,
  }),
  async mounted() {
    this.tableLoading = true
    this.surat = await getData(`/surat-keterangan-pindah/keluarga/${this.$store.state.keluarga.id}`)
    this.tableLoading = false
  },
  methods: {
    openModalDetail(data) {
      this.selectedDetail = data
      this.selectedDetail.isEditable = data.ketua_lingkungan_approval === 1 ? false : true
      this.isModalDetailActive = true
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
          let response = await deleteData('/umat', this.deleteId)
          
          if (response.status === 200) {
            snackbar.color = 'success'
            snackbar.text = 'Data berhasil dihapus'
          } else {
            snackbar.color = 'error'
            snackbar.text = 'Terjadi kesalahan. Silahkan refresh dan coba lagi'
          }
        } catch (error) {
          snackbar.color = 'error'
          snackbar.text = error
        }
        this.$store.dispatch('snackbar/openSnackbar', snackbar)
      }
      this.$store.dispatch('loading/closeLoading')
    }
  }
}
</script>
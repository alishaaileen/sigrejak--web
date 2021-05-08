<template>
  <div>
    <h1>Detail Lingkungan</h1>

    <v-divider></v-divider>

    <div class="form mt-5">
      <h2>Informasi Lingkungan</h2>
      <div class="my-3">
        <v-form>
          <label>Nama lingkungan*</label>
          <v-text-field
            v-model="lingkungan.nama_lingkungan"
            required
            outlined
            dense
          ></v-text-field>

          <label>Nama paroki</label>
          <v-text-field
            :value="paroki.nama_paroki"
            readonly
            disabled
            outlined
            dense
          ></v-text-field>

          <autocomplete
            :value="keluargaKetuaLingkungan[0].nama_keluarga"
            label="Keluarga ketua lingkungan*"
            :suggestionList="keluargaNameList"
            @changeData="changeIdKeluarga"
          ></autocomplete>

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              @click="save"
              color="indigo accent-4"
              dark
              depressed
            >
              Simpan
            </v-btn>
          </div>
        </v-form>

      </div>
    </div>

    <div class="mt-10">
      <h2>Keluarga</h2>

      <div class="data-table">
        <div class="my-3">
          <v-data-table
            :headers="headers"
            :items="lingkunganList"
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
                    color="indigo accent-4"
                    tag="router-link"
                    :to="`/pengurus/lingkungan/tambah`"
                    dark
                    depressed
                  >
                    Tambah lingkungan
                  </v-btn>
                </v-col>
              </v-row>
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
                  color="indigo accent-4"
                ></v-pagination>
              </div>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
    <snackbar></snackbar>
    <confirm-delete-modal
      @confirmDelete="confirmDeleteData"
    ></confirm-delete-modal>
  </div>
</template>

<script>
import { getData, editData, deleteData } from '../../../utils'

export default {
  data: () => ({
    paroki: {
      nama_paroki: '',
    },
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
    lingkunganList: [],
    keluarga: [{}],
    page: 1,
    pageCount: 0,
    selectedJumlahData: 10,
    jumlahData: [10, 30, 50],
    deleteId: null,
  }),
  async mounted() {
    this.tableLoading = true

    this.keluarga = await getData(`/keluarga`)
    this.paroki = await getData(`/paroki/${this.$route.params.id}`)
    this.paroki = this.paroki[0]

    this.lingkunganList = await getData(`/lingkungan/paroki/${this.$route.params.id}`)
    
    this.tableLoading = false
  },
  methods: {
    getNamaKeluarga(id) {
      let keluarga = this.keluarga.find(e => e.id === id)
      return keluarga.nama_keluarga
    },
    async save() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await editData('/paroki', this.$route.params.id, this.paroki)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Data berhasil tersimpan!'
          this.$router.push('kelola-paroki')
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
    // Lingkungan ================
    goToDetail(id) {
      this.$router.push(`/pengurus/lingkungan/keluarga/${id}`)
    },
    openConfirmDelete(id) {
      this.deleteId = id
      this.$store.dispatch('deleteData/openModal')
    },
    async confirmDeleteData(decision) {
      // Close confirmation modal
      this.$store.commit('deleteData/resetModal')
      // Activate loading overlay
      this.$store.dispatch('loading/openLoading')
      let snackbar = {}

      if (decision) {
        try {
          let response = await deleteData('/lingkungan', this.deleteId)
          
          if (response.status >= 200 && response.status < 300) {
              snackbar.color = 'success'
              snackbar.text = 'Data berhasil dihapus'
            this.tableLoading = true
            this.lingkunganList = await getData(`/lingkungan/paroki/${this.$route.params.id}`)
            this.tableLoading = false
          } else if(response.response.status == 409){
            snackbar.color = 'error'
            snackbar.text = 'Gagal menghapus! Masih ada umat di lingkungan'
          } else {
              snackbar.color = 'error'
              snackbar.text = 'Terjadi kesalahan. Silahkan refresh dan coba lagi'
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
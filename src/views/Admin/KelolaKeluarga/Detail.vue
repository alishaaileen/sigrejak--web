<template>
  <div>
    <h1>Detail Keluarga</h1>

    <v-divider></v-divider>

    <div class="form mt-5">
      <h2>Informasi Keluarga</h2>
      <div class="my-3">
        <v-form>
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

          <div class="d-flex justify-end">
            <v-btn
              class="btn text-none"
              @click="save"
              color="success"
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
      <h2 class="mb-5">Anggota Keluarga</h2>

      <div class="data-table">
        <v-card flat outlined>
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
                        to="tambah-anggota"
                        dark
                        depressed
                      >
                        Tambah anggota keluarga
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-title>
              </template>

              <!-- TABLE CONTENT -->
              <template v-slot:[`item.telepon`]="{ item }">
                <p v-if="item.telepon === null">-</p>
                <p v-else>{{ item.telepon }}</p>
              </template>
              <template v-slot:[`item.is_umat_active`]="{ item }">
                <span v-if="item.is_umat_active === 0">
                  <v-icon color="grey darken-2">
                    mdi-checkbox-blank-circle
                  </v-icon>
                </span>
                <span v-else>
                  <v-icon color="green darken-2">
                    mdi-checkbox-marked-circle
                  </v-icon>
                </span>
              </template>
              <template v-slot:[`item.is_dead`]="{ item }">
                <span v-if="item.is_dead === 0"></span>
                <span v-else>
                  <v-icon color="grey darken-2">
                    mdi-hospital
                  </v-icon>
                </span>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td class="ma-5" :colspan="headers.length">
                  Tempat Lahir: {{ item.tempat_lahir }}
                  <br>
                  Tanggal Lahir: {{ item.tgl_lahir }}
                  <br>
                  Alamat: {{ item.alamat }}
                  <br>
                  Pekerjaan: {{ item.pekerjaan }}
                </td>
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
        text: 'Jenis kelamin', value: 'jenis_kelamin',
      },
      {
        text: 'Telepon', value: 'no_telp',
      },
      {
        text: 'Aktif', value: 'is_umat_active',
      },
      {
        text: '', value: 'is_dead',
      },
      {
        text: '', value: 'action',
      },
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
          this.$router.push('kelola-keluarga')
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
<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat" />
    
    <h1>Surat Baptis Dewasa</h1>

    <div class="data-table mt-5">
      <v-card flat>
        <v-data-table
          :headers="headers"
          :items="suratList"
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
              <v-row dense>
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
                  <v-select
                    v-model="selectedShowData"
                    :items="[ 'Semua', 'Belum diverifikasi', 'Terverifikasi' ]"
                    outlined
                    dense
                    hide-details
                    label="Tampil data"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-title>
          </template>

          <!-- TABLE CONTENT -->
          <template v-slot:[`item.status_ketua_lingkungan`]="{ item }">
            <approval-table-icon :approval="item.ketua_lingkungan_approval" />
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
                    <v-list-item-title>Detail</v-list-item-title>
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
  </div>
</template>

<script>
import { getData } from '@/utils'

import ApprovalTableIcon from '@/components/ApprovalTableIcon'

export default {
  components: {
    ApprovalTableIcon,
  },
  data: () => ({
    url: '/surat-baptis-dewasa',
		selectedShowData: 'Semua',
    tableLoading: true,
    search: '',
    headers: [
      {
        text: 'Tgl surat', value: 'created_at',
      },
      {
        text: 'Nama', value: 'nama', width: '250'
      },
      {
        text: 'Ayah', value: 'nama_ayah', width: '100'
      },
      {
        text: 'Ibu', value: 'nama_ibu', width: '100'
      },
      {
        text: 'K. Lingkungan', value: 'status_ketua_lingkungan', align: 'center', sortable: false
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
    selectedDetail: null,
  }),
  computed: {
    suratList() {
			if (this.selectedShowData === 'Semua') {
				return this.surat.filter(e => e.deleted_at === null)
			} else if (this.selectedShowData === 'Belum diverifikasi') {
				return this.surat.filter(e => e.deleted_at === null && e.ketua_lingkungan_approval === 0)
			} else {
				return this.surat.filter(e => e.deleted_at === null && e.ketua_lingkungan_approval === 1)
			}
		}
  },
  async mounted() {
    this.tableLoading = true
    this.surat = await getData(`${this.url}/lingkungan/${this.$store.state.keluarga.lingkunganId}`)
    this.tableLoading = false
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`surat-baptis-dewasa/detail/${id}`)
    },
  }
}
</script>
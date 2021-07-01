<template>
  <div>
    <btn-kembali path="/keluarga/ketua/surat/surat-keterangan" />
    
    <h1 class="mb-5">Detail Surat Keterangan</h1>

    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <h3>Detail Informasi</h3>
            <v-spacer></v-spacer>
            <v-btn
              class="btn text-none mr-3"
              color="yellow accent-4"
              dark
              depressed
              rounded
              @click="isChatBarActive = true"
            >
              <v-icon small>mdi-chat</v-icon>
              Chat
            </v-btn>

            <v-btn
              class="btn text-none"
              color="blue accent-4"
              dark
              rounded
              depressed
              v-if="data.ketua_lingkungan_approval === 0"
              @click="verify"
            >
              Verifikasi
            </v-btn>
            <v-chip
              v-if="data.ketua_lingkungan_approval === 1"
              :color="data.ketua_lingkungan_approval === 1 ? 'green' : 'grey lighten-2'"
            >
              <span class="color-white">
                Terverifikasi
              </span>
            </v-chip>

          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <div class="mb-15">
              <h2 class="mb-5">Informasi Surat</h2>
              <v-divider class="mb-5"></v-divider>

              <label>No. surat</label>
              <p>{{ data.no_surat }}</p>

              <label>Tanggal surat</label>
              <p>{{ data.created_at }}</p>

              <label>Keperluan</label>
              <p>{{ data.keperluan }}</p>
            </div>

            <div class="mb-15">
              <h2 class="mb-5">Informasi Umat</h2>

              <v-divider class="mb-5"></v-divider>

              <label>Nama</label>
              <p>{{ data.nama }}</p>

              <label>Tempat, tanggal lahir</label>
              <p>{{ `${data.tempat_lahir}, ${data.tgl_lahir}` }}</p>

              <label>Alamat</label>
              <p>{{ data.alamat }}</p>

              <label>Pendidikan</label>
              <p>{{ data.pendidikan }}</p>

              <label>Pekerjaan</label>
              <p>{{ data.pekerjaan }}</p>
            </div>

            <h2 class="mb-5">Informasi Orang Tua</h2>
            
            <v-divider class="mb-5"></v-divider>

            <label>Nama orang tua</label>
            <p>{{ data.nama_ortu }}</p>

            <label>Alamat orang tua</label>
            <p>{{ data.alamat_ortu }}</p>
          </v-card-text>
        </v-card>    
      </v-col>
    </v-row>

    <v-navigation-drawer
      v-model="isChatBarActive"
      absolute
      right
      temporary
      width="500"
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/women/81.jpg">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              <h3 class="mb-0">Keluarga {{ data.nama_keluarga }}</h3>
            </v-list-item-title>
            <v-list-item-subtitle>
              <p class="mb-0">lorem ipsum</p>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <chat-right-bar></chat-right-bar>
      
      <v-btn
        class="text-none"
        @click="isChatBarActive = false"
      >
        close
      </v-btn>
    </v-navigation-drawer>
    
    <snackbar />
  </div>
</template>

<script>
// import { API_URL } from '../../../../constants'
// import io from 'socket.io-client'
import { getOneData } from '../../../../utils'
import { verifySurat } from '../../../../utils/pengurus'

import ChatRightBar from './ChatRightBar.vue'

export default {
  components: {
    ChatRightBar,
  },
  data: () => ({
    url: '/surat-keterangan',
    data: {},
    textChat: '',
    isAlertOrtuActive: false,

    isChatBarActive: false,
    user: '',
    message: '',
    messages: [],
  }),
  
  computed: {
    isVerifyDisabled() {
      return this.data.ketua_lingkungan_approval ? true : false
    }
  },
  async mounted() {
    this.connectSocket()
    
    this.$socket.on('MESSAGE', (data) => {
      this.messages = [...this.messages, data];
      // you can also do this.messages.push(data)
    });

    this.data = await getOneData(`${this.url}/${this.$route.params.id}`)
  },


  sockets: {
    connect() {
      console.log('connected!')
    },
    disconnect() {
      console.log('disconnected!')
    },
    connectError(err) {
      console.log(err)
    },
  },


  methods: {
    async verify() {
      let snackbar
      
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      this.data.ketua_lingkungan_approval = 1
      this.data.ketua_lingkungan = this.$store.state.keluarga.nama_kepala_keluarga
      snackbar = await verifySurat(this.url, this.data.id, this.data)

      if (snackbar.color === 'success') {
        this.$router.push('/keluarga/ketua/surat/surat-keterangan')
      }

      this.data = await getOneData(`${this.url}/${this.$route.params.id}`)

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },


    connectSocket() {
      this.user = this.$store.state.keluarga.nama_keluarga  
      this.$socket.auth = { username: this.user };
      this.$socket.connect();
    },
    sendMessage() {
      this.$socket.emit('SEND_MESSAGE', {
        user: this.user,
        message: this.message,
      })
      this.message = ''
    }
  },
  destroyed() {
    this.$socket.off("connect_error")
  }
}
</script>

<style>

</style>
<template>
  <div>
    <btn-kembali :path="`/keluarga/surat/surat-izin-ekaristi/detail/${$route.params.id}`" />
    
    <h1>Chat</h1>

    <div class="form mt-5">
      <v-card class="mx-auto" flat>
        <v-card-title>
          <h3>Chat Surat {{ surat.no_surat }}</h3>
          
          <v-spacer></v-spacer>

          <v-chip
            v-if="surat.ketua_lingkungan_approval === 1"
            :color="surat.ketua_lingkungan_approval === 1 ? 'green' : 'grey lighten-2'"
          >
            <span class="color-white">
              Terverifikasi
            </span>
          </v-chip>
        </v-card-title>
        <v-divider></v-divider>
        
        <div class="chat-container pa-6">
          <div v-for="(chat, i) in chatList" :key="i">
            <div :class="`d-flex ${printLeftOrRight(chat.pengirim)}`">
              <v-card
                max-width="600"
                rounded
                :class="`mb-2 pa-2 ${chat.pengirim === parseInt(userRole) ? '':'color-white'}`"
                :color="chat.pengirim === parseInt(userRole) ? 'grey lighten-3' : 'blue darken-1'"
                flat
              >
                <p class="ma-0">{{ chat.teks }}</p>
              </v-card>
            </div>
            <div :class="`mb-3 d-flex ${printLeftOrRight(chat.pengirim)}`">
              <small>{{ chat.waktu_kirim}}</small>
            </div>
          </div>
        </div>

        <v-divider></v-divider>

        <div class="pa-6">
          <v-form v-if="surat.ketua_lingkungan_approval === 0">
            <v-textarea
              v-model="chat.teks"
              required
              outlined
              dense
            ></v-textarea>

            <div class="d-flex justify-end">
              <v-btn
                class="btn text-none"
                @click="submit"
                color="blue accent-4"
                dark
                depressed
              >
                Ajukan surat
              </v-btn>
            </div>
          </v-form>

          <div v-else>
            <v-alert
              class="ma-0"
              text
              type="success"
            >
              <p class="ma-0">Surat sudah diverifikasi Ketua Lingkungan</p>
            </v-alert>
          </div>
        </div>
      </v-card>     
    </div>
    <snackbar />
  </div>
</template>

<script>
import { getOneData, postData } from '../../utils'
// import Autocomplete from '../../../../components/Autocomplete'

export default {
  components: {
    // Autocomplete,
  },
  data: () => ({
    url: '/surat-izin-pelayanan-ekaristi',
    chatList: [
      {
        id: 'asdf-asdf-asdf',
        id_surat: 'qwer-qwer-qwer',
        pengirim: 0,
        teks: 'hai',
        waktu_kirim: '2021-07-01 12:12:12',
        read: 1,
      },
      {
        id: 'asdf-asdf-asdf',
        id_surat: 'qwer-qwer-qwer',
        pengirim: 1,
        teks: 'hai jg xixi',
        waktu_kirim: '2021-07-01 12:12:12',
        read: 1,
      },
      {
        id: 'asdf-asdf-asdf',
        id_surat: 'qwer-qwer-qwer',
        pengirim: 0,
        teks: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo qui facere nihil laudantium assumenda eum officiis odio, dolor aut est amet vero unde, placeat, quaerat nulla. Cum error itaque quae.',
        waktu_kirim: '2021-07-01 12:12:12',
        read: 1,
      },
      {
        id: 'asdf-asdf-asdf',
        id_surat: 'qwer-qwer-qwer',
        pengirim: 0,
        teks: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo qui facere nihil laudantium assumenda eum officiis odio, dolor aut est amet vero unde, placeat, quaerat nulla. Cum error itaque quae.',
        waktu_kirim: '2021-07-01 12:12:12',
        read: 1,
      },
      {
        id: 'asdf-asdf-asdf',
        id_surat: 'qwer-qwer-qwer',
        pengirim: 0,
        teks: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo qui facere nihil laudantium assumenda eum officiis odio, dolor aut est amet vero unde, placeat, quaerat nulla. Cum error itaque quae.',
        waktu_kirim: '2021-07-01 12:12:12',
        read: 1,
      },
      {
        id: 'asdf-asdf-asdf',
        id_surat: 'qwer-qwer-qwer',
        pengirim: 1,
        teks: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo qui facere nihil laudantium assumenda eum officiis odio, dolor aut est amet vero unde, placeat, quaerat nulla. Cum error itaque quae.',
        waktu_kirim: '2021-07-01 12:12:12',
        read: 1,
      },
    ],
    surat: {},
    userRole: '',
    chat: {
      id_surat: '',
      pengirim: '',
      teks: '',
    }
  }),
  async mounted() {
    this.userRole = (this.$store.state.keluarga.lingkunganId === null ? 0 : 1)
    //Get data surat
    this.surat = await getOneData(`${this.url}/${this.$route.params.id}`)
    
    // Get all chat history
    // this.chatList = await getData(`chat/${this.$route.params.id}`)

    this.chat.id_surat = this.$route.params.id
    this.pengirim = this.$store.state.keluarga.idLingkungan
  },
  methods: {
    printLeftOrRight(pengirim) {
      return (pengirim === parseInt(this.userRole) ? '' : 'justify-end')
    },
    async submit() {
      this.$store.dispatch('loading/openLoading')
      this.$store.commit('snackbar/resetSnackbar')

      this.setAllWaktu(this.waktu)

      let snackbar = {}

      try {
        let response = await postData(`${this.url}/add`, this.formData)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Surat berhasil dibuat!'
          this.$router.push('/keluarga/surat/surat-izin-ekaristi')
        } else {
          snackbar.color = 'error',
          snackbar.text = 'Harap periksa kembali inputan anda'
        }
      } catch (error) {
        snackbar.color = 'error',
        snackbar.text = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
      this.$store.dispatch('loading/closeLoading')
    },
  }
}
</script>

<style>

</style>
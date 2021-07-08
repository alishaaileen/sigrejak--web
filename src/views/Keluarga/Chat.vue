<template>
  <div>
    <v-btn
      class="mb-5 text-none pl-1"
      color="blue"
      plain
      :ripple="false"
      @click="back"
    >
      <v-icon left>
        fas fa-long-arrow-alt-left
      </v-icon>
      Kembali
    </v-btn>

    <div class="form mt-5">
      <v-card class="mx-auto" flat>
        <v-card-title>
          <h3>Chat</h3>
          
          <v-spacer></v-spacer>

          <approval-chip
            :approval="surat.ketua_lingkungan_approval"
            role="Ketua Lingkungan"
            :nama="surat.ketua_lingkungan"
          ></approval-chip>
        </v-card-title>
        <v-divider></v-divider>
        
        <div class="chat-container pa-6">
          <div ref="chatContainer" v-for="(oneChat, i) in chatList" :key="i">
            <div :class="`d-flex ${printLeftOrRight(oneChat.pengirim)}`">
              <v-card
                max-width="600"
                rounded="xl"
                :class="`mb-2 pa-3 ${chat.pengirim === oneChat.pengirim ? 'color-white':''}`"
                :color="chat.pengirim === oneChat.pengirim ? 'blue darken-1' : 'grey lighten-3'"
                flat
              >
                <p class="ma-0 chat-text-break">{{ oneChat.teks }}</p>
              </v-card>
            </div>
            <div :class="`mb-3 d-flex ${printLeftOrRight(oneChat.pengirim)}`">
              <small>{{ changeDateTime(oneChat.waktu_kirim) }}</small>
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
                Kirim
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
import { convertDateTime, getData, getOneData, postData } from '../../utils'
import ApprovalChip from '../../components/ApprovalChip.vue'

export default {
  components: {
    ApprovalChip,
  },
  data: () => ({
    url: '',
    backPath: '',
    chatList: [],
    surat: {},
    chat: {
      id_surat: '',
      pengirim: '',
      teks: '',
    }
  }),
  async mounted() {
    this.url = this.$store.state.chat.endpointUrl
    this.backPath = this.$store.state.chat.detailPageUrl

    //Get data surat
    this.surat = await getOneData(`${this.url}/${this.$route.params.id}`)
    
    // Get all chat history
    this.chatList = await getData(`/chat/history/${this.$route.params.id}`)

    this.chat.id_surat = this.$route.params.id
    this.chat.pengirim = parseInt(this.$store.state.keluarga.lingkunganId === null ? 0 : 1)

    // Scroll to bottom of chat
    this.scrollToEnd()
  },
  methods: {
    back() {
      this.$store.commit('chat/resetChat')
      this.$router.push(this.backPath)
    },
    changeDateTime(dateTime) {
      return convertDateTime(dateTime)
    },
    printLeftOrRight(pengirim) {
      return (pengirim === this.chat.pengirim ? 'justify-end' : '')
    },
    scrollToEnd () {
      // let content = this.$refs.chatContainer;
      // console.log(content.scrollHeight)
      // content.scrollIntoView({behavior: 'smooth'})
      // content.scrollTop = content.scrollHeight;
    },
    async submit() {
      this.$store.commit('snackbar/resetSnackbar')

      let snackbar = {}

      try {
        let response = await postData(`/chat/send`, this.chat)

        if (response.status >= 200 && response.status < 300) {
          snackbar.color = 'success',
          snackbar.text = 'Pesan terkirim!'

          this.chatList = await getData(`/chat/history/${this.$route.params.id}`)
          this.chat.teks = ''
          this.scrollToEnd()
        } else {
          snackbar.color = 'error',
          snackbar.text = 'Oops, terjadi kesalahan. Mohon coba lagi'
        }
      } catch (error) {
        snackbar.color = 'error',
        snackbar.text = error
      }

      this.$store.dispatch('snackbar/openSnackbar', snackbar)
    },
  }
}
</script>

<style>

</style>
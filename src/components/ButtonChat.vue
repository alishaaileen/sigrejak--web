<template>
  <v-badge
    dark
    color="orange"
    overlap
    :value="countChatUnread > 0"
    :content="countChatUnread"
  >
    <v-btn
      class="btn text-none"
      color="yellow accent-4"
      dark
      depressed
      rounded
      @click="goToChat"
    >
      <v-icon small>mdi-chat</v-icon>
      Chat
    </v-btn>
  </v-badge>
</template>

<script>
export default {
  props: {
    countChatUnread: Number,
    chatPageUrl: String,
    detailPageUrl: String,
    endpointUrl: String,
  },
  methods: {
    goToChat() {
      this.$store.dispatch('chat/setChat', {
        detailPageUrl: this.detailPageUrl,
        endpointUrl: this.endpointUrl
      })
      this.$router.push(this.chatPageUrl)
    },
  }
}
</script>

<style>

</style>
<template>
  <v-row justify="center">
    <v-dialog
      v-model="isDialogActive"
      @click:outside="close"
      scrollable
      max-width="700px"
    >
      <v-card class="mx-auto">
        <v-img
          :src="imageSrc"
        >
        </v-img>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    isDialogActive: Boolean,
    imageSrc: String,
  },
  methods: {
    close() {
      this.$emit('close', false)
    }
  }

}
</script>

<style>

</style>
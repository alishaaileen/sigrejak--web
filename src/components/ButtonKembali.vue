<template>
  <v-btn
    class="mb-5 text-none pl-1"
    color="blue"
    plain
    :ripple="false"
    tag="router-link"
    :to="path"
  >
    <v-icon left>
      fas fa-long-arrow-alt-left
    </v-icon>
    Kembali
  </v-btn>
</template>

<script>
export default {
  props: {
    path: String,
  }
}
</script>
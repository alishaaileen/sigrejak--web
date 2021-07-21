<template>
  <v-chip
    class="ma-2"
    :color="color"
    text-color="white"
  >
    <v-avatar left :class="`${color} darken-2`">
      <v-icon
        color="white"
        small
        v-show="icon"
      >
        {{ icon }}
      </v-icon>
    </v-avatar>
    <span class="color-white">{{ text }}</span>
  </v-chip>
</template>

<script>
export default {
  props: {
    color: String,
    icon: String,
    text: String,
  }
}
</script>

<style>

</style>
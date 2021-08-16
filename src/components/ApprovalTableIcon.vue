<template>
  <span v-if="approval === 1">
    <v-icon color="green darken-1">far fa-check-circle</v-icon>
  </span>
  <span v-else>
    <v-icon color="grey">far fa-check-circle</v-icon>
  </span>
</template>

<script>
export default {
  props: {
    approval: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style>

</style>
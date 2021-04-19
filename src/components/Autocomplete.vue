<template>
  <div>
    <label>{{ label }}</label>
    <v-autocomplete
      :items="suggestionList"
      @change="changeData"
      outlined
      :disabled="disable"
      dense
    ></v-autocomplete>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    suggestionList: Array,
    disable: Boolean,
  },
  methods: {
    changeData(e) {
      this.$emit('changeData', e)
    }
  }
}
</script>

<style>

</style>
<template>
  <div>
    <label>{{ label }}</label>
    <v-autocomplete
      :value="value"
      :items="suggestionList"
      :item-text="itemText"
      @change="changeData"
      outlined
      :disabled="disable"
      dense
      :readonly="disable"
    ></v-autocomplete>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    label: String,
    suggestionList: Array,
    disable: Boolean,
    itemText: String,
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
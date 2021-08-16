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
      :rules="rules"
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
    rules: {
      type: Array,
      default: () => [],
    }
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
<template>
  <div>
    <v-menu
    ref="dateMenu"
    v-model="dateMenu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="tgl"
        prepend-inner-icon="mdi-calendar"
        dense
        readonly
        outlined
        v-bind="attrs"
        v-on="on"
        :rules="rules"
      ></v-text-field>
    </template>
    <v-date-picker
      ref="picker"
      :value="tgl"
      :readonly="editable"
      :disabled="editable"
      :max="new Date().toISOString().substr(0, 10)"
      @change="saveDate"
    ></v-date-picker>
  </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    tgl: String,
    editable: Boolean,
    rules: {
      type: Array,
      default: () => [],
    }
  },
  data: () => ({
    dateMenu: false,
    birthDate: '',
  }),
  watch: {
    dateMenu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    birthDate() {
      return this.tgl != null ? this.tgl : ''
    }
  },
  methods: {
    saveDate (date) {
      this.$refs.dateMenu.save(date)
      this.$emit('saveDate', date)
    },
  }
}
</script>

<style>

</style>
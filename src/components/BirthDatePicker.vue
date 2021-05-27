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
          v-model="birthDate"
          prepend-inner-icon="mdi-calendar"
          :value="tgl"
          dense
          readonly
          outlined
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        ref="picker"
        show-current
        :value="tgl"
        :readonly="editable"
        :disabled="editable"
        v-model="birthDate"
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
  },
  data: () => ({
    dateMenu: false,
    birthDate: '',
  }),
  watch: {
    dateMenu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  mounted() {
    if(this.tgl) this.birthDate = this.tgl
  },
  methods: {
    saveDate (date) {
      console.log(date)
      console.log("hai")
      this.$refs.dateMenu.save(date)
      this.$emit('saveDate', date)
    },
  }
}
</script>

<style>

</style>
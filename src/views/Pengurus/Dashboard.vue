<template>
  <div>
    <h1 class="mb-5">Dashboard</h1>
    
    <v-card class="pa-6" flat>
      <h2 class="mb-5 text-center">Jadwal Baptis</h2>
      <calendar-baptis
        class="mb-5"
        :romoList="romoList"
      ></calendar-baptis>
    </v-card>
  </div>
</template>

<script>
import CalendarBaptis from '../../components/CalendarBaptis.vue'
import { getData } from '../../utils'

export default {
  components: {
    CalendarBaptis,
  },
  data: () => ({
    pengurus: {},
    romoList: []
  }),
  async mounted() {
    this.pengurus = this.$store.state.pengurus

    this.romoList = await getData(`/admin/role/4`)
  }
}
</script>

<style>

</style>
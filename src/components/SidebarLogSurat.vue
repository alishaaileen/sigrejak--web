<template>
  <v-navigation-drawer
    v-model="isSidebarActive"
    app
    right
    temporary
    width="550"
  >
    <div class="pa-4 d-flex">
      <v-btn
        @click="closeSidebar"
        text
        color="blue"
        icon
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <h2 class="ml-2">Log Surat</h2>
    </div>

    <v-divider></v-divider>

    <v-card class="ma-4" flat outlined>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Kejadian
              </th>
              <th class="text-left">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(log, i) in logList"
              :key="i"
            >
              <td>{{ log.kejadian }} oleh {{ log.role_pelaku }}</td>
              <td>{{ changeDateTime(log.waktu) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { convertDateTime } from '../utils'
export default {
  props: {
    isSidebarActive: Boolean,
    logList: Array,
  },
  methods: {
    closeSidebar() {
      this.$emit('closeSidebar')
    },
    changeDateTime(dateTime) {
      return convertDateTime(dateTime)
    }
  }
}
</script>

<style>

</style>
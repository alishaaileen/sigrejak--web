<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            <h3>{{ $refs.calendar.title }}</h3>
          </v-toolbar-title>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            class="mr-4 text-none"
            color="blue"
            @click="setToday"
          >
            Hari ini
          </v-btn>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                depressed
                class="text-none"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Hari</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Minggu</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Bulan</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 Hari</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
              flat
            >
              <!-- <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn> -->
              <v-toolbar-title>
                <h5 class="color-white">{{ selectedEvent.name }}</h5>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn> -->
              <v-btn icon @click="selectedOpen = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <label>No. surat</label>
              <p>{{ selectedEvent.no_surat }}</p>

              <label>Nama anak/nama baptis</label>
              <p>{{ selectedEvent.nama }} / {{ selectedEvent.nama_baptis }}</p>

              <label>Jam</label>
              <p>{{ selectedEvent.jadwal_baptis }}</p>

              <label>Romo pembaptis</label>
              <p>{{ getNamaRomo(selectedEvent.id_romo_pembaptis) }}</p>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { getData } from '../utils'
// color: "orange"
// name: "Baptis Anak"
// start: Date Tue Jul 13 2021 18:15:00 GMT+0700 (Western Indonesia Time)
// end: Date Tue Jul 13 2021 19:15:00 GMT+0700 (Western Indonesia Time)
// timed: true
  export default {
    props: {
      romoList: Array
    },
    data: () => ({
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Bulan',
        week: 'Minggu',
        day: 'Hari',
        '4day': '4 Hari',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: [ 'cyan', 'orange', ],
      names: [ 'Baptis Anak', 'Baptis Dewasa' ],
    }),
    async mounted () {
      await this.$refs.calendar.checkChange()
    },
    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      async updateRange () {
        let events = []
          , tempJadwal = await getData(`/surat-baptis-anak/jadwal`)

        if(tempJadwal) {
          tempJadwal.forEach(jadwal => {
            const start = new Date(jadwal.jadwal_baptis)
            const end = new Date(jadwal.jadwal_baptis)

            events.push({
              ...jadwal,
              name: `Baptis Anak (${jadwal.nama})`,
              start: start,
              end: end,
              color: this.colors[0],
            })
          });
        }

        tempJadwal = await getData(`/surat-baptis-dewasa/jadwal`)
          
        if(tempJadwal) {
          tempJadwal.forEach(jadwal => {
            const start = new Date(jadwal.jadwal_baptis)
            const end = new Date(jadwal.jadwal_baptis)

            events.push({
              ...jadwal,
              name: `Baptis Dewasa (${jadwal.nama})`,
              start: start,
              end: end,
              color: this.colors[1],
            })
          });
        }

        this.events = events
      },




      getNamaRomo(idRomo) {
        const tempRomo = this.romoList.find(e => e.id === idRomo)

        if (tempRomo) return tempRomo.nama
      }
    },
  }
</script>

<style>

</style>
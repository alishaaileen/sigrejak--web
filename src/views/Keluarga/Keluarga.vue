<template>
  <div>
    <!------------- NAVBAR ----------->
    <v-app-bar color="white" light flat fixed>
      <v-spacer></v-spacer>

      <v-chip
        class="ma-2"
        :color="$store.state.keluarga.lingkunganId != null ? `indigo accent-2` : `blue lighten-2`"
      >
        <v-avatar left>
          <v-icon
            v-if="$store.state.keluarga.lingkunganId != null"
            color="white"
            small
          >
            fas fa-users-cog
          </v-icon>
          <v-icon
            v-else
            color="white"
            small
          >
            fas fa-users
          </v-icon>
        </v-avatar>
        <span v-if="$store.state.keluarga.lingkunganId != null" class="color-white">Ketua Lingkungan</span>
        <span v-else class="color-white">Keluarga</span>
      </v-chip>

      <!-- <v-btn icon class="btn text-none ma-2">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn> -->

      <v-menu
        offset-y
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="text-none"
            v-bind="attrs"
            v-on="on"
            icon
            color="blue darken-3"
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="() => {this.$router.push('/keluarga/profile/informasi-akun')}">
            <v-list-item-title>
              <v-icon>mdi-account</v-icon>
              Profile Keluarga
            </v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">
            <v-btn class="text-none" text color="error" block>
              <v-icon small>mdi-logout</v-icon>
              Log out
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    
    <!-- SIDEBAR -->
    <v-navigation-drawer color="blue darken-3" dark permanent fixed width="240" app>
      <v-list dense nav class="my-7 px-4">
        <v-list-item two-line>
          <v-avatar size="48" tile>
            <v-icon x-large>mdi-account-circle</v-icon>
          </v-avatar>

          <v-list-item-content>
            <v-list-item-title class="sidebar-app-name">
              <h3 class="color-white">{{ $store.state.keluarga.nama_keluarga }}</h3>
            </v-list-item-title>
            <v-list-item-subtitle class="sidebar-app-name">
              {{ $store.state.keluarga.lingkunganId != null ? 'Ketua Lingkungan' : 'Keluarga' }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <!-- MENU-MENU -->

        <div v-for="(menu, i) in menus" :key="i">
          <v-list-item v-if="!menu.hasOption && menu.show" tag="router-link" :to="menu.to">
            <v-list-item-icon>
              <v-icon color="white">{{ menu.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="sidebar-menu-option">
                {{ menu.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            v-else-if="menu.show"
            :prepend-icon="menu.icon"
            no-action
            :value="false"
            color="blue accent-3"
          >
            <template v-slot:activator>
              <v-list-item-title class="sidebar-menu-option">
                {{ menu.title }}
              </v-list-item-title>
            </template>

            <v-list-item
              v-for="(option, i) in menu.options"
              tag="router-link"
              :to="option.to"
              :key="i"
              link
            >
              <v-list-item-title
                v-text="option.optionTitle"
                class="sidebar-menu-option"
              ></v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>

      <!-- <template v-slot:append>
        <div class="pa-2">
          <v-btn
            color="error"
            @click="logout"
            class="btn text-transform-none text-none"
            block
            >Keluar</v-btn
          >
        </div>
      </template> -->
    </v-navigation-drawer>

    <div class="app-container pa-10 grey lighten-4">
      <router-view class="pt-15"/>
    </div>

    <loading-overlay></loading-overlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { setAxiosBearerToken } from '../../utils'

export default {
  computed: mapState({
    keluarga: 'keluarga'
  }),
  data() {
    return {
      isKetuaLingkungan: false,
      menus: [
        {
          title: "Anggota Keluarga",
          icon: "mdi-account-group-outline",
          to: "/keluarga/anggota",
          show: true,
        },
        {
          title: "Surat",
          icon: "mdi-file-document-multiple-outline",
          to: "/keluarga/surat",
          show: true,
        },
        {
          title: "Ketua Lingkungan",
          icon: "mdi-book-outline",
          show: false,
          hasOption: true,
          options: [
            {
              optionTitle: "Surat",
              to: "/keluarga/ketua/surat",
            },
          ],
        },
      ],
    }
  },
  async created() {
    await setAxiosBearerToken()
    await this.$store.dispatch('keluarga/checkUserToken')
    await this.$store.dispatch('keluarga/getUserProfile')
    await this.$store.dispatch('keluarga/checkKetuaLingkungan')
    this.menus[2].show = this.$store.state.keluarga.lingkunganId != null ? true : false 
  },
  methods: {
    logout() {
      this.$store.dispatch('keluarga/logout')
      this.$router.push('/')
    }
  }
}
</script>
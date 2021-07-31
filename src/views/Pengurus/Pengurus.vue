<template>
  <div>
    <!------------- NAVBAR ----------->
    <v-app-bar color="white" light flat fixed app>
      <v-app-bar-nav-icon @click="isNavDrawerShow = !isNavDrawerShow"></v-app-bar-nav-icon>
      
      <v-spacer></v-spacer>

      <chip-account
        :color="getColor($store.state.pengurus.role)"
        :icon="getIcon($store.state.pengurus.role)"
        :text="getRole($store.state.pengurus.role)"
      />

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
            large
            :color="getColor($store.state.pengurus.role)"
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="() => {this.$router.push('/pengurus/profile/informasi-akun')}">
            <v-list-item-title>
              <v-icon>mdi-account</v-icon>
              Profile
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
    <v-navigation-drawer color="blue darken-3" dark :permanent="isNavDrawerShow" fixed width="240" v-model="isNavDrawerShow" app>
      <v-list dense nav class="my-7 px-4">
        <v-list-item two-line>
          <v-avatar size="48" tile>
            <v-icon x-large>mdi-account-circle</v-icon>
          </v-avatar>

          <v-list-item-content>
            <v-list-item-title class="sidebar-app-name">
              <h3 class="color-white">{{ $store.state.pengurus.nama }}</h3>
            </v-list-item-title>
            <v-list-item-subtitle class="sidebar-app-name">
              {{ getRole($store.state.pengurus.role) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <!-- MENU-MENU -->

        <div v-for="(menu, i) in menus" :key="i">
          <v-list-item v-if="!menu.hasOption" tag="router-link" :to="menu.to">
            <v-list-item-icon>
              <v-icon color="white">{{ menu.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="sidebar-menu-option">{{
                menu.title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            v-else
            :prepend-icon="menu.icon"
            no-action
            value="true"
            color="blue accent-3"
          >
            <template v-slot:activator>
              <v-list-item-title class="sidebar-menu-option font-semi-bold">{{
                menu.title
              }}</v-list-item-title>
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

    </v-navigation-drawer>
    <div class="app-container pa-10 grey lighten-4">
      <router-view/>
    </div>

    <loading-overlay></loading-overlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { setAxiosBearerToken } from '../../utils'
import { adminMenu, sekretariatMenu, romoMenu } from '../../constants'

import ChipAccount from '../../components/ChipJenisAkun'

export default {
  components: {
    ChipAccount,
  },
  computed: mapState({
    pengurus: 'pengurus'
  }),
  data() {
    return {
      isNavDrawerShow: true,
      menus: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard-outline",
          to: "/pengurus/dashboard",
          show: true,
        },
        {
          title: "Pengurus",
          icon: "mdi-account-tie-outline",
          to: "/pengurus/pengurus",
          show: false,
        },
        {
          title: "Keluarga",
          icon: "mdi-account-group-outline",
          to: "/pengurus/keluarga",
          show: false,
        },
        {
          title: "Lingkungan",
          icon: "mdi-home-group",
          to: "/pengurus/lingkungan",
          show: false,
        },
        {
          title: "Surat",
          icon: "mdi-book-outline",
          to: "/pengurus/surat",
          show: false,
        },
        {
          title: "Laporan",
          icon: "mdi-file-document-multiple-outline",
          to: "/pengurus/laporan",
          show: false,
        },
      ],
    }
  },
  async created() {
    setAxiosBearerToken()
    await this.$store.dispatch('pengurus/checkUserToken')
    await this.$store.dispatch('pengurus/getPengurusProfile')
    this.menus = this.getMenuList(this.$store.state.pengurus.role)
  },
  methods: {
    getMenuList(role) {
      if (role === 1) return adminMenu
      if (role === 2) return sekretariatMenu
      if (role === 3 || role === 4) return romoMenu
    },
    getColor(role) {
      if (role === 1) return "indigo lighten-1"
      else if (role === 2) return "cyan"
      else if (role === 3) return "light-blue"
      else if (role === 4) return "blue"
    },
    getIcon(role) {
      if (role === 1) return "mdi-head-cog"
      else if (role === 2) return "mdi-account-cog"
      else return "mdi-account"
    },
    getRole(role) {
      if (role === 1) return "Super Admin"
      else if (role === 2) return "Sekretariat"
      else if (role === 3) return "Romo Paroki"
      else if (role === 4) return "Romo"
    },
    logout() {
      this.$store.dispatch('pengurus/logout')
      this.$router.push('/login-pengurus')
    }
  }
}
</script>
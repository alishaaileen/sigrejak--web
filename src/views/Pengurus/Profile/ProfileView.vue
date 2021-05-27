<template>
  <div>
    <v-card class="mx-auto" flat>

      <div class="d-flex align-start align-stretch">
        <div>
          <v-navigation-drawer color="white" permanent width="240" height="100%">
            <v-list dense nav class="my-7 px-4">
              <div v-for="(setting, i) in settings" :key="i">
                <v-list-item tag="router-link" :to="setting.to">
                  <v-list-item-icon>
                    <v-icon color="blue accent-3">{{ setting.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title class="sidebar-menu-option">{{
                      setting.title
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list>
          </v-navigation-drawer>
        </div>

        <v-container class="pa-7">
          <router-view />
        </v-container>
      </div>
    </v-card>

    <snackbar></snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    settings: [
      { title: 'Profile', icon: 'mdi-account', to: 'informasi-akun' },
      { title: 'Ubah password', icon: 'mdi-key', to: 'ubah-password' }
    ]
  }),
  methods: {
  }
}
</script>

<style>

</style>
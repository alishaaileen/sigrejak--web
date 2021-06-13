<template>
  <v-tooltip top :disabled="(!getApprovalBoolean())">
    <template v-slot:activator="{ on, attrs }">
      <v-chip
        class="mr-3"
        :color="getApprovalBoolean() ? 'green' : 'grey lighten-2'"
        v-bind="attrs"
        v-on="on"
      >
        <v-avatar left v-if="getApprovalBoolean()" class="green lighten-3">
          <v-icon color="green">mdi-check</v-icon>
        </v-avatar>
        <span :class="getApprovalBoolean() ? 'color-white' : ''">{{ role }}</span>
      </v-chip>
    </template>
    <span class="color-white">
      {{ nama }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    approval: Number,
    role: String,
    nama: String,
  },
  methods: {
    getApprovalBoolean() {
      return this.approval === 1 ? true : false
    }
  }
}
</script>
<template>
  <div class="login d-flex align-center justify-center">
    <v-card class="mx-auto" max-width="500" outlined>
      <h1>asdfasndfin</h1>

      <v-form>
        <v-text-field
          placeholder="email"
          append-icon="mdi-account"
        >
        </v-text-field>

        <v-text-field
          placeholder="password"
          append-icon="mdi-account"
        >
        </v-text-field>

        <v-card-actions>
          <v-btn
            color="#20A2BA"
            rounded
            block
            large
            dark
            type="submit"
            >Masuk</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
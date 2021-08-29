<template>
  <v-layout fill-height>
    <v-flex class="d-flex flex-column justify-center align-center">
      <h1 class="primary--text font-weight-black err">404</h1>
      <h2 class="display-2 text-capitalize">página no encontrada</h2>
      <p class="mt-4 text-lowercase title font-weight-regular">
        No pudimos encontrar la página que estás buscando.
      </p>
      <v-btn color="tertiary white--text" to="/dashboard">Volver</v-btn>
    </v-flex>
  </v-layout>
</template>
<style lang="scss" scoped>
.err {
  font-size: 200px;
}
</style>
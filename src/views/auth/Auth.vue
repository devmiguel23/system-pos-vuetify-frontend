<template>
  <v-container fluid>
    <v-layout fill-height wrap>
      <v-flex class="d-flex justify-center align-center">
        <v-card elevation="4" width="500" min-width="200" max-width="400">
          <router-view />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<template>
  <v-container fluid>
    <v-sistem-bar title="Auto Repuestos" />
    <v-layout fill-height wrap>
      <v-flex class="d-flex justify-center align-center">
        <router-view />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: "Auth",
  components: {
    VSistemBar: () => import("@/components/SistemBarComponent.vue"),
  },
};
</script>
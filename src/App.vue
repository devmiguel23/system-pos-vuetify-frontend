<template>
  <v-app>
    <v-layout v-if="!mobile">
      <router-view />
    </v-layout>
    <v-layout v-else class="mobile-message flex flex-column">
      <h2>
        Lo sentimos, esta aplicación no es compatible con dispositivos móviles.
      </h2>
      <p>Para usar esta aplicación, use una computadora o tableta</p>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    mobile: null,
  }),
  created() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  methods: {
    checkScreen() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 750) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #13284c;
  color: #fff;

  p {
    margin-top: 16px;
  }
}
</style>
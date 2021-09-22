<template>
  <v-system-bar style="-webkit-app-region: drag" window app class="systembar">
    <div class="d-flex align-center">
      <div>
        <v-img
          width="19"
          height="19"
          lazy-src="@/assets/logo/logo_96px.png"
          src="@/assets/logo/logo_96px.png"
        ></v-img>
      </div>
      <div
        class="mx-2 grey--text text--lighten-2 font-weight-normal"
        v-text="title"
      ></div>
      <div
        class="mx-2 grey--text text--lighten-2 font-weight-normal"
        v-text="versionApp"
      ></div>
    </div>
    <v-spacer></v-spacer>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="!resetAndInstall"
          @click="update_downloaded"
          class="d-flex align-center pl-2 mx-1"
          small
          tile
          icon
          style="-webkit-app-region: no-drag"
          :disabled="!checkUpdate"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon :class="!updateFinish ? 'warning--text' : 'success--text'"
            >mdi-update</v-icon
          >
        </v-btn>
        <v-btn
          v-else
          @click="restartApp"
          class="d-flex align-center pl-2 mx-1"
          small
          tile
          icon
          style="-webkit-app-region: no-drag"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="success--text">mdi-lock-reset</v-icon>
        </v-btn>
      </template>
      <span v-text="message"></span>
    </v-tooltip>
    <v-btn
      @click="minimizeWindows"
      class="d-flex align-center pl-2 mx-1"
      small
      tile
      icon
      style="-webkit-app-region: no-drag"
    >
      <v-icon class="white--text">mdi-minus</v-icon>
    </v-btn>
    <v-btn
      style="-webkit-app-region: no-drag"
      @click="maximizeWindows"
      class="d-flex align-center pl-2 mx-1"
      small
      tile
      icon
    >
      <v-icon class="white--text">mdi-checkbox-blank-outline</v-icon>
    </v-btn>
    <v-btn
      style="-webkit-app-region: no-drag"
      @click="closeWindowsApp"
      class="d-flex align-center pl-2 mx-1"
      small
      tile
      icon
    >
      <v-icon class="white--text">mdi-close</v-icon>
    </v-btn>
  </v-system-bar>
</template>
<script>
import { ipcRenderer } from "electron";
window.ipcRenderer = ipcRenderer;
export default {
  name: "Sistem-Bar",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    message: null,
    versionApp: null,
    checkUpdate: false,
    updateFinish: false,
    resetAndInstall: false,
  }),
  created() {
    this.update_available();
    this.version();
  },
  methods: {
    update_downloaded() {
      this.updateFinish = true;
      window.ipcRenderer.on("update_downloaded", () => {
        this.checkUpdate = false;
        this.message = "¿Reiniciar ahora? ";
        this.resetAndInstall = true;
      });
    },
    update_available() {
      window.ipcRenderer.on("update_available", () => {
        this.checkUpdate = true;
        this.message = "Actualizar App";
      });
    },
    restartApp() {
      window.ipcRenderer.send("restart_app");
    },
    version() {
      window.ipcRenderer.send("app_version");
      window.ipcRenderer.on("app_version", (event, arg) => {
        this.versionApp = `Version ${arg.version} alpha`;
      });
    },
    minimizeWindows() {
      window.ipcRenderer.send("MinimizeWindows");
    },
    maximizeWindows() {
      window.ipcRenderer.send("MaximizeWindows");
    },
    closeWindowsApp() {
      this.$swal
        .fire({
          title: "Esta seguro que quiere cerrar la aplicacion?",
          showCancelButton: true,
          confirmButtonText: "Si",
          allowOutsideClick: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("Authorization");
            setTimeout(() => {
              window.ipcRenderer.send("closeWindowsApp");
            }, 500);
          }
        });
    },
  },
};
</script>
<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-sistem-bar title="Auto Repuestos" />
    <v-navigation-drawer :mini-variant="mini" permanent app>
      <v-list-item class="px-2" v-if="user">
        <v-list-item-avatar rounded size="40" elevation="5">
          <v-avatar
            color="tertiary  white--text"
            rounded
            size="40"
            v-text="user.fullname.substr(0, 1)"
            class="font-weight-bold headline"
            style="text-transform: uppercase"
          ></v-avatar>
          <!-- <v-img
            contain
            lazy-src="@/assets/avatars/150-2.jpg"
            src="@/assets/avatars/150-2.jpg"
            class="mx-auto"
          /> -->
        </v-list-item-avatar>
        <div class="d-flex flex-column">
          <v-list-item-title
            class="text-capitalize font-weight-medium"
            v-text="user.fullname"
          ></v-list-item-title>
          <v-list-item-subtitle v-text="user.username"></v-list-item-subtitle>
        </div>
      </v-list-item>
      <v-divider></v-divider>
      <v-list class="py-1" dense>
        <template v-for="(item, i) in items">
          <v-list-group
            mandatory
            v-if="item.children"
            :key="i"
            :append-icon="item.model == true ? item.iconUp : item.iconDown"
          >
            <!-- :prepend-icon="item.iconCtr" -->

            <template v-slot:prependIcon>
              <v-icon class="my-0" v-text="item.iconCtr"></v-icon>
            </template>
            <template v-slot:activator>
              <v-list-item-content class="py-0">
                <v-list-item-title v-text="item.text"> </v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              exact-active-class="primary white--text"
              v-for="(child, i) in item.children"
              :key="i"
              :to="child.route"
            >
              <v-list-item-action class="my-0 mr-0" v-if="child.icon">
                <v-icon x-small>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content class="py-0">
                <v-list-item-title v-text="child.text"> </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            exact-active-class="primary white--text"
            v-else
            :key="i"
            exact-path
            :to="item.route"
          >
            <v-list-item-action class="my-0">
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-action>
            <v-list-item-content class="py-0">
              <v-list-item-title v-text="item.text"> </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar elevation="2" color="primary" dense app>
      <v-app-bar-nav-icon
        class="white--text"
        @click="mini = !mini"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar dense elevation="0" color="primary" dark fixed>
        <v-text-field
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Buscar"
          class="hidden-sm-and-down font-weight-light"
          dense
        ></v-text-field>
      </v-toolbar>

      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="logout"
            ><v-icon class="red--text">mdi-power</v-icon></v-btn
          >
        </template>
        <span>Salir</span>
      </v-tooltip>
    </v-app-bar>
    <v-main class="scroll-y">
      <!-- <v-card elevation="4" class="ma-2">
        <div class="mx-4 d-flex justify-start align-center">
          <h3>DASHBOARD</h3>
          <v-divider vertical class="mx-2"></v-divider>
          <v-breadcrumbs
            class="pa-2 font-weight-bold"
            :items="breadcrumbs"
            divider="/"
          ></v-breadcrumbs>
        </div>
      </v-card> -->
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <footer-component title="Auto Repuestos" />
    <v-btn
      small
      v-scroll="onScroll"
      bottom
      color="tertiary"
      dark
      fab
      fixed
      right
      @click="toTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-container>
</template>
<script>
export default {
  name: "Dashboard",
  components: {
    VSistemBar: () => import("@/components/SistemBarComponent.vue"),
    FooterComponent: () => import("@/components/FooterComponent.vue"),
  },
  data: () => ({
    mini: false,
    user: null,
    // breadcrumbs: [
    //   {
    //     text: "Productos",
    //     disabled: true,
    //     href: "breadcrumbs_dashboard",
    //   },
    // ],
    items: [
      {
        icon: "mdi-view-dashboard",
        text: "Escritorio",
        route: "/dashboard/home",
      },
      {
        icon: "mdi-shield-account",
        text: "Usuarios",
        route: "/dashboard/users",
      },
      {
        icon: "mdi-account-tie",
        text: "Proveedores",
        route: "/dashboard/provider",
      },
      {
        icon: "mdi-account-multiple",
        text: "Clientes",
        route: "/dashboard/client",
      },
      {
        icon: "mdi-store",
        text: "Productos",
        route: "/dashboard/product",
      },
      // {
      //   icon: "mdi-table-star",
      //   text: "Categorias",
      //   route: "/dashboard/categories",
      // },
      // {
      //   iconUp: "mdi-chevron-up",
      //   iconDown: "mdi-chevron-down",
      //   iconCtr: "mdi-shield-account",
      //   text: "Usuarios",
      //   model: false,
      //   children: [
      //     {
      //       icon: "mdi-circle",
      //       text: "Ver Usuarios",
      //       route: "/dashboard/users",
      //     },
      //     // {
      //     //   icon: "mdi-circle",
      //     //   text: "Permisos",
      //     //   route: "/dashboard/permission",
      //     // },
      //   ],
      // },
      // {
      //   iconUp: "mdi-chevron-up",
      //   iconDown: "mdi-chevron-down",
      //   iconCtr: "mdi-warehouse",
      //   text: "Almacen",
      //   model: false,
      //   children: [
      //     {
      //       icon: "mdi-store",
      //       text: "Productos",
      //       route: "/dashboard/product",
      //     },
      //     {
      //       icon: "mdi-table-star",
      //       text: "Categorias",
      //       route: "/dashboard/categories",
      //     },
      //     // {
      //     //   icon: "",
      //     //   text: "Agregar Entradas",
      //     //   route: "/dashboard/addproducts",
      //     // },
      //   ],
      // },
    ],
  }),
  created() {
    this.getUserLocalStorage();
  },
  methods: {
    getUserLocalStorage() {
      this.user = JSON.parse(localStorage.getItem("User"));
    },
    logout() {
      this.$swal
        .fire({
          title: "Esta seguro que quiere cerrar session?",
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Si",
          allowOutsideClick: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            // localStorage.removeItem("Authorization");
            localStorage.clear();
            this.$router.push("/auth");
          }
        });
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>
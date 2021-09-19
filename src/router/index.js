import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";

Vue.use(VueRouter);

const routes = [
  //Init Router
  {
    path: "/",
    meta: {
      requiresAuth: true,
    },
    redirect: { name: "Dashboard" },
  },
  //Errors
  {
    path: "*",
    redirect: { name: "Dashboard" },
    // name: "Error",
    // component: () => import("@/errors/Error_404.vue"),
    // meta: {
    //   title: "Pagina no encontrada",
    //   requiresAuth: false,
    // },
  },
  //authentication
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/auth/Auth.vue"),
    redirect: { name: "Auth-SignIn" },
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: "/auth/signin",
        name: "Auth-SignIn",
        component: () => import("@/views/auth/SignIn.vue"),
        meta: {
          title: "Iniciar Session",
          requiresAuth: false,
        },
      },
    ],
  },
  //dashboard
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/home/Dashboard.vue"),
    redirect: { name: "Dashboard-Product" },
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/dashboard/home",
        name: "Dashboard-Home",
        component: () => import("@/views/home/Home.vue"),
        meta: {
          title: "Escritorio",
          requiresAuth: true,
        },
      },
      {
        path: "/dashboard/users",
        name: "Dashboard-Users",
        component: () => import("@/views/home/Users.vue"),
        meta: {
          title: "Usuarios",
          requiresAuth: true,
        },
      },
      {
        path: "/dashboard/provider",
        name: "Dashboard-Provider",
        component: () => import("@/views/home/Provider.vue"),
        meta: {
          title: "Proveedores",
          requiresAuth: true,
        },
      },
      {
        path: "/dashboard/client",
        name: "Dashboard-Client",
        component: () => import("@/views/home/Client.vue"),
        meta: {
          title: "Clientes",
          requiresAuth: true,
        },
      },
      {
        path: "/dashboard/product",
        name: "Dashboard-Product",
        component: () => import("@/views/home/Product.vue"),
        meta: {
          title: "Productos",
          requiresAuth: true,
        },
      }
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) window.document.title = to.meta && to.meta.title ? `AUTO REPUESTOS - ${to.meta.title}` : "AUTO REPUESTOS";
  if (to.meta.requiresAuth) {
    axios.get("/").catch(() => {
      next("/auth");
    });
  }
  next();
});
export default router;

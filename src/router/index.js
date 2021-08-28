import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  //Init Router
  {
    path: '/',
    redirect: { name: 'Dashboard' }
  },
  //Errors
  {
    path: '*',
    name: 'Error',
    component: () => import('@/errors/Error_404.vue'),
    meta: {
      title: 'Pagina no encontrada',
      requiresAuth: false
    },
  },
  //dashboard
  {
    path: '/dashboard',
    name: "Dashboard",
    component: () => import('@/views/home/Dashboard.vue'),
    redirect: { name: 'Dashboard-Product' },
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/dashboard/product',
        name: 'Dashboard-Product',
        component: () => import('@/views/home/Product.vue'),
        meta: {
          title: 'Productos',
          requiresAuth: true
        },
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) window.document.title = to.meta && to.meta.title ? `AUTO REPUESTOS - ${to.meta.title}` : 'AUTO REPUESTOS';
  next();
})
export default router

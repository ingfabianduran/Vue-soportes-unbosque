import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Main from './views/Main.vue'
import Soporte from "./views/Soporte.vue";
import Error503 from "./views/Error503.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Soporte,
      beforeEnter: (to, from, next) => {
        localStorage.clear();
        next();
      }
    },
    {
      path: '/session',
      name: 'session',
      component: Index,
      beforeEnter: (to, from, next) => {
        localStorage.clear();
        next();
      }
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      beforeEnter: (to, from, next) => {
        if (router.app.$session.exists() && localStorage.getItem("jwt") != null){
          next();
        } else {
          next("/");
        }
      }
    },
    {
      path: '/error',
      name: 'error',
      component: Error503
    }
  ]
});

export default router;
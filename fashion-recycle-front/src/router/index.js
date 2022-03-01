import Vue from "vue";
import VueRouter from "vue-router";
import jwtDecode from "jwt-decode";
import NProgress from "nprogress";

// Store
import store from "@/store";
import {
  SAIR,
  SET_SESSION_EXPIRED,
  AUTENTICAR,
} from "@/store/types/UsuarioType";

// Routes
import mainRoutes from "./main";

Vue.use(VueRouter);

function tokenValid() {
  const usuarioStr = localStorage.getItem("usuario");
  if (!usuarioStr) return false;

  const usuario = JSON.parse(usuarioStr);

  if (!usuario.token) return false;

  const decodedToken = jwtDecode(usuario.token);

  if (Date.now() >= decodedToken.exp * 1000) {
    store.dispatch(SET_SESSION_EXPIRED, true);
    return false;
  }

  return true;
}

export function getRoutes() {
  const routeList = [];

  for (const route in mainRoutes) {
    routeList.push(mainRoutes[route]);
  }
  return routeList;
}

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: getRoutes(),

  // Setar o scroll para o inicio da pagina
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  console.log('entrou no before');
  if (tokenValid() && to.name == "Login") {    
    next("/");
  }

  if (!tokenValid()) {
    store.dispatch(SAIR);
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !tokenValid()) {
    next("/login");
  } else {
    const usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal) {
      console.log("entrou usuario local")
      const usuario = JSON.parse(usuarioLocal);
      store.commit(AUTENTICAR, usuario);
    } else {
      next();
    }
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;

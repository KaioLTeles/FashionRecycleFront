import Login from "@/pages/Login";
import Home from "@/pages/Home";

const routes = {
  home: {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
    show: true,
  },
  login: {
    path: "/login",
    name: "Login",
    component: Login,
    show: true,
  },
};

export default routes;

import PagamentosPage from "@/pages/Pagamentos/PagamentosPage";
import RecebimentosPage from "@/pages/Recebimentos/RecebimentosPage";

const routes = {
  Vendas: {
    path: "/pagamentos",
    name: "Pagamentos",
    component: PagamentosPage,
    meta: { requiresAuth: true },
    show: true,
  },
  Recebimentos: {
    path: "/recebimentos",
    name: "Recebimentos",
    component: RecebimentosPage,
    meta: { requiresAuth: true },
    show: true,
  },
};

export default routes;

import PagamentosPage from "@/pages/Pagamentos/PagamentosPage";

const routes = {
  Vendas: {
    path: "/pagamentos",
    name: "Pagamentos",
    component: PagamentosPage,
    meta: { requiresAuth: true },
    show: true,
  },
};

export default routes;

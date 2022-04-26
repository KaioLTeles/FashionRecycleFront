import VendasPage from "@/pages/Vendas/VendasPage";

const routes = {
  Vendas: {
    path: "/vendas",
    name: "Vendas",
    component: VendasPage,
    meta: { requiresAuth: true },
    show: true,
  },
};

export default routes;

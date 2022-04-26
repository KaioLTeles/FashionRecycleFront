import RelatorioVendasPage from "@/pages/Relatorios/RelatorioVendasPage";
import RelatorioFluxoCaixaPage from "@/pages/Relatorios/RelatorioFluxoCaixaPage";
import RelatorioContasPagar from "@/pages/Relatorios/RelatorioContasPagar";

const routes = {
  RelatorioDeVendas: {
    path: "/relatorios/relatorio-vendas",
    name: "RelatorioDeVendas",
    component: RelatorioVendasPage,
    meta: { requiresAuth: true },
    show: true,
  },
  RelatorioDeContasAPagar: {
    path: "/relatorios/relatorio-contas-pagar",
    name: "relatorios",
    component: RelatorioContasPagar,
    meta: { requiresAuth: true },
    show: true,
  },
  RelatorioDeFluxoDeCaixa: {
    path: "/relatorios/relatorio-fluxo-caixa",
    name: "RelatorioDeFluxoDeCaixa",
    component: RelatorioFluxoCaixaPage,
    meta: { requiresAuth: true },
    show: true,
  },
};

export default routes;

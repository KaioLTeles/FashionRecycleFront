import cadastroDeClientesPage from "@/pages/Cadastros/CadastroDeClientePage";
import cadastroDeFornecedorPage from "@/pages/Cadastros/CadastroDeFornecedorPage";
import cadastroDeProdutoPage from "@/pages/Cadastros/CadastroDeProdutoPage";
import cadastroDeParceiroPage from "@/pages/Cadastros/CadastroDeParceiroPage";

const routes = {
  cadastroDeCliente: {
    path: "/cadastros/clientes",
    name: "CadastroDeClientes",
    component: cadastroDeClientesPage,
    meta: { requiresAuth: true },
    show: true,
  },
  cadastroDeFornecedor: {
    path: "/cadastros/fornecedores",
    name: "CadastroDeFornecedor",
    component: cadastroDeFornecedorPage,
    meta: { requiresAuth: true },
    show: true,
  },
  cadastroDeProduto: {
    path: "/cadastros/produtos",
    name: "CadastroDeProduto",
    component: cadastroDeProdutoPage,
    meta: { requiresAuth: true },
    show: true,
  },
  cadastroDeParceiro: {
    path: "/cadastros/parceiros",
    name: "CadastroDeParceiro",
    component: cadastroDeParceiroPage,
    meta: { requiresAuth: true },
    show: true,
  },
};

export default routes;

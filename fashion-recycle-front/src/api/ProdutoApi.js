import { API } from "./config";

const BuscarTodosOsProdutos = async function (payload) {
  return API.get("/product/getListProductAll", {
    params: {
      id: payload.id,
      name: payload.name,
      brand: payload.brand,
      idPartner: payload.idPartner,
    },
  });
};

const BuscarProdutoPorId = async function (payload) {
  return API.get("/product/getProductById", {
    params: {
      idProduct: payload.idProduct,
    },
  });
};

const AlterarOuCriarProduto = async function (payload) {
  return API.post("/product/alterOrCreateProduct", {
    id: payload.id,
    name: payload.name,
    brand: payload.brand,
    amountInventory: payload.amountInventory,
    pricePartner: payload.pricePartner,
    priceSale: payload.priceSale,
    partnerId: payload.partnerId,
    active: payload.active,
  });
};

const BuscarProdutosParaVenda = async function () {
  return API.get("/product/getProductAllForSale");
};

export const ProdutoApi = {
  BuscarTodosOsProdutos,
  BuscarProdutoPorId,
  AlterarOuCriarProduto,
  BuscarProdutosParaVenda,
};

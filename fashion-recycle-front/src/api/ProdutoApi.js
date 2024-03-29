import { API } from "./config";

const BuscarTodosOsProdutos = async function (payload) {
  return API.get("/product/getListProductAll", {
    params: {
      id: payload.id,
      idBrand: payload.brand,
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
    amountInventory: payload.amountInventory,
    pricePartner: payload.pricePartner,
    priceSale: payload.priceSale,
    partnerId: payload.partnerId,
    active: payload.active,
    productStatus: payload.productStatus,
    serialNumber: payload.serialNumber,
    model: payload.model,
    colour: payload.colour,
    observation: payload.observation,
    brandId: payload.brandId,
    margim: payload.margim,
    Content: payload.Content,
    Size: payload.Size,
    Size_BR: payload.Size_BR,
    Size_Sola: payload.Size_Sola,
    ItemRelated: payload.ItemRelated,
    ApprovalDate: payload.ApprovalDate
  });
};

const BuscarProdutoParaVendoPorFornecedor = async function (payload) {
  return API.get("/product/getProductByPartnerForSale", {
    params: {
      idPartner: payload.idPartner,
    },
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
  BuscarProdutoParaVendoPorFornecedor
};

import { API } from "./config";

const CriarVenda = async function (payload) {
  return API.post("/sales/createSale", payload);
};

export const VendasApi = {
  CriarVenda,
};

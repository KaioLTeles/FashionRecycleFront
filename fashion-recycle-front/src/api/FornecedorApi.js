import { API } from "./config";

const BuscarTodosOsFornecedores = async function (payload) {
  return API.get("/provider/getListProviderAll", {
    params: {
      id: payload.id,
      cnpj: payload.cnpj,
    },
  });
};

const BuscarFornecedorPorId = async function (payload) {
  return API.get("/provider/getProviderById", {
    params: {
      idProvider: payload.idProvider,
    },
  });
};

const AlterarOuCriarFornecedor = async function (payload) {
  return API.post("/provider/alterOrCreateProvider", {
    id: payload.id,
    companyName: payload.companyName,
    legalCompanyName: payload.legalCompanyName,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
    cnpj: payload.cnpj,
    address: payload.address,
    streetNumber: payload.streetNumber,
    cep: payload.cep,
    active: payload.active,
  });
};

const BuscarListaDeForncedoresResumida = async function () {
  return API.get("/provider/getAllProvidersResumeList");
};

export const FornecedorApi = {
  BuscarTodosOsFornecedores,
  BuscarFornecedorPorId,
  AlterarOuCriarFornecedor,
  BuscarListaDeForncedoresResumida,
};

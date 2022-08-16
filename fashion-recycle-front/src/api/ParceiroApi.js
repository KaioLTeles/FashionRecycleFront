import { API } from "./config";

const BuscarTodosOsParceiros = async function (payload) {
  return API.get("/partner/getListPartnerAll", {
    params: {
      id: payload.id,
      name: payload.name,
      cpf: payload.cpf,
      cnpj: payload.cnpj,
    },
  });
};

const BuscarParceiroPeloId = async function (payload) {
  return API.get("/partner/getPartnerById", {
    params: {
      idPartner: payload.idPartner,
    },
  });
};

const AlterarOuCriarParceiro = async function (payload) {
  return API.post("/partner/alterOrCreatePartner", {
    id: payload.id,
    name: payload.name,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
    cpf: payload.cpf,
    cnpj: payload.cnpj,
    address: payload.address,
    streetNumber: payload.streetNumber,
    cep: payload.cep,
    active: payload.active,
    dateOfBirth: payload.dateOfBirth,
  });
};

const BuscarListaParceiroResumida = async function () {
  return API.get("/partner/getAllPartnersResumeList");
};

export const ParceiroApi = {
  BuscarTodosOsParceiros,
  BuscarParceiroPeloId,
  AlterarOuCriarParceiro,
  BuscarListaParceiroResumida,
};

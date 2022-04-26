import { API } from "./config";

const BuscarTodosOsClientes = async function (payload) {
  return API.get("/client/getListClientsAll", {
    params: {
      idClient: payload.idClient,
      nameClient: payload.nameClient,
      cpfClient: payload.cpfClient,
    },
  });
};

const BuscarClientePeloId = async function (payload) {
  return API.get("/client/getClientById", {
    params: {
      idClient: payload.idClient,
    },
  });
};

const AlterarOuCriarCliente = async function (payload) {
  return API.post("/client/alterOrCreateClient", {
    id: payload.id,
    name: payload.name,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
    cpf: payload.cpf,
    address: payload.address,
    streetNumber: payload.streetNumber,
    cep: payload.cep,
    active: payload.active,
  });
};

const BuscarClienteListaResumida = async function () {
  return API.get("/client/getClienAllResume");
};

export const ClienteApi = {
  BuscarTodosOsClientes,
  BuscarClientePeloId,
  AlterarOuCriarCliente,
  BuscarClienteListaResumida,
};

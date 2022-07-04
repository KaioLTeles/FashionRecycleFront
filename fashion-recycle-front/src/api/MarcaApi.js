import { API } from "./config";

const BuscarTodasAsMarcas = async function () {
  return API.get("/brand/getBrandAll");
};

const CriarOuAlterarMarcas = async function (payload) {
  return API.post("/brand/createBrand", {
    id: payload.id,
    name: payload.name,
  });
};

const RemoverMarcas = async function (payload) {
  console.log(payload);
  return API.delete("/brand/removeBrand/" + payload);
};

export const MarcaApi = {
  BuscarTodasAsMarcas,
  CriarOuAlterarMarcas,
  RemoverMarcas,
};

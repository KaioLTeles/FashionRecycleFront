import Vue from "vue";
import Vuex from "vuex";

import { MarcaApi } from "@/api/MarcaApi";

import {
  BUSCARTODASASMARCAS,
  CRIARMARCA,
  REMOVERMARCA,
} from "@/store/types/MarcaType";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    marcaList: [],
  };
};

const state = getDefaultState();

const getters = {};

const mutations = {
  [BUSCARTODASASMARCAS](state, response) {
    state.marcaList = response;
  },
};

const actions = {
  async [BUSCARTODASASMARCAS](context) {
    return MarcaApi.BuscarTodasAsMarcas().then((response) => {
      context.commit(BUSCARTODASASMARCAS, response.data);
    });
  },
  async [CRIARMARCA](context, payload) {
    return MarcaApi.CriarOuAlterarMarcas(payload);
  },
  async [REMOVERMARCA](context, payload) {
    return MarcaApi.RemoverMarcas(payload);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

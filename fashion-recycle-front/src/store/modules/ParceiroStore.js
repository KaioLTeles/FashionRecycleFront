import Vue from "vue";
import Vuex from "vuex";

import { ParceiroApi } from "@/api/ParceiroApi";

import {
  BUSCARTODOSOSPARCEIROS,
  BUSCARPARCEIROPORID,
  ALTERAROUCRIARPARCEIRO,
  EMPTYPARCEIRO,
  BUSCARLISTAPARCEIRORESUMIDA,
} from "@/store/types/ParceiroType";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    parceirosList: [],
    parceiroObjeto: {},
    retornoCriacaoParceiro: "",
    listaParceiroResumida: [],
  };
};

const state = getDefaultState();

const getters = {};

const mutations = {
  [BUSCARTODOSOSPARCEIROS](state, response) {
    state.parceirosList = response;
  },
  [BUSCARPARCEIROPORID](state, response) {
    state.parceiroObjeto = response;
  },
  [EMPTYPARCEIRO](state) {
    state.parceiroObjeto = {};
  },
  [ALTERAROUCRIARPARCEIRO](state, response) {
    state.retornoCriacaoParceiro = response;
  },
  [BUSCARLISTAPARCEIRORESUMIDA](state, response) {
    state.listaParceiroResumida = response;
  },
};

const actions = {
  async [BUSCARTODOSOSPARCEIROS](context, payload) {
    return ParceiroApi.BuscarTodosOsParceiros(payload).then((response) => {
      context.commit(BUSCARTODOSOSPARCEIROS, response.data);
    });
  },
  async [BUSCARPARCEIROPORID](context, payload) {
    return ParceiroApi.BuscarParceiroPeloId(payload).then((response) => {
      context.commit(BUSCARPARCEIROPORID, response.data);
    });
  },
  async [ALTERAROUCRIARPARCEIRO](context, payload) {
    return ParceiroApi.AlterarOuCriarParceiro(payload).then((response) => {
      context.commit(ALTERAROUCRIARPARCEIRO, response.data);
    });
  },
  async [BUSCARLISTAPARCEIRORESUMIDA](context) {
    return ParceiroApi.BuscarListaParceiroResumida().then((response) => {
      context.commit(BUSCARLISTAPARCEIRORESUMIDA, response.data);
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

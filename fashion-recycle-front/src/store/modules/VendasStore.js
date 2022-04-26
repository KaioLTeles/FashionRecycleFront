import Vue from "vue";
import Vuex from "vuex";

import { VendasApi } from "@/api/VendasApi";

import {
  ADICIONARPRODUTONALISTA,
  REMOVERPRODUTODALISTA,
  REALIZARVENDA,
  EMPTYVENDAS,
} from "@/store/types/VendasType";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    listaItensVenda: [],
    codigoVendaCriada: 0,
  };
};

const state = getDefaultState();

const getters = {};

const mutations = {
  [ADICIONARPRODUTONALISTA](state, payload) {
    state.listaItensVenda.push(payload);
  },
  [REMOVERPRODUTODALISTA](state, payload) {
    state.listaItensVenda.splice(payload, 1);
  },
  [REALIZARVENDA](state, response) {
    state.codigoVendaCriada = response;
  },
  [EMPTYVENDAS](state) {
    state.listaItensVenda = [];
  },
};

const actions = {
  async [ADICIONARPRODUTONALISTA](context, payload) {
    context.commit(ADICIONARPRODUTONALISTA, payload);
  },

  async [REMOVERPRODUTODALISTA](context, payload) {
    context.commit(REMOVERPRODUTODALISTA, payload);
  },
  async [EMPTYVENDAS](context) {
    context.commit(EMPTYVENDAS);
  },
  async [REALIZARVENDA](context, payload) {
    return VendasApi.CriarVenda(payload).then((response) => {
      context.commit(REALIZARVENDA, response.data);
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

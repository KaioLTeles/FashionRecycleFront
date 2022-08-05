import Vue from "vue";
import Vuex from "vuex";

import { RelatoriosApi } from "@/api/RelatoriosApi";

import {
  BUSCARRELATORIOVENDAS,
  BUSCARRELATORIODEPAGAMENTOS,
  BUSCARRELATORIOFLUXOCAIXA
} from "@/store/types/RelatorioType";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    relVendasList: [],
    relPagamentos: [],
    relFluxoCaixa: [],
  };
};

const state = getDefaultState();

const getters = {};

const mutations = {
  [BUSCARRELATORIOVENDAS](state, response) {
    state.relVendasList = response;
  },
  [BUSCARRELATORIODEPAGAMENTOS](state, response) {
    state.relPagamentos = response;
  },
  [BUSCARRELATORIOFLUXOCAIXA](state, response) {
    state.relFluxoCaixa = response;
  },
};

const actions = {
  async [BUSCARRELATORIOVENDAS](context, payload) {
    return RelatoriosApi.BuscarRelatorioVendas(payload).then((response) => {
      context.commit(BUSCARRELATORIOVENDAS, response.data);
    });
  },
  async [BUSCARRELATORIODEPAGAMENTOS](context, payload) {
    return RelatoriosApi.BuscarRelatorioPagamentos(payload).then((response) => {
      context.commit(BUSCARRELATORIODEPAGAMENTOS, response.data);
    });
  },
  async [BUSCARRELATORIOFLUXOCAIXA](context, payload) {
    return RelatoriosApi.GetAllSalesForCashFlow(payload).then((response) => {
      context.commit(BUSCARRELATORIOFLUXOCAIXA, response.data);
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

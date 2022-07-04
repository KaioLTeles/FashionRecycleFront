import Vue from "vue";
import Vuex from "vuex";

import { PagamentosApi } from "@/api/PagamentosApi";

import {
  BUSCARMARGEMPADRAO,
  BUSCARTODOSPAGAMENTOSATIVOS,
  BUSCARPAGAMENTOPORID,
  CRIAROUALTERARPAGAMENTO,
  REMOVERPAGAMENTO,
} from "@/store/types/PagamentosType";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    margemPadrao: 0,
    listPagamentos: [],
    pagamentoObj: {},
  };
};

const state = getDefaultState();

const getters = {};

const mutations = {
  [BUSCARMARGEMPADRAO](state, response) {
    state.margemPadrao = response;
  },
  [BUSCARTODOSPAGAMENTOSATIVOS](state, response) {
    state.listPagamentos = response;
  },
  [BUSCARPAGAMENTOPORID](state, response) {
    state.pagamentoObj = response;
  },
};

const actions = {
  async [BUSCARMARGEMPADRAO](context, payload) {
    return PagamentosApi.BuscarMargemPadrao(payload).then((response) => {
      context.commit(BUSCARMARGEMPADRAO, response.data);
    });
  },
  async [BUSCARTODOSPAGAMENTOSATIVOS](context, payload) {
    return PagamentosApi.BuscarTodosPagamentoAtivos(payload).then(
      (response) => {
        context.commit(BUSCARTODOSPAGAMENTOSATIVOS, response.data);
      }
    );
  },
  async [BUSCARPAGAMENTOPORID](context, payload) {
    return PagamentosApi.BuscarPagamentoPorId(payload).then((response) => {
      context.commit(BUSCARPAGAMENTOPORID, response.data);
    });
  },
  async [CRIAROUALTERARPAGAMENTO](context, payload) {
    return PagamentosApi.CriarOuAlterarPagamento(payload);
  },
  async [REMOVERPAGAMENTO](context, payload) {
    return PagamentosApi.RemoverPagamentos(payload);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

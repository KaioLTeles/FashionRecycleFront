import Vue from "vue";
import Vuex from "vuex";

import { FornecedorApi } from "@/api/FornecedorApi";

import {
  BUSCARTODOSFORNECEDORES,
  BUSCARFORNECEDORPORID,
  ALTERAROUCRIARFORNECEDOR,
  EMPTYFORNECEDOR,
  BUSCARLISTAFORNECEDORRESUMIDA,
} from "@/store/types/FornecedorType";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    fornecedorList: [],
    fornecedorObjeto: {},
    retornoCriadoFornecedor: "",
    listaFornecedorResumida: [],
  };
};

const state = getDefaultState();

const getters = {};

const mutations = {
  [BUSCARTODOSFORNECEDORES](state, response) {
    state.fornecedorList = response;
  },
  [BUSCARFORNECEDORPORID](state, response) {
    state.fornecedorObjeto = response;
  },
  [EMPTYFORNECEDOR](state) {
    state.fornecedorObjeto = {};
  },
  [ALTERAROUCRIARFORNECEDOR](state, response) {
    state.retornoCriadoFornecedor = response;
  },
  [BUSCARLISTAFORNECEDORRESUMIDA](state, response) {
    state.listaFornecedorResumida = response;
  },
};

const actions = {
  async [BUSCARTODOSFORNECEDORES](context, payload) {
    return FornecedorApi.BuscarTodosOsFornecedores(payload).then((response) => {
      context.commit(BUSCARTODOSFORNECEDORES, response.data);
    });
  },
  async [BUSCARFORNECEDORPORID](context, payload) {
    return FornecedorApi.BuscarFornecedorPorId(payload).then((response) => {
      context.commit(BUSCARFORNECEDORPORID, response.data);
    });
  },
  async [ALTERAROUCRIARFORNECEDOR](context, payload) {
    return FornecedorApi.AlterarOuCriarFornecedor(payload).then((response) => {
      context.commit(ALTERAROUCRIARFORNECEDOR, response.data);
    });
  },
  async [BUSCARLISTAFORNECEDORRESUMIDA](context) {
    return FornecedorApi.BuscarListaDeForncedoresResumida().then((response) => {
      context.commit(BUSCARLISTAFORNECEDORRESUMIDA, response.data);
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

import Vue from "vue";
import Vuex from "vuex";

import { ProdutoApi } from "@/api/ProdutoApi";

import {
  BUSCARTODOSOSPRODUTOS,
  BUSCARPRODUTOPORID,
  ALTERAROUCRIARPRODUTO,
  EMPTYPRODUTO,
  BUSCARPRODUTOSDISPONIVEISPARAVENDA,
} from "@/store/types/ProdutoType";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    produtoList: [],
    produtoObjeto: {},
    retornoCriacaoProduto: "",
    produtoVendaList: [],
  };
};

const state = getDefaultState();

const getters = {};

const mutations = {
  [BUSCARTODOSOSPRODUTOS](state, response) {
    state.produtoList = response;
  },
  [BUSCARPRODUTOPORID](state, response) {
    state.produtoObjeto = response;
  },
  [EMPTYPRODUTO](state) {
    state.produtoObjeto = {};
  },
  [ALTERAROUCRIARPRODUTO](state, response) {
    state.retornoCriacaoProduto = response;
  },
  [BUSCARPRODUTOSDISPONIVEISPARAVENDA](state, response) {
    state.produtoVendaList = response;
  },
};

const actions = {
  async [BUSCARTODOSOSPRODUTOS](context, payload) {
    return ProdutoApi.BuscarTodosOsProdutos(payload).then((response) => {
      context.commit(BUSCARTODOSOSPRODUTOS, response.data);
    });
  },
  async [BUSCARPRODUTOPORID](context, payload) {
    return ProdutoApi.BuscarProdutoPorId(payload).then((response) => {
      context.commit(BUSCARPRODUTOPORID, response.data);
    });
  },
  async [ALTERAROUCRIARPRODUTO](context, payload) {
    return ProdutoApi.AlterarOuCriarProduto(payload).then((response) => {
      context.commit(ALTERAROUCRIARPRODUTO, response.data);
    });
  },
  async [BUSCARPRODUTOSDISPONIVEISPARAVENDA](context) {
    return ProdutoApi.BuscarProdutosParaVenda().then((response) => {
      context.commit(BUSCARPRODUTOSDISPONIVEISPARAVENDA, response.data);
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

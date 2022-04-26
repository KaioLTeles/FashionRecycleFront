import Vue from "vue";
import Vuex from "vuex";

import { ClienteApi } from "@/api/ClienteApi";

import {
  BUSCARTODOSCLIENTES,
  BUSCARCLIENTEPELOID,
  EMPTYBUSCARCLIENTEPELOID,
  CRIAROUALTERARCLIENTE,
  BUSCARLISTACLIENTERESUMIDA,
} from "@/store/types/ClienteType";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    clientList: [],
    clientObjeto: {},
    retornoCriacaoCliente: "",
    clientListResumida: [],
  };
};

const state = getDefaultState();

const getters = {};

const mutations = {
  [BUSCARTODOSCLIENTES](state, response) {
    state.clientList = response;
  },
  [BUSCARCLIENTEPELOID](state, response) {
    state.clientObjeto = response;
  },
  [EMPTYBUSCARCLIENTEPELOID](state) {
    state.clientObjeto = {};
  },
  [CRIAROUALTERARCLIENTE](state, response) {
    state.retornoCriacaoCliente = response;
  },
  [BUSCARLISTACLIENTERESUMIDA](state, response) {
    state.clientListResumida = response;
  },
};

const actions = {
  async [BUSCARTODOSCLIENTES](context, payload) {
    return ClienteApi.BuscarTodosOsClientes(payload).then((response) => {
      context.commit(BUSCARTODOSCLIENTES, response.data);
    });
  },

  async [BUSCARCLIENTEPELOID](context, payload) {
    return ClienteApi.BuscarClientePeloId(payload).then((response) => {
      context.commit(BUSCARCLIENTEPELOID, response.data);
    });
  },

  async [CRIAROUALTERARCLIENTE](context, payload) {
    return ClienteApi.AlterarOuCriarCliente(payload).then((response) => {
      context.commit(CRIAROUALTERARCLIENTE, response.data);
    });
  },

  async [BUSCARLISTACLIENTERESUMIDA](context) {
    return ClienteApi.BuscarClienteListaResumida().then((response) => {
      context.commit(BUSCARLISTACLIENTERESUMIDA, response.data);
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

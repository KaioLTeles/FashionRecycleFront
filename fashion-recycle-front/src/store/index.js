import Vue from "vue";
import Vuex from "vuex";
import UsuarioStore from "./modules/UsuarioStore";
import NotificationStore from "./modules/NotificationStore";
import ClienteStore from "./modules/ClienteStore";
import ParceiroStore from "./modules/ParceiroStore";
import FornecedorStore from "./modules/FornecedorStore";
import ProdutoStore from "./modules/ProdutoStore";
import VendasStore from "./modules/VendasStore";
import MarcaStore from "./modules/MarcaStore";
import PagamentosStore from "./modules/PagamentosStore";
import RelatorioStore from "./modules/RelatorioStore";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    UsuarioStore,
    NotificationStore,
    ClienteStore,
    ParceiroStore,
    FornecedorStore,
    ProdutoStore,
    VendasStore,
    MarcaStore,
    PagamentosStore,
    RelatorioStore,
  },
});

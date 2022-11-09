import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import moment from "vue-moment";
import VueMask from "v-mask";
import VueExcelXlsx from "vue-excel-xlsx";
import VuetifyMoney from "vuetify-money";

import { AUTENTICAR } from "./store/types/UsuarioType";

Vue.config.productionTip = false;

Vue.use(moment);

Vue.use(VuetifyMoney);

Vue.use(VueExcelXlsx);

Vue.use(VueMask);

new Vue({
  router,
  store,
  vuetify,
  created() {
    const usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal) {
      const usuario = JSON.parse(usuarioLocal);
      this.$store.commit(AUTENTICAR, usuario);
    }
  },
  render: (h) => h(App),
}).$mount("#app");

export default VuetifyMoney;

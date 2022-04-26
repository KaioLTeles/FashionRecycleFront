<template>
  <Fragment>
    <v-app-bar
      :app="!isMobile ? true : false"
      :clipped-left="!isMobile ? true : false"
      v-show="autenticado"
      color="toolbarcolor"
      dark
      class="appbar"
    >
      <v-container class="container">
        <v-app-bar-nav-icon
          v-show="isMobile ? true : false"
          @click.stop="drawer = !drawer"
        />
        <v-toolbar-title class="toolbar-title">
          <router-link to="/"> Fashion Recycle </router-link>
        </v-toolbar-title>
        <v-spacer />
        <v-menu bottom right offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon small v-bind="attrs" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="sair">
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer
      :temporary="isMobile ? true : false"
      :permanent="!isMobile"
      :clipped="!isMobile"
      :expand-on-hover="!isMobile"
      app
      v-model="drawer"
      v-show="autenticado"
      @transitionend="collapseSubItems"
    >
      <template>
        <v-divider class="mb-1" />

        <v-list dense nav class="wrap-text">
          <v-list-item to="/" style="font-size: 1px">
            <v-list-item-action color="primary">
              <v-icon color="primary">mdi-home</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>Início</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!--Cadastros-->
          <v-list-group v-model="cadastrosGroup">
            <template v-slot:activator>
              <v-list-item-action>
                <v-icon color="sidebarcolor"
                  >mdi-clipboard-check-multiple</v-icon
                >
              </v-list-item-action>

              <v-list-item-title>Cadastros</v-list-item-title>
            </template>

            <v-list-item to="/cadastros/clientes">
              <v-list-item-content>
                <v-list-item-title class="wrap-text"
                  >Cadastro Cliente</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/cadastros/fornecedores">
              <v-list-item-content>
                <v-list-item-title class="wrap-text"
                  >Cadastro Fornecedor</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/cadastros/parceiros">
              <v-list-item-content>
                <v-list-item-title class="wrap-text"
                  >Cadastro Parceiro</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/cadastros/produtos">
              <v-list-item-content>
                <v-list-item-title class="wrap-text"
                  >Cadastro Produto</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-item to="/vendas">
            <v-list-item-action>
              <v-icon color="sidebarcolor">mdi-currency-usd </v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title class="wrap-text">Vendas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/pagamentos">
            <v-list-item-action>
              <v-icon color="sidebarcolor">mdi-currency-usd-off </v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title class="wrap-text"
                >Contas Pagar</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <!--Relatórios-->
          <v-list-group v-model="relatorioGroup">
            <template v-slot:activator>
              <v-list-item-action>
                <v-icon color="sidebarcolor">mdi-chart-sankey </v-icon>
              </v-list-item-action>

              <v-list-item-title>Relatórios</v-list-item-title>
            </template>

            <v-list-item to="/relatorios/relatorio-vendas">
              <v-list-item-content>
                <v-list-item-title class="wrap-text"
                  >Relatório de Vendas</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/relatorios/relatorio-contas-pagar">
              <v-list-item-content>
                <v-list-item-title class="wrap-text"
                  >Relatório de Contas a Pagar</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/relatorios/relatorio-fluxo-caixa">
              <v-list-item-content>
                <v-list-item-title class="wrap-text"
                  >Relatório de Fluxo de Caixa</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item to="/usuarios">
            <v-list-item-action>
              <v-icon color="sidebarcolor">mdi-cog-outline </v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title class="wrap-text"
                >Gestão de Usuarios</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- Dialog Mudar Senha -->
    <v-dialog
      v-model="dialog"
      scrollable
      fullscreen
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <MudarSenha v-on:close-dialog="closeDialog" alterarSenha="true" />
    </v-dialog>

    <div>
      <v-snackbar v-model="snackbarShow" top :color="color">
        {{ message }}
      </v-snackbar>
    </div>
  </Fragment>
</template>

<script>
import { Fragment } from "vue-fragment";
import { SET_SNACKBAR_FALSE } from "@/store/types/NotificationType";
import { SAIR } from "@/store/types/UsuarioType";

export default {
  name: "Header-comp",
  components: { Fragment },
  data() {
    return {
      ativo: false,
      ativoPositivacao: false,
      icon: "mdi-menu-up",
      iconPositivacao: "mdi-menu-up",
      collapsed: false,
      selected: [],
      searchInput: null,
      drawer: true,
      mini: true,
      dialog: false,
      isMobile: false,
      cadastrosGroup: false,
      relatorioGroup: false,
    };
  },
  methods: {
    async sair() {
      await this.$store.dispatch(SAIR);
      this.$router.push("/login");
    },
    input(val) {
      //this.drawer = true
      this.$router.push(`/${val}`);
      this.searchInput = null;
      this.selected = [];
    },
    closeDialog() {
      this.dialog = false;
    },
    onResize() {
      this.isMobile = window.innerWidth < 600;
    },
    collapseSubItems() {
      this.cadastrosGroup = false;
      this.relatorioGroup = false;
    },
  },
  watch: {},
  computed: {
    autenticado() {
      return this.$store.state.UsuarioStore.Autenticado;
    },
    snackbarShow: {
      get() {
        return this.$store.state.NotificationStore.snackbarShow;
      },
      set(value) {
        this.$store.commit(SET_SNACKBAR_FALSE, value);
      },
    },
    message() {
      return this.$store.state.NotificationStore.message;
    },
    color() {
      return this.$store.state.NotificationStore.color;
    },
    nome() {
      return this.$store.state.UsuarioStore.usuario.nome;
    },
    matricula() {
      return this.$store.state.UsuarioStore.usuario.matricula;
    },
    codigo() {
      return this.$store.state.UsuarioStore.usuario.codigo;
    },
    isProd() {
      return process.env.VUE_APP_ENV === "production";
    },
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, {
        passive: true,
      });
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
};
</script>

<style scoped>
.wrap-text {
  white-space: normal;
}

.container {
  display: flex;
  align-items: center;
}

.toolbar-title a {
  color: white !important;
  text-decoration: inherit;
}

@media (max-width: 599px) {
  .container {
    padding-left: 0;
    padding-right: 0;
  }

  .appbar {
    max-height: 56px;
  }
}
</style>

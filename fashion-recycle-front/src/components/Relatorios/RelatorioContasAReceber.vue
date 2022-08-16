<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Relatorio de Contas a Receber</v-toolbar-title>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-menu
              v-model="dateInicial.initialMenuDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  v-model="initialDateFormatted"
                  label="Data Inicial"
                  prepend-icon="fa-calendar-alt"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateInicial.initialDate"
                @input="dateInicial.initialMenuDate = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              v-model="dateFinal.initialMenuDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  v-model="finalDateFormatted"
                  label="Data Final"
                  prepend-icon="fa-calendar-alt"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateFinal.initialDate"
                @input="dateFinal.initialMenuDate = false"
              ></v-date-picker>
            </v-menu>
          </v-col>          
        </v-row>
        <v-card-actions>
          <v-btn color="btnPrimary" @click="pesquisar()"> Pesquisar </v-btn>
          <BtnExportToXlsx
            :dataExport="listaItensExport"
            :columnsExport="headersXlsExport"
            :fileName="rel_vendas_nome"
            sheetName="Vendas"
            :loadingToExport="loadingExport"
          ></BtnExportToXlsx>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
          :items="listaVendas"
          :loading="loadingDataTable"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarProduto(item)"
              >mdi-clipboard-text-search</v-icon
            >
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import BtnExportToXlsx from "@/components/Shared/BtnExportToXlsx";

import { BUSCARPRODUTOSDISPONIVEISPARAVENDA } from "@/store/types/ProdutoType";

import { BUSCARRELATORIOVENDAS } from "@/store/types/RelatorioType";

import { BUSCARLISTACLIENTERESUMIDA } from "@/store/types/ClienteType";

import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";

import { BUSCARTODASASMARCAS } from "@/store/types/MarcaType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  components: { BtnExportToXlsx },
  data() {
    return {
      headers: [
        { text: "Codigo da Venda", value: "id" },
        { text: "Data da Venda", value: "creationDateFormated" },
        { text: "Total a Receber", value: "amountSale" },
        { text: "Forma de Pagamento", value: "paymentMethod" },
      ],
      mostrarJanela: false,
      loadingDataTable: false,
      loadingParceiros: false,
      loadingCampoMarca: false,
      loadingExport: false,
      listaItensExport: [],
      rel_vendas_nome: "Rel_Vendas_Export",
      headersXlsExport: [
        { label: "Codigo da Venda", field: "id" },
        { label: "Data da Venda", field: "creationDateFormated" },
        { label: "Cliente", field: "nameClient" },
        { label: "Codigo da Venda", field: "Cliente" },
        { label: "Código Produto", field: "alternativeId" },
        { label: "Produto", field: "productDesciption" },
        { label: "Total da Venda", field: "amountSale" },
        { label: "Forma de Pagamento", field: "paymentMethod" },
      ],
      codigoVendaFilter: 0,
      clienteFilter: 0,
      marcaFilter: 0,
      parceiroFilter: 0,
      codigoProduto: 0,
      loadingCampoCliente: false,
      listaVendasTeste: [],
      dateInicial: {
        todayDate: new Date().toISOString().substr(0, 10),
        initialMenuDate: false,
        initialDate: new Date().toISOString().substr(0, 10),
      },
      dateFinal: {
        todayDate: new Date().toISOString().substr(0, 10),
        initialMenuDate: false,
        initialDate: new Date().toISOString().substr(0, 10),
      },
    };
  },
  methods: {
    pesquisar() {
      this.buscarDadosRelatório();
    },
    buscarDadosRelatório() {
      let payload = {
        idSale:
          this.codigoVendaFilter == null || this.codigoVendaFilter == ""
            ? 0
            : parseInt(this.codigoVendaFilter),
        idClient: parseInt(this.clienteFilter),
        idPartner: parseInt(this.parceiroFilter),
        brand: parseInt(this.marcaFilter),
        inicialFilterDate: this.dateInicial.initialDate,
        finalFilterDate: this.dateFinal.initialDate,
      };
      this.loadingDataTable = true;

      this.$store
        .dispatch(BUSCARRELATORIOVENDAS, payload)
        .then(() => {
          this.loadingDataTable = false;
          this.listaItensExport = this.listaVendas;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados de venda",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alterarProduto(item) {
      this.codigoProduto = item.id;
      this.mostrarJanela = true;
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    async buscarListaDeParceiros() {
      this.loadingParceiros = true;
      await this.$store
        .dispatch(BUSCARLISTAPARCEIRORESUMIDA)
        .then(() => {
          this.loadingParceiros = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingParceiros = false;
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de parceiros",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    async buscarMarcas() {
      this.loadingCampoMarca = true;
      await this.$store
        .dispatch(BUSCARTODASASMARCAS)
        .then(() => {
          this.loadingCampoMarca = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingCampoMarca = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados de marcas",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    resetarCodigoProduto() {
      this.codigoProduto = 0;
    },
    async carregarCampoCiente() {
      this.loadingCampoCliente = true;
      await this.$store
        .dispatch(BUSCARLISTACLIENTERESUMIDA)
        .then(() => {
          this.loadingCampoCliente = false;
        })
        .catch((error) => {
          this.loadingCampoCliente = false;
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao carregar os dados do produto",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    async buscarProdutosVenda() {
      await this.$store
        .dispatch(BUSCARPRODUTOSDISPONIVEISPARAVENDA)
        .then(() => {})
        .catch((error) => {
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de produtos",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
  created() {
    this.buscarListaDeParceiros();
    this.carregarCampoCiente();
    this.buscarMarcas();
  },
  computed: {
    listaParceirosResumida() {
      return this.$store.state.ParceiroStore.listaParceiroResumida;
    },
    listaDeClientes() {
      return this.$store.state.ClienteStore.clientListResumida;
    },
    listaMarcas() {
      return this.$store.state.MarcaStore.marcaList;
    },
    listaVendas() {
      return this.$store.state.RelatorioStore.relVendasList;
    },
    initialDateFormatted: {
      get: function () {
        return this.formatDate(this.dateInicial.initialDate);
      },
      // setter
      set: function (newValue) {
        this.dateInicial.initialDate = newValue;
      },
    },
    finalDateFormatted: {
      get: function () {
        return this.formatDate(this.dateFinal.initialDate);
      },
      // setter
      set: function (newValue) {
        this.dateFinal.initialDate = newValue;
      },
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>

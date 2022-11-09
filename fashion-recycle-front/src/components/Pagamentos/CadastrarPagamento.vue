<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Contas a Pagar</v-toolbar-title>
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
        </v-card-actions>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-actions>
        <v-col class="text-right">
          <v-btn @click="criarPagamento()" dark color="btnPrimary">Novo</v-btn>
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
          :items="listpayments"
          :loading="loadingDataTable"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarPagamento(item)"
              >mdi-pencil</v-icon
            >
          </template>
          <template v-slot:[`item.paymentMade`]="{ item }">
             {{ item.paymentMade == true ? "Liquidado" : "Em Aberto" }}
          </template>
          <template v-slot:[`item.amount`]="{ item }">
            {{ item.amount.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <CadastrarPagamentoModal
      v-model="mostrarJanela"
      v-if="mostrarJanela"
      :codigoPagamento="codigoPagamento"
      @resetarCodigoPayment="resetarCodigoPayment"
      @pesquisar="pesquisar"
    />
  </div>
</template>

<script>
import CadastrarPagamentoModal from "./CadastrarPagamentoModal";

import { BUSCARTODOSPAGAMENTOSATIVOS } from "@/store/types/PagamentosType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  components: { CadastrarPagamentoModal },
  data() {
    return {
      headers: [
        { text: "Código", value: "id" },
        { text: "Histórico", value: "name" },
        { text: "Classificação", value: "paymenyType.description" },
        { text: "Valor", value: "amount" },
        { text: "Data Vencimento", value: "paymentDateFormated" },
        { text: "Status", value: "paymentMade" },
        { text: "Ações", value: "action", sortable: false },
      ],
      codigoFilter: "",
      fornecedorFilter: null,
      parceiroFilter: null,
      loadingDataTable: false,
      mostrarJanela: false,
      codigoPagamento: 0,
      loadingParceiros: false,
      loadingFornecedor: false,
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
    criarPagamento() {
      this.codigoPagamento = 0;
      this.mostrarJanela = true;
    },
    alterarPagamento(item) {
      this.codigoPagamento = item.id;
      this.mostrarJanela = true;
    },
    pesquisar() {
      this.buscarListaDePagamentos();
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    resetarCodigoPayment() {
      this.codigoPagamento = 0;
    },
    async buscarListaDePagamentos() {
      let payload = {
        inicialDate: this.dateInicial.initialDate,
        finalDate: this.dateFinal.initialDate,
      };

      this.loadingDataTable = true;
      await this.$store
        .dispatch(BUSCARTODOSPAGAMENTOSATIVOS, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de pagamentos",
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
  created() {},
  computed: {
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
    listpayments() {
      return this.$store.state.PagamentosStore.listPagamentos;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>

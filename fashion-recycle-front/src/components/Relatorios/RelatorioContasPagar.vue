<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title"
          >Relatório de Contas a Pagar</v-toolbar-title
        >
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
          <v-col>
            <v-select
              dense
              label="Tipo de Despesa"
              :items="listaDeDespesas"
              item-value="Codigo"
              item-text="Descricao"
              v-model="tipoDespesaFilter"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              dense
              label="Status do Pagamento"
              :items="listaStatus"
              item-value="Codigo"
              item-text="Descricao"
              v-model="statusPagamentoFilter"
            ></v-select>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="btnPrimary" @click="pesquisar()"> Pesquisar </v-btn>
          <BtnExportToXlsx
            :dataExport="listaItensExport"
            :columnsExport="headersXlsExport"
            :fileName="relpagnome"
            sheetName="Pagamentos"
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
          :items="listaRelatorioContasAPagar"
          :loading="loadingDataTable"
        >
        <template v-slot:[`item.amount`]="{ item }">
            {{ item.amount.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { BUSCARRELATORIODEPAGAMENTOS } from "@/store/types/RelatorioType";

import BtnExportToXlsx from "@/components/Shared/BtnExportToXlsx";

export default {
  components: { BtnExportToXlsx },
  data() {
    return {
      headers: [
        { text: "Data de Cadastro", value: "creationDateFormated" },
        { text: "Histórico", value: "name" },
        { text: "Classificação", value: "paymentDescription" },
        { text: "Valor", value: "amount" },
        { text: "Data Vencimento", value: "paymentDateFormated" },
      ],
      headersXlsExport: [
        { label: "Data de Cadastro", field: "creationDateFormated" },
        { label: "Histórico", field: "name" },
        { label: "Classificação", field: "paymentDescription" },
        { label: "Valor", field: "amount" },
        { label: "Data Vencimento", field: "paymentDateFormated" },
      ],
      listaItensExport: [],
      mostrarJanela: false,
      loadingDataTable: false,
      loadingExport: false,
      loadingParceiros: false,
      tipoDespesaFilter: 0,
      statusPagamentoFilter: 0,
      relpagnome: "Rel-Pag-Export",
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
      let payload = {
        inicialDate: this.dateInicial.initialDate,
        finalDate: this.dateFinal.initialDate,
        idPaymentType:
          this.tipoDespesaFilter == null || this.tipoDespesaFilter == ""
            ? 0
            : this.tipoDespesaFilter,
            filtertype: this.statusPagamentoFilter
      };

      this.loadingDataTable = true;

      this.BuscarRelatorioPagamentos(payload);
    },
    async BuscarRelatorioPagamentos(payload) {
      await this.$store
        .dispatch(BUSCARRELATORIODEPAGAMENTOS, payload)
        .then(() => {
          this.loadingDataTable = false;
          this.listaItensExport = this.listaRelatorioContasAPagar;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar o relatório de pagamentos",
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
    listaDeDespesas() {
      let array = [
        { Codigo: 1, Descricao: "Custo com Comissão de Venda" },
        { Codigo: 2, Descricao: "Custo com Material de Embalagem" },
        { Codigo: 3, Descricao: "Custo Mercadoria Vendida" },
        { Codigo: 4, Descricao: "Despesa com Aluguel" },
        { Codigo: 5, Descricao: "Despesa com Assessoria Contábil" },
        { Codigo: 6, Descricao: "Despesa com Assessoria Jurídica" },
        { Codigo: 7, Descricao: "Despesa com Energia Elétrica" },
        { Codigo: 8, Descricao: "Despesa com Funcionários" },
        { Codigo: 9, Descricao: "Despesa com Marketing" },
        { Codigo: 10, Descricao: "Despesa com Materiais de Escritório" },
        { Codigo: 11, Descricao: "Despesa com Limpeza e Conservação" },
        { Codigo: 12, Descricao: "Receita com Vendas (Comissões)" },
      ];
      return array;
    },
    listaStatus() {
      let array = [
        { Codigo: 0, Descricao: "-" },
        { Codigo: 1, Descricao: "Pagamentos Liquidados" },
        { Codigo: 2, Descricao: "Pagamentos Vencidos" },
        { Codigo: 3, Descricao: "Pagamentos a Vencer" },
      ];
      return array;
    },
    listaRelatorioContasAPagar() {
      return this.$store.state.RelatorioStore.relPagamentos;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>

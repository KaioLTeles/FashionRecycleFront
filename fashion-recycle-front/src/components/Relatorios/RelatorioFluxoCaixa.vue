<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title"
          >Relatório de Fluxo de Caixa</v-toolbar-title
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
          :loading="loadingDataTable"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarProduto(item)"
              >mdi-pencil</v-icon
            >
          </template>
          <template v-slot:[`item.active`]="{ item }">
            <v-simple-checkbox
              v-model="item.active"
              disabled
            ></v-simple-checkbox>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { BUSCARTODOSOSPRODUTOS } from "@/store/types/ProdutoType";

import BtnExportToXlsx from "@/components/Shared/BtnExportToXlsx";

export default {
  components: { BtnExportToXlsx },
  data() {
    return {
      headers: [
        { text: "Código", value: "id" },
        { text: "Fornecedor", value: "name" },
        { text: "Parceiro", value: "email" },
        { text: "Classificação", value: "phoneNumber" },
        { text: "Valor", value: "cpf" },
        { text: "Data Vencimento", value: "active" },
        { text: "Ações", value: "action", sortable: false },
      ],
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
      mostrarJanela: false,
      loadingDataTable: false,
      loadingParceiros: false,
      codigoFilter: "",
      nomeFilter: "",
      rel_vendas_nome: "",
      loadingExport: false,
      listaItensExport: [],
      marcaFilter: "",
      parceiroFilter: 0,
      codigoProduto: 0,
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
        id: parseInt(this.codigoFilter == "" ? "0" : this.codigoFilter),
        name: this.nomeFilter,
        brand: this.marcaFilter,
        idPartner: this.parceiroFilter,
      };

      this.loadingDataTable = true;

      this.buscarDadosProduto(payload);
    },
    async buscarDadosProduto(payload) {
      await this.$store
        .dispatch(BUSCARTODOSOSPRODUTOS, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados de produtos",
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
  },
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
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>

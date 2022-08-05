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
         <v-row>
          <v-col cols="6">
            <v-checkbox v-model="checkEntradas" label="Somente Entradas" />
          </v-col>
          <v-col cols="6">
            <v-checkbox v-model="checkSaidas" label="Somente Saidas" />
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="btnPrimary" @click="pesquisar()"> Pesquisar </v-btn>
          <BtnExportToXlsx
            :dataExport="listaItensExport"
            :columnsExport="headersXlsExport"
            :fileName="rel_fluxo_caixa_nome"
            sheetName="FluxoCaixa"
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
          :items="listaRelFluxoCaixa"
        >          
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { BUSCARRELATORIOFLUXOCAIXA } from "@/store/types/RelatorioType";

import BtnExportToXlsx from "@/components/Shared/BtnExportToXlsx";

export default {
  components: { BtnExportToXlsx },
  data() {
    return {
      headers: [
        { text: "Data", value: "rowDateText" },
        { text: "Entradas", value: "valueRevenue" },
        { text: "Saidas", value: "valueExpense" },
        { text: "Saldo", value: "balance" },        
      ],
      headersXlsExport: [
        { label: "Data", field: "rowDateText" },
        { label: "Entradas", field: "valueRevenue" },
        { label: "Saidas", field: "valueExpense" },
        { label: "Saldo", field: "balance" },
      ],
      mostrarJanela: false,
      loadingDataTable: false,
      loadingParceiros: false,
      checkEntradas: true,
      checkSaidas: true,
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
        onlyRevenue: this.checkEntradas,
        onlyExpense: this.checkSaidas,
      };

      this.loadingDataTable = true;

      this.buscarDadosProduto(payload);
    },
    async buscarDadosProduto(payload) {
      await this.$store
        .dispatch(BUSCARRELATORIOFLUXOCAIXA, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados do relatório",
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
    listaRelFluxoCaixa() {
      return this.$store.state.RelatorioStore.relFluxoCaixa;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>

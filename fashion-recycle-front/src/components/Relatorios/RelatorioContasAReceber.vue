<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title"
          >Relatorio de Contas a Receber</v-toolbar-title
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
          :items="listaRelatorioContasReceber"
          :loading="loadingDataTable"
        >
          
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import BtnExportToXlsx from "@/components/Shared/BtnExportToXlsx";

import { BUSCARRELATORIOCONTASARECEBER } from "@/store/types/RelatorioType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  components: { BtnExportToXlsx },
  data() {
    return {
      headers: [
        { text: "Data da Venda", value: "saleDateFormated" },
        { text: "Comprador", value: "clientName" },
        { text: "Histórico", value: "name" },
        { text: "Valor", value: "amout" },
        { text: "Data a Receber", value: "recieveDateFormated" },
        { text: "Status", value: "status" },
      ],
      loadingDataTable: false,
      loadingExport: false,
      listaItensExport: [],
      rel_vendas_nome: "Rel_ContReceb_Export",
      headersXlsExport: [
        { label: "Data da Venda", field: "saleDateFormated" },
        { label: "Comprador", field: "clientName" },
        { label: "Histórico", field: "name" },
        { label: "Valor", field: "amout" },
        { label: "Data a Receber", field: "recieveDateFormated" },
        { label: "Status", field: "status" },
      ],
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
        inicialDate: this.dateInicial.initialDate,
        finalDate: this.dateFinal.initialDate,
      };
      this.loadingDataTable = true;

      this.$store
        .dispatch(BUSCARRELATORIOCONTASARECEBER, payload)
        .then(() => {
          this.loadingDataTable = false;        
          
          let tempList = [];        
          tempList = this.listaRelatorioContasReceber;

          tempList.forEach(function(item) {
            item.status = item.status == true ? "Recebido" : "Em aberto"
          });

          this.listaItensExport = tempList;

        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar O relatório de contas a receber!",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
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
  },
  computed: {
    listaRelatorioContasReceber() {
      return this.$store.state.RelatorioStore.relContasAReceber;
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
